/*Sign in auth:
Function that if you are not logged, on click into the icon a google popup will appeard and we will save
the data of the user in the var user. Also we catch the errors.
Docu: https://firebase.google.com/docs/auth/web/google-signin 
*/
function loginGoogle(){
    if(!firebase.auth().currentUser){
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            var user = result.user;
            console.log(user);
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            var credential = error.credential;
            if(errorCode==='auth/account-exists-with-different-credential'){
                alert('This user does exist');
            }

        });
    }else{
        firebase.auth().signOut();
    }
}
