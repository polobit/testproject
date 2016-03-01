package com.agilecrm.projectedpojos;

import javax.xml.bind.annotation.XmlRootElement;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class DomainUserPartial {
	public Long id;
	public String email;
	public String name;
	
	public DomainUserPartial(Long id, String name, String email){
		this.id = id;
		this.name = name;
		this.email = email;
	}
}
