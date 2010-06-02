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

(function( lib, namespace, fileUploader){
  
// declare namespace
var api =lib.namespace( namespace), undefined;

// override Uploader prototype
with( fileUploader.Uploader.prototype) {
	
	// handle dialog open
  onDialogOpen =function() {
  	lib.event.trigger( this.elem, 'uploadDialogOpen');
  };
  
  // handle file selection
  onSelect =function( id, fileInfo) {
    // reference default upload data
    var returnData ={
      'value': true
    };
    
    lib.event.trigger( this.elem, 'uploadFileSelect', {
      'fileId': id,
      'fileInfo': fileInfo,
      'returnData': returnData
    });
    
    // pass return value to native API
    return returnData.value;
  };
  
  // handle file removal
  onRemove =function( id, fileInfo) {
  	lib.event.trigger( this.elem, 'uploadFileRemove', {
      'fileId': id,
      'fileInfo': fileInfo
    });
  };
  
  // handle dialog closure
  onDialogClose =function() {
  	lib.event.trigger( this.elem, 'uploadDialogClose');
  };
  
  // handle file uploading start
  onUploadStart =function( id, fileInfo) {
  	lib.event.trigger( this.elem, 'uploadStart', {
      'fileId': id,
      'fileInfo': fileInfo
    });
  };
  
  // handle file uploading progress
  onUploadProgress =function( id, fileInfo, bytesLoaded, bytesTotal, percComplete) {
  	lib.event.trigger( this.elem, 'uploadProgress', {
      'fileId': id,
      'fileInfo': fileInfo,
      'bytesLoaded': bytesLoaded,
      'bytesTotal': bytesTotal,
      'percComplete': percComplete
    });
  };
  
  // handle file uploading transfer rate
  onUploadTransferRate =function( id, fileInfo, speed, avgSpeed) {
  	lib.event.trigger( this.elem, 'uploadTransferRate', {
      'fileId': id,
      'fileInfo': fileInfo,
      'speed': speed,
      'avgSpeed': avgSpeed
    });
  };
  
  // handle file uploading completion, enter server response awaiting state
  onUploadAwaitingResponse =function( id, fileInfo) {
    lib.event.trigger( this.elem, 'uploadWaitResponse', {
      'fileId': id,
      'fileInfo': fileInfo
    });
  };
  
  // handle file uploading error
  onUploadError =function( id, fileInfo, errorMsg) {
    lib.event.trigger( this.elem, 'uploadError', {
      'fileId': id,
      'fileInfo': fileInfo,
      'errorMsg': errorMsg
    });
  };
  
  // handle file uploading success
  onUploadSuccess =function( id, fileInfo, serverData, filesRemaining) {
  	lib.event.trigger( this.elem, 'uploadSuccess', {
      'fileId': id,
      'fileInfo': fileInfo,
      'serverData': serverData,
      'filesRemaining': filesRemaining
    });
  };
  
  // handle file uploading completion
  onUploadComplete =function( id, fileInfo, filesPending, removeFromQueue) {
  	lib.event.trigger( this.elem, 'uploadComplete', {
      'fileId': id,
      'fileInfo': fileInfo,
      'filesPending': filesPending,
      'removeFromQueue': removeFromQueue
    });
  };
}

// initialize uploader instance for target element
api.attach =function( elem, defaultUploadData) {
	// return uploader instance
  var uploader =new fileUploader.Uploader( defaultUploadData);
  
  // attach uploader
  uploader.attach( elem);
  
  // return uploader instance
  return uploader;
};

})( EVOLIB_EXPORT, 'uploader', window.fileUploader);