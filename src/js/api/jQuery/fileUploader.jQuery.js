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

(function( $, fileUploader){
  
var undefined;

// override Uploader prototype
// handle dialog open
with( fileUploader.Uploader.prototype) {
  onDialogOpen =function() {
    $(this.elem).trigger( 'uploadDialogOpen');
  };
  
  // handle file selection
  onSelect =function( id, fileInfo) {
    // reference default upload data
    var returnData ={
      'value': true
    };
    
    // trigger callback
    $(this.elem).trigger( 'uploadFileSelect', {
      'fileId': id,
      'fileInfo': fileInfo,
      'returnData': returnData
    });
    
    // pass return value to native API
    return returnData.value;
  };
  
  // handle file removal
  onRemove =function( id, fileInfo) {
    $(this.elem).trigger( 'uploadFileRemove', {
      'fileId': id,
      'fileInfo': fileInfo
    });
  };
  
  // handle dialog closure
  onDialogClose =function() {
    $(this.elem).trigger( 'uploadDialogClose');
  };
  
  // handle file uploading start
  onUploadStart =function( id, fileInfo) {
    $(this.elem).trigger( 'uploadStart', {
      'fileId': id,
      'fileInfo': fileInfo
    });
  };
  
  // handle file uploading progress
  onUploadProgress =function( id, fileInfo, bytesLoaded, bytesTotal, percComplete) {
    $(this.elem).trigger( 'uploadProgress', {
      'fileId': id,
      'fileInfo': fileInfo,
      'bytesLoaded': bytesLoaded,
      'bytesTotal': bytesTotal,
      'percComplete': percComplete
    });
  };
  
  // handle file uploading transfer rate
  onUploadTransferRate =function( id, fileInfo, speed, avgSpeed) {
    $(this.elem).trigger( 'uploadTransferRate', {
      'fileId': id,
      'fileInfo': fileInfo,
      'speed': speed,
      'avgSpeed': avgSpeed
    });
  };
  
  // handle file uploading completion, enter server response awaiting state
  onUploadAwaitingResponse =function( id, fileInfo) {
    $(this.elem).trigger( 'uploadWaitResponse', {
      'fileId': id,
      'fileInfo': fileInfo
    });
  };
  
  // handle file uploading error
  onUploadError =function( id, fileInfo, errorMsg) {
    $(this.elem).trigger( 'uploadError', {
      'fileId': id,
      'fileInfo': fileInfo,
      'errorMsg': errorMsg
    });
  };
  
  // handle file uploading success
  onUploadSuccess =function( id, fileInfo, serverData, filesRemaining) {
    $(this.elem).trigger( 'uploadSuccess', {
      'fileId': id,
      'fileInfo': fileInfo,
      'filesRemaining': filesRemaining
    });
  };
  
  // handle file uploading completion
  onUploadComplete =function( id, fileInfo, filesPending, removeFromQueue) {
    $(this.elem).trigger( 'uploadComplete', {
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