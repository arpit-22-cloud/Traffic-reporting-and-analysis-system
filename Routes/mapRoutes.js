import express from "express";
import {searchDestination,searchByFilter,searchBetweenPoints,getGeocodingData} from "../Controllers/mapController.js";

const router = express.Router();

router.route('/destination')
.post( searchDestination);
router.route('/filter')
.post( searchByFilter);
router.route('/route')
.post( searchBetweenPoints);
router.route('/geocodeing')
.get(getGeocodingData);

export default router;