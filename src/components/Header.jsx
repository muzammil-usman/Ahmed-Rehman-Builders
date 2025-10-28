// components/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, Menu, X, Phone } from "lucide-react";
import gsap from "gsap";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      ".nav-item",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5 }
    );
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Header height offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Handle navigation click
  const handleNavClick = (path, event) => {
    event.preventDefault();

    if (path === "/") {
      // Home par click - top par scroll karega
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else if (path.startsWith("#")) {
      const sectionId = path.substring(1); // # hatayega
      if (location.pathname === "/") {
        // Same page par hai - smooth scroll karega
        scrollToSection(sectionId);
      } else {
        // Different page par hai - home page par le jayega
        window.location.href = `/#${sectionId}`;
      }
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Services", path: "#services" },
    { name: "About", path: "#about" },
    { name: "Contact", path: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 nav-item cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <HomeIcon className="w-8 h-8 text-[#174143]" />
            <span className="text-2xl font-bold text-[#174143]">
              A & R Builders
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) =>
              item.path === "/properties" ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className="nav-item text-[#174143] hover:text-[#427A76] transition-colors duration-300 font-medium cursor-pointer"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(item.path, e)}
                  className="nav-item text-[#174143] hover:text-[#427A76] transition-colors duration-300 font-medium cursor-pointer"
                >
                  {item.name}
                </button>
              )
            )}
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center space-x-2 nav-item">
            <Phone className="w-4 h-4 text-[#174143]" />
            <span className="text-[#174143]">+92 123 456 789</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden nav-item text-[#174143] cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) =>
                item.path === "/properties" ? (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-[#174143] hover:text-[#427A76] transition-colors duration-300 font-medium py-2 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavClick(item.path, e)}
                    className="text-[#174143] hover:text-[#427A76] transition-colors duration-300 font-medium py-2 cursor-pointer text-left"
                  >
                    {item.name}
                  </button>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
