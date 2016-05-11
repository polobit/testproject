package com.agilecrm.util.email;

import java.io.IOException;
import com.github.jknack.handlebars.Helper;
import com.github.jknack.handlebars.Options;


public class HandlebarsHelpers {
	
	/**
	 * 
	 * @return
	 */
	 public static Helper<Object> firstNameHelper() {
	    	return new Helper<Object>(){
	    		
	    		public CharSequence apply(Object obj, Options options) throws IOException{
	    			
	    			String param0 = options.param(0);
					
					if(obj.toString().length() == 0)
					{
						return param0;
						
					}else{
						
						return obj.toString();
					}
	    		}
	    		
	    	};
	    }
	
	 
	 /**
	  * 
	  * @return
	  */
	 public static Helper<Object> safeStringHelper() { 
		    return new Helper<Object>() { 
		 
		      @Override 
		      public CharSequence apply(Object s, Options options) throws IOException {
		    	  
		    	  return s.toString(); 
		       
		      } 
		    }; 
		  } 
	


}
