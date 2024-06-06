// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    LocationHelper.findLocation((location) => {
        const latitudeTagging = document.getElementById("latitude")
        const longitudeTagging = document.getElementById("longitude")
        const latitudeDiscovery = document.getElementById("latitudeSearch")
        const longitudeDiscovery = document.getElementById("longitudeSearch")
        latitudeTagging.value = location.latitude;
        longitudeTagging.value = location.longitude;
        latitudeDiscovery.value = location.latitude;
        longitudeDiscovery.value = location.longitude;

        const mapManager = new MapManager();
        mapManager.initMap(location.latitude, location.longitude);
        mapManager.updateMarkers(location.latitude, location.longitude);

        const map = document.getElementById("map")
        const mapView = document.getElementById("mapView");
        const mapDescription = document.getElementById("mapDescription");
        console.log(map)
        console.log(mapView)
        console.log(mapDescription)
        mapView.remove()
        mapDescription.remove()
    })
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
  const latitude = document.getElementById("latitude");
  const longitude = document.getElementById("longitude");
  console.log(latitude);
  if (latitude === "361" || longitude === "361") {
    consolo.log("updating location via location api");
    updateLocation();
  }
});
