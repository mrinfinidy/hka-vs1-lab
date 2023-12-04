// File origin: VS1LAB A3
const Geotag = require('./geotag');
const GeoTagExamples = require('./geotag-examples');
const GeotagExamples = require('./geotag-examples');

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
    this.getGeotags().push(geotag);
  }

  removeGeoTag(geotagName) {
    this.getGeotags().filter(geotag => geotag.name !== geotagName);
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

  popluateGeotagStore(taglist) {
    // const taglist = GeoTagExamples.tagList;
    for (const tag of taglist) {
      const geotag = new Geotag(tag[0], tag[1], tag[2], tag[3]);
      this.addGeoTag(geotag);
    }
  }
}


// Calculate distance of two locations using Haversine formula
function calculateDistance(location1, location2) {
  // Convert latitude and longitude from degrees to radians
  const radLatitude1 = (Math.PI / 180) * location1.latitude;
  const radLongitude1 = (Math.PI / 180) * location1.longitude;
  const radLatitude2 = (Math.PI / 180) * location2.latitude;
  const radLongitude2 = (Math.PI / 180) * location2.longitude;

  const deltaLatitude = radLatitude2 - radLatitude1;
  const deltaLongitude = radLongitude2 - radLongitude1;
  const a = 
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(radLatitude1) * Math.cos(radLatitude2) * Math.sin(deltaLongitude / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of the earth in meters
  // in km: const radius = 6371;
  const radius = 6371e3;
  const distance = radius * c;

  return distance;
}

module.exports = InMemoryGeoTagStore
