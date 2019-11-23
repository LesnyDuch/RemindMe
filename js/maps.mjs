// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var addListenerHandler;
// We have to use this to extract the value from the call back I guess
var placeName;
// Stores current position
var POSITION = { 'lat': 62.60, 'lng': 29.76 };
// The radius, in which we consider the markers to be nearby
const RADIUS = 100;

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
        // TODO: Initialize to current location
        let location = { lat: 62.60, lng: 29.76 };
        var map = new google.maps.Map(document.getElementById(map_id), {
            zoom: 12,
            center: location,
            disableDefaultUI: true
        });
        this.map = map;
        this.setLocation(true);
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
        let count = 0;
        // Calculates distance between two points
        let dist = google.maps.geometry.spherical.computeDistanceBetween;
        this.setLocation();
        for (let n of notes) {
            console.log(n.location);
            // Check if a note is in the radius
            if (dist(POSITION, n.location) <= RADIUS) {
                $(`#${n.id_}`).addClass('highlighted');
                count++;
            } else {
                $(`#${n.id_}`).removeClass('highlighted');
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
            label: labels[labelIndex++ % labels.length],
            map: map,
            animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', () => { focusNote(id) });
        // Disable the event listener
        google.maps.event.removeListener(addListenerHandler);
    }

    /**
     * When the ADD button is pressed, enables adding markers by clicking
     * on the map, activating the addListenerHandler.
     */
    addNote(notes) {
        var addMarker = this.addMarker;
        var map = this.map;
        // Disable the event listener in case it was activated before
        google.maps.event.removeListener(addListenerHandler);
        $('#btn-add').addClass('active');
        // This event listener calls addMarker() when the map is clicked.
        addListenerHandler = google.maps.event.addListener(map, 'click',
            function (event) {
                var latLng = event.latLng;
                let service = new google.maps.places.PlacesService(map);
                let request = {
                    'radius': 100,
                    'location': latLng,
                    'fields': ['name', 'formatted_address']
                }
                // Find the location's name
                service.nearbySearch(request, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        let placeName = results[0]['name'];
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
                        // TODO: Add Push to db
                        // dbNotePush()
                        // Redraw the notes using the local registry
                        redrawNotes(notes);
                        $('#btn-add').removeClass('active');
                        // Change focus to the new note
                        focusNote(newNote.id_);
                    }
                    else {
                        console.log(status)
                    }
                });
            });
    }
}
