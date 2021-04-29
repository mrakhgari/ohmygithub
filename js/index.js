const avatarContainer = document.querySelector(".avatar_container");
const hoverIcon = document.querySelector(".hover");
const fullscreen = document.querySelector(".fullscreen");
const closeButton = document.querySelector('.close');
const usernameInput = document.querySelector('.search-div__input');
const searchButton = document.querySelector('.search_wrapper__button');
const avatarImages = document.getElementsByClassName('avatar-image');
const username = document.querySelector('.name');
const userId = document.querySelector('.id');
const bio = document.querySelector('.bio__content');
const stats = document.getElementsByClassName('info__number');
const locationDiv = document.querySelector('.location');
const locationText = document.querySelector('.location > .item__text');
const blogDiv = document.querySelector('.webpage');
const blogUrl = document.querySelector('.webpage > .item__text');
const error = document.querySelector('.error');
const languageDiv = document.querySelector(".lang");
const language = document.querySelector(".lang > span");

// for show avatar in fullscreen mode.
function show() {
    hoverIcon.classList.add('active');
    fullscreen.classList.add('show');
}

// for hide avatar
function hide() {
    hoverIcon.classList.remove('active');
    fullscreen.classList.remove('show');
}

// set focus in search bar. (we add focus class and the css handle it :)) )
function focusOnInputbar() {
    let parent = this.parentNode.parentNode;
    parent.classList.add('focus');
}

// remove focus class from search bar
function blurOnInputbar() {
    let parent = this.parentNode.parentNode;
    if (this.value == "")
        parent.classList.remove('focus');
}

// for handle status code error
function handleError(response) {
    showErrorMessage(response.message);
}

// displays each given message as an error message 
function showErrorMessage(message) {
    console.log(message);
    error.classList.add('active');
    error.innerHTML = message;
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        error.classList.remove('active');
    }, 4000)
}

// get user data from API and return the json value.
async function getUserData(username) {
    console.log("request");
    try {
        let response = await fetch(`https://api.github.com/users/${username}`)
        let json = await response.json();
        if (response.status == 200) {
            return json
        }
        handleError(json);
        return Promise.reject(`Request failed with error ${response.status}`);
    } catch (e) {
        showErrorMessage(e);
        console.log(e);
    }
}

// set avatar in view
function setAvatar(avatar) {
    for (avatarImage of avatarImages) {
        avatarImage.src = avatar;
    }
}

// set name in view
function setName(userData) {
    username.innerHTML = userData.name;
    userId.innerHTML = userData.login;
}

function setBio(userData) {
    if (userData.bio == null)
        bio.innerHTML = `Sorry!!! ${userData.login} has not any bio.`;
    else
        bio.innerHTML = userData.bio;
}

// Sets followers, following and repo counts.
function setStats(userData) {
    stats[0].innerHTML = userData.followers;
    stats[1].innerHTML = userData.following;
    stats[2].innerHTML = userData.public_repos;
}

function setLocation(userData) {
    if (userData.location == null) {
        locationDiv.style.display = "none";
    } else {
        locationDiv.style.display = "flex";
        locationText.innerHTML = userData.location;
    }
}

// add http to start of link
const getClickableLink = link => {
    return link.startsWith("http://") || link.startsWith("https://") ?
        link
        : `http://${link}`;
};

function setBlog(userData) {
    if (userData.blog == "") {
        console.log("no blog");
        blogDiv.style.display = "none";
    } else {
        blogDiv.style.display = "flex";
        blogUrl.innerHTML = userData.blog;
        blogUrl.href = getClickableLink(userData.blog);
    }
}

// fill user data in view .
function fillProfileCard(userData) {
    console.log(userData);
    setAvatar(userData.avatar_url);
    setName(userData);
    setBio(userData);
    setStats(userData);
    setLocation(userData);
    setBlog(userData);
}

// get all repositories of user and return json.
async function getRepos(username) {
    try {
        let response = await fetch(`https://api.github.com/users/${username}/repos`);
        let json = await response.json();
        if (response.status != 200) {
            handleError(json);
            return Promise.reject(`Request failed with error ${response.status}`);
        }
        return json;
    } catch (e) {
        console.log(e);
        showErrorMessage(e);
    }
}

// set popular repository in view.
async function findPopLang(username) {
    languageDiv.style.display = "none";
    let repos = await getRepos(username);
    // sort repos by time of push and get 0:5 repos. 
    repos = repos.sort(function (a, b) {
        return b.pushed_at.localeCompare(a.pushed_at);
    }).slice(0, 5);

    // get populare repository.
    let popRepo = [...repos.reduce((op, inp) => {
        let lang = inp.language;
        op.set(lang, (op.get(lang) || 0) + 1)
        return op
    }, new Map()).entries()][0][0];

    // set in html
    language.innerHTML = popRepo;
    languageDiv.style.display = "block";

}

// the process of sending data and fill it in view.
async function sendRequest(e) {
    console.log("clicked on submit");
    let username = usernameInput.value;
    if (username == "") {
        console.log("username was empty");
        return;
    }
    e.preventDefault();
    let userData;
    userData = await JSON.parse(window.localStorage.getItem(username));
    if (userData == null) {
        userData = await getUserData(username);
        if (userData == null)
            return;
        findPopLang(username);
        window.localStorage.setItem(username, JSON.stringify(userData));
    }
    fillProfileCard(userData);
}

avatarContainer.addEventListener('click', show);
closeButton.addEventListener('click', hide);
usernameInput.addEventListener('focus', focusOnInputbar);
usernameInput.addEventListener('blur', blurOnInputbar);
searchButton.addEventListener('click', sendRequest);
window.localStorage.clear(); // used for remove cache in refresh