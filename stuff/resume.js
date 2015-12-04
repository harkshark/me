/* -----------------------------------------
   Resume Scripts
   By Lauren Harkness
----------------------------------------- */

/* TOC ----------------------------------
:: Scrollspy
:: Smooth Scroll
:: Carousel
----------------------------------------- */


$(function(){

	"use strict";


	/* Scrollspy ------------------------ */

	var topOffset = 50;		// navbar height

	$('body').scrollspy({
		target: 'header .navbar',
		offset: topOffset
	});


	// use 'inbody' class to add background when not at the very top
 	toggleInBody(this);

	$('.navbar-fixed-top').on('activate.bs.scrollspy', function(){ toggleInBody(this); });

	function toggleInBody(body){

		var hash = $(body).find('li.active a').attr('href');
		
		if (hash !== '#featured'){ $('header nav').addClass('inbody'); }
		else { $('header nav').removeClass('inbody'); }
	}


	/* Smooth Scroll -------------------- */

	$('.navbar a[href*=#]:not([href=#])').click(function() {

		if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {

			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

			if (target.length) {

				$('html, body').animate({ scrollTop: target.offset().top-topOffset+2 }, 500);
				return false;
			}
		}
	});

	
	/* Carousel ------------------------- */

	$('.carousel').carousel({
		interval: '5000',
		pause:    false
	});


	// count slide items and add thumbnails
	var numSlides = $('#featured .item').length;
	var randomSlide = Math.floor(Math.random()*numSlides);

	for (var i=0; i<numSlides; i++){

		var markup = '<li data-target="#featured" data-slide-to="' + i + '"';

		if (i === randomSlide){ markup += ' class="active" '; }		// set active thumbnail

		markup += '></li>';

		$('#featured ol').append(markup);
	}


	// randomize first slide
	$('#featured .item').eq(randomSlide).addClass('active');


	// convert images to background-images for full window display
	var winHeight = $(window).height();

	$('.fullheight').css('height', winHeight);

	$('#featured .item img').each(function(){

		var imgSrc = $(this).attr('src');
		$(this).parent().css({ 'background-image': 'url('+ imgSrc +')' });
		$(this).remove();
	});

	$(window).resize(function(){

		winHeight = $(window).height();
		$('.fullheight').css('height', winHeight);
	});


});
