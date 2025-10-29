// components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Home,
  Upload,
  XCircle,
  Menu,
  GripVertical,
} from "lucide-react";
import {
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  updatePropertyOrder,
} from "../services/propertyService";

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "order",
    direction: "asc",
  });
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    area: "",
    areaUnit: "marla", // Default Pakistani unit
    type: "villa",
    featured: false,
    images: [],
    description: "",
    features: [""],
  });

  // ✅ DRAG & DROP FUNCTIONS
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newProperties = [...properties];
    const [movedItem] = newProperties.splice(dragIndex, 1);
    newProperties.splice(dropIndex, 0, movedItem);

    const updatedProperties = newProperties.map((property, index) => ({
      ...property,
      order: index,
    }));

    setProperties(updatedProperties);
    setDragIndex(null);

    try {
      await updatePropertyOrder(updatedProperties);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating property order");
    }
  };

  // ✅ SORTING FUNCTION
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedProperties = [...properties].sort((a, b) => {
      if (key === "title" || key === "location" || key === "type") {
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else if (key === "price") {
        const priceA = parseFloat(a[key].replace(/[^\d.]/g, ""));
        const priceB = parseFloat(b[key].replace(/[^\d.]/g, ""));
        return direction === "asc" ? priceA - priceB : priceB - priceA;
      } else if (key === "beds" || key === "area") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else {
        return direction === "asc" ? a.order - b.order : b.order - a.order;
      }
    });

    setProperties(sortedProperties);
  };

  // ✅ FREE IMAGE HOSTING FUNCTION
  const uploadToFreeHosting = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.data && data.data.url) {
        const directUrl = data.data.url.replace(
          "tmpfiles.org/",
          "tmpfiles.org/dl/"
        );
        return directUrl;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Free hosting error:", error);
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

  // ✅ Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadLoading(true);
      const uploadedUrls = [];

      for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
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

  // ✅ Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const props = await getProperties();
      const propertiesWithOrder = props.map((property, index) => ({
        ...property,
        order: property.order || index,
      }));
      setProperties(propertiesWithOrder);
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
      area: "",
      areaUnit: "marla",
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

      if (formData.images.length === 0) {
        alert("Please upload at least one image");
        return;
      }

      const submitData = {
        ...formData,
        features: formData.features.filter((feature) => feature.trim() !== ""),
        beds: parseInt(formData.beds),
        area: parseFloat(formData.area),
        price: formData.price.toString(),
        order: properties.length,
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
      area: property.area.toString(),
      areaUnit: property.areaUnit || "marla",
      type: property.type || "villa",
      featured: property.featured || false,
      images: property.images || [],
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-[#174143] text-white rounded-lg shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex">
        {/* Sidebar - Mobile & Desktop */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white shadow-lg lg:shadow-none transition-transform duration-300
        `}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-[#174143]" />
              <div>
                <h1 className="text-xl font-bold text-[#174143]">
                  A & R Builders
                </h1>
                <p className="text-[#427A76] text-sm">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Quick Stats - Sidebar Version */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-[#174143] mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#427A76] text-sm">Total Properties</span>
                <span className="font-bold text-[#174143]">
                  {properties.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#427A76] text-sm">Featured</span>
                <span className="font-bold text-[#174143]">
                  {properties.filter((p) => p.featured).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#427A76] text-sm">Villas</span>
                <span className="font-bold text-[#174143]">
                  {properties.filter((p) => p.type === "villa").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#427A76] text-sm">Apartments</span>
                <span className="font-bold text-[#174143]">
                  {properties.filter((p) => p.type === "apartment").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="lg:hidden">
                    <Home className="w-8 h-8 text-[#174143]" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-xl lg:text-2xl font-bold text-[#174143]">
                      A & R Builders - Admin Panel
                    </h1>
                    <p className="text-[#427A76] text-sm">
                      Manage your properties - Drag to reorder
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#174143] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#427A76] transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Properties List */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg lg:text-xl font-bold text-[#174143]">
                      Properties ({properties.length})
                    </h2>

                    {/* SORTING OPTIONS */}
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <span className="text-sm text-[#427A76]">Sort by:</span>
                      <select
                        onChange={(e) => handleSort(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#174143]"
                      >
                        <option value="order">Display Order</option>
                        <option value="title">Title</option>
                        <option value="price">Price</option>
                        <option value="beds">Beds</option>
                        <option value="area">Area</option>
                        <option value="type">Type</option>
                      </select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#174143] mx-auto"></div>
                      <p className="text-[#427A76] mt-2">
                        Loading properties...
                      </p>
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
                    <div className="space-y-3">
                      {properties.map((property, index) => (
                        <div
                          key={property.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-move ${
                            dragIndex === index
                              ? "opacity-50 bg-blue-50"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* DRAG HANDLE */}
                            <div className="flex items-center justify-center sm:justify-start">
                              <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                              <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">
                                {index + 1}
                              </span>
                            </div>

                            <div className="shrink-0">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-[#174143] text-sm sm:text-base truncate">
                                    {property.title}
                                  </h3>
                                  <p className="text-[#427A76] text-xs sm:text-sm truncate">
                                    {property.location}
                                  </p>
                                  <p className="text-lg font-bold text-[#427A76] sm:text-base">
                                    {property.price}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2 flex-wrap gap-1">
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
                              <div className="flex items-center space-x-4 mt-2 text-[#427A76] text-xs sm:text-sm flex-wrap">
                                <span>{property.beds} Beds</span>
                                {/* ✅ SIMPLE AREA DISPLAY - Jo unit admin ne select ki wohi show hogi */}
                                <span>
                                  {property.area} {property.areaUnit}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-end sm:justify-start space-x-2 sm:ml-4">
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

              {/* Quick Stats - Desktop Only */}
              <div className="hidden lg:block lg:col-span-1">
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
                        {
                          properties.filter((p) => p.type === "apartment")
                            .length
                        }
                      </span>
                    </div>
                  </div>

                  {/* DRAG & DROP INSTRUCTIONS */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#174143] mb-2">
                      💡 Drag & Drop Guide
                    </h4>
                    <ul className="text-xs text-[#427A76] space-y-1">
                      <li>• Drag handle (⋮⋮) to reorder properties</li>
                      <li>• Use sort dropdown for quick sorting</li>
                      <li>• Order saves automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 lg:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto mx-auto">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-bold text-[#174143]">
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="PKR 2,500,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
                    />
                  </div>

                  {/* ✅ SIMPLE AREA FIELD - No conversion, just display selected unit */}
                  <div>
                    <label className="block text-sm font-medium text-[#174143] mb-1">
                      Area *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        min="1"
                        step="0.01"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
                        placeholder="Enter area"
                      />
                      <select
                        name="areaUnit"
                        value={formData.areaUnit}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base w-32"
                      >
                        <option value="sqft">Square Feet</option>
                        <option value="marla">Marla</option>
                        <option value="gaz">Gaz</option>
                        <option value="yards">Square Yards</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center sm:col-span-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
                  />
                </div>

                {/* IMAGE UPLOAD SECTION */}
                <div>
                  <label className="block text-sm font-medium text-[#174143] mb-3">
                    Images *
                  </label>

                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-8 text-center mb-4 hover:border-[#174143] transition-colors cursor-pointer bg-gray-50"
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />

                    <Upload className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2 lg:mb-3" />
                    <p className="text-base lg:text-lg font-medium text-gray-600 mb-1 lg:mb-2">
                      Click to upload images
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      or drag and drop files here
                    </p>
                    <p className="text-xs text-gray-400 mt-1 lg:mt-2">
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
                    <div className="mt-4 lg:mt-6">
                      <h4 className="text-sm font-medium text-[#174143] mb-3">
                        Uploaded Images ({formData.images.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
                        {formData.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Property ${index + 1}`}
                              className="w-full h-20 lg:h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            >
                              <XCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                            </button>
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] text-sm lg:text-base"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading || uploadLoading}
                    className="flex-1 bg-[#174143] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#427A76] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 order-2 sm:order-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm lg:text-base">
                          Saving Property...
                        </span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span className="text-sm lg:text-base">
                          {editingProperty ? "Update Property" : "Add Property"}
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 order-1 sm:order-2"
                  >
                    <span className="text-sm lg:text-base">Cancel</span>
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
