const avatar = document.querySelector(".avatar_container");
const hoverIcon = document.querySelector(".hover");
const fullscreen = document.querySelector(".fullscreen");
const closeButton = document.querySelector('.close');

function show() {
    console.log("aaa");
    hoverIcon.classList.add('active');
    fullscreen.classList.add('show');
}

function hide() {
    hoverIcon.classList.remove('active');
    fullscreen.classList.remove('show');
}

avatar.addEventListener('click', show);
closeButton.addEventListener('click', hide);