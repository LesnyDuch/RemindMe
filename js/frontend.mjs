const SIDEBAR_ID = '#sidebar';
const NOTE_CLASS = 'note-card'
// TEMPORARY test data
var NOTES = []
var CLOSE_MAP_LISTENER;

/**
 * Find note by its ID.
 * @param notes Array of notes objects.
 * @param noteId The ID of the note to be found.
 * @returns The index of the note in the notes array.
 */
var findNote = function (notes, noteId) {
    let id;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].noteId == noteId) {
            id = i;
        }
    }
    return id;
}

/**
 * Update a note's information in the database.
 * @param {*} noteId The note's id in the db.
 * @param {*} text Text of the note to be updated.
 */
var updateNote = function (notes, noteId, text) {
    let id = findNote(notes, noteId);
    notes[id].text = text;
    // TODO: Update database;
    dbUpdateNote(uid, noteId, text, notes[id].dbID)

}


/**
 * Resize a note based on the amount of lines/text
 * @param {*} element The textarea element to be resized
 * https://stackoverflow.com/questions/2803880/is-there-a-way-to-get-a-textarea-to-stretch-to-fit-its-content-without-using-php
 */
var resizeNote = function (element) {
    element.style.height = "";
    element.style.height = element.scrollHeight + 3 + "px";
}

/**
 * Removes a note from the DOM tree and sends a delete request to the DB.
 * @param {*} notes List of notes objects.
 * @param {*} noteId Note's ID.
 */
var removeNote = function (notes, noteId) {
    // Collapse the elements, then delete them, after a small wait, for smoother animation
    note = document.getElementById(noteId);
    for (c of note.querySelectorAll('h5, button, textarea')) {
        c.classList.add('collapsed');
    }
    note.classList.add('collapsed');
    setTimeout(function () { document.getElementById(noteId).remove() }, 400);
    let id = findNote(notes, noteId);
    dbRemoveNote(uid, noteId, notes[id].dbID)
    // Remove from local registry
    notes.splice(findNote(notes, noteId), 1);
    // Remove the marker from the map
    MARKERS[noteId].setMap(null);
}

/**
 * Opens the map, closes the sidebar
 */
var activateMap = function () {
    $('#main').removeClass('active');
    $('#map').removeClass('active');
}

/**
 * Opens the sidebar
 */
var activateSidebar = function () {
    // On narrow screens, this will close the sidebar, if the map is clicked
    $('#main').addClass('active');
    $('#map').addClass('active');
}
/**
 * Sets the focus on a given note.
 * @param id Id of the note.
 */
var focusNote = function (id) {
    // Open the sidebar, if it's not open
    activateSidebar();
    // Set focus on the note
    $(`#${id} textarea`).focus();
    $(`#${id}`).addClass('focused');
    setTimeout(() => { $(`#${id}`).removeClass('focused'); }, 1000);
}

/**
 * Centers the map on the note's marker.
 * @param {*} location Location on which the map should be centered.
 * @param {*} map The map object.
 */
var centerNote = function (lat, lng, map) {
    console.log('Centering map to ' + lat + ' ' + lng);
    map.map.setCenter({ 'lat': lat, 'lng': lng });
    activateMap();
}

/**
 * Deletes and redraws all notes in the DOM tree.
 * @param notes List of notes.
 */
var redrawNotes = function (notes) {
    document.getElementById('sidebar').innerHTML = "";
    drawNotes(notes);
}

/**
 * Draws notes onto the sidebar
 * @param {*} notes Array of note objects.
 */
var drawNotes = function (notes) {
    for (let n of notes) {
        $(SIDEBAR_ID).append(
            `
            <div class="${NOTE_CLASS}" id="${n.noteId}">
                <button type="button" class="close" aria-label="Close"
                    onclick='removeNote(NOTES, this.parentElement.id)'>
                    <span aria-hidden="true">&times;</span>
                </button>
                <h5 onclick='centerNote(${n.location.lat()}, ${n.location.lng()}, MAP)'>${n.locationTitle}</h5>
                <textarea 
                    oninput='resizeNote(this)'
                    onresize='resizeNote(this)'
                    onfocusout='updateNote(NOTES, this.parentElement.id, this.value);'
                    placeholder="Enter a note...">${n.text}</textarea>
            </div>
            `
        )
    }
    // Change initial textarea size, a slight wait is necessary for the page to load
    // correctly the first time
    setTimeout(() => {
        $("textarea").each(function () {
            resizeNote(this);
        });
    }, 100)



}