// create the namespace
const appMenu = {};

// query the hamburger menu and navigation elements
appMenu.hamburgerButton = document.querySelector('.mobileMenuIcon');
appMenu.hamburgerIcon = document.querySelector('.mobileMenuIcon i');
appMenu.navigationList = document.querySelector('.mobileNav');
appMenu.navigationListItem = document.querySelectorAll('.mobileNav li');

appMenu.openHamburgerNav = () => {
	appMenu.hamburgerOpen = true;
	// change the hamburger icon to the "x" icon
	appMenu.hamburgerIcon.classList.toggle('fa-xmark');
	appMenu.hamburgerIcon.classList.toggle('fa-bars');
	// add the navOpen class to the nav menu list
	appMenu.navigationList.classList.add('navOpen');
}

appMenu.closeHamburgerNav = () => {
	// change the hamburger icon to the "x" icon.
	appMenu.hamburgerIcon.classList.toggle('fa-xmark');
	appMenu.hamburgerIcon.classList.toggle('fa-bars');
	// remove the navOpen class to the nav menu list
	appMenu.navigationList.classList.remove('navOpen');
	// the menu is now closed
	appMenu.hamburgerOpen = false;
}

appMenu.hamburgerClick = () => {
	// when the hamburger button is clicked:
	// if the menu is open, close it
	if(appMenu.hamburgerOpen){
		appMenu.closeHamburgerNav();
	// if the menu is closed, open it
	} else {
		appMenu.openHamburgerNav();
	}
}

appMenu.hamburgerButton.addEventListener('click', appMenu.hamburgerClick);