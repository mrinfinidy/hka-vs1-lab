// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
	const latitude = document.getElementById("latitude");
	const longitude = document.getElementById("longitude");
	const latitudeSearch = document.getElementById("latitudeSearch");
	const longitudeSearch = document.getElementById("longitudeSearch");
	const mapManager = new MapManager("wBgdLkzOFHqTwbkl2pF8NhPt5L0FupXY");
  let mapUrl = "";

  console.log("latitudeSearch.value: ", latitudeSearch.value);
  console.log("longitudeSearch.value: ", longitudeSearch.value);
  if (latitudeSearch.value === "361" || longitudeSearch.value === "361") {
	  LocationHelper.findLocation((location) => {
	  	latitude.value = location.latitude;
	  	longitude.value = location.longitude;
	  	latitudeSearch.value = location.latitude;
	  	longitudeSearch.value = location.longitude;
	  	// Set map coordinates
      console.log("location: ", location)
	  	mapUrl = mapManager.getMapUrl(location.latitude, location.longitude);
	  });
  } else {
    // Set map coordinates
    mapUrl = mapManager.getMapUrl(latitude.value, longitude.value);
  }
	const mapView = document.getElementById("mapView");
	mapView.src = mapUrl;
  return { latitude, longitude };
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
	updateLocation();
});
