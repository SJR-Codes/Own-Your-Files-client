// Example POST method implementation:
/* async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        //"Content-Type": "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
} */

const baseURL = "http://127.0.0.1:8000";

//prevent form submit
const form = document.getElementById('login-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    //console.debug('Posting form...');
});

function getStuff(fpath, elem) {
    const token = sessionStorage.getItem('token');

    const myInit = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
        mode: "cors",
        cache: "default",
    };
      
    const request = new Request(baseURL + fpath, myInit);
    fetch(request)
    .then((response) => {
        //console.debug(response);
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error("Something went wrong on API server!");
        }
    })
    .then((response) => {
        //console.debug(response);
        var contentElement = document.getElementById(elem);
        contentElement.innerHTML = JSON.stringify(response);
    })
    .catch((error) => {
        console.error(error);
    });

}

function postStuff(fpath, body){
    //console.debug(formbody);
    const request = new Request(baseURL + fpath, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        //credentials: "same-origin", // include, *same-origin, omit
        //referrerPolicy: "same-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        headers: {
            //"Content-Type": "application/json",
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body, //'username=a%40a.fo&password=asd', //formbody,
    });

    fetch(request)
    .then((response) => {
        //console.debug(response);
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error("Something went wrong on API server!");
        }
    })
    .then((response) => {
        //console.debug(response);
        const token = response.access_token;
        //set token into sessionStorage -> destroyed when client closed
        sessionStorage.setItem('token', token);
        //console.debug(token);
        var contentElement = document.getElementById('content');
        contentElement.innerHTML = 'Logged in...';
        //console.debug("Got token: "+token);
    })
    .catch((error) => {
        console.error(error);
    });
}

function doLogin() {
    var userElement = document.getElementById('username');
    var passwordElement = document.getElementById('password');
    var usern = userElement.value;
    var password = passwordElement.value;

    if( usern == "" || password == "" ) {
        alert("Enter username and password, please.");
        return null;
    }

    const queryParams = { username: usern, password: password }
    const formbody = new URLSearchParams(queryParams).toString()
    
    postStuff("/auth/jwt/login", formbody);
    
    if( sessionStorage.getItem('token') !== null ) {
        showNavi();
        getPhotos();
    }
}

function showNavi() {
    var element = document.getElementById("footnavi");
    element.classList.remove("hidden");
}

function getUserInfo() {      
    getStuff("/users/me", 'content');
}

function getPhotos() {
    getStuff( "/photos/", "content");
}