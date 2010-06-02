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