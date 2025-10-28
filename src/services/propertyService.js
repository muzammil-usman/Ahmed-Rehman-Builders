// src/services/propertyService.js - COMPLETE REWRITE
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const propertiesCollection = collection(db, "properties");

// Cache to prevent multiple calls
let propertiesCache = null;
let featuredCache = null;

export const getProperties = async (forceRefresh = false) => {
  // Return cached data if available and not forcing refresh
  if (propertiesCache && !forceRefresh) {
    return propertiesCache;
  }

  try {
    const querySnapshot = await getDocs(propertiesCollection);
    const properties = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const property = {
        id: doc.id,
        title: data.title || "Untitled Property",
        location: data.location || "Location not specified",
        price: data.price || "Price not set",
        beds: data.beds || 0,
        baths: data.baths || 0,
        area: data.area || 0,
        type: data.type || "villa",
        featured: data.featured || false,
        images: data.images || [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        ],
        description: data.description || "No description available",
        features: data.features || [],
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      };

      properties.push(property);
    });

    // Cache the results
    propertiesCache = properties;
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

export const getFeaturedProperties = async (forceRefresh = false) => {
  // Return cached data if available and not forcing refresh
  if (featuredCache && !forceRefresh) {
    return featuredCache;
  }

  try {
    // Try direct query first
    const q = query(propertiesCollection, where("featured", "==", true));
    const querySnapshot = await getDocs(q);
    const featuredProperties = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const property = {
        id: doc.id,
        title: data.title || "Untitled Property",
        location: data.location || "Location not specified",
        price: data.price || "Price not set",
        beds: data.beds || 0,
        baths: data.baths || 0,
        area: data.area || 0,
        type: data.type || "villa",
        featured: true,
        images: data.images || [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        ],
        description: data.description || "No description available",
        features: data.features || [],
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      };

      featuredProperties.push(property);
    });

    // Cache the results
    featuredCache = featuredProperties;
    return featuredProperties;
  } catch (error) {
    // If direct query fails, use cached properties or empty array
    console.error("Error in featured properties query:", error);

    if (propertiesCache) {
      // Use cached properties to filter
      const filtered = propertiesCache.filter((prop) => prop.featured === true);
      featuredCache = filtered;
      return filtered;
    }

    // Return empty array as last resort
    return [];
  }
};

export const getPropertyById = async (id) => {
  try {
    const docRef = doc(db, "properties", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Property not found");
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
};

export const addProperty = async (propertyData) => {
  try {
    const docRef = await addDoc(propertiesCollection, {
      ...propertyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Clear cache when new property is added
    propertiesCache = null;
    featuredCache = null;

    return docRef.id;
  } catch (error) {
    console.error("Error adding property:", error);
    throw error;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const docRef = doc(db, "properties", id);
    await updateDoc(docRef, {
      ...propertyData,
      updatedAt: serverTimestamp(),
    });

    // Clear cache when property is updated
    propertiesCache = null;
    featuredCache = null;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const docRef = doc(db, "properties", id);
    await deleteDoc(docRef);

    // Clear cache when property is deleted
    propertiesCache = null;
    featuredCache = null;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const testFirebaseConnection = async () => {
  try {
    await getDocs(propertiesCollection);
    return true;
  } catch (error) {
    console.error("Firebase connection failed:", error);
    return false;
  }
};

export const debugFirebaseData = async () => {
  try {
    const querySnapshot = await getDocs(propertiesCollection);
    const allDocs = [];

    querySnapshot.forEach((doc) => {
      allDocs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return allDocs;
  } catch (error) {
    console.error("Error checking Firebase data:", error);
    throw error;
  }
};

// Clear cache manually if needed
export const clearCache = () => {
  propertiesCache = null;
  featuredCache = null;
};
