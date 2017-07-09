$(document).ready(function() {
	
	$(window).on('scroll', function(el) {
		var cur = el.currentTarget.scrollY;
		if (cur <= 53) {
			$('#miniNav').css('top', 50 - cur);
		}
		else {
			$('#miniNav').css('top', 0);
		}
	})

	$(window).scroll();

	$('.tile').on('mouseover', function(el) {
		$(this).toggleClass('tile_hover');
	});

	$('.tile').on('mouseout', function(el) {
		$(this).toggleClass('tile_hover');
	});


	$('div#docDisplay img').on('click', function(el) {
		$('div#docDisplay img').toggleClass('magnify');
	})
});