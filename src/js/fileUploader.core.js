
(function( api, window, document, dependency){

var undefined;

// function to check if user agent is MSIE
function IsAgentIE() {
	return document.attachEvent !==undefined;
}

// movie object id
var movieId =null;

// movie object
var movie =null;

// movie container object (to be removed on deinitialization)
var movieContainer =null;

// follower interval timer
var followerTimer =null;

// registered buttons
var buttons =new Array();

// button id offset
var buttonIdOffset =0;

// expose API object
api =api.fileUploader ={};

// expose configuration object
var config =api.config ={
	// flash file URL
	'swfUrl': '/bin/flash/FileUploader.swf',
	// zIndex to assign to flash file container
	'zIndex': 9999,
	// enable visual debugging
	'visualDebug': false,
	// forced positioning of elements
	'forcedPositioning': false
};

// read-only property to see if uploader is initialized for
// system calls
api.ready =false;

// default debug handler
api.debug =function( msg){
	// override this method from outside world to receive debug
	//	messages
};

// methods to handle flash events / call flash methods
var flash ={};

// incoming flash event handlers
flash.handlers ={};

// flash is ready
flash.handlers.ready =function( elementId) {
	// set ready flag
	api.debug( '[FLASH] ready');
	
	// set movie object id
	movieId =elementId;
	
	// try to obtain reference to movie element
	if(( movie =document.getElementById( elementId)) ===null) {
		// BUGFIX: this can fail in IE, because IE initializes DOM after flash
		// initialization is complete. This is not valid behavior, so we
		// allow IE to pass this exception.
		if( !IsAgentIE())
			throw 'Did not found movie object #' +elementId +' during flash initialization';
	}
			
	// set ready flag
	api.ready =true;
	
	// in case we had focus on button while flash was
	// loading, restore that focus
	ButtonFollow( true);
};

// file dialog is opened
flash.handlers.dialogOpen =function( buttonId) {
	return api.handlers.dialogOpen( buttonId);
};

// file dialog is closed
flash.handlers.dialogClose =function( buttonId, activeUploadCount) {
	return api.handlers.dialogClose( buttonId, activeUploadCount);
};

// file has been added to queue
flash.handlers.fileSelect =function( buttonId, fileId, fileInfo) {
	return api.handlers.fileSelect( buttonId, fileId, fileInfo);
};

// file has been removed from queue
flash.handlers.fileRemove =function( fileId, fileInfo) {
	return api.handlers.fileRemove( fileId, fileInfo);
};

// file upload has been started
flash.handlers.fileUploadStart =function( fileId, fileInfo) {
	return api.handlers.fileUploadStart( fileId, fileInfo);
};

// file is uploading...
flash.handlers.fileUploadProgress =function( fileId, fileInfo, bytesLoaded, bytesTotal, percComplete) {
	return api.handlers.fileUploadProgress( fileId, fileInfo, bytesLoaded, bytesTotal, percComplete);
};

// file transfer rate info
flash.handlers.fileUploadTransferRate =function( fileId, fileInfo, speed, avgSpeed) {
	return api.handlers.fileUploadTransferRate( fileId, fileInfo, speed, avgSpeed);
};

// file upload has been completed, awaiting server response
flash.handlers.fileUploadAwaitingResponse =function( fileId, fileInfo) {
	return api.handlers.fileUploadAwaitingResponse( fileId, fileInfo);
};

// file upload error encountered
flash.handlers.fileUploadError =function( fileId, fileInfo, errorMsg) {
	return api.handlers.fileUploadError( fileId, fileInfo, errorMsg);
};

// file upload was successful
flash.handlers.fileUploadSuccess =function( fileId, fileInfo, serverData, filesRemaining) {
	return api.handlers.fileUploadSuccess( fileId, fileInfo, serverData, filesRemaining);
};

// file upload has completed
flash.handlers.fileUploadComplete =function( fileId, fileInfo, queueSize, removeFromQueue) {
	return api.handlers.fileUploadComplete( fileId, fileInfo, queueSize, removeFromQueue);
};


// flash callable functions (internal)
flash.call ={};

// flash callable functions (external)
api.call ={};

// remove file from queue
api.call.removeFile =flash.call.removeFile =function( fileId) {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	movie.removeFile( fileId);
};

// get file info
api.call.getFile =flash.call.getFile =function( fileId) {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	return movie.getFile( fileId);
};

// get all queued files
api.call.getQueue =flash.call.getQueue =function( buttonId) {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	if( buttonId ===undefined)
		buttonId =null;
		
	return movie.getQueue( buttonId);
};

// get queue size
api.call.getQueueSize =flash.call.getQueueSize =function( buttonId) {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	if( buttonId ===undefined)
		buttonId =null;
		
	return movie.getQueueSize( buttonId);
};

// start file uploading
api.call.startUpload =flash.call.startUpload =function( fileId, url, fileName, postArgs, uploadTimeout, expectResponse, responseTimeout) {
	if( !api.ready)
		throw 'File uploader is not ready';
	 
	// make sure all params are passed
	if( uploadTimeout ===undefined)
		uploadTimeout =null;
	if( expectResponse ===undefined)
		expectResponse =true;
	if( responseTimeout ===undefined)
		responseTimeout =10;
		
	movie.startUpload( fileId, url, fileName, postArgs, uploadTimeout, expectResponse, responseTimeout);
};

// stop file uploading
api.call.stopUpload =flash.call.stopUpload =function( fileId) {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	movie.stopUpload( fileId);
};

// stop all file uploading
api.call.stopAllUploads =flash.call.stopAllUploads =function() {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	movie.stopAllUploads();
};

// clear file queue
api.call.clearQueue =flash.call.clearQueue =function() {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	movie.clearQueue();
};

// set internal uploader setting
flash.call.setSettings =function( settings) {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	movie.setSettings( settings);
};

// get active file upload count
api.call.getActiveUploadCount =flash.call.getActiveUploadCount =function() {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	return movie.getActiveUploadCount();
};

// notify flash of shutting down
flash.call.shutdown =function() {
	if( !api.ready)
		throw 'File uploader is not ready';
		
	movie.shutdown();
};

// public API

// expose flash -> js bridge
api.bridge =function( elementId, methodName, args) {
	// handle flash events
	switch( methodName) {
		case 'ready':
			flash.handlers.ready( elementId);
		break;
		case 'dialogOpen':
			return flash.handlers.dialogOpen( args[0]);
		break;
		case 'dialogClose':
			return flash.handlers.dialogClose( args[0], args[1]);
		break;
		case 'fileSelect':
			return flash.handlers.fileSelect( args[0], args[1], args[2]);
		break;
		case 'fileRemove':
			return flash.handlers.fileRemove( args[0], args[1]);
		break;
		case 'fileUploadStart':
			return flash.handlers.fileUploadStart( args[0], args[1]);
		break;
		case 'fileUploadProgress':
			return flash.handlers.fileUploadProgress( args[0], args[1], args[2], args[3], args[4]);
		break;
		case 'fileUploadTransferRate':
			return flash.handlers.fileUploadTransferRate( args[0], args[1], args[2], args[3]);
		break;
		case 'fileUploadAwaitingResponse':
			return flash.handlers.fileUploadAwaitingResponse( args[0], args[1]);
		break;
		case 'fileUploadError':
			return flash.handlers.fileUploadError( args[0], args[1], args[2]);
		break;
		case 'fileUploadSuccess':
			return flash.handlers.fileUploadSuccess( args[0], args[1], args[2], args[3]);
		break;
		case 'fileUploadComplete':
			return flash.handlers.fileUploadComplete( args[0], args[1], args[2], args[3]);
		break;
	}
};

// create new button over element
api.create =function( elem, settings) {
	// see if file uploader is initialized
	if( movieContainer ===null) {
		// initialize file uploader
		api.load();
	}
	
	// make sure settings object is instantiated
	if( settings ===undefined)
		settings ={};
		
	// make sure all settings are present
	if( settings.id ===undefined)
		settings.id =AllocButtonId();
	if( settings.fileFilter ===undefined)
		settings.fileFilter ='*.*';
	if( settings.fileFilterName ===undefined)
		settings.fileFilterName ='All Files';
	if( settings.multi ===undefined)
		settings.multi =true;
	
	var mouseEnterHandler =function() {
		// focus target element
		FocusButton( elem);
	};
	
	// when mouse is over this element, move flash object right over
	// the overlay
	dependency.bind( elem, 'mouseenter', mouseEnterHandler);
	
	// create new button
	buttons.push({
		'elem': elem,
		'left': null,
		'top': null,
		'width': null,
		'height': null,
		'focused': false,
		'settings': settings,
		'mouseEnterHandler': mouseEnterHandler
	});
	
	// execute button follower immediately
	ButtonFollow();
	
	// return button id
	return settings.id;
};

// remove button from element
api.remove =function( elem) {
	// button reference
	var button =null;
	
	// find element
	for( var i =0; i < buttons.length; ++i) {
		if( buttons[i].elem ===elem) {
			// button found
			button =buttons[i];
			
			// loose any focused button
			LooseButton();
				
			// remove button from array
			buttons.splice( i, 1);
			break;
		}
	}
	
	// see if element was wrapped
	if( button ===null)
		throw 'Element is not wrapped via file uploader';
	
	// remove installed event handler from element
	dependency.unbind( button.elem, 'mouseenter', button.mouseEnterHandler);
};

// update button settings
api.update =function( buttonId, settings) {
	// find button entry
	var entry =GetButtonById( buttonId);
	
	// button not found?
	if( entry ===undefined)
		throw 'Button #' +buttonId +' not found';
		
	// update settings
	if( settings.fileFilter !==undefined)
		entry.settings.fileFilter =settings.fileFilter;
	if( settings.fileFilterName !==undefined)
		entry.settings.fileFilterName =settings.fileFilterName;
	if( settings.multi !==undefined)
		entry.settings.multi =settings.multi;
		
	// see if button is focused
	if( entry.focused) {
		// adjust movie to button and send new settings
		AdjustMovieToButton( entry, true);
	}
};

// internal

// allocate button id
function AllocButtonId() {
	return buttonIdOffset++;
};

// get button by button id
function GetButtonById( id) {
	for( var i =0; i < buttons.length; ++i)
		if( buttons[i].settings.id ==id)
			return buttons[i];
			
	// button not found
	return undefined;
};

// focus target element
function FocusButton( elem) {
	// loose any focused buttons
	LooseButton();
	
	// find target button
	var button =null;
	for( var i =0; i < buttons.length; ++i) {
		var button =buttons[i];
		if( button.elem ===elem) {
			// button found
			break;
		}
	}
	
	// see if button was found
	if( button ===null)
		// unable to focus non-existing button
		return;
		
	// move button away of viewport
	button.focused =true;
	
	// adjust movie to button
	AdjustMovieToButton( button);

	// set maximum z-index so that flash object is always on top
	// of other elements (IE bug fix)
	movieContainer.style.zIndex =config.zIndex;
	
	// follow button
	ButtonFollow();
};

// get OBJECT and EMBED tags from within movieContainer
function GetObjectAndEmbed() {
	var OBJECT =movieContainer.childNodes[0];
	var elems =[ OBJECT];
	var i;
	var EMBED;
	for( i =0; i < OBJECT.childNodes.length; ++i) {
		EMBED =OBJECT.childNodes[i];
		
		if( EMBED.tagName =='EMBED') {
			// add EMBED tag to array
			elems.push( EMBED);
			break;
		}
	}
	
	// return found elements
	return elems;
};

// adjust movie container object to button position
// and sizing
function AdjustMovieToButton( button, sendSettings) {
	if( sendSettings ===undefined)
		sendSettings =true;
		
	// assign new dimensions to movieContainer
	with( movieContainer.style) {
		width =button.width +'px';
		height =button.height +'px';
	}
	
	// assign new dimensions to the object element
	// and embed element, if used
	var elems =GetObjectAndEmbed();
	var i;
	for( i =0; i < elems.length; ++i) {
		with( elems[ i].style) {
			width =button.width +'px';
			height =button.height +'px';
		}
	}
	
	// assign new positioning
	with( movieContainer.style) {
		left =button.left +'px';
		top =button.top +'px';
	}
	
	if( api.ready && sendSettings) {
		// set active file selection settings
		flash.call.setSettings({
			'buttonId': button.settings.id,
			'multi': button.settings.multi,
			'fileFilter': button.settings.fileFilter,
			'fileFilterName': button.settings.fileFilterName +' (' +button.settings.fileFilter +')'
		});
	}
};

// loose button from focus
function LooseButton() {
	// had focus flag
	var hadFocus =false;
	var button;
	
	// find focused button and change it's focus status
	for( var i =0; i < buttons.length; ++i) {
		button =buttons[i];
		
		if( button.focused) {
			// found at least one focused button
			hadFocus =true;
			
			// remove focus flag
			button.focused =false;
			
			// force repositioning
			button.top =null;
			button.left =null;
			button.width =null;
			button.height =null;
		}
	}
	
	if( hadFocus) {
		// squeeze the button so it does not get accidentally hovered only
		//	if there were focused buttons active
		var elems =GetObjectAndEmbed();
		var i;
		for( i =0; i < elems.length; ++i) {
			with( elems[ i].style) {
				width ='1px';
				height ='1px';
			}
		}
		
		// assign initial settings
		movieContainer.style.width ='1px';
		movieContainer.style.height ='1px';
		movieContainer.style.left ='-100px';
		movieContainer.style.top ='-100px';
	}
	
	// assign new button positions
	ButtonFollow();
};

// button follow routine, executed by event handlers and setTimeout
function ButtonFollowRoutine() {
	ButtonFollow();
}

// see which buttons are registered to the file uploader,
// check if element positions / dimensions have changed,
// and if so, adjust new overlay positioning
function ButtonFollow( justReady) {
	// check input
	if( justReady ===undefined)
		justReady =false;
		
	var button;
	//var overlay;
	var elem;
	var style;
	var focusedButton =null;
	
	// iterate all buttons
	for( var i =0; i < buttons.length; ++i) {
		button =buttons[i];
		
		//overlay =button.overlay;
		elem =button.elem;

		// Check dimensions and positioning. Get last
		//	remembered button positioning.
		var lastLeft =button.left;
		var lastTop =button.top;
		var lastWidth =button.width;
		var lastHeight =button.height;
		
		// data to obtain
		var top, left, width, height;
		
		// see if button is hidden or removed from DOM
		if( !dependency.isElementVisible( elem) || !elem.parentNode) {
			// TODO: implement way to determine if node is no more used (removed from DOM) to
			//	automatically remove button reference from element.
			top =-100;
			left =-100;
			width =1;
			height =1;
			
		} else {
			// get offset
			var rect =dependency.getRect( elem);
			
			// store new offsets
			top =rect.top;
			left =rect.left;
	
			// get width and height
			width =dependency.getElementOuterWidth( elem);
			height =dependency.getElementOuterHeight( elem);
		}

		// see if positioning needs to be changed
		if( justReady || config.forcedPositioning || lastLeft ===null || lastLeft !=left || lastTop ===null || lastTop !=top || lastWidth ===null || lastWidth !=width || lastHeight ===null || lastHeight !=height) {
			// remember new data
			button.left =left;
			button.top =top;
			button.width =width;
			button.height =height;
		}
		
		if( button.focused)
			focusedButton =button;
	}
	
	if( focusedButton !==null) {
		// move movie element over focused button
		AdjustMovieToButton( focusedButton, justReady);
		
	} else if( justReady) {
		// now when object is inserted and initialized,
		// we move it out of viewport because there are
		// no buttons to focus on.
		movieContainer.style.left ='-100px';
		movieContainer.style.top ='-100px';
		movieContainer.style.width ='1px';
		movieContainer.style.height ='1px';
	}
};

// initialize uploader
api.load =function() {
	if( movieContainer !==null)
		// already loaded
		return;
		
	/*
		Inject OBJECT into DOM. 24h wasted on fixing this one, thanks to Microsoft.
		
		In IE ExternalInterface is not exported to JS if "data" attribute is not used on OBJECT
		tag. In Opera, if "data" attribute is used on OBJECT tag, on first 'mouseenter' event
		browser fails so hard that everything on the page becomes unclickable.
		
		BUGFIX: In IE "data" attribute is being added.
	*/
	var html =
		'<object id="fileUploader_OBJECT" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="200px" height="200px"' +( /* BUGFIX */ IsAgentIE() ? ' data="' +config.swfUrl +'"' :'') +'>' +
			'<param name="allowScriptAccess" value="always" />' +
			'<param name="movie" value="' +config.swfUrl +'" />' +
			'<param name="wmode" value="transparent" />' +
			'<param name="menu" value="false" />' +
			'<param name="quality" value="low" />' +
			'<param name="scale" value="exactfit" />' +
			'<param name="flashvars" value="elementId=fileUploader_OBJECT&amp;bridgeFn=fileUploader.bridge&amp;debugFn=fileUploader.debug&amp;visualDebug=' +(config.visualDebug ? '1' : '0') +'" />' +
			'<embed id="fileUploader_EMBED" src="' +config.swfUrl +'" flashvars="elementId=fileUploader_EMBED&amp;bridgeFn=fileUploader.bridge&amp;debugFn=fileUploader.debug&amp;visualDebug=' +(config.visualDebug ? '1' : '0') +'" width="200px" height="200px" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" wmode="transparent" menu="false" quality="low" scale="exactfit" />' +
		'</object>';
	
	// create container element
	var div =document.createElement( 'DIV');
	
	// assign class
	div.className ='fileUploader';
	
	// initially move element to the viewport so that firefox and other
	// browser optimizations initialize flash element instantly. When flash
	// will call 'ready' callback, the 'ready' callback with shift flash object
	// out of viewport.
	
	// get scrolling offset
	var scrollTop =document.documentElement.scrollTop;
	var scrollLeft =document.documentElement.scrollLeft;
	
	if( document.body !==undefined) {
		if( scrollTop < document.body.scrollTop)
			scrollTop =document.body.scrollTop;
		if( scrollLeft < document.body.scrollLeft)
			scrollLeft =document.body.scrollLeft;
	}
	
	// apply style
	div.style.position ='fixed';
	div.style.left =scrollLeft +'px';
	div.style.top =scrollTop +'px';
	div.style.width ='200px';
	div.style.height ='200px';
	div.style.overflow ='hidden';
	
	// in some browsers div.style.* applied attributes do not work at current step,
	// so apply style attribute to fix the problem.
	div.setAttribute( 'style',
		'position: fixed;' +
		'left: ' +scrollLeft +'px;' +
		'top: ' +scrollTop +'px;' +
		'width: 200px;' +
		'height: 200px;' +
		'overflow: hidden;');
	
	// assign content html
	div.innerHTML =html;
	
	// when mouse is out the container, unfocus it (bring behind the scenes)
	dependency.bind( div, 'mouseleave', function() {
		if( !api.ready)
			// take no action while flash is not ready
			return;

		// loose button focus
		LooseButton();
	});
	
	// capture all clicks on the target div, avoid event bubbling
	dependency.bind( div, 'click', function(){
		return false;
	});

	// remember movie container element
	movieContainer =document.body.appendChild( div);

	// BUGFIX: see if browser is IE, and if it is, see if flash ready callback
	// has already been received. If it was received and movie object is still
	// unresolved, do it now.
	if( api.ready && IsAgentIE() && movie ===null) {
		// see if movie is defined within window
		if( window[ movieId] ===undefined)
			throw 'window[' +movieId +'] is not defined';

		// get movie element from window object
		movie =window[ movieId];
	}
	
	// create button follower delayed execution
	followerTimer =setInterval( ButtonFollowRoutine, 500);
	
	// bind window on resizing to adjust button positioning
	dependency.bind( window, 'resize', ButtonFollowRoutine);
};

// deinitialize uploader
api.unload =function(){
	if( movieContainer ===null)
		// uploader already shut down
		return;
		
	// see if flash is ready
	if( api.ready) {	
		// notify flash of shutdown
		flash.call.shutdown();
	}
	
	if( followerTimer !==null) {
		// stop follower interval
		clearInterval( followerTimer);
		
		// reset interval
		followerTimer =null;
	}
	
	// remove all buttons
	while( buttons.length >0)
		api.remove( buttons[0].elem);
	
	// remove element from DOM
	movieContainer.parentNode.removeChild( movieContainer);
	
	// remove references
	movie =null;
	movieContainer =null;
	
	// set state to not ready
	api.ready =false;
	
	// remove window resizing callback
	dependency.unbind( window, 'resize', ButtonFollowRoutine);
};

// expose default handlers

// methods to handle flash events externally
api.handlers ={};

// file dialog is opened
api.handlers.dialogOpen =function( buttonId) {
	api.debug( '[FLASH] dialogOpen - button=' +buttonId);
};

// file dialog is closed
api.handlers.dialogClose =function( buttonId, activeUploadCount) {
	api.debug( '[FLASH] dialogClose - button=' +buttonId);
};

// file has been added to queue
api.handlers.fileSelect =function( buttonId, fileId, fileInfo) {
	api.debug( '[FLASH] fileSelect - button=' +buttonId +', file=' +fileId +', name=' +fileInfo.name);
	
	// add file to queue
	return true;
};

// file has been removed from queue
api.handlers.fileRemove =function( fileId, fileInfo) {
	api.debug( '[FLASH] fileRemove - file=' +fileId +', name=' +fileInfo.name);
};

// file upload has been started
api.handlers.fileUploadStart =function( fileId, fileInfo) {
	api.debug( '[FLASH] fileUploadStart - file=' +fileId +', name=' +fileInfo.name);
};

// file is uploading...
api.handlers.fileUploadProgress =function( fileId, fileInfo, bytesLoaded, bytesTotal, percComplete) {
	api.debug( '[FLASH] fileUploadProgress - file=' +fileId +', name=' +fileInfo.name +', bytes=' +bytesLoaded +'/' +bytesTotal +' (' +percComplete +'%)');
};

// file upload transfer rate
api.handlers.fileUploadTransferRate =function( fileId, fileInfo, speed, avgSpeed) {
	api.debug( '[FLASH] fileUploadTransferRate - file=' +fileId +', name=' +fileInfo.name +', speed=' +speed +', average=' +avgSpeed);
};

// file upload has been completed, awaiting server response
api.handlers.fileUploadAwaitingResponse =function( fileId, fileInfo) {
	api.debug( '[FLASH] fileUploadAwaitingResponse - file=' +fileId +', name=' +fileInfo.name);
};

// file upload error encountered
api.handlers.fileUploadError =function( fileId, fileInfo, errorMsg) {
	api.debug( '[FLASH] fileUploadError - file=' +fileId +', name=' +fileInfo.name);
	
	// do not keep failed file in queue
	return false;
};

// file upload was successful
api.handlers.fileUploadSuccess =function( fileId, fileInfo, serverData, filesRemaining) {
	api.debug( '[FLASH] fileUploadSuccess - file=' +fileId +', name=' +fileInfo.name +' (' +(filesRemaining ==0 ? 'no more files' : filesRemaining +' files to go') +'), server response="' +serverData +'"');
};

// file upload has completed
api.handlers.fileUploadComplete =function( fileId, fileInfo, queueSize, removeFromQueue) {
	api.debug( '[FLASH] fileUploadComplete - file=' +fileId +', name=' +fileInfo.name +', removeFromQueue=' +removeFromQueue);
};

// custom public functions

// get readable data volume representation
api.readableVolume =function( bytes) {
	var levels =[ 'B', 'KB', 'MB', 'GB', 'TB'];
	var level =0;
	var maxLevel =levels.length -1;
	var div =1024;
	
	while( bytes > div && level < maxLevel) {
		level++;
		bytes =bytes / div;
	}
	
	// return readable representation
	return bytes.toFixed( 2).toString() +' ' +levels[ level];
};
	
})( window, window, document, window.fileUploaderDependency);