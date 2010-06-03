<?php
// Author: Dmitry Stepanov <dmitrij@stepanov.lv>
// http://www.stepanov.lv
// Mon Dec 14 10:02:20 GMT 2009 10:02:20 build.php

function usage() {
  echo 'Usage: php build.php <dependent library name>' ."\n";
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
  
if( count( $argv) <2)
  usage();
  
// get dependency name
$sourceRoot =dirname( __DIR__) .'/src/';
$dependency =$argv[1];
$outputPath =__DIR__ .'/fileUploader.js';

// build bundle
if(( $dependencyJs =file_get_contents( $filePath =$sourceRoot .'js/dep/' .$dependency .'/fileUploader.' .$dependency .'.js')) ===false)
  read_error( $filePath);
  
if(( $coreJs =file_get_contents( $filePath =$sourceRoot .'js/fileUploader.core.js')) ===false)
  read_error( $filePath);
  
if(( $apiJs =file_get_contents( $filePath =$sourceRoot .'js/api/fileUploader.Uploader.js')) ===false)
  read_error( $filePath);
  
if(( $dependencyApiJs =file_get_contents( $filePath =$sourceRoot .'js/api/' .$dependency .'/fileUploader.' .$dependency .'.js')) ===false)
  read_error( $filePath);
  
// build output
$output =<<<COPYRIGHT_NOTICE
/**
 * File-Uploader - Evolver's file uploading script.
 * http://github.com/Evolver/File-Uploader
 *
 * Copyright (C) 2010 Dmitry Stepanov <dmitrij@stepanov.lv>
 * URL: http://www.stepanov.lv
 *
 * Publicly available for non-commercial use under GPL v2 license terms.
 */
 
COPYRIGHT_NOTICE;

// append output with script
$output .=$dependencyJs;
$output .=$coreJs;
$output .=$apiJs;
$output .=$dependencyApiJs;
  
// output bundled file
if( !file_put_contents( $outputPath, $output))
  write_error( $outputPath);
  
?>