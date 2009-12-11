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
  
package evolver {

	public class Debug {
		
		// by default debug mode is off
		public static var enable:Boolean =false;
		
		// by default no debug function is defined, use tracing
		public static var debugFn:Function =function( msg){
			trace( '[Debug] ' +msg);
		};
	
		// check if assertion is false, and if is, throw an exception
		public static function assert( expr:Boolean) {
			if( !Debug.enable)
				// debugging is off
				return;
				
			if( !expr)
				throw new Error( 'Assertion failed');
		}
		
		// write message to debug console
		public static function write( msg:String) {
			if( !Debug.enable)
				// debugging is off
				return;
				
			// call debugging function
			Debug.debugFn( msg);
		}
		
	}
}