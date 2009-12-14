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

// get element relative offset
api.fileUploaderDependency.getElementRelativeOffset =function( elem) {
  var $elem =$( elem);
  var $offsetParent =$elem.offsetParent();
  var offset =$elem.offset();
  
  if( $offsetParent.size() ==0)
    // return absolute offset
    return offset;
    
  var parentOffset =$offsetParent.offset();
  
  // get relative offset
  offset.left =offset.left -parentOffset.left;
  offset.top =offset.top -parentOffset.top;
  
  // return offset relative to positioned parent element
  return offset;
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