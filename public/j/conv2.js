var burger = document.querySelector('nav#stickyNav .burger'),
	navUl = document.querySelector('nav#stickyNav ul');

	burger.addEventListener('click', function(e) {
		
		if (e.target.nextElementSibling.style.display == '' || e.target.nextElementSibling.style.display == 'none') {
			e.target.nextElementSibling.style.display = 'inline-block';
			e.target.nextElementSibling.style.position = 'absolute';
			e.target.nextElementSibling.style.top = '60px';
			e.target.nextElementSibling.style.right = '1px';
			e.target.nextElementSibling.style.padding = '0';
		} else {
			e.target.nextElementSibling.style.display = '';
			e.target.nextElementSibling.style.position = '';
			e.target.nextElementSibling.style.top = '';
			e.target.nextElementSibling.style.right = '';
			e.target.nextElementSibling.style.padding = '';
		}

	})

window.addEventListener('resize', function(el) {
	if(el.target.innerWidth >= 500) {
		navUl.style.display = '';
		navUl.style.position = '';
		navUl.style.top = '';
		navUl.style.right = '';
		navUl.style.padding = '';
	}
})

