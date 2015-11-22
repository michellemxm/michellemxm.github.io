jQuery(document).ready(function(){					
 
	 jQuery('.title-wrap, .subtitle-wrap').not('.flexslider .title-wrap, .flexslider .subtitle-wrap').each(function() {
        jQuery(this).data('wrapping', jQuery(this).width());
        jQuery(this).css('width', 0);
     });

      jQuery('.images').not('.flexslider .images').bind('mouseenter', function() {
        jQuery(this).find('.title-wrap').stop().each(function() {
          jQuery(this).animate({
            width: jQuery(this).data('wrapping')
          }, 150);
      	});
        jQuery(this).find('.subtitle-wrap').stop().each(function() {
          jQuery(this).delay(250).animate({
            width: jQuery(this).data('wrapping')
          }, 150);
        });
      });

      jQuery('.images').not('.flexslider .images').bind('mouseleave', function() {
        jQuery(this).find('.title-wrap').stop().each(function() {
          jQuery(this).animate({
            width: 0
          }, 150);
      	});
        jQuery(this).find('.subtitle-wrap').stop().each(function() {
          jQuery(this).animate({
            width: 0
          }, 150);
        });
      });
	  
	  jQuery('.element').hover(function() {
			 jQuery(this).find('.overlay').stop().fadeToggle(150);
	  });
	  
	  
});