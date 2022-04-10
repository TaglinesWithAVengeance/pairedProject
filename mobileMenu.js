// create the namespace
const app = {};

// query the hamburger menu and navigation elements
app.hamburgerButton = document.querySelector('.mobileMenuIcon');
app.hamburgerIcon = document.querySelector('.mobileMenuIcon i');
app.navigationList = document.querySelector('.mobileNav');
app.navigationListItem = document.querySelectorAll('.mobileNav li');

app.openHamburgerNav = () => {
	app.hamburgerOpen = true;
	// change the hamburger icon to the "x" icon
	app.hamburgerIcon.classList.toggle('fa-xmark');
	app.hamburgerIcon.classList.toggle('fa-bars');
	// add the navOpen class to the nav menu list
	app.navigationList.classList.add('navOpen');
}

app.closeHamburgerNav = () => {
	// change the hamburger icon to the "x" icon.
	app.hamburgerIcon.classList.toggle('fa-xmark');
	app.hamburgerIcon.classList.toggle('fa-bars');
	// remove the navOpen class to the nav menu list
	app.navigationList.classList.remove('navOpen');
	// the menu is now closed
	app.hamburgerOpen = false;
}

app.hamburgerClick = () => {
	// when the hamburger button is clicked:
	// if the menu is open, close it
	if(app.hamburgerOpen){
		app.closeHamburgerNav();
	// if the menu is closed, open it
	} else {
		app.openHamburgerNav();
	}
}

app.hamburgerButton.addEventListener('click', app.hamburgerClick);