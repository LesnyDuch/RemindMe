let SIDEBAR_ID = '#sidebar';
let NOTE_CLASS = 'note-card'


// TEMPORARY test data
var NOTES = [
    {
        'id_': 1,
        'location': 'SOMEWHERE',
        'locationTitle': 'SOMEWHERE',
        'text': `Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Officiis dolor doloribus, corporis cupiditate ullam modi, 
            laborum soluta mollitia ex, velit quidem voluptatem dignissimos
            quod. Voluptatum, dolore laudantium? Deserunt, iure vel.`
    },
    {
        'id_': 2,
        'location': 'SOMEWHERE_ELSE',
        'locationTitle': 'SOMEWHERE_ELSE',
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
 * Draws notes onto the sidebar
 * @param {*} notes Array of note objects.
 */
var drawNotes = function (notes = NOTES) {
    for (let n of NOTES) {
        $(SIDEBAR_ID).append(
            `
            <div class="${NOTE_CLASS}" id="${n.id_}">
                <h5>${n.locationTitle}</h5>
                <textarea 
                    oninput='resizeNote(this)'
                    onresize='resizeNote(this)'
                    onfocusout='updateNote(this.parentElement.id, this.value);'
                    placeholder="Enter a note...">
${n.text}
                </textarea>
            </div>
            `
        )
    }

    // Change initial textarea size
    $("textarea").each(function () {
        resizeNote(this);
    });
}