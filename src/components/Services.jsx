// components/Services.jsx
import React, { useEffect } from "react";
import {
  Home,
  Shield,
  Users,
  TrendingUp,
  Hammer,
  Building,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const services = [
    {
      icon: <Hammer className="w-12 h-12" />,
      title: "Custom Home Building",
      description:
        "Complete custom home construction services tailored to your unique vision and requirements.",
    },
    {
      icon: <Building className="w-12 h-12" />,
      title: "Property Development",
      description:
        "Professional property development services from planning to completion.",
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Construction Management",
      description:
        "Comprehensive project management to ensure quality and timely completion.",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Consultation & Design",
      description:
        "Expert architectural consultation and design services for your construction projects.",
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      ".service-card",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: "#services",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section id="services" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#174143] mb-4">
          Our Services
        </h2>
        <p className="text-xl text-center text-[#427A76] mb-12 max-w-2xl mx-auto">
          Comprehensive construction solutions tailored to your needs by A & R
          Builders
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 text-center border border-gray-100 cursor-pointer"
            >
              <div className="text-[#427A76] mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#174143] mb-4">
                {service.title}
              </h3>
              <p className="text-[#427A76] leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
