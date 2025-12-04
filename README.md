# Inventrix Inventory Management 

## Project Overview

This is the official frontend repository for the **Inventrix Inventory Management System**. This application provides a modern, responsive, and secure interface for users to track, manage, and log activities related to store inventory and assets.

The UI is built to support a seamless user experience across a complete workflow, from secure authentication to complex data visualization on the dashboard.

---

##  Key Features

* **Complete Authentication Flow:** Fully implemented UI for Sign In, Sign Up, Forgot Password, and Reset Password.
* **Secure Routing:** Implements client-side route protection to restrict access to core application features based on user authentication status.
* **Responsive Design:** Utilizes Tailwind CSS for a mobile-first, adaptive user experience.
* **Route Grouping:** Uses Next.js Route Groups (`(auth)`) for structured routing and isolated layouts (Navbar/Footer hidden on authentication screens).

---

## Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Server-side rendering, routing, and environment management. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid and consistent styling. |
| **Components** | **Shadcn UI** | Accessible, reusable UI components built on top of Radix UI. |
| **Language** | **TypeScript** | Ensures type safety and improves code quality. |

---

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* Node.js (v18+)
* npm or yarn

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/hngprojects/stock-keeping-app-fe.git]
    cd stock-keeping-app-fe
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Setup Environment Variables:**
    Create a `.env.local` file in the root directory and add necessary variables (e.g., API keys, backend URL, etc.).

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn devtrigger ci
##