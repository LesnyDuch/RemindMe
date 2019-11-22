let SIDEBAR_ID = '#sidebar';
let NOTE_CLASS = 'note-card'
// TEMPORARY test data
var NOTES = [
    {
        'id_': 1,
        'location': { lat: -34.397, lng: 150.644 },
        'locationTitle': 'Somewhere',
        'text': `Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Officiis dolor doloribus, corporis cupiditate ullam modi, 
            laborum soluta mollitia ex, velit quidem voluptatem dignissimos
            quod. Voluptatum, dolore laudantium? Deserunt, iure vel.`
    },
    {
        'id_': 2,
        'location': { lat: -35.397, lng: 170.644 },
        'locationTitle': 'Somewhere else',
        'text': `Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Officiis dolor doloribus, corporis cupiditate ullam modi, 
            laborum soluta mollitia ex, velit quidem voluptatem dignissimos
            quod. Voluptatum, dolore laudantium? Deserunt, iure vel.`
    }
]

/**
 * Update a note's information in the database.
 * @param {*} noteId The note's id in the db.
 * @param {*} text Text of the note to be updated.
 */
var updateNote = function (noteId, text) {
    console.log('Updating note ' + noteId);
    // TODO: Update database;
    // dbUpdateNote(id, text)
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
 * @param {*} noteId Note's ID.
 */
var removeNote = function (noteId) {
    // Collapse the element, then delete it
    note = document.getElementById(noteId);
    for (c of note.querySelectorAll('h5, button, textarea')) {
        c.classList.add('collapsed');
    }
    note.classList.add('collapsed');

    setTimeout(function () { document.getElementById(noteId).remove() }, 400);
    // TODO: Remove from DB
    // dbRemoveNote(noteId)
}

/**
 * Centers the map on the note's marker.
 * @param {*} location Location on which the map should be centered.
 * @param {*} map The map object.
 */
var centerNote = function (lat, lng, map) {
    console.log('Centering map to ' + lat + ' ' + lng);
    map.map.setCenter({ 'lat': lat, 'lng': lng });
}

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
            <div class="${NOTE_CLASS}" id="${n.id_}">
                <button type="button" class="close" aria-label="Close"
                    onclick='removeNote(this.parentElement.id)'>
                    <span aria-hidden="true">&times;</span>
                </button>
                <h5 onclick='centerNote(${n.location.lat}, ${n.location.lng}, MAP)'>${n.locationTitle}</h5>
                <textarea 
                    oninput='resizeNote(this)'
                    onresize='resizeNote(this)'
                    onfocusout='updateNote(this.parentElement.id, this.value);'
                    placeholder="Enter a note...">${n.text}</textarea>
            </div>
            `
        )
    }

    // Change initial textarea size
    $("textarea").each(function () {
        resizeNote(this);
    });
}