/**
  * Author: Dmitry Stepanov
  * E-Mail: dmitrij@stepanov.lv
  * URL: http://www.stepanov.lv
  */

(function( $, api){
  
var undefined;
  
// export dependency functions
api.fileUploaderDependency ={};

// test if browser is Internet Explorer
api.fileUploaderDependency.isAgentIE =function() {
  return $.browser.msie;
};

// bind event handler to element
api.fileUploaderDependency.bind =function( elem, eventName, handler) {
  $(elem).bind( eventName, handler);
};

// unbind event handler
api.fileUploaderDependency.unbind =function( elem, eventName, handler) {
  $(elem).unbind( eventName, handler);
};

// get element offset
api.fileUploaderDependency.getElementOffset =function( elem) {
  return $(elem).offset();
};

// get element outer width
api.fileUploaderDependency.getElementOuterWidth =function( elem) {
  return $(elem).outerWidth();
};

// get element outer height
api.fileUploaderDependency.getElementOuterHeight =function( elem) {
  return $(elem).outerHeight();
};

})( $, window);