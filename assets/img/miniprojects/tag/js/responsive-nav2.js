$.fn.slideFadeToggle  = function(speed, easing, callback) {
        return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
};


jQuery(document).ready(function(){
	"use strict";
	
	jQuery('#nav-button').click(function() {
			jQuery('#nav').toggle();
	});
	
	if ( jQuery(window).width() < 959) {
	jQuery('#nav li a').click(function() {
			jQuery('#nav').hide();
	});
	}
	
	jQuery(window).resize(function() {
  if ( jQuery(window).width() < 959) {
	  jQuery('#nav').hide();
	jQuery('#nav li a').click(function() {
			jQuery('#nav').hide();
	});
	}
	});
	
});	