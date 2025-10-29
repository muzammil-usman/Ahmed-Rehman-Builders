// components/PropertyModal.jsx - Fixed price position & enhanced UI
import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Square,
  Heart,
  Share2,
  Phone,
  Star,
  Home,
  Car,
  TreePine,
  Wifi,
} from "lucide-react";
import gsap from "gsap";

const PropertyModal = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleSaveProperty = () => {
    setIsSaved(!isSaved);
    // Add your save property logic here
  };

  useEffect(() => {
    // Modal open animation
    gsap.fromTo(
      ".modal-content",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prevImage, nextImage]);

  // Feature icons mapping
  const featureIcons = {
    parking: <Car className="w-4 h-4" />,
    garden: <TreePine className="w-4 h-4" />,
    wifi: <Wifi className="w-4 h-4" />,
    furnished: <Home className="w-4 h-4" />,
  };

  const getFeatureIcon = (feature) => {
    const lowerFeature = feature.toLowerCase();
    for (const [key, icon] of Object.entries(featureIcons)) {
      if (lowerFeature.includes(key)) {
        return icon;
      }
    }
    return <Star className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-90">
      <div
        className="modal-content bg-white rounded-3xl w-full max-w-6xl h-[95vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Moved to top-left */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-50 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer border border-gray-200"
        >
          <X className="w-6 h-6 text-[#174143]" />
        </button>

        {/* Save Button - Top right */}
        <button
          onClick={handleSaveProperty}
          className={`absolute top-6 right-6 z-50 backdrop-blur-sm rounded-full p-3 shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer border ${
            isSaved
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white/90 border-gray-200 text-gray-600"
          }`}
        >
          <Heart className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Image Gallery */}
        <div className="lg:w-1/2 h-80 lg:h-full flex flex-col bg-linear-to-br from-gray-900 to-black relative">
          {/* Main Image */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop";
              }}
            />

            {/* Navigation Arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 text-[#174143]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 text-[#174143]" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {property.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-full text-sm font-medium border border-white/20">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="h-24 bg-linear-to-t from-black to-gray-900 px-6 py-4 border-t border-gray-700">
              <div className="flex space-x-3 overflow-x-auto h-full items-center">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-3 transition-all duration-300 transform hover:scale-110 ${
                      currentImageIndex === index
                        ? "border-[#427A76] shadow-lg shadow-[#427A76]/50"
                        : "border-gray-500 opacity-70 hover:opacity-100 hover:border-gray-300"
                    } cursor-pointer`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="lg:w-1/2 flex flex-col h-full bg-linear-to-br from-white to-gray-50">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            {/* Header with Price - Fixed position */}
            <div className="mb-8">
              {/* Badge */}
              {property.featured && (
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-yellow-200">
                  <Star className="w-4 h-4 fill-current" />
                  Featured Property
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#174143] mb-3 leading-tight">
                    {property.title}
                  </h2>
                  <div className="flex items-center text-[#427A76] text-lg font-medium">
                    <MapPin className="w-5 h-5 mr-3 shrink-0" />
                    <span className="wrap-break-word">{property.location}</span>
                  </div>
                </div>

                {/* Price - Now properly positioned */}
                <div className="bg-linear-to-r from-[#174143] to-[#427A76] text-white p-6 rounded-2xl shadow-lg">
                  <div className="text-sm font-semibold opacity-90 mb-1">
                    PRICE
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold">
                    {property.price}
                  </div>
                  <div className="text-sm opacity-90 mt-2">
                    Inclusive of all charges
                  </div>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
                  <Bed className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-[#174143]">
                  {property.beds}
                </div>
                <div className="text-gray-600 font-medium">Bedrooms</div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center items-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
                  <Square className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-[#174143]">
                  {property.area}
                </div>
                <div className="text-gray-600 font-medium capitalize">
                  {property.areaUnit || "sqft"}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#174143] mb-4 pb-3 border-b border-gray-200 flex items-center gap-3">
                <div className="w-2 h-8 bg-[#427A76] rounded-full"></div>
                Property Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                {property.description ||
                  "This beautiful property offers modern amenities and comfortable living spaces in a prime location. Perfect for families and individuals looking for quality living."}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#174143] mb-4 pb-3 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#427A76] rounded-full"></div>
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-[#427A76]/10 rounded-lg text-[#427A76]">
                        {getFeatureIcon(feature)}
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Action Buttons */}
          <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-linear-to-r from-[#174143] to-[#427A76] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer text-lg shadow-lg">
                <Phone className="w-5 h-5" />
                Contact Agent
              </button>
              <button className="flex-1 border-2 border-[#174143] text-[#174143] py-4 rounded-xl font-semibold hover:bg-[#174143] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer text-lg hover:shadow-lg">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
