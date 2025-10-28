// pages/Properties.jsx - CLEAN VERSION
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, MapPin, Bed, Bath, Square } from "lucide-react";
import gsap from "gsap";
import PropertyModal from "../components/PropertyModal";
import { getProperties } from "../services/propertyService";

const Properties = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from Firebase
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const firebaseProperties = await getProperties();

      if (firebaseProperties && firebaseProperties.length > 0) {
        setProperties(firebaseProperties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (properties.length > 0 && !loading) {
      gsap.fromTo(
        ".property-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [properties, loading]);

  const filteredProperties =
    filter === "all"
      ? properties
      : properties.filter((property) => property.type === filter);

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Home className="w-8 h-8 text-[#174143]" />
                <span className="text-2xl font-bold text-[#174143]">
                  A & R Builders
                </span>
              </Link>

              <Link
                to="/"
                className="flex items-center space-x-2 text-[#174143] hover:text-[#427A76] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-[#174143] mb-4">
                All Properties
              </h1>
              <p className="text-xl text-[#427A76] max-w-2xl mx-auto">
                Loading properties...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse"
                >
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-6 bg-gray-300 rounded w-32"></div>
                      <div className="h-6 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-40 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Simple Version */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <Home className="w-8 h-8 text-[#174143]" />
              <span className="text-2xl font-bold text-[#174143]">
                A & R Builders
              </span>
            </Link>

            <Link
              to="/"
              className="flex items-center space-x-2 text-[#174143] hover:text-[#427A76] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#174143] mb-4">
              All Properties
            </h1>
            <p className="text-xl text-[#427A76] max-w-2xl mx-auto">
              Discover A & R Builders' complete collection of premium properties
            </p>
          </div>

          {/* Filters */}
          {properties.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                "all",
                "villa",
                "apartment",
                "beach",
                "penthouse",
                "townhouse",
              ].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                    filter === filterType
                      ? "bg-[#174143] text-white"
                      : "bg-white text-[#174143] border border-[#174143] hover:bg-[#174143] hover:text-white"
                  } cursor-pointer capitalize`}
                >
                  {filterType === "all" ? "All Properties" : filterType + "s"}
                </button>
              ))}
            </div>
          )}

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id || index}
                  className="property-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer transform hover:-translate-y-2"
                  onClick={() => openModal(property)}
                >
                  <img
                    src={
                      property.images?.[0] ||
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                    }
                    alt={property.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop";
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

                    <button className="w-full mt-4 bg-[#174143] text-white py-3 rounded-lg font-semibold hover:bg-[#427A76] transition-colors duration-300 cursor-pointer">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Properties Message */
            properties.length === 0 &&
            !loading && (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-[#427A76] mb-4">
                  No properties found.
                </p>
                <p className="text-gray-600">
                  Properties will appear here once added.
                </p>
              </div>
            )
          )}
        </div>
      </main>

      {/* Property Modal */}
      {isModalOpen && selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={closeModal} />
      )}
    </div>
  );
};

export default Properties;
