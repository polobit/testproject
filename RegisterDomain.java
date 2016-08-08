package com.pack.java;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;



public class RegisterDomain implements ServletContextListener{
	public void contextDestroyed(ServletContextEvent arg) {}

	 public void contextInitialized(ServletContextEvent arg) {
	  ObjectifyService.register(Customer.class);
	  
	}
	 

}
