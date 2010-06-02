
(function( $, fileUploader){
	
var undefined;

// override Uploader prototype
with( fileUploader.Uploader.prototype) {
	
	// handle dialog open
	onDialogOpen =function() {
		$(this.elem).triggerHandler( 'uploadDialogOpen');
	};
	
	// handle file selection
	onSelect =function( id, fileInfo) {
		// reference default upload data
		var returnData ={
			'value': true
		};
		
		// trigger callback
		$(this.elem).triggerHandler( 'uploadFileSelect', {
			'fileId': id,
			'fileInfo': fileInfo,
			'returnData': returnData
		});
		
		// pass return value to native API
		return returnData.value;
	};
	
	// handle file removal
	onRemove =function( id, fileInfo) {
		$(this.elem).triggerHandler( 'uploadFileRemove', {
			'fileId': id,
			'fileInfo': fileInfo
		});
	};
	
	// handle dialog closure
	onDialogClose =function() {
		$(this.elem).triggerHandler( 'uploadDialogClose');
	};
	
	// handle file uploading start
	onUploadStart =function( id, fileInfo) {
		$(this.elem).triggerHandler( 'uploadStart', {
			'fileId': id,
			'fileInfo': fileInfo
		});
	};
	
	// handle file uploading progress
	onUploadProgress =function( id, fileInfo, bytesLoaded, bytesTotal, percComplete) {
		$(this.elem).triggerHandler( 'uploadProgress', {
			'fileId': id,
			'fileInfo': fileInfo,
			'bytesLoaded': bytesLoaded,
			'bytesTotal': bytesTotal,
			'percComplete': percComplete
		});
	};
	
	// handle file uploading transfer rate
	onUploadTransferRate =function( id, fileInfo, speed, avgSpeed) {
		$(this.elem).triggerHandler( 'uploadTransferRate', {
			'fileId': id,
			'fileInfo': fileInfo,
			'speed': speed,
			'avgSpeed': avgSpeed
		});
	};
	
	// handle file uploading completion, enter server response awaiting state
	onUploadAwaitingResponse =function( id, fileInfo) {
		$(this.elem).triggerHandler( 'uploadWaitResponse', {
			'fileId': id,
			'fileInfo': fileInfo
		});
	};
	
	// handle file uploading error
	onUploadError =function( id, fileInfo, errorMsg) {
		$(this.elem).triggerHandler( 'uploadError', {
			'fileId': id,
			'fileInfo': fileInfo,
			'errorMsg': errorMsg
		});
	};
	
	// handle file uploading success
	onUploadSuccess =function( id, fileInfo, serverData, filesRemaining) {
		$(this.elem).triggerHandler( 'uploadSuccess', {
			'fileId': id,
			'fileInfo': fileInfo,
			'serverData': serverData,
			'filesRemaining': filesRemaining
		});
	};
	
	// handle file uploading completion
	onUploadComplete =function( id, fileInfo, filesPending, removeFromQueue) {
		$(this.elem).triggerHandler( 'uploadComplete', {
			'fileId': id,
			'fileInfo': fileInfo,
			'filesPending': filesPending,
			'removeFromQueue': removeFromQueue
		});
	};
}
	
// expose jQuery function to instantiate uploader instances
$.fn.uploader =function( defaultUploadData) {
	if( this.size() !=1)
		throw 'You can initialize one uploader button at a time';
		
	// get element reference
	var elem =this.get(0);
	
	// return uploader instance
	var uploader =new fileUploader.Uploader( defaultUploadData);
	
	// attach uploader
	uploader.attach( elem);
	
	// return uploader instance
	return uploader;
};
	
})( jQuery, window.fileUploader);