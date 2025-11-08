import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({
  searchType: {
    type: String,
    enum: ["destination", "filter", "route"],
    required: true,
  },
  query: String, // for text search (like "India Gate")
  coordinates: {
    lat: Number,
    lng: Number,
  },
  formattedAddress: String,
  filterType: {
    type: String,
    enum: ["restaurant", "hospital", "school", "store", "park", "museum", "cafe", "gym"],
  },
  startPoint: {
    lat: Number,
    lng: Number,
  },
  endPoint: {
    lat: Number,
    lng: Number,
  },
  radius: {
    type: Number,
    default: 5000,
  },
  results: {
    type: [Object], // optional: save Google API results here
    default: [],
  },
  address: {
    type: String,
    required: false,
  },
}, { timestamps: true });

export default mongoose.model("MapSearch", mapSchema);
