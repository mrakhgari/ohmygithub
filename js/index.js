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

function show() {
    hoverIcon.classList.add('active');
    fullscreen.classList.add('show');
}

function hide() {
    hoverIcon.classList.remove('active');
    fullscreen.classList.remove('show');
}

function focusOnInputbar() {
    let parent = this.parentNode.parentNode;
    parent.classList.add('focus');
}

function blurOnInputbar() {
    let parent = this.parentNode.parentNode;
    if (this.value == "")
        parent.classList.remove('focus');
}

function showErrorMessage(response) {
    console.log(response);
    error.classList.add('active');
    error.innerHTML = response.message;
    setTimeout(() => {
        error.classList.remove('active');
    }, 4000)
}


async function getUserData(username) {
    console.log("request");
    try {
        let response = await fetch(`https://api.github.com/users/${username}`)
        let json = await response.json();
        if (response.status == 200) {
            return json
        }
        showErrorMessage(json);
        return Promise.reject(`Request failed with error ${response.status}`);
    } catch (e) {
        console.log(e);
    }
}

function setAvatar(avatar) {
    for (avatarImage of avatarImages) {
        avatarImage.src = avatar;
    }
}

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


function setBlog(userData) {
    if (userData.blog == "") {
        console.log("no blog");
        blogDiv.style.display = "none";
    } else {
        blogDiv.style.display = "flex";
        blogUrl.innerHTML = userData.blog;
        blogUrl.href = userData.blog;
    }
}


function fillProfileCard(userData) {
    console.log(userData);
    setAvatar(userData.avatar_url);
    setName(userData);
    setBio(userData);
    setStats(userData);
    setLocation(userData);
    setBlog(userData);
}

async function getRepos(username) {
    try {
        let response = await fetch(`https://api.github.com/users/${username}/repos`);
        let json = await response.json();
        if (response.status != 200) {
            showErrorMessage(json);
            return Promise.reject(`Request failed with error ${response.status}`);
        }
        return json;
    } catch (e) {
        console.log(e);
    }
}

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
window.localStorage.clear(); // used for remove catch in refresh