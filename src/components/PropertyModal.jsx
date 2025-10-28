// components/PropertyModal.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
} from "lucide-react";
import gsap from "gsap";

const PropertyModal = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div
        className="modal-content bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6 text-[#174143]" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Gallery */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-64 lg:h-full">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-[#174143]" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 text-[#174143]" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? "border-[#427A76]"
                        : "border-transparent"
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
          </div>

          {/* Property Details */}
          <div className="lg:w-1/2 p-8 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-[#174143] mb-2">
                  {property.title}
                </h2>
                <div className="flex items-center text-[#427A76] mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#427A76]">
                {property.price}
              </div>
            </div>

            {/* Property Features */}
            <div className="flex justify-between text-[#427A76] mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bed className="w-5 h-5 mr-2" />
                <span>{property.beds} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-2" />
                <span>{property.baths} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="w-5 h-5 mr-2" />
                <span>{property.area} sqft</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#174143] mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#174143] mb-3">
                Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-[#427A76] rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-[#174143] text-white py-4 rounded-lg font-semibold hover:bg-[#427A76] transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer">
                <Heart className="w-5 h-5" />
                Save Property
              </button>
              <button className="flex-1 border-2 border-[#174143] text-[#174143] py-4 rounded-lg font-semibold hover:bg-[#174143] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Contact Button */}
            <button className="w-full mt-4 bg-[#427A76] text-white py-4 rounded-lg font-semibold hover:bg-[#174143] transition-colors duration-300 cursor-pointer">
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
