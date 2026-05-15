# AI-Powered Printing SaaS Platform

A modern printing e-commerce and SaaS platform for a digital print studio. The project is currently focused on the customer-facing React frontend, reusable UI structure, mock business data, and the foundation for future backend and AI features.

## Live Demo

https://shrivastava-five.vercel.app/

## Current Status

### Completed so far

- React + Vite frontend setup
- Responsive customer-facing website
- Single-page navigation managed inside `App.jsx`
- Lazy-loaded pages with suspense fallback
- Framer Motion page transitions and reveal animations
- Shared layout with navbar, footer, page loader, buttons, cards, inputs, and scroll-to-top UI
- Pages for Home, Studio/About, Services, Work/Gallery, Team, Journal/Blog, Pricing, Contact, FAQ, and Product Detail
- Static print studio visuals under `public/images`
- Central site content in `src/data/site.js`
- Mock business datasets under `src/mock-data`
- Global CSS organization for variables, typography, utilities, responsive rules, components, dashboard styles, and animations
- Vercel-ready frontend build output

### Mock data prepared

The project includes JSON data that can be wired into the app or future backend/API layer:

- `src/mock-data/products.json` - product catalog with categories, pricing, finishes, ratings, delivery times, and stock status
- `src/mock-data/categories.json` - product category metadata
- `src/mock-data/orders.json` - sample order records and production statuses
- `src/mock-data/users.json` - sample customer/admin profiles
- `src/mock-data/faq.json` - detailed print support FAQ content
- `src/mock-data/documents.json` - knowledge-base style print guidance content
- `src/mock-data/chat-prompts.json` - draft system prompt and examples for a future print assistant

### Not implemented yet

- Real backend API
- Database persistence
- Authentication
- Cart and checkout
- Admin dashboard
- File upload workflow
- Live AI assistant
- Order management connected to real data

## Project Vision

The long-term goal is to turn this into a production-grade SaaS platform for print studios, combining:

- Online product discovery
- Quote and order workflows
- Customer and admin dashboards
- Print file validation
- AI-powered customer support
- Smart recommendations and pricing assistance
- Cloud deployment and DevOps practices

## Tech Stack

### Frontend

- React 19
- Vite 7
- Framer Motion
- Tailwind CSS
- Feature and page-level CSS files

### Tooling

- ESLint
- PostCSS
- Autoprefixer
- Vercel deployment target

### Planned Backend and AI

- FastAPI
- PostgreSQL or Supabase
- AI chatbot/RAG support
- OpenAI or similar LLM APIs
- Vector database for print support documents

## Project Structure

```bash
.
+-- backend/
|   +-- main.py
+-- public/
|   +-- images/
+-- src/
|   +-- animations/
|   +-- assets/
|   +-- components/
|   |   +-- layout/
|   |   +-- sections/
|   |   +-- ui/
|   +-- data/
|   |   +-- site.js
|   +-- mock-data/
|   +-- pages/
|   +-- styles/
|   +-- utils/
|   +-- App.jsx
|   +-- main.jsx
+-- index.html
+-- package.json
+-- tailwind.config.js
+-- vite.config.js
```

## Pages Available

- Home
- Studio/About
- Services
- Work/Gallery
- Product Detail
- Team
- Journal/Blog
- Pricing
- Contact
- FAQ

## Getting Started

Clone the repository:

```bash
git clone <your-repository-link>
cd <project-folder>
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Environment Variables

Create a `.env` file from `.env.example` when backend or external services are added.

```env
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENAI_API_KEY=
```

At the moment, the frontend does not require these values to run locally.

## Roadmap

### Frontend

- Connect product pages to `src/mock-data/products.json`
- Add cart state and checkout screens
- Add dashboard views for customers and admins
- Improve product filtering/search
- Add quote request flow
- Continue responsive and accessibility improvements

### Backend

- Build FastAPI API endpoints
- Add database schema for users, products, orders, quotes, and files
- Add authentication and role-based access
- Add order lifecycle management
- Add file upload and proof approval flow

### AI

- Add AI print consultant chatbot
- Use `documents.json`, `faq.json`, and `chat-prompts.json` as a first knowledge base
- Add product recommendation logic
- Add artwork/file readiness guidance
- Explore smart quote and pricing assistance

### DevOps

- Add Docker support
- Add CI/CD checks
- Add deployment documentation
- Add monitoring and analytics once the backend exists

## Developer

Built by Shrivastava Ayush.

This project is being built as a real-world learning path across frontend engineering, backend development, AI integration, SaaS architecture, and cloud deployment.
