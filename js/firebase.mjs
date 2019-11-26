//GLOBAL VARS
var userConected = null;
var email = null;
var uid = null;

/*Sign in auth:
Function that if you are not logged, on click into the icon a google popup will appeard and we will save
the data of the user in the var user. Also we catch the errors.
Docu: https://firebase.google.com/docs/auth/web/google-signin 
*/
function loginGoogle() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            var user = result.user;
            uid = result.user.uid;
            console.log('LOGDED USER:', 'email:', email, 'uid:', uid);

            alert('You have successfully logged in');
            console.log('Logged in')
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('This user does exist');
            }

        });
    } else {
        firebase.auth().signOut().then(function (result) {
            alert('You have successfully logged out');
            console.log('Logged out')
        }).catch(function (error) {

        });
    }
}

/**
* Store the notes in the database
* @param uid  id value of the user in the databse. 
*/
function dbNotePush(uid, noteId, latLng, locationTitle, text) {
    let resp = db.ref("/user" + uid).push({
        uid: uid,
        noteId: noteId,
        location: latLng,
        locationTitle: locationTitle,
        text: text
    })
    let id = resp.path.o[1]
    return id
}

/**
* Update the text field in the notes collection at the database
*/
function dbUpdateNote(uid, noteId, text, dbID) {
    db.ref("/user" + uid).child(dbID).update({
        text: text
    })

}

/**
* Remove the whole note collection of an specidif user at the database
*/
function dbRemoveNote(uid, noteId, dbID) {
    db.ref("/user" + uid).child(dbID).remove();

}

/*Load the data that is stored in /useruid ans save the values of the childs of this root into the
* var data which contains {locationTitle: "...", location: "...", noteId: "..", text: "", uid: "..."}
* Documentation: https://firebase.google.com/docs/database/web/lists-of-data
*/
function loadNotes(uid) {
    var userNotes = db.ref('user' + uid);
    userNotes.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var data = childSnapshot.val();
            console.log(data);
            return (data);
        })
    })

}
