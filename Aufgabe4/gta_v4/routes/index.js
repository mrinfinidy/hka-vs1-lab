// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
const GeoTagExamples = require('../models/geotag-examples');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();
const taglist = GeoTagExamples.tagList;
geoTagStore.populateGeotagStore(taglist);
const location = { latitude: 361, longitude: 361 }

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { location, taglist: geoTagStore.getGeotags() });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
  const name = req.body.tagname;
  const hashtag = req.body.hashtag;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const goetag = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(goetag);
  const location = { latitude: latitude, longitude: longitude };
  res.render('index', { location, taglist: geoTagStore.getGeotags() });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
  const keyword = req.body.searchterm;
  const latitude = req.body.latitudeSearch;
  const longitude = req.body.longitudeSearch
  const location = { latitude: latitude, longitude: longitude };
  const nearbyGeotags = geoTagStore.searchNearbyGeoTags(location, keyword);

  console.log("location: ", location);
  res.render('index', { location, taglist: nearbyGeotags });
});


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  const keyword = req.query.searchterm;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  let geotags = null;
  if (keyword != null && latitude != null && longitude != null) {
    console.log("searchnearby");
    const location = { latitude: latitude, longitude: longitude };
    console.log("location: ", location);
    geotags = geoTagStore.searchNearbyGeoTags(location, keyword);
  } else if (keyword != null)  {
    geotags = geoTagStore.searchGeoTags(keyword);
    console.log("search");
  } else  {
    geotags = geoTagStore.getGeotags(); 
    console.log("all");
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(geotags));
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  const body = req.body;
  const geotag_id = geoTagStore.addGeoTag(new GeoTag(body.name, body.latitude, body.longitude, body.hashtag));

  res.set('Content-Type', 'application/json');
  res.set('Location', '/api/geotags/'+geotag_id);
  res.status(201);
  res.end();

});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
  const id = req.params.id

  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify(geoTagStore.getGeoTagById(id)));

});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  const id = req.params.id

  const body = req.body;
  geoTagStore.geotags[id] = new GeoTag(body.name, body.latitude, body.longitude, body.hashtag);

  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify(geoTagStore.getGeoTagById(id)));

});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  const id = req.params.id
  geoTagStore.removeGeoTagById(id)
  res.set('Content-Type', 'application/json');
  res.status(204);
  res.end(JSON.stringify(geoTagStore.getGeoTagById(id)));
});

module.exports = router;
