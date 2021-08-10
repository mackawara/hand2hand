var navbarToggler=document.getElementById("navbarToggler");
var navbar=document.getElementById("mainNavbar");
navbarToggler.addEventListener('click',toggleNavbar())
function toggleNavbar() {
navbar.classList.toggle('active')
    
}