async function onSignIn() {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    let params = {
      "client_id": "305926015169-2gqociste5293tgj6pqfa8bbt5l4hg9h",
      "redirect_uri": "http://127.0.0.1:5500/client/profile.html",
      "response_type":"token",
      "scope":"https://www.googleapis.com/auth/userinfo.profile",
      "include_granted_scopes":'true',
      "state":"pass-through-value"
    };

    for (var p in params) {
      let input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    };

    document.body.appendChild(form)
    form.submit();
  }

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    // remove token from local storage
    localStorage.removeItem('auth');
}