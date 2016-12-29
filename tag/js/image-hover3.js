jQuery(document).ready(function($){
	"use strict";							
	
	jQuery('.images').not('.images.no-icon').bind('mouseover', function() {
	  jQuery(this).find('.overlay, p').stop().animate({
    "opacity": "0"
  }, 200 );
	  jQuery(this).find('h4').stop().animate({
    "padding-bottom": "120",
	"opacity": "0"
  }, 200 );
	   });
	
	jQuery('.images').not('.images.no-icon').bind('mouseout', function() {
	  jQuery(this).find('.overlay, p').stop().animate({
    "opacity": "1"
  }, 200 );
	  jQuery(this).find('h4').stop().animate({
    "padding-bottom": "0",
	"opacity": "1"
  }, 200 );
	   });

	

});