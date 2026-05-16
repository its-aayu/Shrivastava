# Aayu Printing Studio — AI-Powered Print SaaS

A production-grade SaaS platform for a premium print studio. Built across three phases: customer-facing frontend, FastAPI backend, and AI integration. Currently at the end of Phase 2A (backend foundation live, frontend wired to API).

**Live demo:** https://shrivastava-five.vercel.app/

---

## What's been built

### Phase 1 — Frontend (complete)

**Routing and app shell**
- React 19 + Vite 7 SPA with state-based routing managed in `App.jsx` (no React Router dependency)
- `React.lazy()` + `Suspense` code-splitting on all 10 page components
- `AnimatePresence` page transitions with `MotionConfig reducedMotion="user"` for OS-level motion preference
- Skip link, `<main id="main-content">`, scroll restoration on page change

**Pages**
- Home, About/Studio, Services, Work/Gallery, Team, Journal/Blog, Pricing, Contact, FAQ, Product Detail

**Shared components**
- Layout: `Navbar`, `Footer`
- Page sections: `PageHero`, `SectionHeader`, `QuoteForm`, `PromoBand`, `ReviewSection`, `ServiceCards`, `StatsStrip`, `TrustStrip`, `ImagePanel`
- UI: `Button` (4 variants), `Card`, `Input`, `Reveal` (scroll-reveal wrapper), `ScrollTop`, `PageLoader`

**Animation system**
- `src/animations/motion.js` — shared variants: `gridContainer`, `cardItem`, `fadeUp`, `fadeLeft`, `fadeRight`, `scaleIn`, `floatingAnimation`
- `Reveal` component wraps any element with configurable `y`, `delay`, and `duration`
- Stagger grids on product/service/value cards using `gridContainer` + `cardItem` variants

**CSS architecture**
- `src/styles/globals.css` — reset, custom properties, typography, `:focus-visible`, skip link, reduced-motion
- `src/styles/components.css` — shared UI system (buttons, cards, inputs, navbar, footer, heroes, section headers)
- `src/styles/responsive.css` — breakpoint rules for all shared components
- Per-page `style.css` files extend the shared system without duplication

**Accessibility and performance**
- `:focus-visible` keyboard focus rings (removed for mouse, shown for keyboard)
- `@media (pointer: coarse)` — 44px minimum tap targets on all interactive elements
- `@media (prefers-reduced-motion: reduce)` — disables all CSS transitions and keyframe animations
- ARIA labels, `aria-required`, `aria-describedby`, `aria-pressed`, semantic `<nav aria-label>` in footer
- Lazy image loading with `onError` fallback to `/images/print-fallback.svg`

---

### Mock data layer — `src/mock-data/` (complete)

Schema-first design mirroring the planned PostgreSQL tables. Migration from JSON to DB requires no frontend changes.

| File | Contents |
|---|---|
| `products.json` | 18 products — INR pricing, GSM, finish, delivery time, features, tags, rating |
| `categories.json` | 8 product categories with slugs, icons, sort order |
| `orders.json` | 15 orders across 5 statuses: delivered, processing, proof_review, production, cancelled |
| `users.json` | 7 customers + 1 admin with spend history and preferred products |
| `faq.json` | 18 print FAQ entries with category grouping |
| `documents.json` | 35 RAG knowledge-base documents covering CMYK, DPI, bleed, GSM, finishes, sustainability |
| `chat-prompts.json` | Full AI assistant config: system prompt, personality traits, guardrails, RAG config, order status templates |

---

### Phase 2A — Backend foundation (complete)

**Folder structure**
```
backend/
├── app/
│   ├── api/
│   │   └── products.py       # API routes
│   ├── core/
│   │   └── config.py         # pydantic-settings (env vars)
│   ├── db/
│   │   └── database.py       # SQLAlchemy engine, session, Base
│   ├── models/
│   │   └── product.py        # ORM model (18 columns)
│   ├── schemas/
│   │   └── product.py        # Pydantic schemas
│   ├── services/
│   │   └── product_service.py # Business logic
│   └── main.py               # FastAPI app + CORS + lifespan
├── requirements.txt
├── .env
└── .env.example
```

**API endpoints**
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check (shows DB connection status) |
| `GET` | `/api/v1/products` | All products — filterable by `?category=`, `?featured=true`, `?skip=`, `?limit=` |
| `GET` | `/api/v1/products/featured` | Featured products only |
| `GET` | `/api/v1/products/{id}` | Single product by id or slug |
| — | `/docs` | Swagger UI (auto-generated) |
| — | `/redoc` | ReDoc API reference |

**Service layer design**

`product_service.py` reads from `src/mock-data/products.json` today. The DB query blocks are written and commented out directly above each mock-data block. To switch to PostgreSQL: set `DATABASE_URL` in `backend/.env` and uncomment 4 lines per function. No other changes needed.

**Frontend API integration**
- `src/lib/api.js` — thin fetch client reading `VITE_API_URL`
- `src/hooks/useProducts.js` — `useProducts(params)` and `useProduct(id)` hooks with cleanup cancellation
- Gallery page fetches from API with shimmer skeleton and error state
- ProductDetail fetches single product + related products from API, displays INR pricing and features list

---

## Running the project

### Frontend

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. Works standalone without the backend running (shows error state on Gallery/Product pages).

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`. Swagger UI at `http://localhost:8000/docs`.

No database required — the backend reads from `src/mock-data/products.json` automatically.

### Environment variables

**Frontend (`.env` in root):**
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENAI_API_KEY=
```

**Backend (`backend/.env`):**
```env
DATABASE_URL=          # leave empty to use mock data
SECRET_KEY=            # generate with: python -c "import secrets; print(secrets.token_hex(32))"
OPENAI_API_KEY=
DEBUG=true
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Tech stack

### Frontend
- React 19 + Vite 7
- Framer Motion (animations, page transitions, reduced-motion support)
- Custom CSS (no UI framework) — component system with CSS custom properties

### Backend
- FastAPI 0.115
- SQLAlchemy 2.0 (ORM + session management)
- Pydantic 2.10 (request/response validation)
- pydantic-settings (env var management)
- psycopg2-binary (PostgreSQL driver, ready to connect)
- uvicorn (ASGI server)

### Planned
- PostgreSQL via Neon (cloud) or local
- OpenAI API for AI print consultant
- Vector database for RAG (document retrieval)
- Supabase Auth or custom JWT
- Docker + CI/CD
- Vercel (frontend) + Railway or Render (backend)

---

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers
│   │   ├── core/           # Config and settings
│   │   ├── db/             # Database engine and session
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic layer
│   │   ├── utils/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
├── public/
│   └── images/
├── src/
│   ├── animations/         # Framer Motion variant library
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   └── ui/             # Button, Card, Input, Reveal, ScrollTop, PageLoader
│   ├── data/
│   │   └── site.js         # Static content (nav, gallery items, testimonials)
│   ├── hooks/
│   │   └── useProducts.js  # API data hooks
│   ├── lib/
│   │   └── api.js          # Fetch client
│   ├── mock-data/          # JSON data layer (7 files)
│   ├── pages/              # 10 page components + shared/
│   ├── styles/             # globals, components, responsive, dashboard, animations CSS
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Roadmap

### Phase 2 — Backend (in progress)
- [x] FastAPI project structure
- [x] Product API with mock data
- [x] SQLAlchemy setup (DB-ready)
- [ ] Connect to Neon PostgreSQL
- [ ] Seed DB from mock JSON
- [ ] User auth (JWT or Supabase)
- [ ] Orders API
- [ ] Quote request API
- [ ] File upload endpoint

### Phase 3 — AI integration
- [ ] RAG pipeline over `documents.json` + `faq.json`
- [ ] AI print consultant chatbot (using `chat-prompts.json` system prompt)
- [ ] Product recommendation by use case
- [ ] Artwork file validation guidance
- [ ] Smart quote estimation

### Phase 4 — Dashboards and DevOps
- [ ] Customer dashboard (orders, proofs, history)
- [ ] Admin dashboard (order management, user list, analytics)
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Monitoring and logging

---

## Developer

Built by Ayush Shrivastava as a real-world learning path across frontend engineering, backend development, AI integration, SaaS architecture, and cloud deployment.
