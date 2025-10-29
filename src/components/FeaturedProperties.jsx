// components/FeaturedProperties.jsx - Fixed baths issue
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowRight,
  RefreshCw,
  Database,
  Plus,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedProperties } from "../services/propertyService";

gsap.registerPlugin(ScrollTrigger);

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const featuredProperties = await getFeaturedProperties();

      if (featuredProperties && featuredProperties.length > 0) {
        setProperties(featuredProperties);
        setApiStatus("connected");
      } else {
        setProperties([]);
        setError("No featured properties found");
        setApiStatus("empty");
      }
    } catch (err) {
      console.log("Error fetching featured properties:", err.message);
      setProperties([]);
      setError("Failed to load featured properties");
      setApiStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    if (properties.length > 0) {
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
    }
  }, [properties]);

  // ✅ AREA UNIT DISPLAY FUNCTION - Admin panel ke saath sync
  const getAreaDisplay = (property) => {
    // Agar property mein areaUnit hai toh wohi use karo
    if (property.areaUnit) {
      return `${property.area} ${property.areaUnit}`;
    }

    // Fallback: Default "Marla" agar koi unit set nahi hai
    return `${property.area} Marla`;
  };

  // ✅ BATHROOMS KO COMPLETELY REMOVE KAR DIYA
  // Kyonki admin panel mein ab baths field nahi hai

  const retryFetch = () => {
    fetchProperties();
  };

  if (properties.length === 0 && !loading) {
    return null;
  }

  if (loading) {
    return (
      <section id="featured-properties" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#174143] mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-center text-[#427A76] mb-12 max-w-2xl mx-auto">
            Loading featured properties...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="property-card bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-properties" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#174143] mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-[#427A76] max-w-2xl">
              Explore A & R Builders' handpicked selection of premium properties
            </p>
            {error && apiStatus === "empty" && (
              <div className="mt-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 bg-[#174143] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#427A76] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Mark Properties as Featured
                </Link>
              </div>
            )}
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
          {properties.map((property) => (
            <div
              key={property.id}
              className="property-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop";
                }}
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

                {/* ✅ BATHROOMS COMPLETELY REMOVED - Sirf 2 items bache hain */}
                <div className="flex justify-between text-[#427A76] border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{property.beds} Beds</span>
                  </div>

                  {/* ✅ AREA UNIT FIXED - Admin panel ke saath sync */}
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span>{getAreaDisplay(property)}</span>
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
