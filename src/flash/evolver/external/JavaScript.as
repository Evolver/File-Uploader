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