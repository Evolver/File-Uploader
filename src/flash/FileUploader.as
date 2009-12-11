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

package {
	
	import evolver.external.JavaScript;
	import evolver.Debug;
	import flash.display.Stage;
	import flash.display.LoaderInfo;
	import flash.net.FileReference;
	import flash.net.FileReferenceList;
	import flash.net.FileFilter;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.DataEvent;
	import flash.events.TimerEvent;
	import flash.errors.IllegalOperationError;
	import flash.errors.MemoryError;
	import flash.utils.Timer;
	
	public class FileUploader {
		
		// file uploading states
		public static var STATE_PENDING:uint =0;
		public static var STATE_UPLOADING:uint =1;
		
		// flash object id
		var elementId:String;
		
		// bridge function in javascript
		var bridgeFn:String;
		
		// file queue
		var queue:Object ={};
		
		// file id generator offset
		var idOffset:uint =0;
		
		// single file reference
		var singleFile:FileReference =new FileReference();
		
		// multiple file reference
		var multipleFiles:FileReferenceList =new FileReferenceList();
		
		// settings
		var settings:Object ={
			// select multiple or single file
			'multi': false,
			// file filter mask
			'fileFilter': '*.*',
			// file filter mask name
			'fileFilterName': 'All Files',
			// button id - initially not set
			'buttonId': null
		};
	
		// constructor
		public function FileUploader( elementId:String, bridgeFn:String) {
			Debug.write( 'FileUploader::FileUploader()');
			
			// assign settings
			this.elementId =elementId;
			this.bridgeFn =bridgeFn;
			
			// bind callbacks
			JavaScript.bind( 'removeFile', this.removeFile);
			JavaScript.bind( 'getFile', this.getFile);
			JavaScript.bind( 'getQueue', this.getQueue);
			JavaScript.bind( 'getQueueSize', this.getQueueSize);
			JavaScript.bind( 'startUpload', this.startUpload);
			JavaScript.bind( 'stopUpload', this.stopUpload);
			JavaScript.bind( 'stopAllUploads', this.stopAllUploads);
			JavaScript.bind( 'clearQueue', this.clearQueue);
			JavaScript.bind( 'setSettings', this.setSettings);
			JavaScript.bind( 'getActiveUploadCount', this.getActiveUploadCount);
			JavaScript.bind( 'shutdown', this.shutdown);
			
			// create reference to current object
			var self:FileUploader =this;
			
			// bind select event handler
			this.singleFile.addEventListener( Event.SELECT, function(){
				Debug.write( '[EVENT] singleFile: SELECT');
				
				// add file to queue
				self.addFile( self.singleFile);
				
				// notify of dialog closure
				self.fileDialogClosed();
			});
			
			// bind close handlers
			this.singleFile.addEventListener( Event.CANCEL, function(){
				Debug.write( '[EVENT] singleFile: CANCEL');
				
				// window closed
				self.fileDialogClosed();
			});
			
			// bind select event handler
			this.multipleFiles.addEventListener( Event.SELECT, function(){
				Debug.write( '[EVENT] multipleFiles: SELECT');
				
				// iterate selected files and add them to queue
				with( self.multipleFiles) {
					for( var i =0; i < fileList.length; ++i)
						self.addFile( fileList[ i]);
				}
				
				// notify of dialog closure
				self.fileDialogClosed();
			});
			
			// bind close handlers
			this.multipleFiles.addEventListener( Event.CANCEL, function(){
				Debug.write( '[EVENT] multipleFiles: CANCEL');
				
				// window closed
				self.fileDialogClosed();
			});
			
			// call bridge method to notify of flash ready state
			this.callExternal( 'ready');
		}
		
		// opens file selection dialog
		public function selectFiles() {
			Debug.write( 'FileUploader::selectFile()');
			
			try {
				// create file filter
				var filter:FileFilter =new FileFilter( this.settings.fileFilterName, this.settings.fileFilter);
				
				// try browsing file (this fails if the method is called not
				// within user interaction event.
				if( this.settings.multi)
					this.multipleFiles.browse([ filter]);
				else
					this.singleFile.browse([ filter]);
				
				// file dialog was opened
				this.fileDialogOpened();
				
			} catch( e) {
				// notify of exception
				Debug.write( 'Exception during FileUploader::selectFile() : ' + e.toString());
			}
		}
		
		// file dialog is opened
		public function fileDialogOpened() {
			this.callExternal( 'dialogOpen', this.settings.buttonId);
		}
		
		// file dialog is closed
		public function fileDialogClosed() {
			this.callExternal( 'dialogClose', this.settings.buttonId, this.getActiveUploadCount());
		}
		
		// allocate file id
		protected function allocFileId():uint {
			Debug.write( 'FileUploader::allocFileId()');
			
			return this.idOffset++;
		}
		
		// add file from file reference object
		protected function addFile( ref:FileReference):uint {
			Debug.write( 'FileUploader::addFile()');
			
			var id =this.allocFileId();
			var info:Object;
			var self =this;
			
			// get current settings
			var buttonId =this.settings.buttonId;
			
			// add file to queue
			this.queue[ id] =info ={
				'progress': 0,
				'state': FileUploader.STATE_PENDING,
				'ref': ref,
				'expectResponse': true,
				'responseTimeout': null,
				'timeoutTimer': null
			};
			
			// notify of file addition
			this.callExternal( 'fileSelect', buttonId, id, this.getFileInfoFromRef( ref));
			
			// add event listeners to the file reference object
			
			// uploading started
			ref.addEventListener( Event.OPEN, function( e:Event){
				Debug.write( '[EVENT] file - Event.OPEN');
				Debug.assert( self.queue[ id] !==undefined);
				
				// reference entry
				var entry =self.queue[ id];
				
				// notify of uploading start
				self.callExternal( 'fileUploadStart', id, self.getFileInfoFromRef( ref));
				
				Debug.write( 'Uploading file #' +id +' (' +entry.ref.name +'), expectResponse=' +entry.expectResponse +', responseTimeout=' +entry.responseTimeout);
					
				// initiate timeout timer if requested
				if( entry.responseTimeout !==null) {
					var t:Timer =new Timer( entry.responseTimeout *1000, 1);
					
					// create event listener to act accordingly on timeout
					t.addEventListener( TimerEvent.TIMER_COMPLETE, function(){
						Debug.write( '[EVENT] file - TimerEvent.TIMER_COMPLETE (timeout)');
						
						// stop uploading process
						ref.cancel();
						
						// notify of error
						uploadErrorFn( 'Response awaiting timeout');
						uploadCompleteFn( false);
					});
					
					// assign timer to entry
					entry.timeoutTimer =t;
					
					// start timer
					t.start();
				}
			});
			
			// uploading completed
			var uploadCompleteFn:Function =function( removeFromQueue:Boolean){
				// make sure file is within queue
				Debug.assert( self.queue[id] !==undefined);
				
				// reference entry
				var entry =self.queue[id];
				
				// remove timer
				if( entry.timeoutTimer !==null) {
					entry.timeoutTimer.stop();
					entry.timeoutTimer =null;
				}
				
				// notify of upload completion
				self.callExternal( 'fileUploadComplete', id, self.getFileInfoFromRef( ref), self.getQueueSize(), removeFromQueue);
				
				// update file status
				entry.state =FileUploader.STATE_PENDING;
				
				if( removeFromQueue)
					// remove file from queue
					self.removeFile( id);
			};
			
			// uploading progress...
			ref.addEventListener( ProgressEvent.PROGRESS, function( e:ProgressEvent){
				Debug.write( '[EVENT] file - ProgressEvent.PROGRESS');
				
				self.callExternal( 'fileUploadProgress', id, self.getFileInfoFromRef( ref), e.bytesLoaded, e.bytesTotal, int(( e.bytesLoaded / e.bytesTotal) *100));
			});
			
			// uploading succeeded
			var uploadSuccessFn:Function =function( serverData) {
				Debug.assert( self.queue[ id] !==undefined);
				
				// reference file
				var file =self.queue[ id];
				
				// notify of event
				self.callExternal( 'fileUploadSuccess', id, self.getFileInfoFromRef( ref), serverData, self.getQueueSize() -1);
			};
	
			ref.addEventListener( Event.COMPLETE, function( e:Event){
				Debug.write( '[EVENT] file - Event.COMPLETE');
				Debug.assert( self.queue[ id] !==undefined);
				
				// reference entry
				var entry =self.queue[ id];

				if( !entry.expectResponse) {
					// call if response is not being expected
					uploadSuccessFn( null);
					uploadCompleteFn( true);
				}
			});
			ref.addEventListener( DataEvent.UPLOAD_COMPLETE_DATA, function( e:DataEvent){
				Debug.write( '[EVENT] file - DataEvent.UPLOAD_COMPLETE_DATA');
				
				// see if object has already been removed from queue
				if( self.queue[ id] ===undefined)
					return;
				
				// see if response was expected
				if( self.queue[ id].expectResponse) {
					// call only if response is being expected
					uploadSuccessFn( e.data);
					uploadCompleteFn( true);
				}
			});
			
			// uploading error
			var uploadErrorFn:Function =function( msg:String){
				self.callExternal( 'fileUploadError', id, self.getFileInfoFromRef( ref), msg);
			};
			
			ref.addEventListener( SecurityErrorEvent.SECURITY_ERROR, function( e:SecurityErrorEvent){
				Debug.write( '[EVENT] file - SecurityErrorEvent.SECURITY_ERROR');
				
				uploadErrorFn( 'Security violation: ' +e.text);
				uploadCompleteFn( false);
			});
			ref.addEventListener( IOErrorEvent.IO_ERROR, function( e:IOErrorEvent){
				Debug.write( '[EVENT] file - IOErrorEvent.IO_ERROR');
				
				uploadErrorFn( 'I/O error: ' +e.text);
				uploadCompleteFn( false);
			});
			
			// return file id
			return id;
		}
		
		// remove file by id
		public function removeFile( i:uint) {
			Debug.write( 'FileUploader::removeFile()');
			Debug.assert( this.queue[ i] !==undefined);
			
			if( this.queue[ i].state ==FileUploader.STATE_UPLOADING)
				// stop uploading target file because file is being removed from queue
				this.stopUpload( i);
				
			// notify of file removal
			this.callExternal( 'fileRemove', i, this.getFileInfoFromRef( this.queue[i].ref));
			
			// delete file from queue
			delete this.queue[i];
		}
		
		// get file information from file reference object
		protected function getFileInfoFromRef( ref:FileReference):Object {
			return {
				'name': ref.name,
				'size': ref.size,
				'type': ref.type
			};
		}
		
		// get file by index
		public function getFile( i:uint):Object {
			Debug.write( 'FileUploader::getFile()');
			Debug.assert( this.queue[ i] !==undefined);
			
			// return object by index
			return this.getFileInfoFromRef( this.queue[ i].ref);
		}
		
		// get queue
		public function getQueue( buttonId =null):Object {
			Debug.write( 'FileUploader::getQueue()');
			
			// return data
			var ret:Object ={};
			var k;
			
			// iterate queue
			if( buttonId ===null) {
				// get whole queue
				for( k in this.queue)
					ret[k] =this.getFileInfoFromRef( this.queue[k].ref);
					
			} else {
				// get queue for specified button id
				var entry;
				for( k in this.queue) {
					entry =this.queue[ k];
					if( entry.settings.buttonId ==buttonId)
						ret[k] =this.getFileInfoFromRef( entry.ref);
				}
			}
				
			// return formatted queue
			return ret;
		}
		
		// get queue size
		public function getQueueSize( buttonId =null):uint {
			Debug.write( 'FileUploader::getQueueSize()');
			
			// return data
			var ret:uint =0;
			var k;
			
			// iterate queue
			if( buttonId ===null) {
				// get whole queue size
				for( k in this.queue)
					++ret;
					
			} else {
				// get queue size for specified button id
				for( k in this.queue) {
					if( this.queue[ k].settings.buttonId ==buttonId)
						++ret;
				}
			}
				
			// return queue size
			return ret;
		}
		
		// start uploading specified file in queue
		public function startUpload( i:*, url:String, fileName:String, postVars =null, expectResponse =true, responseTimeout =null):Boolean {
			Debug.write( 'FileUploader::startUpload()');
			
			if( postVars ===null)
				postVars ={};
			
			// iteration key
			var k;
			
			// see if file id has been passed
			if( i ===null) {
				// get first file in queue that is not being
				// currently uploaded
				for( k in this.queue) {
					if( this.queue[k].state ==FileUploader.STATE_PENDING) {
						i =k;
						break;
					}
				}
				
				// see if queue was empty
				if( i ===null)
					throw new Error( 'No files for uploading');
					
			} else {
				// use passed in id
				i =uint( i);
				
				// make sure passed id is valid and file is not already being uploaded
				if( this.queue[i] ===undefined)
					throw new Error( 'Invalid file id');
				if( this.queue[i].state ==FileUploader.STATE_UPLOADING)
					throw new Error( 'File is already being uploaded');
			}
			
			// create url variables
			var vars:URLVariables =new URLVariables();
			// assign URL variables
			for( k in postVars)
				vars[k] =postVars[k];
			
			// start uploading file
			var req:URLRequest =new URLRequest();
			req.method ='POST';
			req.data =vars;
			req.url =url;
			
			var entry:Object =this.queue[i];
			// mark file as being uploaded
			entry.state =FileUploader.STATE_UPLOADING;
			
			// reference file reference object
			var file:FileReference =entry.ref;
			
			// assign response expectation flag
			entry.expectResponse =expectResponse;
			entry.responseTimeout =responseTimeout;
			
			try {
				// start file uploading process
				file.upload( req, fileName);
				
			} catch( e:SecurityError) {
				Debug.write( 'Security error: ' +e.toString());
				return false;
				
			} catch( e:IllegalOperationError) {
				Debug.write( 'Illegal operation error: ' +e.toString());
				return false;
				
			} catch( e:ArgumentError) {
				Debug.write( 'Argument error: ' +e.toString());
				return false;
				
			} catch( e:MemoryError) {
				Debug.write( 'Memory error: ' +e.toString());
				return false;
				
			} catch( e:Error) {
				Debug.write( 'Error: ' +e.toString());
				return false;
			}
			
			// uploading started
			return true;
		}
		
		// cancel uploading current file
		public function stopUpload( i:uint) {
			Debug.write( 'FileUploader::stopUpload()');
			Debug.assert( this.queue[i] !==undefined);
			Debug.assert( this.queue[i].state ==FileUploader.STATE_UPLOADING);
			
			var file:Object =this.queue[i];
			
			// cancel upload
			file.ref.cancel();
			
			// fire a uploading error
			var error:IOErrorEvent =new IOErrorEvent( IOErrorEvent.IO_ERROR);
			error.text ='File uploading canceled';
			file.ref.dispatchEvent( error);
		}
		
		// stop all file uploading
		public function stopAllUploads() {
			Debug.write( 'FileUploader::stopAllUploads()');
			
			// stop uploading all files
			var file:Object;
			
			for( var i in this.queue) {
				// reference file
				file =this.queue[i];
				
				if( file.state ==FileUploader.STATE_UPLOADING)
					// stop uploading file
					this.stopUpload( i);
			}
		}
		
		// clear queue
		public function clearQueue() {
			Debug.write( 'FileUploader::clearQueue()');
			
			// stop uploading all files
			this.stopAllUploads();
			
			// clear queue
			this.queue ={};
		}
		
		// set single uploader setting
		protected function setSetting( setting:String, value:*) {
			Debug.write( 'FileUploader::setSetting() : ' +setting +'=' +value.toString());
			
			switch( setting) {
				case 'multi':
					this.settings.multi =Boolean( value);
				break;
				case 'fileFilter':
					this.settings.fileFilter =String( value);
				break;
				case 'fileFilterName':
					this.settings.fileFilterName =String( value);
				break;
				case 'buttonId':
					this.settings.buttonId =String( value);
				break;
				default:
					// invalid setting
					Debug.write( 'FileUploader::setSetting() : invalid setting ' +setting);
				break;
			}
		}
		
		// change uploader settings
		public function setSettings( settings:Object) {
			Debug.write( 'FileUploader::setSettings()');
			
			// iterate settings
			for( var k in settings) {
				this.setSetting( k, settings[k]);
			}
		}
		
		// check if file upload is active
		public function getActiveUploadCount():uint {
			// see if there is upload active
			var ret:uint =0;
			for( var i in this.queue) {
				if( this.queue[i].state ==FileUploader.STATE_UPLOADING)
					++i;
			}
			
			// return active upload count
			return i;
		}
		
		// prepare for shutting down of flash env.
		public function shutdown() {
			Debug.write( 'FileUploader::shutdown()');
		}
		
		// call external interface function
		protected function callExternal( methodName, ... args):* {
			// call javascript external interface
			try {
				return JavaScript.call( bridgeFn, this.elementId, methodName, args);
			} catch( e) {
				Debug.write( 'Exception during invocation of ' +methodName +'() : ' +e.toString());
			}
		}

	
	}
	
}