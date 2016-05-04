package com.agilecrm.emailbuilder;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.api.NamespaceManager;

@SuppressWarnings("serial")
public class EmailPollServlet extends HttpServlet
{

	public void doPost(HttpServletRequest request,HttpServletResponse response)throws IOException
	{
		doGet(request,response);
	}
	public void doGet(HttpServletRequest req,HttpServletResponse res)throws IOException
	{
		String email = req.getParameter("email");
		String tag = req.getParameter("pollanswer");
		String url = req.getParameter("redirecturl");
		String domain = NamespaceManager.get();
		String error = null;
		String response = null;
		
		Contact contact = ContactUtil.searchContactByEmail(email);
		
		System.out.println("email is "+email);
		
		try
		{
			
				if(url != null){
					
					url += "?email="+email+"&pollanswer="+tag;
					
					if(contact != null)
					{
						contact.addTags(tag);
						contact.save();						
					}
					else{	
						error = "contact with "+email+" not found";
						url += "&error="+error;
					}
				}else
				{
					if(contact!=null)
					 url = "/agile_emailbuilder.jsp?name="+contact.first_name;
					else
						url = "/agile_emailbuilder.jsp?name=customer";
				}
				
				res.sendRedirect(url);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
	}
}
