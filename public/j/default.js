$(document).ready(function() {

	$('.tile').on('mouseover', function(el) {
		$(this).toggleClass('tile_hover');
	});

	$('.tile').on('mouseout', function(el) {
		$(this).toggleClass('tile_hover');
	});

	$('#proj1').on('click', function(el) {
		window.location = 'https://github.com/Hamlet-Tamaz/Sudoku';
	});

	$('#proj2').on('click', function(el) {
			window.location = 'https://github.com/Hamlet-Tamaz/lonelytable_app';
		});

	$('#proj3').on('click', function(el) {
			window.location = 'https://github.com/Hamlet-Tamaz/flink';
		});
	
	


});