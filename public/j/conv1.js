var body = document.body,
	nav = document.querySelector('nav ul'),
	burger = document.querySelector('#burger');


nav.addEventListener('click', drop);

burger.addEventListener('click', function(e) {
	nav.style.display != 'inline-block' ?  nav.style.display = 'inline-block' : nav.style.display = 'none';
});


function clear(e, t) {
	var tabs = document.querySelectorAll('.drop, .drop2');

	var inTabs = false,
		disp = false;

	var inNav = nav.contains(e.target);


	tabs.forEach(function(el, i) {
		if (el.contains(e.target)) {
			inTabs = true;
		}
		if (el.style.display != '' && el.style.display != 'none') {
			disp = true;
		}
	});

	if ((!inTabs && disp)  ) {
		tabs.forEach(function(el, i) {
			el.style.display = 'none';
		})	
	}
}



function drop(e) {
	e.preventDefault();

	var drop = e.target.nextElementSibling,
		tabs = document.querySelectorAll('.drop, .drop2');

	if (e.target.nodeName == "A") {	
		if (drop.style.display=='block') {
			drop.style.display = 'none';
			body.removeEventListener('click', clear);
		}
		else {
			body.addEventListener('click', clear);
			clear(e, this);
			drop.style.display = 'block';	
		}
	}

	e.stopPropagation();
}


