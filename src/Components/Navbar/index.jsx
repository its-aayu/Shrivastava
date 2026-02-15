import Button from "../Button";

export default function Navbar() {
  return (
    <header className="bg-[#3C3288] text-white">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wide">
            Shrivastava
          </span>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#" className="text-[#FF9247] font-medium">
            Home
          </a>
          <a href="#" className="hover:text-[#FF9247] transition">
            About
          </a>
          <a href="#" className="hover:text-[#FF9247] transition">
            Services
          </a>
          <a href="#" className="hover:text-[#FF9247] transition">
            Page
          </a>
          <a href="#" className="hover:text-[#FF9247] transition">
            Contact Us
          </a>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Button className="bg-[#FF9247] hover:bg-[#ff7f2a] text-white">
            Get a Quote
          </Button>
        </div>

      </div>
    </header>
  );
}
