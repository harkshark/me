/* -----------------------------------------
   Case Study Gallery Plugin
   NTC / Lauren Harkness
   November 2013
----------------------------------------- */

(function($){
	
	$.fn.gallery = function(options){
		
		var settings = $.extend({}, $.fn.gallery.defaults, options);
		var oGallery = $(this);
		
		// Go To Study
		if (settings.goToStudy > 0){ fnGoToStudy(oGallery, settings.goToStudy); }
		//if (settings.goToStudy >= settings.numToDisplay){ fnGoToStudy(oGallery, settings.goToStudy); }
		
		// Determine How to Display
		settings.numToDisplay = fnDisplayHow(oGallery, settings.numToDisplay);
		
		// Inject Navigational Elements
		if (fnInjectNav(oGallery, settings.containToGrid)){
			
			// Move Left
			var oLeftNav = $(oGallery).find('.nav.left');
			$(oLeftNav).bind('click', {theGallery:oGallery, theEasing:settings.navEasing}, fnMoveRight);
			
			// Move Right
			var oRightNav = $(oGallery).find('.nav.right');
			$(oRightNav).bind('click', {theGallery:oGallery, theEasing:settings.navEasing}, fnMoveLeft);
		}
		
		// Draw Gallery
		fnDrawGallery(oGallery, settings.numToDisplay, settings.studyPadding, settings.containToGrid, settings.goToStudy);
		
		// Set Caption Options
		fnCaptionOptions(oGallery, settings.capFontSize, settings.capBackColor);
		
		// Hover Captions
		if (settings.hoverCaptions){
			$(oGallery).children('.study').each(function(){
				$(this).bind('mouseenter', {theStudy:$(this), theEasing:settings.hoverEasing}, fnShowCaption);
				$(this).bind('mouseleave', {theStudy:$(this)}, fnHideCaption);
			});
		}
		
		// On Study Click
		$(oGallery).children('.study').bind('click', {theSettings:settings}, fnStudyClick);
		
		
		// Ready
		$(oGallery).children('.study:not(.hidden), .l-nav').fadeIn(1000);
		
		return oGallery;
	};
	
	// Option Defaults
	$.fn.gallery.defaults = {
		numToDisplay: 4,
		goToStudy: 0,
		studyPadding: 24,
		containToGrid: true,
		navEasing: 'easeOutBack',
		hoverEasing: 'easeOutElastic',
		hoverCaptions: true,
		capBackColor: '',
		capFontSize: 16,
		onStudyClick: function(){}
	};
	
	// PRIVATE: Go To Study
	function fnGoToStudy(fGallery, fGoToStudy){
		
		//var aStudy = $(fGallery).find('.study').toArray();
		//var aStudy = $(fGallery).find('.study').get();		// Can't use .toArray() or .get() with IE11!!!
		
		var aStudy = [];
		$(fGallery).children().each(function(){ aStudy.push(this.outerHTML); });
		
		var order = [0,1,2,3,4,5];
		var i = 0;
		
		while (i < fGoToStudy){
			var tmp = order.shift();
			order.push(tmp);
			i++;
		}
		
		$(fGallery).html('');
		$.each(order, function(i, val){ $(fGallery).append(aStudy[val]); });
	}
	
	// PRIVATE: Determine How to Display
	function fnDisplayHow(fGallery, fNumToDisplay){
		
		var totalStudy = $(fGallery).children('.study').length;
		var diff = totalStudy - fNumToDisplay;
		
		if (diff < 0){ return totalStudy; }		//user error; totalStudy < numToDisplay so only show what's there
		else if (diff == 0){ return fNumToDisplay; }
		else {
			$(fGallery).children('.study').slice(-diff).addClass('hidden');
			return fNumToDisplay;
		}
	}
	
	// PRIVATE: Draw Gallery
	function fnDrawGallery(fGallery, fNumToDisplay, fPadding, fContainToGrid, fGoToStudy){
		
		// Calculate Study Width
		var numHidden = $(fGallery).children('.study.hidden').length;
		var containerWidth = $(fGallery).width();
		
		// Contain to Grid
		if ( fContainToGrid && numHidden > 0 ){ containerWidth = $(fGallery).width() - 80; }	//account for nav elements	
		
		if (!$.isNumeric(fPadding)){ fPadding = $.fn.gallery.defaults.studyPadding; }
		var studyWidth = Math.floor((containerWidth-(fPadding*(fNumToDisplay-1)))/fNumToDisplay);
		
		// Draw Studies
		$(fGallery).children('.study').width(studyWidth).css('margin-right', fPadding + 'px');
		$(fGallery).children('.study:nth-child(' + (fNumToDisplay+1) + ')').css('margin-right', '0px');
		if (numHidden == 0){ $(fGallery).children('.study:last-child').css('margin-right', '0px'); }
		
		// Adjust Nav
		var studyHeight = $(fGallery).children('.study').height();
		var navHeight = $(fGallery).children('.nav').height();
		var navPositionY = (studyHeight-navHeight)/2;
		
		$(fGallery).children('.nav').height(studyHeight);
		$(fGallery).children('.nav').css('margin-top', navPositionY);
		
	}
	
	// PRIVATE: Inject Navigational Elements
	function fnInjectNav(fGallery, fContainToGrid){
		
		var numHidden = $(fGallery).children('.study.hidden').length;
		var oNavLeft;
		var oNavRight;
		
		// Contain to Grid
		if (fContainToGrid){
			oNavLeft = '<div class="nav left"><img src="../img/icon-arrow-left.png"></div>';
			oNavRight = '<div class="nav right"><img src="../img/icon-arrow-right.png"></div>';	
		} else {
			oNavLeft = '<div class="nav expand left"><img src="../img/icon-arrow-left.png"></div>';
			oNavRight = '<div class="nav expand right"><img src="../img/icon-arrow-right.png"></div>';
		}
		
		if (numHidden > 0){
			$(fGallery).prepend(oNavLeft).append(oNavRight);
			return true;
		}
	}
	
	// PRIVATE: Move Left
	function fnMoveLeft(e) {

		var fGallery = $(e.data.theGallery);
		var iTotalStudy = parseInt($(fGallery).children('.study').length) - 1;
		var oFirstStudy;
	
		$(fGallery).children('.study').each(function(i){
			
			if (i==0){ oFirstStudy = $(this).clone(); }		//remember the first study to replace the last
			
			// This Study = Next Study
			if (i < iTotalStudy){ $(this).html($(this).next().html()); }
			else if (i == iTotalStudy){ $(this).html($(oFirstStudy).html()); }
			
			// Animate
			$(this).not('.hidden').effect('slide',{easing:e.data.theEasing, direction:'right'});
		});
	}
	
	// PRIVATE: Move Right
	function fnMoveRight(e){
		
		var fGallery = $(e.data.theGallery);
		var iTotalStudy = parseInt($(fGallery).children('.study').length) - 1;
		var oLastStudy;
		
		$($(fGallery).children('.study').get().reverse()).each(function(i){
			
			if (i==0){ oLastStudy = $(this).clone(); }		//because .reverse(), i==0 is the last study
			
			// This Study = Previous Study
			if (i < iTotalStudy){ $(this).html($(this).prev().html()); }
			else if (i == iTotalStudy){ $(this).html($(oLastStudy).html()); }
			
			// Animate
			$(this).not('.hidden').effect('slide',{easing:e.data.theEasing});
		});
	}
	
	// PRIVATE: Caption Options
	function fnCaptionOptions(fGallery, fFontSize, fBackColor){
		
		// Background Color
		if ( (fBackColor).charAt(0) != '#' ){ fBackColor = '#' + fBackColor; }
		if ( /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(fBackColor) ){
			$(fGallery).find('.caption').css({'background-color':fBackColor, 'border-color':fBackColor});
		}
		
		// Font Size
		if ($.isNumeric(fFontSize)){ $(fGallery).find('.caption').css('font-size',fFontSize); }
	}
	
	// PRIVATE: Show Caption
	function fnShowCaption(e){
		$(e.data.theStudy).children('.caption').stop(true, true).slideToggle('slow',e.data.theEasing);
	}
	
	// PRIVATE: Hide Caption
	function fnHideCaption(e){
		$(e.data.theStudy).children('.caption').stop(true, true).slideToggle('fast');
	}
	
	// PRIVATE: On Study Click
	function fnStudyClick(e){ e.data.theSettings.onStudyClick.call(this) }
		
}(jQuery));
