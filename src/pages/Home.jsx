// pages/Home.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Award,
  Clock,
  ShieldCheck,
} from "lucide-react";
import gsap from "gsap";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function HomePage() {
  const appRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      appRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={appRef}>
      <Header />
      <Hero />
      <FeaturedProperties />
      <Services />

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#174143] mb-6">
                About A & R Builders
              </h2>
              <p className="text-lg text-[#427A76] mb-6 leading-relaxed">
                With over 15 years of experience in the construction industry, A
                & R Builders has been helping families build their dream homes
                and investors develop their properties. Our commitment to
                excellence and customer satisfaction sets us apart.
              </p>
              <p className="text-lg text-[#427A76] mb-8 leading-relaxed">
                We believe that building your dream home should be an exciting
                journey, not a stressful experience. That's why we provide
                personalized service and expert guidance every step of the way.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#174143] mb-2">
                    1000+
                  </div>
                  <div className="text-[#427A76]">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#174143] mb-2">
                    98%
                  </div>
                  <div className="text-[#427A76]">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#174143] mb-2">
                    15+
                  </div>
                  <div className="text-[#427A76]">Years Experience</div>
                </div>
              </div>

              <button className="bg-[#174143] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#427A76] transition-colors duration-300 cursor-pointer">
                Learn More About Us
              </button>
            </div>

            {/* Right Content - Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <Award className="w-8 h-8 text-[#427A76] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-[#174143] mb-2">
                    Award Winning Service
                  </h3>
                  <p className="text-[#427A76]">
                    Recognized as the best construction company for customer
                    service and satisfaction.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-[#427A76] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-[#174143] mb-2">
                    Available 24/7
                  </h3>
                  <p className="text-[#427A76]">
                    Our team is always available to assist you with your
                    construction needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-[#427A76] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-[#174143] mb-2">
                    Trusted & Secure
                  </h3>
                  <p className="text-[#427A76]">
                    Your construction projects are safe with our secure and
                    transparent process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
