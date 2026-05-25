import { lazy, Suspense, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion, MotionConfig } from "framer-motion";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/Navbar";
import PageLoader from "./components/ui/PageLoader";
import ScrollTop from "./components/ui/ScrollTop";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { navItems } from "./data/site";
import ChatWidget from "./components/ui/ChatWidget";

const Home        = lazy(() => import("./pages/Home"));
const About       = lazy(() => import("./pages/About"));
const Services    = lazy(() => import("./pages/Services"));
const Gallery     = lazy(() => import("./pages/Gallery"));
const Team        = lazy(() => import("./pages/Team"));
const Blog        = lazy(() => import("./pages/Blog"));
const Pricing     = lazy(() => import("./pages/Pricing"));
const Contact     = lazy(() => import("./pages/Contact"));
const FAQ         = lazy(() => import("./pages/FAQ"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login       = lazy(() => import("./pages/Login"));
const Signup      = lazy(() => import("./pages/Signup"));
const Dashboard   = lazy(() => import("./pages/Dashboard"));
const Checkout    = lazy(() => import("./pages/Checkout"));
const Cart        = lazy(() => import("./pages/Cart"));

const pages = {
  home: Home,
  about: About,
  services: Services,
  gallery: Gallery,
  team: Team,
  blog: Blog,
  pricing: Pricing,
  contact: Contact,
  faq: FAQ,
  product: ProductDetail,
  login: Login,
  signup: Signup,
  dashboard: Dashboard,
  checkout: Checkout,
  cart: Cart,
};

// Pages that replace the full site shell (no Navbar / Footer)
const FULL_PAGE = new Set(["login", "signup", "dashboard", "checkout"]);

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: "easeInOut" },
};

function App() {
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState(null);

  const CurrentPage = useMemo(() => pages[page] ?? Home, [page]);
  const isFullPage = FULL_PAGE.has(page);

  const goToPage = (nextPage, data = null) => {
    setPage(nextPage);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageContent = (
    <AnimatePresence mode="wait" initial={false}>
      <Motion.div key={page} {...pageTransition}>
        <Suspense fallback={<PageLoader />}>
          <CurrentPage
            onNavigate={goToPage}
            {...(pageData ? { productId: pageData } : {})}
          />
        </Suspense>
      </Motion.div>
    </AnimatePresence>
  );

  if (isFullPage) {
    return (
      <MotionConfig reducedMotion="user">
        {pageContent}
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="siteShell">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar activePage={page} navItems={navItems} onNavigate={goToPage} />
        <main id="main-content" tabIndex="-1">
          {pageContent}
        </main>
        <Footer onNavigate={goToPage} />
        <ScrollTop />
        <ChatWidget />
      </div>
    </MotionConfig>
  );
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
      <Toaster
        position="bottom-right"
        offset={80}
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
          },
        }}
      />
    </AuthProvider>
  );
}
