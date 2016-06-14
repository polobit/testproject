package com.agilecrm.apilimitcheck;

import java.io.Serializable;

public class ApiLimitCache implements Serializable{

    public Integer api_count;
    
    public Long lastTimeCalled;

    public ApiLimitCache() {
    }

    public ApiLimitCache(Integer api_count, Long lastTimeCalled) {
	this.api_count = api_count;
	this.lastTimeCalled = lastTimeCalled;
    }

    @Override
    public String toString() {
	return "ApiLimitCache [api_count=" + api_count + ", lastTimeCalled="
		+ lastTimeCalled + "]";
    }
    
    
    
    
}