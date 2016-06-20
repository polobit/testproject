package com.agilecrm.call.util.deferred;

import com.agilecrm.account.util.VoiceCallUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * this task is for call node
 * 
 * @author Sonali
 * 
 */
@SuppressWarnings("serial")
public class CallDeferredTask implements DeferredTask
{    
    
        public String callGateWayType = null; 
    	public String account_id = null;
    	public String auth_token = null;
    	public String fromNumber = null;
    	public String firstCall = null;
    	public String secondCall = null;
    	public String message = null;
    	
    	public CallDeferredTask(String callGateWayType,String account_id, String auth_token, String fromNumber, String firstCall,String secondCall,String message)
    	{	
    	    	this.callGateWayType=callGateWayType;
    		this.fromNumber = fromNumber;
    		this.firstCall = firstCall;
    		this.message =message;
    		this.account_id = account_id;
    		this.auth_token = auth_token;
    		this.secondCall = secondCall;
    		this.secondCall = secondCall;
    	}

    	public void run() 
    	{
    		System.out.println("CallDeferredTask run...");

    		if (callGateWayType.equals("TWILIO"))
    		    VoiceCallUtil.sendVoiceall(account_id, auth_token, fromNumber, firstCall, secondCall, message);
    		
    	}
    
}
