
(function( lib, api){
	
var undefined;
	
// export dependency functions
api.fileUploaderDependency ={};

// bind event handler to element
api.fileUploaderDependency.bind =function( elem, eventName, handler) {
	lib.event.bind( elem, eventName, handler);
};

// unbind event handler
api.fileUploaderDependency.unbind =function( elem, eventName, handler) {
	lib.event.unbind( elem, eventName, handler);
};

// get element offset
api.fileUploaderDependency.getElementOffset =function( elem) {
	return lib.css.position( elem, true);
};

// get element's client rect
api.fileUploaderDependency.getRect =function( elem) {
	return lib.css.rect( elem);
};

// get element outer width
api.fileUploaderDependency.getElementOuterWidth =function( elem) {
	var sizing =lib.css.sizing( elem);
	
	// return computed value
	return 	sizing['width'] +
					sizing['border-left-width'] +
					sizing['border-right-width'] +
					sizing['padding-left'] +
					sizing['padding-right'] +
					sizing['margin-left'] +
					sizing['margin-right'];
};

// get element outer height
api.fileUploaderDependency.getElementOuterHeight =function( elem) {
	var sizing =lib.css.sizing( elem);
	
	// return computed value
	return 	sizing['height'] +
					sizing['border-top-width'] +
					sizing['border-bottom-width'] +
					sizing['padding-top'] +
					sizing['padding-bottom'] +
					sizing['margin-top'] +
					sizing['margin-bottom'];
};

// check if element is visible
api.fileUploaderDependency.isElementVisible =function( elem) {
	return lib.css.visible( elem);
};

})( EVOLIB_EXPORT, window);