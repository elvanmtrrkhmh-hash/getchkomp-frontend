# GetchKomp Frontend

Welcome to the frontend repository for the **GetchKomp** e-commerce platform (Tech Komputer Hub). This application provides a modern, responsive, and dynamic user interface for a computer hardware and accessories store.

## 🚀 Tech Stack

This project is built with a modern frontend stack to ensure high performance, type safety, and great developer experience:

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management & Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## ✨ Key Features

- **Dynamic Homepage**: Features hero banners, product highlights, and categories fetched dynamically from the backend API.
- **Product Catalog & Variants**: Browse products and select mandatory variants (color, panel, refresh rate) before adding to cart.
- **Shopping Cart & Checkout**: Integrated checkout process linked directly to the backend order API and payment gateway (Xendit).
- **Wishlist Management**: Global wishlist state allowing users to easily save favorite products.
- **Blog & Articles**: Read tech articles and news with dynamic category and tag metadata.
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop viewing.

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tech-komputer-hub-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory based on `.env.example` (if available) or add the necessary environment variables.
   
   Example `.env` configuration:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   *(Ensure the backend API is running on port 8000 or update the URL accordingly)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   By default, the Vite development server will run on `http://localhost:8080` (or `http://localhost:5173` depending on configuration).

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Runs ESLint to catch code quality issues.
- `npm run preview`: Locally preview the production build.
- `npm test`: Runs Vitest for unit and integration testing.

## 🤝 Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## 📄 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.
