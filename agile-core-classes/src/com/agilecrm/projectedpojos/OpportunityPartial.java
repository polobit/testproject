package com.agilecrm.projectedpojos;

import javax.xml.bind.annotation.XmlRootElement;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class OpportunityPartial {
	public Long id;
	public String name;
	
	public OpportunityPartial(Long id, String name){
		this.id = id;
		this.name = name;
	}
}
