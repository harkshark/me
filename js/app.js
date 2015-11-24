/* -----------------------------------------
   My Scripts
   github.com/harkshark/me
   MIT License
   By Lauren Harkness
----------------------------------------- */


/* Foundation --------------------------- */

$(document).foundation();


/* Masonry ------------------------------ */

$(window).load(function(){

	$('.masonry-house').masonry({
		itemSelector: '.masonry-brick',
		columnWidth:  240
	});

});//end .load