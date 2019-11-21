function loginGoogle(){
    if(!firebase.auth().currentUser){
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
        console.log("I'm here");
        firebase.auth().signInWithPopup(provider).then(function(result) {
            console.log("I'm inside popup function")
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
