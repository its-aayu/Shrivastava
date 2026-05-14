import { lazy, Suspense, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion, MotionConfig } from "framer-motion";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/Navbar";
import PageLoader from "./components/ui/PageLoader";
import ScrollTop from "./components/ui/ScrollTop";
import { navItems } from "./data/site";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Team = lazy(() => import("./pages/Team"));
const Blog = lazy(() => import("./pages/Blog"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

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
};

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

  const goToPage = (nextPage, data = null) => {
    setPage(nextPage);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="siteShell">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar activePage={page} navItems={navItems} onNavigate={goToPage} />
        <main id="main-content" tabIndex="-1">
          <AnimatePresence mode="wait" initial={false}>
            <Motion.div key={page} {...pageTransition}>
              <Suspense fallback={<PageLoader />}>
                <CurrentPage onNavigate={goToPage} {...(pageData ? { productId: pageData } : {})} />
              </Suspense>
            </Motion.div>
          </AnimatePresence>
        </main>
        <Footer onNavigate={goToPage} />
        <ScrollTop />
      </div>
    </MotionConfig>
  );
}

export default App;
