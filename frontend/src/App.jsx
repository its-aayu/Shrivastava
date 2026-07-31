import { lazy, Suspense, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion, MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import PageLoader from "./components/ui/PageLoader";
import ScrollTop from "./components/ui/ScrollTop";
import ChatWidget from "./components/ui/ChatWidget";
import { navItems } from "./data/site";

const Home           = lazy(() => import("./pages/Home"));
const Categories     = lazy(() => import("./pages/Categories"));
const NewArrivals    = lazy(() => import("./pages/NewArrivals"));
const Gift           = lazy(() => import("./pages/Gift"));
const About          = lazy(() => import("./pages/About"));
const Login          = lazy(() => import("./pages/Login"));
const Signup         = lazy(() => import("./pages/Signup"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PrivacyPolicy  = lazy(() => import("./pages/PrivacyPolicy"));
const Terms          = lazy(() => import("./pages/Terms"));
const RefundPolicy   = lazy(() => import("./pages/RefundPolicy"));

const pages = {
  home:           Home,
  categories:     Categories,
  newArrivals:    NewArrivals,
  gift:           Gift,
  about:          About,
  login:          Login,
  signup:         Signup,
  adminDashboard: AdminDashboard,
  privacy:        PrivacyPolicy,
  terms:          Terms,
  refundPolicy:   RefundPolicy,
};

// Pages that skip the Navbar + Footer shell
const FULL_PAGE = new Set(["login", "signup", "adminDashboard"]);

const pageTransition = {
  initial:    { opacity: 0, y: 8 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeInOut" },
};

function App() {
  const [page, setPage]         = useState("home");
  const [pageData, setPageData] = useState(null);

  const CurrentPage = useMemo(() => pages[page] ?? Home, [page]);
  const isFullPage  = FULL_PAGE.has(page);

  function goToPage(nextPage, data = null) {
    setPage(nextPage);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageContent = (
    <AnimatePresence mode="wait" initial={false}>
      <Motion.div key={page} {...pageTransition}>
        <Suspense fallback={<PageLoader />}>
          <CurrentPage onNavigate={goToPage} {...(pageData ? { pageData } : {})} />
        </Suspense>
      </Motion.div>
    </AnimatePresence>
  );

  if (isFullPage) {
    return <MotionConfig reducedMotion="user">{pageContent}</MotionConfig>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="siteShell">
        <a className="skip-link" href="#main-content">Skip to content</a>
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
        offset={16}
        toastOptions={{ style: { fontFamily: "var(--font-body)", fontSize: "0.875rem" } }}
      />
    </AuthProvider>
  );
}
