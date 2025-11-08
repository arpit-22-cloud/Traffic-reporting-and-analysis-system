import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// SEARCH DESTINATION - PLACE TEXT SEARCH API

export const searchDestination = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_PLACE_API_KEY;
    const url = "https://places.googleapis.com/v1/places:searchText";

    const response = await axios.post(
      url,
      {
        textQuery: query, // your search text
        pageSize: 5 // optional: limit results
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location",
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data.places || [],
    });
  } catch (error) {
    console.error("Search Destination Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || "Something went wrong.",
    });
  }
};




// SEARCH BY FILTER - NEARBY PLACES API
export const searchByFilter = async (req, res) => {
  try {
    const { lat, lng, type } = req.body;

    if (!lat || !lng || !type) {
      return res.status(400).json({
        success: false,
        message: "Latitude, longitude, and filter type are required.",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_PLACE_API_KEY;
    const url =` https://places.googleapis.com/v1/places:searchNearby`
;

    const response = await axios.post(
      url,
      {
        includedTypes: [type], // e.g., "restaurant", "hospital", etc.
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 5000, // 5 km radius
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location",
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data.places || [],
    });
  } catch (error) {
    console.error("Filter Search Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message || "Error while fetching nearby places.",
    });
  }
};

// SEARCH B/W TWO POINTS - DIRECTIONS API

export const searchBetweenPoints = async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({
        success: false,
        message: "Please provide startLat, startLng, endLat, and endLng.",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_DIRECTION_API_KEY;

    // ✅ Fetch data from Google Directions API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: `${startLat},${startLng}`,
          destination: `${endLat},${endLng}`,
          key: apiKey,
        },
      }
    );

    if (response.data.status !== "OK") {
      return res.status(400).json({
        success: false,
        message: response.data.error_message || "No route found",
      });
    }

    // ✅ Extract only important fields
    const route = response.data.routes[0];
    const leg = route.legs[0];

    const cleanedData = {
      startAddress: leg.start_address,
      endAddress: leg.end_address,
      distance: leg.distance.text,
      duration: leg.duration.text,
      summary: route.summary,
      overviewPolyline: route.overview_polyline.points, // map drawing line
    };

    res.status(200).json({
      success: true,
      route: cleanedData,
    });
  } catch (error) {
    console.error("Directions API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching route data",
    });
  }
};

// GEOCODING API - ADDRESS TO COORDINATES
export const getGeocodingData = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Please provide an address query parameter.",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_GEO_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    

    const response = await axios.get(url, {
      params: { address, key: apiKey },
    });
   

    if (response.data.status !== "OK") {
      return res.status(400).json({
        success: false,
        status: response.data.status,
        message: response.data.error_message || "No results found",
      });
    }

    const result = response.data.results[0];
    const { lat, lng } = result.geometry.location;

    
  

    res.status(200).json({
      success: true,
      data: {
        formattedAddress: result.formatted_address,
        latitude: lat,
        longitude: lng,
      },
    });
   
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching geocoding data",
    });
  }
};