// create the namespace
const app = {};

// Query the hamburger menu and navigation elements
app.hamburgerButton = document.querySelector('.mobileMenuIcon')
app.hamburgerIcon = document.querySelector('.mobileMenuIcon i')
app.navigationList = document.querySelector('.mobileNav')
app.navigationListItem = document.querySelectorAll('.mobileNav li')

app.openHamburgerNav = () => {
    // the menu is now open
    app.hamburgerOpen = true;
    // change the hamburger icon to the "x" icon
    app.hamburgerIcon.classList.toggle('fa-xmark');
    app.hamburgerIcon.classList.toggle('fa-bars');
    // add the navOpen class to the nav menu list
    app.navigationList.classList.add('navOpen');
    // change the aria description
    app.hamburgerIcon.ariaDescription = "Close mobile navigation menu"
}

app.closeHamburgerNav = () => {
    // The menu is now closed
    app.hamburgerOpen = false
    // change the hamburger icon to the "x" icon.
    app.hamburgerIcon.classList.toggle('fa-xmark');
    app.hamburgerIcon.classList.toggle('fa-bars');
    // remove the navOpen class to the nav menu list
    app.navigationList.classList.remove('navOpen');
    // change the aria description;
    app.hamburgerIcon.ariaDescription = "Open mobile navigation menu"
}

app.hamburgerClick = () => {
    // When the hamburger button is clicked:
    // If the menu is open, close it
    if(app.hamburgerOpen){
        app.closeHamburgerNav();
        console.log(app.hamburgerIcon);
    // If the menu is closed, open it
    } else{
        app.openHamburgerNav();
        console.log(app.hamburgerIcon);
    }
}
app.hamburgerButton.addEventListener('click', app.hamburgerClick)