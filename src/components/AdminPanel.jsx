// components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Home,
  Upload,
  XCircle,
} from "lucide-react";
import {
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "../services/propertyService";

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    baths: "",
    area: "",
    type: "villa",
    featured: false,
    images: [],
    description: "",
    features: [""],
  });

  // ✅ FREE IMAGE HOSTING FUNCTION - Images ko free hosting par upload karega
  const uploadToFreeHosting = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Free image hosting service - koi account nahi chahiye
      const response = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.data && data.data.url) {
        // URL convert karo direct image link mein
        const directUrl = data.data.url.replace(
          "tmpfiles.org/",
          "tmpfiles.org/dl/"
        );
        return directUrl;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Free hosting error:", error);

      // Alternative free hosting try karo
      try {
        const altResponse = await fetch("https://file.io", {
          method: "POST",
          body: formData,
        });
        const altData = await altResponse.json();
        return altData.link;
      } catch (altError) {
        throw new Error("All image hosts failed");
      }
    }
  };

  // ✅ Handle image upload - Images ko free hosting par upload karega
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadLoading(true);

      const uploadedUrls = [];

      // Files ko one by one upload karo
      for (let file of files) {
        // File size check
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          alert(`File ${file.name} is too large. Maximum size is 5MB.`);
          continue;
        }

        const url = await uploadToFreeHosting(file);
        uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));

        alert(`${uploadedUrls.length} image(s) uploaded successfully! ✅`);
      }

      e.target.value = "";
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images: " + error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // ✅ Remove image
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ Drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      const fakeEvent = { target: { files: imageFiles } };
      await handleImageUpload(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ✅ Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const props = await getProperties();
      setProperties(props);
    } catch (error) {
      console.error("Error fetching properties:", error);
      alert("Error fetching properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Add feature
  const addFeatureField = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  // ✅ Update feature
  const updateFeature = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  // ✅ Remove feature
  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      price: "",
      beds: "",
      baths: "",
      area: "",
      type: "villa",
      featured: false,
      images: [],
      description: "",
      features: [""],
    });
    setEditingProperty(null);
    setShowForm(false);
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validation
      if (formData.images.length === 0) {
        alert("Please upload at least one image");
        return;
      }

      // ✅ Yahan sirf IMAGE URLs save hongi Firebase mein
      const submitData = {
        ...formData,
        features: formData.features.filter((feature) => feature.trim() !== ""),
        beds: parseInt(formData.beds),
        baths: parseInt(formData.baths),
        area: parseInt(formData.area),
        price: formData.price.toString(),
        // images: formData.images → Ye already URLs hain
      };

      if (editingProperty) {
        await updateProperty(editingProperty.id, submitData);
        alert("Property updated successfully!");
      } else {
        await addProperty(submitData);
        alert("Property added successfully!");
      }

      resetForm();
      fetchProperties();
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Error saving property: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit property
  const handleEdit = (property) => {
    setFormData({
      title: property.title,
      location: property.location,
      price: property.price,
      beds: property.beds.toString(),
      baths: property.baths.toString(),
      area: property.area.toString(),
      type: property.type || "villa",
      featured: property.featured || false,
      images: property.images || [], // ✅ Ye URLs hain
      description: property.description || "",
      features:
        property.features && property.features.length > 0
          ? property.features
          : [""],
    });
    setEditingProperty(property);
    setShowForm(true);
  };

  // ✅ Delete property
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        setLoading(true);
        await deleteProperty(id);
        alert("Property deleted successfully!");
        fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Error deleting property");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-[#174143]" />
              <div>
                <h1 className="text-2xl font-bold text-[#174143]">
                  A & R Builders - Admin Panel
                </h1>
                <p className="text-[#427A76]">Manage your properties</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#174143] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#427A76] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Properties List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#174143] mb-4">
                Properties ({properties.length})
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#174143] mx-auto"></div>
                  <p className="text-[#427A76] mt-2">Loading properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No properties found</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-[#174143] hover:text-[#427A76] mt-2 cursor-pointer"
                  >
                    Add your first property
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4 flex-1">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-[#174143]">
                                  {property.title}
                                </h3>
                                <p className="text-sm text-[#427A76]">
                                  {property.location}
                                </p>
                                <p className="text-lg font-bold text-[#427A76]">
                                  {property.price}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {property.featured && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                    Featured
                                  </span>
                                )}
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  {property.type}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-[#427A76]">
                              <span>{property.beds} Beds</span>
                              <span>{property.baths} Baths</span>
                              <span>{property.area} sqft</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(property)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#174143] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#427A76]">Total Properties</span>
                  <span className="font-bold text-[#174143]">
                    {properties.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#427A76]">Featured</span>
                  <span className="font-bold text-[#174143]">
                    {properties.filter((p) => p.featured).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#427A76]">Villas</span>
                  <span className="font-bold text-[#174143]">
                    {properties.filter((p) => p.type === "villa").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#427A76]">Apartments</span>
                  <span className="font-bold text-[#174143]">
                    {properties.filter((p) => p.type === "apartment").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#174143]">
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="AED 2,500,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                    >
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
                      <option value="beach">Beach House</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Beds *
                    </label>
                    <input
                      type="number"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Baths *
                    </label>
                    <input
                      type="number"
                      name="baths"
                      value={formData.baths}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Area (sqft) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-[#174143]">
                      Featured Property
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#174143] mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                  />
                </div>

                {/* ✅ UPDATED IMAGE UPLOAD SECTION - FREE HOSTING */}
                <div>
                  <label className="block text-sm font-medium text-[#174143] mb-3">
                    Images *
                  </label>

                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-[#174143] transition-colors cursor-pointer bg-gray-50"
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />

                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Click to upload images
                    </p>
                    <p className="text-sm text-gray-500">
                      or drag and drop files here
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      PNG, JPG, JPEG (Max 5MB each)
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ✅ Images will be stored on free cloud storage
                    </p>
                  </div>

                  {/* Upload Loading */}
                  {uploadLoading && (
                    <div className="text-center py-4 bg-blue-50 rounded-lg mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-blue-600">
                        Uploading to cloud storage...
                      </p>
                    </div>
                  )}

                  {/* Uploaded Images Preview */}
                  {formData.images.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-[#174143] mb-3">
                        Uploaded Images ({formData.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Property ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                              URL Stored
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Message */}
                  {formData.images.length === 0 && !uploadLoading && (
                    <p className="text-red-500 text-sm text-center">
                      Please upload at least one property image
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#174143]">
                      Features
                    </label>
                    <button
                      type="button"
                      onClick={addFeatureField}
                      className="text-sm text-[#174143] hover:text-[#427A76] cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Swimming Pool, Garden, Parking, etc."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143]"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading || uploadLoading}
                    className="flex-1 bg-[#174143] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#427A76] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving Property...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>
                          {editingProperty ? "Update Property" : "Add Property"}
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
