
(function( $, api){
	
var undefined;
	
// export dependency functions
api.fileUploaderDependency ={};

// bind event handler to element
api.fileUploaderDependency.bind =function( elem, eventName, handler) {
	$(elem).bind( eventName, handler);
};

// unbind event handler
api.fileUploaderDependency.unbind =function( elem, eventName, handler) {
	$(elem).unbind( eventName, handler);
};

// get element's client rect
api.fileUploaderDependency.getRect =function( elem) {
	var offs =$(elem).offset();
	
	// subtract document scrolling
	offs.top -=$(document).scrollTop();
	offs.left -=$(document).scrollLeft();
	
	return offs;
};

// get element outer width
api.fileUploaderDependency.getElementOuterWidth =function( elem) {
	return $(elem).outerWidth();
};

// get element outer height
api.fileUploaderDependency.getElementOuterHeight =function( elem) {
	return $(elem).outerHeight();
};

// check if element is visible
api.fileUploaderDependency.isElementVisible =function( elem) {
	return $( elem).is( ':visible');
};

})( $, window);