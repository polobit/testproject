package com.agilecrm.core.api;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
* <code>JsonIOAPI</code> is the API class for getting response from the server for JsonIO request.  
*
* @author  Mahendra
* @since   2016-12-29 
*/
import com.campaignio.tasklets.agile.JSONNode;

@Path("/api/jsonio")
public class JsonIOAPI {
	
	/**
     * Sends request to server and return response data as String.
     * 
     * @param url - url
     * 
     * @param methodType - method type
     * 
     * @param paramsJSONArrayString - params data
     * 
     * @param headersJSONArrayString - headers data
     * 
     * @return String
     */
	@POST
	@Produces({ MediaType.TEXT_HTML,MediaType.TEXT_PLAIN})
	public String executeJSONRequest(@FormParam("url") String url, @FormParam("method") String methodType,
			@FormParam("params") String paramsJSONArrayString,
			@FormParam("headers") String headersJSONArrayString) {
		Boolean isCamoaignCall = false;	
		
		String response = "";
		try {
			response = JSONNode.executeRequestJSON(null, null, null, null, url, methodType, paramsJSONArrayString, headersJSONArrayString, isCamoaignCall);
		} catch (Exception e) {
			e.printStackTrace();
			return e.getMessage();
		}					
		return response;
	}
}
