# Bicicleta 🚲

> A modern, comprehensive web application for custom bicycle configuration, component tracking, and pricing analysis.

Bicicleta empowers cyclists and mechanics to plan their dream builds, compare component groups, track pricing history across different retailers (like Mercado Livre), and manage complete bike builds in one cohesive interface. Built on a modern serverless stack with Nuxt 3 and Neon PostgreSQL.

## 🌟 Features

- **Custom Bike Builder**: Mix and match components to build custom bikes and calculate total prices and weights.
- **Component Catalog**: Exhaustive database of brands (Shimano, SRAM, etc.), lines, and components.
- **Price Tracking**: Integrates with external APIs (Mercado Livre) to track and update prices of components over time.
- **Group Sets**: Ready-to-use drivetrain groups (front shifter, rear derailleur, cassette, etc.).
- **Admin Dashboard**: Manage brands, trigger scrapers, upload logos, and update catalogs.
- **Multi-Theme UI**: Dynamic theme system (Sport-Tech, Brutalist, Editorial, Retro-Futurism, Organic).
- **Interactive Visuals**: Vue Flow powered interactive brand mindmaps and component hierarchies.

## 🛠️ Architecture / Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) / [Vue.js 3](https://vuejs.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Nuxt UI](https://ui.nuxt.com/)
- **Database**: [Neon Serverless Postgres](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Postgres Database (Neon recommended)
- Mercado Livre API Credentials (for scraping)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/danielvm-git/bicicleta.git
   cd bicicleta
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and fill in your connection strings and API keys.

   ```bash
   cp .env.example .env
   ```

4. **Database Setup**
   Push the Drizzle schema to your database and optionally seed the database.

   ```bash
   npm run db:push
   # Optional: run seed scripts if available
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📚 Documentation

For detailed architectural documents, API contracts, and data models, please refer to the `docs/` directory:

- [API Contracts](docs/api-contracts.md)
- [Data Models](docs/data-models.md)
- [Component Inventory](docs/component-inventory.md)
- [Development Guide](docs/development-guide.md)
- [Source Tree Analysis](docs/source-tree-analysis.md)

## 🤝 Contributing

Contributions are always welcome! Please follow the conventional commit messages and ensure tests pass before submitting a PR.

```bash
# Run tests
npm run preflight
```

## 📝 License

This project is proprietary.
