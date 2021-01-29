const getMeta = (metaName)  => {
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return metas[i].getAttribute('content');
        }
    }
    return '';
}


const  onLoadGoogleCallback = ()  => {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: getMeta('google-signin-client_id'),
            cookiepolicy: 'single_host_origin',
            scope: 'profile'
        });

        auth2.attachClickHandler(element, {},
            function (googleUser) {
                var id_token = googleUser.getAuthResponse().id_token;
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/login');
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = function() {
                   window.location.href = "/dashboard"
                };
                xhr.send(JSON.stringify({token : id_token}));

            }, function (error) {
                console.log('Sign-in error', error);
            }
        );
    });

    element = document.getElementById('googleSignIn');

    element.click()

}




function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}





