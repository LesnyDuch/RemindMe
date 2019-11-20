
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

/* Draws notes onto the sidebar */
var drawNotes = function (notes = NOTES) {

    for (let n of NOTES) {
        $(SIDEBAR_ID).append(
            `
            <div class="${NOTE_CLASS}" data-id_="${n.id_}">
            <h4>${n.locationTitle}</h4>
            <p>${n.text}ß</p>
            `
        )
    }
}