jQuery(document).ready(function($){
	"use strict";							
	
	jQuery('.images').not('.images.no-icon').bind('mouseover', function() {
	  jQuery(this).find('.icons').stop().animate({
    "opacity": "1"
  }, 200 );
	  jQuery(this).find('.info-wrapper').stop().animate({
    "margin-top": "0"
  }, 200 );
	   });
	
	jQuery('.images').not('.images.no-icon').bind('mouseout', function() {
	  jQuery(this).find('.icons').stop().animate({
    "opacity": "0"
  }, 200 );
	  jQuery(this).find('.info-wrapper').stop().animate({
    "margin-top": "-58"
  }, 200 );
	   });

	

});