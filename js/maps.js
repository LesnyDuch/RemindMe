// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var addListenerHandler;
var GOOGLE;

class RemindMap {
    /**
     * Initializes the Google Map object.
     * @param map_id    HTML id value of the div, where the map is  
     */
    constructor(map_id) {
        // TODO: Initialize to current location
        let location = { lat: 62.60, lng: 29.76 };
        this.map = new GOOGLE.maps.Map(document.getElementById(map_id), {
            zoom: 12,
            center: location
        });
    }

    /** Adds a marker to the map.
     * @param location Location returned by the calling event handler
     * @param map Map object
     * @returns Information about the Marker and location
     */
    addMarker(location) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        let marker = new GOOGLE.maps.Marker({
            position: location,
            label: labels[labelIndex++ % labels.length],
            map: this.map
        });
        // Disable the event listener
        google.maps.event.removeListener(addListenerHandler);
    }

    /**
     * When the ADD button is pressed, enables adding markers by clicking
     * on the map, activating the addListenerHandler.
     */
    addNote() {
        // This event listener calls addMarker() when the map is clicked.
        addListenerHandler = google.maps.event.addListener(this.map, 'click',
            function (event) {
                addMarker(event.latLng, this.map);
            });
    }
}
