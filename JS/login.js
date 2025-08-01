const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

const goToHomePage = document.getElementById('goToHomePage');
const goToRegisterPage = document.getElementById('goToRegisterPage');

goToHomePage.addEventListener('click', () => {
    window.location.href = "../Maqueta/home.html";
});

goToRegisterPage.addEventListener('click', () => {
    window.location.href = "../Maqueta/home.html";
});
