const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY =  process.env.GOOGLE_API_KEY;

const  getCoordsForAddress = async(address) => {
  if(API_KEY == ""){
    return {
      // lat: 40.7484474,
      // lng: -73.
      lat: 22.5743137,
      lng: 88.4334517
    };
  }

  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`);

  const data = response.data;
  
  if(!data || data.status === 'ZERO_RESULTS'){
    const error = new HttpError("Cannot find the given location", 422);
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;

}

module.exports = getCoordsForAddress;