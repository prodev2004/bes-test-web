const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');
const hideMobileNav = document.querySelector('.hide-mobile-nav');

burger.addEventListener('click', () => {
    nav.classList.toggle('opened');
});
hideMobileNav.addEventListener('click', () => {
    nav.classList.remove('opened');
});