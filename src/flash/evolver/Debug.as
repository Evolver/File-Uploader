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