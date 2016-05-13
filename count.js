var name_of_page;

function change_like_number(number_likes) {
  var elem = document.querySelector('#number_of_likes');
  od = new Odometer({
    el: elem,
    value: 200,

    // Any option (other than auto and selector) can be passed in here
    format: '( ddd),dd',
    duration : 3000
  });
  elem.innerHTML = number_likes;
  document.title = name_of_page + " " + number_likes;
}

function startCounter() {
  pageId = $("#inputPageId").val();
  console.log("pageId = " + pageId);
  set_initial_state();
  setInterval(update.live, 1*1000);
}

function onClickSubmitButton() {
  actionWithLoginOrNot();
}

var update={};
update.live = function() {
  FB.api(
    '/'+pageId+'/',
    'GET',
    {"fields":"fan_count"},
    function(response) {
      change_like_number(response.fan_count);
    }
  );
}

function set_initial_state () {
  FB.api(
    '/'+pageId+'/',
    'GET',
    {"fields":"fan_count"},
    function(response) {
      var initdoc = document.querySelector('#initial_number');
      od2 = new Odometer({
        el: initdoc,
        value: 200,

        // Any option (other than auto and selector) can be passed in here
        format: '( ddd),dd',
        duration : 3000
      });
      initdoc.innerHTML = response.fan_count;

      FB.api(
        '/'+pageId+'/',
        'GET',
        function(response) {
          $("#text_initial_value").text("Initial value of " + response.name +  " was ");
          name_of_page = response.name;
        }
      );

      change_like_number(response.fan_count);
    }
  );
}

function actionWithLoginOrNot() {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        console.log("je suis vrai");
        isCo =  1;
        startCounter();

      } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook,
        // but has not authenticated your app
        console.log("je suis moyen vrai");
        isCo =  1;
        startCounter();

      } else {
        // the user isn't logged in to Facebook.
        console.log("je suis faux");
        isCo =  0;
        alert("you need to be connected with facebook ! ");
      }
    });


}

/*function findAccessToken(responseFromAuthor) {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;

      } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook,
        // but has not authenticated your app
      } else {
        // the user isn't logged in to Facebook.
      }
    });
}
*/
function login() {
    console.log("login");
    FB.login(function(response) {
              if (response.authResponse) {
                   console.log('Welcome!  Fetching your information.... ');
                   FB.api('/me', function(response) {
                   console.log('Good to see you, ' + response.name + '.');
                  // findAccessToken(response);
                });
               } else {
                console.log('User cancelled login or did not fully authorize.');
               }
           }, {scope: 'email,user_likes'});
}

function onload() {
  $("#submitButton").on("click", function(){
    onClickSubmitButton();
  });
  $("#loginButton").on("click", function(){
    login();
  });
}
