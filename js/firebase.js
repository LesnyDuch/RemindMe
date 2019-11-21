function loginGoogle(){
    if(!firebase.auth().currentUser){
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https:googleapis.com/auth/plus.login");
        firebase.auth().signInWithPopup(provider).then (function(result){
            var token = result.credential.accestoken;
            var user = result.user;
            console.log(user);
        }).catch(function (error){
            var errorCode = error.code;
            var errorMessage = error.message;
            var errorMail = error.email;
            var credential = error.credential;

            if(errorCode==='auth/account-exists-with-different-credential'){
                alert('This user does exist');
            }

        });

    }else{
        firebase.auth().signOut();
    }
}
