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

async function getUserData(username) {
    try {
        let response = await fetch(`https://api.github.com/users/${username}`)
        if (response.status == 200)
            return response.json();
        return Promise.reject(`Request failed with error ${response.status}`)
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

async function sendRequest(e) {
    console.log("clicked on submit");
    let username = usernameInput.value;
    if (username == "") {
        console.log("username was empty");
        return;
    }
    e.preventDefault();
    let userData = await getUserData(usernameInput.value);
    fillProfileCard(userData);
}

avatarContainer.addEventListener('click', show);
closeButton.addEventListener('click', hide);
usernameInput.addEventListener('focus', focusOnInputbar);
usernameInput.addEventListener('blur', blurOnInputbar);
searchButton.addEventListener('click', sendRequest);