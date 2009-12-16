/**
  * Author: Dmitry Stepanov
  * E-Mail: dmitrij@stepanov.lv
  * URL: http://www.stepanov.lv
  
  File Uploader - parallel asynchronous file uploader.
  Copyright (C) 2009  Dmitry Stepanov <dmitrij@stepanov.lv>
  
  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License
  as published by the Free Software Foundation; either version 2
  of the License, or (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
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

// get element relative parent
api.fileUploaderDependency.getElementRelativeParent =function( elem) {
  var doc =elem.ownerDocument;
  var body =doc.body;
  
  //return $(elem).offsetParent().get(0);
  while( elem.parentNode) {
    elem =elem.parentNode;
    
    if( elem.nodeName =='BODY' || elem.nodeName =='HTML')
      return body;
      
    // get element style
    var style =doc.defaultView ? doc.defaultView.getComputedStyle( elem, null) : elem.currentStyle;
    
    if( style.position !='static')
      return elem;
  }
  
  return body;
};

// get element relative parent offset
api.fileUploaderDependency.getElementRelativeOffset =function( elem) {
  return $(elem).position();
};

// get element outer width
api.fileUploaderDependency.getElementOuterWidth =function( elem) {
  return $(elem).outerWidth();
};

// get element outer height
api.fileUploaderDependency.getElementOuterHeight =function( elem) {
  return $(elem).outerHeight();
};

// get element scrolling info
api.fileUploaderDependency.getElementScrolling =function( elem) {
  return {
    'top': elem.scrollTop,
    'left': elem.scrollLeft
  };
};

// check if element is visible
api.fileUploaderDependency.isElementVisible =function( elem) {
  return $( elem).is( ':visible');
};

})( $, window);