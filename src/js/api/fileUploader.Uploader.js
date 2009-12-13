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

(function( api, fileUploader){
  
var undefined;
  
// button and object association
var buttons ={};

// file and button association
var files ={};

// get Uploader object by button id
function GetObjectByButtonId( buttonId) {
  if( buttons[ buttonId] ===undefined)
    throw 'Button #' +buttonId +' not found';
    
  // return Uploader object
  return buttons[ buttonId];
};

// get button id by file id
function GetButtonIdByFileId( fileId) {
  if( files[ fileId] ===undefined)
    throw 'File #' +fileId +' not found';
    
  // return button id
  return files[ fileId];
};

// begin or continue uploading process
function BeginOrContinueUploading( uploader) {
  // get uploader
  var activeUploads =uploader.getActiveUploadCount();
  
  // see if concurrency is exceeded
  if( activeUploads >= uploader.concurrency)
    // don't do anything
    return;
    
  // seek for files to upload
  var uploadCount =uploader.concurrency -activeUploads;
  var k;
  var file;
  
  for( k in uploader.queue) {
    file =uploader.queue[ k];
    
    // see if file is pending for upload
    if( file.state !=api.Uploader.STATE_PENDING)
      continue;
      
    // see if file has to be uploaded
    if( !file.upload)
      continue;
      
    // change file state
    file.state =api.Uploader.STATE_UPLOADING;
      
    // upload that file
    fileUploader.call.startUpload( k, file.url, file.fileName, file.postArgs, file.expectResponse, uploader.timeout);
    
    // see if more files can be uploaded
    if( --uploadCount ==0)
      break;
  }
};

// check file uploading data
function CheckUploadData( uploadData) {
  // check if required fields are present
  if( uploadData.url ===undefined)
    throw 'url is not defined';
    
  // check if optional fields are present
  if( uploadData.fileName ===undefined)
    uploadData.fileName ='file';
  if( uploadData.postArgs ===undefined)
    uploadData.postArgs ={};
  if( uploadData.expectResponse ===undefined)
    uploadData.expectResponse =false;
};
  
// file dialog is opened
fileUploader.handlers.dialogOpen =function( buttonId) {
  api.debug( '[FLASH] dialogOpen - button=' +buttonId);
  
  var uploader =GetObjectByButtonId( buttonId);
  
  // execute callback
  uploader.onDialogOpen();
};

// file dialog is closed
fileUploader.handlers.dialogClose =function( buttonId, activeUploadCount) {
  api.debug( '[FLASH] dialogClose - button=' +buttonId);
  
  var uploader =GetObjectByButtonId( buttonId);
  var k;
  var file;
  
  // execute callback
  uploader.onDialogClose();
  
  // begin uploading process
  BeginOrContinueUploading( uploader);
};

// file has been added to queue
fileUploader.handlers.fileSelect =function( buttonId, fileId, fileInfo) {
  api.debug( '[FLASH] fileSelect - button=' +buttonId +', file=' +fileId +', name=' +fileInfo.name);
  
  var uploader =GetObjectByButtonId( buttonId);
  
  // get custom upload data
  var uploadData =uploader.onSelect( fileId, fileInfo);
  
  // check if any value is returned
  if( uploadData ===undefined)
    uploadData =true;
  
  // see if returned value is false
  if( uploadData ===false) {
    // do not add file to queue
    return false;
  }
  
  // see if upload data was set during event handling
  if( typeof uploadData =='object') {
    // use specified upload data
    CheckUploadData( uploadData);
    
  } else {
    // use default upload data
    uploadData =uploader.uploadData;
  }

  // add file to queue
  uploader.queue[ fileId] ={
    'state': api.Uploader.STATE_PENDING,
    'upload': uploader.autoStart,
    'url': uploadData.url,
    'fileName': uploadData.fileName,
    'postArgs': uploadData.postArgs,
    'expectResponse': uploadData.expectResponse
  };
  
  // associate file with button
  files[ fileId] =buttonId;
  
  // add file to queue
  return true;
};

// file has been removed from queue
fileUploader.handlers.fileRemove =function( fileId, fileInfo) {
  api.debug( '[FLASH] fileRemove - file=' +fileId +', name=' +fileInfo.name);
  
  var uploader =GetObjectByButtonId( GetButtonIdByFileId( fileId));
  
  // execute callback
  uploader.onRemove( fileId, fileInfo);
  
  // remove file from queue
  delete uploader.queue[ fileId];
  
  // remove file -> button association
  delete files[ fileId];
  
  // begin or continue uploading
  BeginOrContinueUploading( uploader);
};

// file upload has been started
fileUploader.handlers.fileUploadStart =function( fileId, fileInfo) {
  api.debug( '[FLASH] fileUploadStart - file=' +fileId +', name=' +fileInfo.name);
  
  var uploader =GetObjectByButtonId( GetButtonIdByFileId( fileId));
  
  // execute callback
  uploader.onUploadStart( fileId, fileInfo);
};

// file is uploading...
fileUploader.handlers.fileUploadProgress =function( fileId, fileInfo, bytesLoaded, bytesTotal, percComplete) {
  api.debug( '[FLASH] fileUploadProgress - file=' +fileId +', name=' +fileInfo.name +', bytes=' +bytesLoaded +'/' +bytesTotal +' (' +percComplete +'%)');
  
  var uploader =GetObjectByButtonId( GetButtonIdByFileId( fileId));
  
  // execute callback
  uploader.onUploadProgress( fileId, fileInfo, bytesLoaded, bytesTotal, percComplete);
};

// file upload error encountered
fileUploader.handlers.fileUploadError =function( fileId, fileInfo, errorMsg) {
  api.debug( '[FLASH] fileUploadError - file=' +fileId +', name=' +fileInfo.name);
  
  var uploader =GetObjectByButtonId( GetButtonIdByFileId( fileId));
  
  // execute callback
  uploader.onUploadError( fileId, fileInfo, errorMsg);
};

// file upload was successful
fileUploader.handlers.fileUploadSuccess =function( fileId, fileInfo, serverData, filesRemaining) {
  api.debug( '[FLASH] fileUploadSuccess - file=' +fileId +', name=' +fileInfo.name +' (' +(filesRemaining ==0 ? 'no more files' : filesRemaining +' files to go') +'), server response="' +serverData +'"');
  
  var uploader =GetObjectByButtonId( GetButtonIdByFileId( fileId));
  
  // execute callback
  uploader.onUploadSuccess( fileId, fileInfo, serverData, filesRemaining);
};

// file upload has completed
fileUploader.handlers.fileUploadComplete =function( fileId, fileInfo, queueSize, removeFromQueue) {
  api.debug( '[FLASH] fileUploadComplete - file=' +fileId +', name=' +fileInfo.name +', removeFromQueue=' +removeFromQueue);

  var uploader =GetObjectByButtonId( GetButtonIdByFileId( fileId));
  var file =uploader.queue[ fileId];
  
  // execute callback
  uploader.onUploadComplete( fileId, fileInfo, queueSize, removeFromQueue);
  
  // change file purpose for uploading
  file.upload =false;
  
  // change file state
  file.state =api.Uploader.STATE_PENDING;
  
  // continue uploading
  BeginOrContinueUploading( uploader);
};
  
// expose API

// constructor
api.Uploader =function( defaultUploadData){
  if( defaultUploadData ===undefined)
    throw 'No upload information specified';
    
  // check provided default upload data
  CheckUploadData( defaultUploadData);
  
  // instantiate new object for holding queued files
  this.queue ={};
  
  // store upload data
  this.uploadData =defaultUploadData;
};

// constants

// uploading states
api.Uploader.STATE_PENDING =0;
api.Uploader.STATE_UPLOADING =1;

with( api.Uploader) {
  
  // properties
  prototype.elem =null;
  
  // button id
  prototype.buttonId =null;
  
  // uploading concurrency
  prototype.concurrency =2;
  
  // file uploading timeout
  prototype.timeout =null;
  
  // assigned at construction
  prototype.queue =null;
  
  // default upload data : assigned at construction
  prototype.uploadData =null;
  
  // start uploading automatically
  prototype.autoStart =true;
  
  // file filter
  prototype.fileFilter ='*.*';
  
  // file filter name
  prototype.fileFilterName ='All Files';
  
  // allow selection of multiple files
  prototype.multi =true;
  
  // attach a button to element
  prototype.attach =function( elem){
    // register button
    var buttonId =this.buttonId =fileUploader.create( elem, {
      'fileFilter': this.fileFilter,
      'fileFilterName': this.fileFilterName,
      'multi': this.multi
    });
    
    // store element's reference
    this.elem =elem;
    
    // create button-wise reference
    buttons[buttonId] =this;
  };

  // destructor
  prototype.detach =function() {
    // remove all files from queue
    for( var id in this.queue)
      fileUploader.call.removeFile( id);
      
    // at this step queue should be empty
    
    // unregister button
    fileUploader.remove( this.elem);
    
    // delete button entry
    delete buttons[ this.buttonId];
    
    // reset properties
    this.buttonId =null;
  };
  
  // update assigned settings
  prototype.update =function() {
    // set button settings
    fileUploader.update( this.buttonId, {
      'fileFilter': this.fileFilter,
      'fileFilterName': this.fileFilterName,
      'multi': this.multi
    });
  };
  
  // get current file queue
  prototype.getQueue =function() {
    return fileUploader.call.getQueue( this.buttonId);
  };
  
  // get current file queue size
  prototype.getQueueSize =function() {
    return fileUploader.call.getQueueSize( this.buttonId);
  };
  
  // get active upload count
  prototype.getActiveUploadCount =function() {
    var ret =0;
    for( var k in this.queue) {
      if( this.queue[k].state ==api.Uploader.STATE_UPLOADING)
        ++ret;
    }
    // return count
    return ret;
  };
  
  // allow file uploading
  prototype.upload =function( fileId) {
    if( this.queue[ fileId] ===undefined)
      throw 'File #' +fileId +' not found';
      
    var file =this.queue[ fileId];
    
    // check file state
    if( file.state !=api.Uploader.STATE_PENDING)
      throw 'File #' +fileId +' is already uploading';
    
    // store passed in attributes
    file.upload =true;
    
    // continue uploading process
    BeginOrContinueUploading( GetObjectByButtonId( GetButtonIdByFileId( fileId)));
  };
  
  // stop file uploading
  prototype.stop =function( fileId) {
    if( this.queue[ fileId] ===undefined)
      throw 'File #' +fileId +' not found';
      
    var file =this.queue[ fileId];
    
    // mark file as not for uploading
    file.upload =false;
    
    // see what's the state of file
    if( file.state ==api.Uploader.STATE_UPLOADING)
      // stop uploading
      fileUploader.call.stopUpload( fileId);
  };
  
  // remove file from queue
  prototype.remove =function( fileId) {
    if( this.queue[ fileId] ===undefined)
      throw 'File #' +fileId +' not found';
      
    // remove file
    fileUploader.call.removeFile( fileId);
  };
  
  // These event handlers should be overridden by user in order to
  // handle uploading events.
  
  // handle dialog open
  prototype.onDialogOpen =function() {
    
  };
  
  // handle file selection
  prototype.onSelect =function( id, fileInfo) {
    
  };
  
  // handle file removal
  prototype.onRemove =function( id, fileInfo) {
    
  };
  
  // handle dialog closure
  prototype.onDialogClose =function() {
    
  };
  
  // handle file uploading start
  prototype.onUploadStart =function( id, fileInfo) {
    
  };
  
  // handle file uploading progress
  prototype.onUploadProgress =function( id, fileInfo, bytesLoaded, bytesTotal, percComplete) {
    
  };
  
  // handle file uploading error
  prototype.onUploadError =function( id, fileInfo, errorMsg) {
    
  };
  
  // handle file uploading success
  prototype.onUploadSuccess =function( id, fileInfo, serverData, filesRemaining) {
    
  };
  
  // handle file uploading completion
  prototype.onUploadComplete =function( id, fileInfo, filesPending, removeFromQueue) {
    
  };
}

})( fileUploader, fileUploader);