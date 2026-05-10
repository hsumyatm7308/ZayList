# ZayList - Notion-Inspired Household Grocery Tracker

ZayList is a minimalist, high-efficiency grocery management application designed for households. It features a clean, Notion-like aesthetic with a focus on usability and clarity.

## ✨ Key Features

- **Notion-Inspired UI**: A clean, technical, and spaced-out interface using the Inter typeface and a soft monochromatic palette.
- **Bi-Modal Interface**:
  - **List Mode**: Manage and organize your household's needs.
  - **Shopping Mode**: A focused view for when you're actually in the store.
- **Smart Auto-Clear Logic**:
  - Items that are **Checked** AND have a **Price** recorded will automatically clear from the main view after 24 hours.
  - Items that are **Checked but have no price** remain on the list as a reminder to input the cost.
  - All purchased items are archived into the **Insights** monthly log.
- **Workspace Insights**: Track your monthly spending with beautiful charts (Weekly trends and Category breakdowns).
- **Shared Boards**: Collaborate with family members using a shared Household ID.
- **Voice Support**: Quickly add or edit items using built-in voice-to-text.

## 🚀 How to Use

### 1. Adding Items
Click the **+** button at the bottom right. You can input the item name, category, quantity, and an optional note. You can also record the price immediately or leave it at 0 to fill in later at the store.

### 2. Organizing
Use the search bar to find specific items. You can filter by category (Produce, Dairy, Meat, etc.) and sort by Date Added, Name, or Price.

### 3. Shopping Mode
When you're at the store, toggle the **ShoppingCart** icon in the header. This view isolates items you haven't bought yet. Tap the checkbox to mark an item as purchased.

### 4. Pricing & Clearing
- If you check an item but **forget the price**, a "Missing Price" warning will appear. This item will stay on your list until you add a price.
- Once a price is added and the item is checked, it will disappear from your main list after 24 hours, keeping your workspace clean.

### 5. Tracking Spending
Switch to the **Insights** tab (Bar Chart icon) to see how much you've spent this month, visualize your weekly spending habits, and see which categories take up most of your budget.

## 🛠 Developer Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zaylist
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Web Development
To start the development server with Hot Module Replacement:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Native Mobile Setup (Capacitor)
ZayList uses Capacitor to provide a native mobile experience.

1. **Build the web project**:
   ```bash
   npm run build
   ```
2. **Add native platforms** (only needed once):
   ```bash
   npx cap add android
   npx cap add ios
   ```
3. **Sync changes**:
   Every time you build the web project, sync it with native platforms:
   ```bash
   npx cap sync
   ```
4. **Open in IDE**:
   Open the native project in Android Studio or Xcode:
   ```bash
   npx cap open android
   npx cap open ios
   ```

### Project Structure
- `/src/lib/store.ts`: Zustand state management and auto-clear logic.
- `/src/components/Insights.tsx`: Recharts implementation for spending analytics.
- `/capacitor.config.ts`: Native app configuration (App ID, Name).

## 🛠 Tech Stack

- **React 18** (Vite)
- **Tailwind CSS** (Styling)
- **Motion** (Animations)
- **Lucide React** (Icons)
- **Recharts** (Data Visualization)
- **Zustand** (State Management)
- **Capacitor** (Native Mobile Support)

---
*Built with ❤️ for organized households.*
