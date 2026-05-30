<div align="center">
  <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" alt="Beauty Salon Banner" width="100%"/>

  # ✨ Komsl Beauty Salon ✨
  **A Premium, State-of-the-Art Salon Booking Experience**

  [![GitHub Stars](https://img.shields.io/github/stars/nouman-aziz/komsl-beauty-salon?style=for-the-badge&color=amber)](https://github.com/nouman-aziz/komsl-beauty-salon)
  [![Vite](https://img.shields.io/badge/Vite-6.23-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 🌟 Overview

Welcome to **Komsl Beauty Salon**, a high-end web application designed to provide a seamless and premium booking experience for beauty enthusiasts. Built with modern web technologies, it features a sleek dark mode interface, vibrant aesthetics, and fluid micro-animations that reflect the luxury of the salon itself.

## 🚀 Key Features

- **💎 Boutique Service Catalog**: Explore a curated selection of premium beauty services with intuitive search and filtering.
- **📅 Smart Booking System**: A multi-step booking process where users can add multiple services to their bill.
- **✨ Fluid Framer Motion**: Smooth transitions and physics-based animations for a truly premium feel.
- **📱 Fully Responsive**: Optimized for every device, from desktop to mobile screens.
- **🔔 Live Notifications**: Real-time feedback for every user interaction.
- **🛡️ Quality Assessment**: Integrated quality promises and core values display.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion (Framer Motion)](https://motion.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

---

## 💻 Local Installation

Follow these steps to set up the project on your local machine:

### 1. Prerequisites
Ensure you have **Node.js (v20 or higher)** and **npm** installed. 

> [!IMPORTANT]
> This project requires **Node.js >= 20**. Using a lower version will cause installation errors with Tailwind CSS and Google Generative AI.

Check your version:
```bash
node -v
```
```bash
git clone https://github.com/nouman-aziz/komsl-beauty-salon.git
cd komsl-beauty-salon
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configuration
Create a `.env.local` file in the root directory and add your Gemini API key (if required by features):
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 5. Start Development Server
```bash
npm run dev
```
The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 🌍 Free Deployment Guide

You can deploy this project for free using **Vercel** or **Netlify**.

### Option 2: Deploy with Netlify
1. Log in to [netlify.com](https://netlify.com).
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Choose **GitHub** and authorize.
4. Select your repository.
5. In the Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**.

### Option 1: Deploy with Vercel (Recommended)
1. Push your code to a **GitHub** repository.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **"Add New"** -> **"Project"**.
4. Import your GitHub repository.
5. Vercel will automatically detect **Vite**. Leave the default settings.
6. (Optional) Add your `GEMINI_API_KEY` in the **Environment Variables** section.
7. Click **Deploy**.

---

## 🛠️ Troubleshooting

### ❌ Error: "Cannot find native binding"
If you see an error related to `@tailwindcss/oxide` or "native binding", it is usually due to an incompatible Node.js version.

**Solution:**
1. Upgrade to **Node.js 20+** (using [nvm](https://github.com/nvm-sh/nvm) is recommended):
   ```bash
   nvm install 20
   nvm use 20
   ```
2. Clean and reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### ❌ Error: "vite: not found"
Ensure you have run `npm install` before starting the development server.

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Crafted with ❤️ for the world of beauty.</p>
</div>
