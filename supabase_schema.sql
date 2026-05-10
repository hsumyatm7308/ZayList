-- Households table
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  household_id UUID REFERENCES households(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grocery items table
CREATE TABLE grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  note TEXT,
  quantity TEXT DEFAULT '1',
  price NUMERIC DEFAULT 0,
  category TEXT NOT NULL,
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;

-- Helper to get current user's household without recursion
CREATE OR REPLACE FUNCTION public.get_my_household()
RETURNS UUID AS $$
  -- SECURITY DEFINER bypasses RLS
  SELECT household_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Helper to check if current user can see a profile
CREATE OR REPLACE FUNCTION public.can_see_profile(target_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  me_household UUID;
  target_household UUID;
BEGIN
  -- Always can see own profile
  IF auth.uid() = target_id THEN
    RETURN TRUE;
  END IF;

  -- Get me household (bypasses RLS)
  SELECT household_id INTO me_household FROM public.profiles WHERE id = auth.uid();
  -- Get target household (bypasses RLS)
  SELECT household_id INTO target_household FROM public.profiles WHERE id = target_id;

  RETURN (me_household IS NOT NULL AND target_household IS NOT NULL AND me_household = target_household);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Policies for households
CREATE POLICY "Users can see their own household" ON households
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    id = public.get_my_household()
  );

CREATE POLICY "Owners can update their household" ON households
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can create households" ON households
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Policies for profiles
CREATE POLICY "Profile visibility" ON profiles
  FOR SELECT USING ( public.can_see_profile(id) );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for grocery_items
CREATE POLICY "Household members can see items" ON grocery_items
  FOR SELECT USING (
    household_id = public.get_my_household()
  );

CREATE POLICY "Household members can insert items" ON grocery_items
  FOR INSERT WITH CHECK (
    household_id = public.get_my_household()
  );

CREATE POLICY "Household members can update items" ON grocery_items
  FOR UPDATE USING (
    household_id = public.get_my_household()
  );

CREATE POLICY "Household members can delete items" ON grocery_items
  FOR DELETE USING (
    household_id = public.get_my_household()
  );

-- Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
