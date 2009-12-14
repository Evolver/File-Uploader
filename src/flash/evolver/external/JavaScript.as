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
  
package evolver.external {
	
	import flash.external.ExternalInterface;
	
	// see if external interface is available
	if( !ExternalInterface.available)
		throw 'External interface is not available';
		
	// pass exceptions to the outer interface
	ExternalInterface.marshallExceptions =true;

	// external javascript communication interface
	public class JavaScript {
		
		// bind a callback to incoming call
		public static function bind( functionName:String, callback:Function) {
			ExternalInterface.addCallback( functionName, callback);
		}
		
		// call a javascript method
		public static function call( ... functionAndArguments):* {
			// perform call
			return ExternalInterface.call.apply( null, functionAndArguments);
		}
		
	}
}