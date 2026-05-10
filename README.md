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
