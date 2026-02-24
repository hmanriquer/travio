<div align="center">

# 🌍 Travio

**The ultimate travel expense and budget tracker for modern travelers.**

[![CI/CD Pipeline](https://github.com/hmanriquer/travio/actions/workflows/pipeline.yml/badge.svg)](https://github.com/hmanriquer/travio/actions/workflows/pipeline.yml)
[![Vercel Identity](https://img.shields.io/badge/deployed-vercel-black?logo=vercel)](https://travio-hmanriquer.vercel.app)
[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Drizzle](https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

[Explore the App](https://travio-hmanriquer.vercel.app) · [Report Bug](https://github.com/hmanriquer/travio/issues) · [Request Feature](https://github.com/hmanriquer/travio/issues)

</div>

## 🚀 About Travio

Travio is a high-performance, visually stunning travel management application designed to help individuals and groups keep track of their trips, expenses, and budget limits. Built with the latest web technologies, it offers a seamless experience for managing your travel finances.

### Key Features

-   📍 **Destination Tracking**: Log trips from any origin to any destination with ease.
-   💰 **Budget Guard**: Set spending limits and monitor total amounts in real-time.
-   👤 **Traveler Profiles**: Manage multiple travelers and their associated trips from a central dashboard.
-   🌓 **Adaptive UI**: Beautiful dark and light mode support using modern CSS variables.
-   ⚡ **Real-time Synchronization**: Powered by TanStack Query for a fast and interactive experience.
-   🛡️ **End-to-End Type Safety**: Fully typed with TypeScript and Drizzle ORM for robust development.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/), [Sonner](https://sonner.stevenly.me/)
-   **Database**: [Neon Postgres](https://neon.tech/), [Drizzle ORM](https://orm.drizzle.team/)
-   **State Management**: [TanStack Query v5](https://tanstack.com/query)
-   **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
-   **CI/CD**: [GitHub Actions](https://github.com/features/actions), [Vercel](https://vercel.com/)

## 🏁 Getting Started

### Prerequisites

-   Node.js 20.x or higher
-   npm, yarn, or pnpm
-   A Neon Database instance (or any PostgreSQL database)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/hmanriquer/travio.git
    cd travio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your connection string:
    ```env
    POSTGRES_URL=postgresql://user:password@host:port/dbname?sslmode=require
    ```

4.  **Sync Database Schema**
    ```bash
    npm run db:push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

Visit [http://localhost:3000](http://localhost:3000) to start exploring!

## 🧪 Development & Quality

### Testing
Travio maintains high code quality through a rigorous testing suite powered by Jest.
```bash
npm test          # Run tests in watch mode
npm run test:ci   # Run tests for CI environment
```

### Database Management
Easily manage your schema and data with Drizzle Kit:
-   `npm run db:generate`: Generate migration files based on schema changes.
-   `npm run db:push`: Directly push schema changes to the database.
-   `npm run db:studio`: Launch a visual database explorer.

### Code Quality
```bash
npm run lint      # Run ESLint check
```

## 📂 Project Structure

```text
├── app/              # Next.js App Router (pages, layouts, globals)
├── components/       # UI Component library
│   └── ui/           # Atomic shadcn/ui components
├── db/               # Database connection and schema definitions
├── drizzle/          # Auto-generated migrations
├── lib/              # Shared utility functions
├── providers/        # React Context providers (Query, Theme)
├── public/           # Static assets (images, icons)
└── __tests__/        # Unit and Integration test suites
```

## 🤝 Contributing

Contributions make the open-source community an amazing place. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---
<p align="center">
  Built with ❤️ for better traveling.
</p>
