
<h1>File Uploader</h1>

File Uploader is a flash-based file uploader, alternative to SWFUpload. It is robust, fast and easy to use. It is meant to be used on a web pages to replace standard &lt;input type="file" /&gt;.

<b style="color:red;">File Uploader is under development and it's implementation is experimental. No stable release is currently available.</b>

<h2>What makes it great:</h2>

<ul>
  <li>Lighweight, uses one SWF embed for all uploader instances on single page</li>
  <li>Supports multiple file selection and parallel uploading</li>
  <li>Supports multiple uploaders (queues) per page without impact on performance</li>
  <li>Supports per-file POST arguments</li>
  <li>Easy-to-use high level API out of box</li>
  <li>Exports low level API to create custom high level APIs</li>
  <li>Supports automatic upload start</li>
  <li>Designed to support any JavaScript library</li>
  <li>Licensed under <a href="http://www.gnu.org/licenses/gpl-2.0.html">GPL v2</a></li>
</ul>

<h2>With File Uploader you can:</h2>

<ul>
  <li>Select multiple files for uploading</li>
  <li>Upload selected files asynchronously (without submitting the form, just like AJAX works)</li>
  <li>Display upload progress bars or other upload status indicators</li>
  <li>Get file name, size and type, remove unnecessary files from queue before actual upload starts</li>
  <li>Upload files to different URLs concurrently</li>
</ul>

<h2>Installation and usage</h2>

<h3>Step 1 - Make a File Uploader bundle you need</h3>

File Uploader consists of four elements you need to include in your webpage:

<ol>
  <li>Dependent library (such as jQuery, Prototype.js or something else) and it's binding for FileUploader [located in <b>src/js/dep/</b>]</li>
  <li>File Uploader core file [<b>src/js/fileUploader.core.js</b>]</li>
  <li>File Uploader public API file (API you will use to work with uploader) [located in <b>src/js/api/</b>]</li>
  <li>File Uploader SWF file [<b>bin/flash/FileUploader.swf</b>]</li>
</ol>

<h3>Step 2 - Deploy File Uploader on your webserver</h3>

<ol>
  <li>Take the files you collected and deploy them on your webserver</li>
  <li>Make sure <b>fileUploader.core.js</b> is configured correctly and URL of File Uploader SWF file is correct</li>
  <li>Include <b>dependent library JS</b> code, include <b>dependent library File Uploader bindings</b>, include <b>fileUploader.core.js</b> and <b>File Uploader public API</b> file.
  
    Example:
    <pre>
        &lt;!-- dependent library and binding --&gt;
        &lt;script type="text/javascript" src="/src/js/dep/jQuery/jquery-1.3.2.js">&lt;/script&gt;
        &lt;script type="text/javascript" src="/src/js/dep/jQuery/fileUploader.jQuery.js">&lt;/script&gt;
        
        &lt;!-- uploader core file --&gt;
        &lt;script type="text/javascript" src="/src/js/fileUploader.core.js">&lt;/script&gt;
        
        &lt;!-- uploader public API --&gt;
        &lt;script type="text/javascript" src="/src/js/api/fileUploader.Uploader.js"&gt;&lt;/script&gt;
    </pre>
  </li>
</ol>

<h3>Step 3 - Use File Uploader</h3>

<b>To use out of box API, use the following code:</b>

<pre>
  &lt;!-- dependent library and binding --&gt;
  &lt;script type="text/javascript" src="/src/js/dep/jQuery/jquery-1.3.2.js">&lt;/script&gt;
  &lt;script type="text/javascript" src="/src/js/dep/jQuery/fileUploader.jQuery.js">&lt;/script&gt;
  
  &lt;!-- uploader core file --&gt;
  &lt;script type="text/javascript" src="/src/js/fileUploader.core.js">&lt;/script&gt;
  
  &lt;!-- uploader public API --&gt;
  &lt;script type="text/javascript" src="/src/js/api/fileUploader.Uploader.js"&gt;&lt;/script&gt;
</pre>

...

<pre>
  // instantiate uploader
  var uploader =new fileUploader.Uploader({
    // url where to upload the file
    'url': 'http://www.example.com/upload.php',
    // file entry name
    'fileName': 'myFile',
    // POST arguments
    'postArgs': {'action':'upload','galleryId':15},
    '
  });
  
  // configure uploader (optional)
  uploader.concurrency =2;
  uploader.timeout =15;
  
  // listen to events
  
  // handle dialog open
  uploader.onDialogOpen =function() {
    
  };
  
  // handle file selection
  uploader.onSelect =function( id, fileInfo) {
    
  };
  
  // handle file removal
  uploader.onRemove =function( id, fileInfo) {
    
  };
  
  // handle dialog closure
  uploader.onDialogClose =function() {
    
  };
  
  // handle file uploading start
  uploader.onUploadStart =function( id, fileInfo) {
    
  };
  
  // handle file uploading progress
  uploader.onUploadProgress =function( id, fileInfo, bytesLoaded, bytesTotal, percComplete) {
    
  };
  
  // handle file uploading error
  uploader.onUploadError =function( id, fileInfo, errorMsg) {
    
  };
  
  // handle file uploading success
  uploader.onUploadSuccess =function( id, fileInfo, serverData, filesPending) {
    
  };
  
  // handle file uploading completion
  uploader.onUploadComplete =function( id, fileInfo, filesPending, removeFromQueue) {
    
  };
  
  // deploy
  uploader.attach( document.getElementById( 'myButton'));
</pre>

<b>jQuery API:</b>

<pre>
  &lt;!-- dependent library and binding --&gt;
  &lt;script type="text/javascript" src="/src/js/dep/jQuery/jquery-1.3.2.js">&lt;/script&gt;
  &lt;script type="text/javascript" src="/src/js/dep/jQuery/fileUploader.jQuery.js">&lt;/script&gt;
  
  &lt;!-- uploader core file --&gt;
  &lt;script type="text/javascript" src="/src/js/fileUploader.core.js">&lt;/script&gt;
  
  &lt;!-- uploader public API --&gt;
  &lt;script type="text/javascript" src="/src/js/api/fileUploader.Uploader.js"&gt;&lt;/script&gt;
  
  &lt;!-- jQuery public API binding --&gt;
  &lt;script type="text/javascript" src="/src/js/api/jQuery/fileUploader.jQuery.js"&gt;&lt;/script&gt;
</pre>

...

<pre>
  // jQuery-wrapped #myButton
  var $btn =$( '#myButton');
  
  // listen to events
  $btn.bind( 'uploadDialogOpen uploadDialogClose uploadFileSelect uploadFileRemove uploadStart uploadProgress uploadSuccess uploadError uploadComplete', function( e, data){
    switch( e.type) {
      case 'uploadDialogOpen':
        debug( 'Dialog open');
      break;
      case 'uploadDialogClose':
        debug( 'Dialog close');
      break;
      case 'uploadFileSelect':
        debug( 'Select file #' +data.fileId +' - ' +data.fileInfo.name + ' (size=' +data.fileInfo.size +')');
      break;
      case 'uploadFileRemove':
        debug( 'Remove file #' +data.fileId +' - ' +data.fileInfo.name);
      break;
      case 'uploadStart':
        debug( 'Start upload #' +data.fileId +' - ' +data.fileInfo.name);
      break;
      case 'uploadProgress':
        debug( 'Upload progress #' +data.fileId +' - ' +data.fileInfo.name + ' (' +data.percComplete +'%)');
      break;
      case 'uploadSuccess':
        debug( 'Upload success #' +data.fileId +' - ' +data.fileInfo.name);
      break;
      case 'uploadError':
        debug( 'Upload error #' +data.fileId +' - ' +data.fileInfo.name +' (' +data.errorMsg +')');
      break;
      case 'uploadComplete':
        debug( 'Upload complete #' +data.fileId +' - ' +data.fileInfo.name);
      break;
    }
  });
  
  // initialize uploader
  var uploaderObject =$btn.uploader({
    'url': '/test/receive.php'
  });
  
  // optionally configure uploader instance
  //uploaderObject.concurrency =2;
  
  // detach uploader from a button
  //uploaderObject.detach();
</pre>

<h3>Examples</h3>

You can view live debugging test of native API <a href="http://www.stepanov.lv/uploader/test.html">here</a>.
Other tests you can find in /test/ directory of File-Uploader repo.

<h2>Supported browsers</h2>

File Uploader was tested and is working as expected in:

<ul>
  <li>Win32 Flash player 10.0.22+</li>
  <li>Internet Explorer 7</li>
  <li>Internet Explorer 8</li>
  <li>Firefox 3.5.5</li>
  <li>Safari 4.0.4</li>
  <li>Chrome 3.0</li>
  <li>Opera 10.10</li>
</ul>

More info to come...