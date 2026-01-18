# Kode Club

The official coding platform for RGIPT students. Designed for growth, performance, and competition.

![Kode Club Hero](public/og.png)

## 🚀 Features

- **Daily Practice Problems (DPP)**: Fresh coding challenges every day to build consistency.
- **Instant Compiler**: Run code in 4+ languages (C++, Java, Python, JavaScript) instantly.
- **Live Leaderboard**: Compete with peers and climb the global rankings.
- **Glassmorphism UI**: Premium, developer-centric design with dark mode and cinematic effects.
- **Dev Mode**: Command-palette driven navigation (`⌘K`) for power users.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Tabler Icons](https://tabler-icons.io/) & [Lucide](https://lucide.dev/)
- **Video**: [Cloudinary](https://cloudinary.com/) for optimized background streaming

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/vjain5375/Kode-Klub.git
   cd Kode-Klub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp env.example .env.local
   
   # Edit .env.local and set your backend API URL
   # For local development: NEXT_PUBLIC_API_URL=http://localhost:5000/api
   # For production: NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

   **Note**: Make sure your backend is running on `http://localhost:5000` for local development.

## 📝 Environment Variables

The frontend requires the following environment variable:

- `NEXT_PUBLIC_API_URL`: Backend API base URL (must include `/api` suffix)
  - Local: `http://localhost:5000/api`
  - Production: `https://your-backend-service.onrender.com/api`

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup instructions.

## 🤝 Contributing

Built by students, for coders. Contributions are welcome! 
