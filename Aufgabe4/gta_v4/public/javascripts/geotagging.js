// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
const mapManager = new MapManager();

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    LocationHelper.findLocation((location) => {
        initMap(location.latitude, location.longitude)
    })
}

function initMap(latitude, longitude) {
  const latitudeTagging = document.getElementById("latitude")
  const longitudeTagging = document.getElementById("longitude")
  const latitudeDiscovery = document.getElementById("latitudeSearch")
  const longitudeDiscovery = document.getElementById("longitudeSearch")
  latitudeTagging.value = latitude;
  longitudeTagging.value = longitude;
  latitudeDiscovery.value = latitude;
  longitudeDiscovery.value = longitude;
  const map = document.getElementById("map")
  const taglist = JSON.parse(map.dataset.tags)
  mapManager.initMap(latitude, longitude);
  // mapManager.updateMarkers(latitude, longitude, taglist);
  
  const mapView = document.getElementById("mapView");
  const mapDescription = document.getElementById("mapDescription");
  mapView.remove()
  mapDescription.remove()
}

function update_taglist(taglist) {
  latitude = document.getElementById("latitude")
  longitude = document.getElementById("longitude")
  mapManager.updateMarkers(latitude, longitude, taglist);
}

// tagging event listener
const form = document.getElementById('tag-form');
form.addEventListener('submit', async event => {
  event.preventDefault();

  geotag = {
    name: document.getElementById('name').value,
    hashtag: document.getElementById('hashtag').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
  }

  console.log(geotag);

  const res = await fetch(
    '/api/geotags',
    {
      method: 'POST',
      body: JSON.stringify(geotag),
      headers: new Headers({'content-type': 'application/json'}),
    },
  );
});

// tagging event listener
const discovery_form = document.getElementById('discoveryFilterForm');
discovery_form.addEventListener('submit', async event => {
  event.preventDefault();

  geotag = {
    name: document.getElementById('name').value,
    hashtag: document.getElementById('hashtag').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
  }

  console.log(geotag);

  const res = await fetch(
    '/api/geotags?'+ new URLSearchParams({
      searchterm: document.getElementById('searchterm').value,
      latitude: document.getElementById('latitudeSearch').value,
      longitude: document.getElementById('longitudeSearch').value,
    }).toString(),
    {
      method: 'GET',
    },
  );
  console.log(res);
  update_taglist(await res.json());
});



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  console.log("latitude: " + latitude);
  console.log("longitude: " + longitude);
  if (latitude === "361" || longitude === "361") {
    console.log("updating location via location api");
    updateLocation();
  } else {
    initMap(latitude, longitude)
  }
});
