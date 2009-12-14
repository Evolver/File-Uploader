<?php
// Author: Dmitry Stepanov <dmitrij@stepanov.lv>
// http://www.stepanov.lv
// Mon Dec 14 10:02:20 GMT 2009 10:02:20 build.php

function usage() {
  echo 'Usage: php build.php <source directory> <dependent library name> <output file name>' ."\n";
  die();
}

function read_error( $filePath) {
  echo 'Unable to open "' .$filePath .'" for reading' ."\n";
  die();
}

function write_error( $filePath) {
  echo 'Unable to write to "' .$filePath .'"' ."\n";
  die();
}

// Builds jQuery bundle
if( !isset( $argv))
  die( 'register_argc_argv is not enabled');
  
if( count( $argv) <3)
  usage();
  
// get dependency name
$sourceRoot =$argv[1];
$dependency =$argv[2];
$outputPath =$argv[3];

// build bundle
if(( $dependencyJs =file_get_contents( $filePath =$sourceRoot .'/src/js/dep/' .$dependency .'/fileUploader.' .$dependency .'.js')) ===false)
  read_error( $filePath);
  
if(( $coreJs =file_get_contents( $filePath =$sourceRoot .'/src/js/fileUploader.core.js')) ===false)
  read_error( $filePath);
  
if(( $apiJs =file_get_contents( $filePath =$sourceRoot .'/src/js/api/fileUploader.Uploader.js')) ===false)
  read_error( $filePath);
  
if(( $dependencyApiJs =file_get_contents( $filePath =$sourceRoot .'/src/js/api/' .$dependency .'/fileUploader.' .$dependency .'.js')) ===false)
  read_error( $filePath);
  
// build output code
$output =
  '// File-Uploader ' .$dependency .' API, build ' .date( 'Y/m/d H:i:s') .'. Get your own File Uploader at http://github.com/Evolver/File-Uploader' ."\n\n" .
  '// ' .'src/js/dep/' .$dependency .'/fileUploader.' .$dependency .'.js' ."\n\n" .$dependencyJs ."\n\n" .
  '// ' .'src/js/fileUploader.core.js' ."\n\n" .$coreJs ."\n\n" .
  '// ' .'src/js/api/fileUploader.Uploader.js' ."\n\n" .$apiJs ."\n\n" .
  '// ' .'src/js/api/' .$dependency .'/fileUploader.' .$dependency .'.js' ."\n\n" .$dependencyApiJs;
  
  
// output bundled file
if( !file_put_contents( $outputPath, $output))
  write_error( $outputPath);
  
echo 'Written to "' .$outputPath .'". If you wish to compress output file to a smaller size, use http://javascriptcompressor.com/ online tool to compress and obfuscate JavaScript code' ."\n";

?>