var addListenerHandler;
// We have to use this to extract the value from the call back I guess
var placeName;
// Stores current position
var POSITION = { 'lat': 62.60, 'lng': 29.76 };
// The radius, in which we consider the markers to be nearby
const RADIUS = 100;
// Dictionary containing id:marker pairs, used to delete markers from map
var MARKERS = {};
// Shows the user's position on the map
var currentMarker;


/**
 * Generates random UUID for the database entries.
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
var uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

class RemindMap {
    /**
     * Initializes the Google Map object.
     * @param {*} map_id HTML id value of the div, where the map is. 
     */
    constructor(map_id) {
        // Initial location is Joensuu
        let location = { lat: 62.60, lng: 29.76 };
        var map = new google.maps.Map(document.getElementById(map_id), {
            zoom: 12,
            center: location,
            disableDefaultUI: true
        });
        this.map = map;
        this.setLocation(true);
        this.placesService = new google.maps.places.PlacesService(this.map);
    }

    /**
     * Using HTML5 geolocation functionality, sets the current position and centers
     * the map onto it.
     */
    setLocation(centerMap = false) {
        var map = this.map;
        // Taken from Docs
        let handleLocationError = () => {
            console.log('Location error occured.')
        }
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                POSITION = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                if (centerMap)
                    map.setCenter(POSITION);
                currentMarker.setPosition(POSITION);
            }, handleLocationError);
        } else {
            // Browser doesn't support Geolocation
            handleLocationError();
        }
    }

    /**
     * Updates the location of the user and highlights notes if they are nearby.
     * @param notes List of notes objects.
     */
    onUpdateLocation(notes) {
        // Calculates distance between two points
        let dist = google.maps.geometry.spherical.computeDistanceBetween;
        let count = 0;
        // To avoid crashing when being called from a callback function
        // Mamma mia this is dirty
        try { this.setLocation(); } catch  { };

        if (notes) {
            for (let n of notes) {
                // Check if a note is in the radius and if yes, highlight it
                if (dist(POSITION, n.location) <= RADIUS) {
                    $(`#${n.id_}`).addClass('highlighted');
                    count++;
                } else {
                    $(`#${n.id_}`).removeClass('highlighted');
                }
            }
        }
        // Set the number of nearby markers.
        $('#nearby-count').html(count);
    }

    /** Adds a marker to the map.
     * @param {*} location Location returned by the calling event handler
     * @param {*} map Map object
     * @returns Information about the Marker and location
     */
    addMarker(location, map, id) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        let marker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', () => { focusNote(id) });
        // Add marker to a dictionary, so it can be removed if necessary
        MARKERS[id] = marker;
        // Disable the event listener, if it was activated
        if (addEventListener)
            google.maps.event.removeListener(addListenerHandler);
    }

    /**
     * When the ADD button is pressed, enables adding markers by clicking
     * on the map, activating the addListenerHandler.
     * @param notes List of notes objects.
     */
    addNote(notes) {
        // Method references to be called from the callbacks
        var addMarker = this.addMarker;
        var placesService = this.placesService;
        var map = this.map;
        var updateNearby = this.onUpdateLocation;
        // Disable the event listener in case it was activated before
        google.maps.event.removeListener(addListenerHandler);
        // Changes the add button color to signal that adding is enabled
        $('#btn-add').addClass('active');
        // This event listener calls addMarker() when the map is clicked.
        addListenerHandler = google.maps.event.addListener(map, 'click',
            function (event) {
                // Request for the places API
                let request = {
                    'radius': 100,
                    'location': event.latLng,
                    'fields': ['name', 'formatted_address']
                }
                let latLng = {
                    'lat': event.latLng.lat(),
                    'lng': event.latLng.lng()
                };
                // This method uses Google's Place service to find the nearby places
                placesService.nearbySearch(request, function (results, status) {
                    let placeName;
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        // Closest place's name
                        placeName = results[0]['name'];
                    } else if (status == 'ZERO_RESULTS') {
                        // If no place is found set as the coordinates, reduced to 3
                        // decimal places
                        placeName = `${latLng.lat.toFixed(3)}, ${latLng.lng.toFixed(3)}`
                    } else {
                        console.log('Google Places API error');
                        return
                    }

                    let newNote = {
                        'id_': uuidv4(),
                        'location': event.latLng,
                        'locationTitle': placeName,
                        'text': ""
                    };
                    // Add the marker to the MAP
                    addMarker(event.latLng, map, newNote.id_);
                    // Push the note to the local registry
                    notes.push(newNote);
                    newNote.dbID = dbNotePush(uid, newNote.id_, latLng, newNote.locationTitle, newNote.text)
                    // Redraw the notes using the local registry
                    redrawNotes(notes);
                    updateNearby(notes);
                    // The add button is no longer highlighted
                    $('#btn-add').removeClass('active');
                    // Change focus to the new note
                    focusNote(newNote.id_);
                });
            });
    }
}
