// components/Hero.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-title",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        ".hero-subtitle",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(
        ".hero-button",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="pt-32 pb-20 px-4 bg-linear-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto text-center">
        <h1 className="hero-title text-5xl md:text-7xl font-bold text-[#174143] mb-6">
          Find Your Dream
          <span className="block text-[#427A76]">Home Today</span>
        </h1>

        <p className="hero-subtitle text-xl md:text-2xl text-[#427A76] mb-8 max-w-3xl mx-auto">
          Discover premium properties with exceptional service. Your perfect
          home is just a click away.
        </p>

        <div className="hero-button flex justify-center items-center mb-12">
          <Link
            to="/properties"
            className="bg-[#174143] text-white px-12 py-4 rounded-full font-semibold hover:bg-[#427A76] transition-colors duration-300 flex items-center gap-2 cursor-pointer text-lg"
          >
            Browse Properties
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Properties" },
            { number: "50+", label: "Happy Clients" },
            { number: "15+", label: "Years Experience" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#174143] mb-2">
                {stat.number}
              </div>
              <div className="text-[#427A76]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
