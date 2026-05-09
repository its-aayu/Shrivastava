import { useMemo, useState } from "react";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/Navbar";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Services from "./pages/Services";
import Team from "./pages/Team";
import { navItems } from "./data/site";

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
};

function App() {
  const [page, setPage] = useState("home");
  const CurrentPage = useMemo(() => pages[page] ?? Home, [page]);

  const goToPage = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="siteShell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar activePage={page} navItems={navItems} onNavigate={goToPage} />
      <main id="main-content" tabIndex="-1">
        <CurrentPage onNavigate={goToPage} />
      </main>
      <Footer onNavigate={goToPage} />
    </div>
  );
}

export default App;
