// components/Footer.jsx
import React from "react";
import { Home, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#174143] text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="w-8 h-8" />
              <span className="text-2xl font-bold">A & R Builders</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner in construction. We help you build the
              perfect property with exceptional service and expertise.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-[#427A76] rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              {["Home", "Properties", "Services", "About", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>+1 (555) 123-4567</p>
              <p>hello@ar-builders.com</p>
              <p>123 Construction Ave</p>
              <p>City, State 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 A & R Builders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
