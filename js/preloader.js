// Preloader functionality
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const body = document.body;
    
    // Add preloader-active class to prevent scrolling
    body.classList.add('preloader-active');
    
    // Track when page is fully loaded
    let pageLoaded = false;
    let minTimeElapsed = false;
    
    // Set minimum display time of 1 second
    setTimeout(() => {
        minTimeElapsed = true;
        hidePreloaderIfReady();
    }, 1000);
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
        pageLoaded = true;
        hidePreloaderIfReady();
    });
    
    function hidePreloaderIfReady() {
        if (pageLoaded && minTimeElapsed) {
            preloader.classList.add('fade-out');
            body.classList.remove('preloader-active');
            
            // Remove preloader from DOM after transition
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }
    }
});