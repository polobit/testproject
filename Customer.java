package com.pack.java;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.*;

import java.lang.String;
import java.util.Date;
import java.util.List;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Customer {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
	private String custName;
	private String emailId;	
	
   public Customer() {
		// TODO Auto-generated constructor stub 
		  super();	
		 }

		 public Customer(String name, String email) {
		  super();
		  this.custName = name;
		  this.emailId = email;
		  
		 }
	@Override	 
    public String toString()
    {
		String s=getCustName()+" "+" "+getEmailId();
		return s;
    }
	public void setCustName(String custName)
	{
		this.custName=custName;
	}
	
	public String getCustName(){
		return this.custName;
	}
	
	public void setEmailId(String emailId)
	{
		this.emailId=emailId;
	}
	
	public String getEmailId(){
		return this.emailId;
	}
	
	private static Objectify getService() {
		  return ObjectifyService.begin();
		 }

		 public static Customer findByName(String name){
		  Objectify service = getService();
		  return service.get(Customer.class, name);
		 }
	/****saving the domain object in datastore******/ 
		 public void save(){
			 Objectify service = getService();
			 service.put(this);
			}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


}
