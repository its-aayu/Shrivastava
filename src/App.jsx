import { useMemo, useState } from "react";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import About from "./Pages/About";
import Blog from "./Pages/Blog";
import Contact from "./Pages/Contact";
import FAQ from "./Pages/FAQ";
import Gallery from "./Pages/Gallery";
import Home from "./Pages/Home";
import Pricing from "./Pages/Pricing";
import Services from "./Pages/Services";
import Team from "./Pages/Team";
import { navItems } from "./data/site";
import "./App.css";

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
