// File origin: VS1LAB A3
const Geotag = require('./geotag');
const GeoTagExamples = require('./geotag-examples');

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
  constructor() {
    const geotags = [];
    this.getGeotags = () => {
      return geotags;
    }
  }

  addGeoTag(geotag) {
    console.log("storing geotag: ", geotag)
    this.getGeotags().push(geotag);
  }

  removeGeoTag(geotagName) {
    const indexToRemove = this.getGeotags().findIndex(geotag => geotag.name === geotagName);
    if (indexToRemove !== -1) {
      this.getGeotags().splice(indexToRemove, 1);
    }
  }

  getNearbyGeoTags(location) {
    const nearbyGeotags = [];
    const geotags = this.getGeotags();

    for (const geotag of geotags) {
      if (calculateDistance(geotag, location) <= 1000) {
        nearbyGeotags.push(geotag);
      }
    }

    return nearbyGeotags;
  }

  searchNearbyGeoTags(location, keyword) {
    const allNearbyGeotags = this.getNearbyGeoTags(location);
    const nearbyGeotags = [];

    for (const geotag of allNearbyGeotags) {
      if (geotag.name.includes(keyword) || geotag.hashtag.includes(keyword)) {
        nearbyGeotags.push(geotag);
      }
    }

    return nearbyGeotags;
  }

  populateGeotagStore(taglist) {
    for (const tag of taglist) {
      console.log("tag: ", tag)
      const geotag = new Geotag(tag[0], tag[1], tag[2], tag[3]);
      this.addGeoTag(geotag);
    }
  }
}


// Calculate distance of two locations using Haversine formula
function calculateDistance(location1, location2) {
    if ((location1.latitude === location2.latitude) && (location1.longitude === location2.longitude)) {
    return 0;
  }
  // Convert latitude and longitude from degrees to radians
  const radLatitude1 = Math.PI * location1.latitude / 180;
  const radLatitude2 = Math.PI * location2.latitude / 180;
  const theta = location1.longitude - location2.longitude;
  const radTheta = Math.PI * theta / 180;
  let distance = Math.sin(radLatitude1) * Math.sin(radLatitude2) + Math.cos(radLatitude1) * Math.cos(radLatitude2) * Math.cos(radTheta);
  if (distance > 1) {
    distance = 1;
  }
  distance = Math.acos(distance);
  distance = distance * 180 / Math.PI;
  distance = distance * 60 * 1.1515;
  // Unit in km
  distance = distance * 1.609344;

  return distance;
}

module.exports = InMemoryGeoTagStore
