// components/FeaturedProperties.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturedProperties = () => {
  const featuredProperties = [
    {
      id: 1,
      title: "Modern Villa",
      location: "Beverly Hills, CA",
      price: "$2,500,000",
      beds: 4,
      baths: 3,
      area: 3200,
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Luxury Apartment",
      location: "Downtown, NY",
      price: "$1,200,000",
      beds: 3,
      baths: 2,
      area: 1800,
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Beach House",
      location: "Miami, FL",
      price: "$3,800,000",
      beds: 5,
      baths: 4,
      area: 4500,
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      ".property-card",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#featured-properties",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section id="featured-properties" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#174143] mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-[#427A76] max-w-2xl">
              Explore A & R Builders handpicked selection of premium properties
            </p>
          </div>

          <Link
            to="/properties"
            className="hidden md:flex items-center space-x-2 bg-[#174143] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#427A76] transition-colors duration-300 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProperties.map((property) => (
            <div
              key={property.id}
              className="property-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#174143]">
                    {property.title}
                  </h3>
                  <span className="text-2xl font-bold text-[#427A76]">
                    {property.price}
                  </span>
                </div>

                <div className="flex items-center text-[#427A76] mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex justify-between text-[#427A76] border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span>{property.area} sqft</span>
                  </div>
                </div>

                <Link
                  to="/properties"
                  className="w-full mt-4 bg-[#174143] text-white py-3 rounded-lg font-semibold hover:bg-[#427A76] transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <Link
          to="/properties"
          className="md:hidden w-full bg-[#174143] text-white py-4 rounded-lg font-semibold hover:bg-[#427A76] transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View All Properties</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProperties;
