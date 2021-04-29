const avatar = document.querySelector(".avatar_container");
const hoverIcon = document.querySelector(".hover");
const fullscreen = document.querySelector(".fullscreen");
const closeButton = document.querySelector('.close');
const usernameInput = document.querySelector('.search-div__input')


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

avatar.addEventListener('click', show);
closeButton.addEventListener('click', hide);
usernameInput.addEventListener('focus', focusOnInputbar);
usernameInput.addEventListener('blur', blurOnInputbar);