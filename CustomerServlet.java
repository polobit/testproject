package com.pack.java;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.ObjectifyService;
//import com.googlecode.objectify.util.*;


//import javax.persistence.*;
public class CustomerServlet extends HttpServlet {
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException 
	{   
		PrintWriter p=resp.getWriter();
		//UserService userService = UserServiceFactory.getUserService();
	    //User user = userService.getCurrentUser();  // Find out who the user is.

		String name = req.getParameter("name");
	    String email = req.getParameter("email");
        Objectify ofy=ObjectifyService.begin();
        Customer cust=new Customer(name, email);
        ofy.put(cust);
        p.print("successfully done!!");
        
 	   
         }
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException 
	{   
	      Objectify ofy=ObjectifyService.begin(); 
	      
	      //Query<Customer> q=ofy.query(Customer.class);
	      List<Customer> l=ofy.query(Customer.class).list();
	      //Customer c=ofy.get(Customer.class,"mykey");
	      	  
	  try{
	     req.setAttribute("EmpList", l.toString());
	     /*for(Entity e:l)
	     {
	    	 out.print("the list is:"+e);
	     }*/
	    req.getRequestDispatcher("list.jsp").forward(req, resp);
	    //out.print(l.toString());
	  }
	  catch(Exception e)
	  {
		  e.printStackTrace();
	  }


    }


	    

}
