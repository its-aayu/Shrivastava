# Aayu Printing Studio — AI-Powered Print SaaS

A production-grade SaaS platform for a premium print studio. Built across a 90-day plan covering a customer-facing marketing frontend, authenticated SaaS dashboard, FastAPI backend with JWT auth and file uploads, and an AI integration layer (Phase 3). Currently at the end of Phase 3.

**Live demo:** https://shrivastava-five.vercel.app/

---

## Everything built so far

### Phase 1 — Marketing Frontend (complete)

**App shell and routing**
- React 19 + Vite 7 SPA — state-based routing in `App.jsx` (no React Router)
- `React.lazy()` + `Suspense` code-splitting on all page components
- `AnimatePresence` page transitions with `MotionConfig reducedMotion="user"`
- Skip link, `<main id="main-content">`, scroll restoration on navigation

**10 Marketing pages**
Home, About/Studio, Services, Gallery, Team, Journal/Blog, Pricing, Contact, FAQ, Product Detail

**Shared component library**
- Layout: `Navbar` (floating glassmorphism, sticky, responsive), `Footer`
- Sections: `PageHero`, `SectionHeader`, `QuoteForm`, `PromoBand`, `ReviewSection`, `ServiceCards`, `StatsStrip`, `TrustStrip`, `ImagePanel`
- UI primitives: `Button` (4 variants), `Card`, `Input`, `Reveal` (scroll-reveal), `ScrollTop`, `PageLoader`

**Animation system** — `src/animations/motion.js`
- Variants: `gridContainer`, `cardItem`, `fadeUp`, `fadeLeft`, `fadeRight`, `scaleIn`, `floatingAnimation`
- `Reveal` component wraps any element with configurable `y`, `delay`, `duration`
- Stagger grids on product/service/value cards

**CSS architecture**
- `App.css` — master import file (variables → globals → typography → utilities → animations → components → dashboard → responsive)
- `src/styles/variables.css` — full design token system (colors, glass, fonts, spacing, radii, shadows, transitions)
- Per-page `style.css` files extend the shared system

**Accessibility and performance**
- `:focus-visible` focus rings (keyboard only, not mouse)
- `@media (pointer: coarse)` — 44px minimum tap targets
- `@media (prefers-reduced-motion: reduce)` — disables all CSS transitions
- ARIA labels, `aria-current`, semantic `<nav aria-label>`, lazy image loading with fallback

---

### Mock data layer — `src/mock-data/` (complete)

Schema-first design mirroring the PostgreSQL tables. Migration from JSON → DB needs no frontend changes.

| File | Contents |
|---|---|
| `products.json` | 18 products — INR pricing, GSM, finish, delivery, features, tags, rating |
| `categories.json` | 8 product categories with slugs, icons, sort order |
| `orders.json` | 15 orders — statuses: delivered, processing, proof_review, production, cancelled |
| `users.json` | 7 customers + 1 admin with spend history |
| `faq.json` | 18 print FAQ entries with category grouping |
| `documents.json` | 35 RAG knowledge-base docs covering CMYK, DPI, bleed, GSM, finishes |
| `chat-prompts.json` | Full AI assistant config: system prompt, RAG config, fallback responses |

---

### Phase 2A — Backend foundation (complete)

**FastAPI app** — `backend/app/main.py`
- CORS middleware (reads `ALLOWED_ORIGINS` from env)
- Lifespan startup: `create_tables()` ensures all ORM models are synced
- Swagger UI at `/docs`, ReDoc at `/redoc`, health check at `/health`

**Database** — `backend/app/db/database.py`
- SQLAlchemy 2.0: `engine`, `SessionLocal`, `Base`, `get_db()` dependency, `ping_db()`
- Connected to **Neon PostgreSQL** (cloud) via `DATABASE_URL` in `backend/.env`

**6 ORM models** — `backend/app/models/`
| Model | Key fields |
|---|---|
| `Product` | id, slug, title, category, price (INR), gsm, finish, features (JSONB) |
| `User` | id, name, email, hashed_password, role (customer/admin), total_orders, preferred_products |
| `Order` | id, user_id, product_id, status, quantity, unit_price, total_price, created_at |
| `Document` | doc_id, title, category, content, tags, file_path, file_size, mime_type, uploaded_by |
| `ChatHistory` | session_id, role, message, created_at |
| `FAQ` | id, question, answer, category |

**Seeding** — `backend/seed.py`
- Loads all 5 JSON files → PostgreSQL in safe mode (skip if exists) or `--force` to overwrite
- Seeded: 18 products, 8 users, 15 orders, 35 documents, 18 FAQs

**API endpoints**
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Service info |
| `GET` | `/health` | DB connection status |
| `GET` | `/api/v1/products` | All products (filterable: `?category=`, `?featured=true`) |
| `GET` | `/api/v1/products/featured` | Featured products |
| `GET` | `/api/v1/products/{id}` | Product by id or slug |
| `GET` | `/api/v1/orders/` | All orders |
| `GET` | `/api/v1/orders/{id}` | Single order |
| `POST` | `/api/v1/orders/` | Create order |
| `PATCH` | `/api/v1/orders/{id}/status` | Update order status |

---

### Phase 2B — JWT Authentication (complete)

**Backend** — `backend/app/api/auth.py`, `services/auth_service.py`, `utils/security.py`, `utils/auth.py`
- `POST /api/v1/auth/signup` — register new user, hash password with bcrypt, return JWT
- `POST /api/v1/auth/login` — verify credentials, return JWT
- `GET /api/v1/auth/me` — return current user profile (requires bearer token)
- `get_current_user()` FastAPI dependency — decodes JWT, fetches user from DB
- Token payload includes `sub` (user id), `email`, `role`

**Frontend** — `src/context/AuthContext.jsx`
- `AuthProvider` wraps the entire app
- On mount: reads `aayu_token` from `localStorage`, calls `/auth/me` to restore session
- If token expired or invalid: clears storage, user stays logged out
- Exports: `user`, `token`, `isAuthenticated`, `loading`, `login(token, userData)`, `logout()`
- `useAuth()` hook for any component to read auth state

**Login page** — `src/pages/Login/`
- Full-page glassmorphism card (no Navbar/Footer)
- Connects to `POST /auth/login` → stores token → redirects based on role
- Admin users (`role === "admin"`) → Dashboard; customers → Home
- Error toast, loading state, link to Signup

**Signup page** — `src/pages/Signup/`
- Same design system as Login
- Connects to `POST /auth/signup` → stores token + user data → redirects to Home
- Client-side validation: min 8-char password
- Welcome toast on success

**Role-based access control (RBAC)**
- Dashboard is admin-only — customers who navigate directly are redirected to Home
- Login redirect reads `userData.role` after `/auth/me` — admin → dashboard, customer → home
- Navbar shows "Sign In" when logged out, "Dashboard" when admin is logged in

**Protected routing**
- Auth pages (`login`, `signup`, `dashboard`, `checkout`) skip the marketing Navbar and Footer entirely
- Dashboard checks `isAuthenticated` on mount — redirects to Login if no valid token

---

### Phase 2C — File Upload Pipeline (complete)

**Backend** — `backend/app/api/uploads.py`, `services/upload_service.py`
- `POST /api/v1/uploads` — multipart form upload, requires bearer token
- Accepted formats: **PDF, PNG, JPG/JPEG** only — validated by both file extension and MIME type
- Max size: **10 MB** — returns `400` with clear message if exceeded
- Blocked formats: `.exe`, `.zip`, and anything not in the allowed set returns `400`
- Files saved to `backend/app/uploads/` with UUID-prefixed safe filename to prevent collisions and path traversal
- Unauthenticated requests return `401`

**Response format:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "a3f9...safe_name.pdf",
    "original_filename": "my-artwork.pdf",
    "path": "/absolute/path/on/server",
    "size": 204800,
    "content_type": "application/pdf"
  }
}
```

---

### Phase 2D — SaaS Dashboard (complete)

**Dashboard** — `src/pages/Dashboard/`
```
Dashboard/
├── index.jsx               Main layout + tab routing + auth guard
├── style.css               Complete dashboard CSS (sidebar, cards, tables, badges, upload zone, skeletons)
└── components/
    ├── Sidebar.jsx          Nav with Overview, Orders, Uploads, AI, Settings — inline SVG icons
    ├── DashboardCard.jsx    Metric card with skeleton loader (shimmer when value is loading)
    ├── DashboardHeader.jsx  Sticky header with greeting and Sign Out
    ├── OrdersTable.jsx      API-first → mock fallback, status badges
    ├── UploadsTable.jsx     Drag-and-drop upload zone + localStorage history + Sonner toasts
    └── ChatPanel.jsx        Full AI chat tab with history, auto-focus, typing indicator, error toasts
```

**Overview tab** — 4 metric cards: Total Orders, Pending, Files Uploaded, AI Requests
- Cards show shimmer skeleton while data loads (`value === "…"`)
- Recent orders table (last 5 rows)

**Orders tab** — full orders table
- Columns: Order ID, Product, Status, Amount, Date
- Status badges: pending (amber), processing (blue), completed/delivered (green), cancelled (red)
- Fetches from `GET /api/v1/orders/` with auth token — falls back to `mock-data/orders.json`

**Uploads tab** — file upload center
- Drag-and-drop zone or click to browse
- Calls `POST /api/v1/uploads` — requires the user to be logged in
- `toast.loading()` → `toast.success()` / `toast.error()` pattern with a single toast ID
- Upload history persisted in `localStorage`
- Shows: original filename, type, size, upload date

**AI Assistant tab** — fully operational RAG chatbot (see Phase 3)

---

### Phase 3 — AI Integration (complete)

#### Knowledge Base

**`backend/app/data/aayu_knowledge.txt`** — 400+ line curated knowledge base covering:
- All 8 product categories with full specifications and pricing in INR
- Exact turnaround times per product type
- Step-by-step production process (6 stages)
- File requirements: 300 DPI, CMYK, 3mm bleed, accepted formats
- 20+ FAQ entries covering finishes, delivery, rush orders, proofing
- Contact info and quality guarantee

**`backend/seed_knowledge.py`** — one-command indexing script:
```bash
cd backend
python seed_knowledge.py
```
Chunks the knowledge base into 400-token overlapping segments and stores them in ChromaDB.

#### RAG Pipeline — `backend/app/services/rag_service.py`

- `chunk_document(text, chunk_size, overlap)` — overlapping text chunker
- `add_chunks(doc_id, chunks, metadata)` — stores vector embeddings in ChromaDB
- `retrieve_context(query, db, top_k=4)` — semantic similarity search over all indexed documents
- `generate_response(query, context_chunks)` — builds prompt with retrieved context, calls Groq API
- ChromaDB `PersistentClient` — vectors persisted to `backend/chroma_store/` on disk

#### Chat API — `backend/app/api/chat.py`

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/chat/` | Required | Chat with history saved to `ChatHistory` table |
| `GET` | `/api/v1/chat/history/{session_id}` | Required | Retrieve session history |
| `POST` | `/api/v1/chat/widget` | None | Public widget endpoint — same RAG pipeline, no DB save |

The widget endpoint (`/chat/widget`) uses the same ChromaDB retrieval and Groq generation as the authenticated endpoint, making it safe to expose publicly without any token.

#### Dashboard Chat Panel — `src/pages/Dashboard/components/ChatPanel.jsx`

- Loads conversation history on mount from `/chat/history/{session_id}`
- Skeleton loader (4 shimmer lines alternating left/right) while history loads
- Auto-focuses input on mount and after each AI response
- Typing indicator (three animated dots) while AI is generating
- "AI is thinking…" italic pulsing text below the typing bubble
- Circular send button with spinning SVG icon during loading
- `toast.error()` on network failure
- "✕ New" button to start a fresh session (new UUID stored in `localStorage`)
- Sources shown as chips below each AI message
- 6 suggested question chips on first load

#### Public Chat Widget — `src/components/ui/ChatWidget.jsx`

- Floating trigger in bottom-right corner — icon-only circle (54×54px) by default
- On hover: expands to show "Chat with us" text (CSS width transition, no JS)
- Trigger disappears when chat panel is open
- Dark gradient header panel with spring open/close animation
- Session stored in `sessionStorage` (clears on tab close, unlike localStorage)
- Uses `widgetApi.send()` → `POST /chat/widget` (no auth required)
- 6 quick question chips on empty state with "Suggested questions" label
- No per-message avatars — clean minimal message bubbles

---

### Cart System (complete)

#### Global State — `src/store/cartStore.js`

Zustand store with `persist` middleware (localStorage):

```js
{
  items: [],          // [{ product, quantity }]
  addItem(product, quantity),   // merges quantity if product already in cart
  removeItem(productId),
  updateQty(productId, quantity), // removes item if qty drops below 1
  clearCart(),
  totalItems(),       // sum of all quantities
  subtotal(),         // sum of price × quantity
}
```

#### Product Detail — `src/pages/ProductDetail/`

- Quantity picker (−/input/+) with min 1 guard
- "Add to cart · ₹{price × qty}" button
- `toast.success()` with product name, quantity, line total, and "View cart" action button

#### Cart Page — `src/pages/Cart/`

Stays within the site shell (Navbar + Footer visible):
- Two-column layout: items list (left) + sticky order summary sidebar (right)
- Table-style item rows: letter-avatar thumbnail, product name/category, qty controls, line total, trash remove
- Empty state with "Browse products" CTA
- Summary sidebar: per-item line totals, subtotal, 18% GST note, "Proceed to checkout" CTA, trust badges
- `toast.info()` on item removal

#### Checkout Page — `src/pages/Checkout/`

Full-page (no Navbar/Footer) — requires authentication:
- Auth gate: shows Sign In / Sign Up buttons if not logged in
- Empty cart gate: redirects to cart page if cart is empty
- Form: full name, email, phone, city, delivery notes
- Razorpay payment section (placeholder with live/test mode toggle UI)
- Order creation: `POST /api/v1/orders/` — one request per cart item (single-product-per-order schema)
- After all orders created: `clearCart()`, shows success screen with all order IDs
- Success screen: "Track your orders" → Dashboard, "Back to Home"

#### Navbar Cart Icon

- Cart icon (SVG) in Navbar links to cart page
- Red badge shows total item count — hidden when cart is empty
- Count updates reactively via Zustand

---

### Payment Architecture — `backend/app/services/payment_service.py`

Razorpay integration stubs with full documentation (not wired to UI yet):

| Function | Description |
|---|---|
| `create_payment_order(amount_inr, order_id)` | Creates Razorpay order, returns `razorpay_order_id` |
| `verify_payment(razorpay_order_id, payment_id, signature)` | HMAC-SHA256 signature verification |
| `create_refund(payment_id, amount_inr=None)` | Full or partial refund via Razorpay API |

Required env vars when enabling: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
Install: `pip install razorpay`

---

### Toast Notification System (complete)

Using **Sonner 2.0.7** — `<Toaster position="bottom-right" offset={80} />` in `App.jsx`.

| Trigger | Toast type | Message |
|---|---|---|
| Login success | `success` | "Welcome {first name}!" with role-specific description |
| Login failure | `error` | Server error message |
| Signup success | `success` | "Account created! Welcome, {name}." |
| Signup failure | `error` | Server error message |
| Add to cart | `success` | Product name, qty, line total + "View cart" action |
| Remove cart item | `info` | Item removed |
| File upload start | `loading` | "Uploading {filename}…" |
| File upload success | `success` | Updates loading toast — "indexed into knowledge base" |
| File upload failure | `error` | Updates loading toast with error message |
| AI chat failure | `error` | "AI response failed — check connection" |

---

## Running the project

### Frontend

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. Works standalone without the backend (mock data on most pages; auth, upload, and AI features need the backend).

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`. Swagger UI at `http://localhost:8000/docs`.

### Index the knowledge base (one-time)

```bash
cd backend
python seed_knowledge.py
```

Must be run once after starting the backend. Seeds `aayu_knowledge.txt` into ChromaDB so the AI can answer questions about products, pricing, and turnaround times.

### Environment variables

**Backend — `backend/.env`:**
```env
DATABASE_URL=postgresql://user:pass@host/db   # Neon connection string
SECRET_KEY=                                    # python -c "import secrets; print(secrets.token_hex(32))"
ALLOWED_ORIGINS=http://localhost:5173
GROQ_API_KEY=                                  # https://console.groq.com
DEBUG=true
```

**Frontend — `.env` (optional, defaults shown):**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Tech stack

### Frontend
- **React 19 + Vite 7** — SPA, code splitting, HMR
- **Zustand 5** — global cart state with `persist` middleware (localStorage)
- **Framer Motion** — page transitions, scroll reveals, stagger animations, reduced-motion support
- **Sonner 2** — toast notifications (loading → success/error pattern)
- **Custom CSS** — no UI framework; full design token system with glassmorphism

### Backend
- **FastAPI 0.115** — async routes, auto OpenAPI docs, dependency injection
- **SQLAlchemy 2.0** — ORM, session management, declarative models
- **Pydantic 2.10** — request/response validation and settings management
- **python-jose + passlib[bcrypt]** — JWT creation/verification, password hashing
- **psycopg2-binary** — PostgreSQL driver
- **python-multipart** — multipart file upload support
- **uvicorn** — ASGI server

### AI layer
- **ChromaDB 0.5.23** — vector store (`PersistentClient`, persisted to `backend/chroma_store/`)
- **Groq API** — `llama-3.3-70b-versatile` model for fast LLM generation
- **Custom RAG pipeline** — overlapping chunker → ChromaDB retrieval → Groq generation

### Database
- **Neon PostgreSQL** (cloud) — connected and seeded

---

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/           products.py, orders.py, auth.py, uploads.py, chat.py
│   │   ├── core/          config.py (pydantic-settings)
│   │   ├── data/          aayu_knowledge.txt (400+ line knowledge base)
│   │   ├── db/            database.py (engine, session, Base)
│   │   ├── models/        product, user, order, document, chat_history, faq
│   │   ├── schemas/       product, user, order, auth, upload, chat
│   │   ├── services/      product_service, order_service, auth_service,
│   │   │                  upload_service, rag_service, payment_service
│   │   ├── uploads/       runtime file storage (gitkeep)
│   │   ├── utils/         auth.py (get_current_user dep), security.py (JWT utils)
│   │   └── main.py
│   ├── chroma_store/      ChromaDB vector store (auto-created on first run)
│   ├── seed.py            PostgreSQL seeder
│   ├── seed_knowledge.py  ChromaDB knowledge base indexer
│   └── requirements.txt
│
├── src/
│   ├── animations/        motion.js — shared Framer Motion variants
│   ├── components/
│   │   ├── layout/        Navbar (auth-aware, cart badge), Footer
│   │   └── ui/            Button, Card, Input, Reveal, ScrollTop, PageLoader, ChatWidget
│   ├── context/
│   │   └── AuthContext.jsx   AuthProvider + useAuth hook
│   ├── data/              site.js (nav, gallery, pricing, FAQ static content)
│   ├── hooks/             useProducts.js
│   ├── lib/               api.js (productsApi, authApi, ordersApi, uploadsApi, chatApi, widgetApi)
│   ├── mock-data/         7 JSON files (products, orders, users, docs, faq, chat-prompts)
│   ├── pages/
│   │   ├── Home, About, Services, Gallery, Team, Blog, Pricing, Contact, FAQ, ProductDetail
│   │   ├── Login/         index.jsx + style.css (RBAC redirect: admin→dashboard, customer→home)
│   │   ├── Signup/        index.jsx (redirects to home after signup)
│   │   ├── Cart/          index.jsx (full page, stays in site shell)
│   │   ├── Checkout/      index.jsx (full page, no Navbar/Footer, auth-gated)
│   │   └── Dashboard/     index.jsx, style.css, components/ (Sidebar, DashboardCard,
│   │                      DashboardHeader, OrdersTable, UploadsTable, ChatPanel)
│   ├── store/             cartStore.js (Zustand + persist)
│   ├── styles/            variables, globals, typography, utilities, animations, components, dashboard, responsive
│   ├── App.jsx            routing + AuthProvider wrapper + Toaster
│   └── main.jsx
│
├── index.html
├── package.json
└── vite.config.js
```

---

## Roadmap

### Phase 2 (complete)
- [x] FastAPI project structure
- [x] Product, Orders API
- [x] SQLAlchemy + Neon PostgreSQL connected and seeded
- [x] JWT authentication (signup, login, me)
- [x] File upload endpoint (PDF/PNG/JPG, 10MB limit, auth-protected)
- [x] SaaS dashboard (sidebar, metric cards, orders table, upload center)
- [x] Frontend auth flow (login, signup, protected routes, session persistence)
- [x] Role-based access control (admin vs customer redirect after login)

### Phase 3 — AI integration (complete)
- [x] ChromaDB vector store integration
- [x] RAG pipeline: text chunking → ChromaDB storage → semantic retrieval → Groq generation
- [x] Knowledge base (400+ lines covering all products, pricing, FAQ, turnaround times)
- [x] Authenticated AI chat endpoint with session history saved to PostgreSQL
- [x] Public widget endpoint (no auth required) using same RAG+Groq pipeline
- [x] Dashboard AI Assistant tab — full chat panel with history, typing indicator, auto-focus
- [x] Public floating chat widget on homepage — hover-to-expand, spring animation
- [x] Cart system (Zustand global state, cart page, checkout, order creation)
- [x] Toast notification system (Sonner) across all user actions
- [x] Loading states and skeleton loaders throughout dashboard and chat

### Phase 4 — Payments and DevOps (next)
- [ ] Razorpay payment integration (service stubs already in place)
- [ ] `GET /api/v1/uploads` — list a user's uploaded files from DB
- [ ] Admin dashboard (order management, user list, analytics)
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Vercel (frontend) + Railway or Render (backend)

---

## Developer

Built by Ayush Shrivastava as a real-world learning path across frontend engineering, backend development, AI integration, SaaS architecture, and cloud deployment.
