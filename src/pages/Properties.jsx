// pages/Properties.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Search,
  Filter,
} from "lucide-react";
import gsap from "gsap";
import PropertyModal from "../components/PropertyModal";

const Properties = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const properties = [
    {
      id: 1,
      title: "Modern Villa",
      location: "Beverly Hills, CA",
      price: "$2,500,000",
      beds: 4,
      baths: 3,
      area: 3200,
      type: "villa",
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      ],
      description:
        "Luxurious modern villa with panoramic views, featuring state-of-the-art amenities and elegant design.",
      features: [
        "Swimming Pool",
        "Home Theater",
        "Wine Cellar",
        "Smart Home",
        "Garden",
        "Garage",
      ],
    },
    {
      id: 2,
      title: "Luxury Apartment",
      location: "Downtown, NY",
      price: "$1,200,000",
      beds: 3,
      baths: 2,
      area: 1800,
      type: "apartment",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
      ],
      description:
        "Stylish downtown apartment with modern finishes and convenient urban living.",
      features: ["Concierge", "Gym", "Rooftop Terrace", "Parking", "Security"],
    },
    {
      id: 3,
      title: "Beach House",
      location: "Miami, FL",
      price: "$3,800,000",
      beds: 5,
      baths: 4,
      area: 4500,
      type: "beach",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1575517111836-7e4f4d8a56c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
      ],
      description:
        "Stunning beachfront property with direct beach access and breathtaking ocean views.",
      features: [
        "Beach Access",
        "Infinity Pool",
        "Outdoor Kitchen",
        "Private Dock",
        "Sun Deck",
      ],
    },
    {
      id: 4,
      title: "Mountain Retreat",
      location: "Aspen, CO",
      price: "$4,200,000",
      beds: 6,
      baths: 5,
      area: 5200,
      type: "mountain",
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1464822759844-4c9a8c4f4b81?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      ],
      description:
        "Luxurious mountain retreat with ski-in/ski-out access and cozy fireplace.",
      features: [
        "Ski Access",
        "Hot Tub",
        "Fireplace",
        "Game Room",
        "Mountain Views",
      ],
    },
    {
      id: 5,
      title: "City Penthouse",
      location: "Chicago, IL",
      price: "$2,800,000",
      beds: 3,
      baths: 3,
      area: 2800,
      type: "penthouse",
      images: [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      ],
      description:
        "Elegant penthouse with stunning city skyline views and premium amenities.",
      features: [
        "City Views",
        "Private Elevator",
        "Wet Bar",
        "Balcony",
        "High Ceilings",
      ],
    },
    {
      id: 6,
      title: "Country Estate",
      location: "Napa Valley, CA",
      price: "$5,500,000",
      beds: 7,
      baths: 6,
      area: 6800,
      type: "estate",
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      ],
      description:
        "Magnificent country estate with vineyard and extensive grounds.",
      features: [
        "Vineyard",
        "Guest House",
        "Tennis Court",
        "Pool House",
        "Stables",
      ],
    },
  ];

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

  useEffect(() => {
    gsap.fromTo(
      ".property-card",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
    );
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <Home className="w-8 h-8 text-[#174143]" />
              <span className="text-2xl font-bold text-[#174143]">
                EstatePro
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
              Discover our complete collection of premium properties
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                filter === "all"
                  ? "bg-[#174143] text-white"
                  : "bg-white text-[#174143] border border-[#174143] hover:bg-[#174143] hover:text-white"
              } cursor-pointer`}
            >
              All Properties
            </button>
            <button
              onClick={() => setFilter("villa")}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                filter === "villa"
                  ? "bg-[#174143] text-white"
                  : "bg-white text-[#174143] border border-[#174143] hover:bg-[#174143] hover:text-white"
              } cursor-pointer`}
            >
              Villas
            </button>
            <button
              onClick={() => setFilter("apartment")}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                filter === "apartment"
                  ? "bg-[#174143] text-white"
                  : "bg-white text-[#174143] border border-[#174143] hover:bg-[#174143] hover:text-white"
              } cursor-pointer`}
            >
              Apartments
            </button>
            <button
              onClick={() => setFilter("beach")}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                filter === "beach"
                  ? "bg-[#174143] text-white"
                  : "bg-white text-[#174143] border border-[#174143] hover:bg-[#174143] hover:text-white"
              } cursor-pointer`}
            >
              Beach Houses
            </button>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="property-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer transform hover:-translate-y-2"
                onClick={() => openModal(property)}
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-64 object-cover"
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
