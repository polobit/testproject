package com.thirdparty.ozonetel;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.ozonetel.kookoo.Dial;
import com.ozonetel.kookoo.Response;

//add and import kookoo response.jar or source code into your application

@SuppressWarnings("serial")
public class OzonetelCallBackServlet extends HttpServlet {
	/**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	try{
	        String uri = request.getRequestURI();
	        System.out.println("kookoo outbound status : " + uri);/*here I am just kookoo final xml prepared*/
	        if (request.getQueryString() != null) {
	            uri += "?" + request.getQueryString();
	        }
	        JSONObject jsonobj = new JSONObject();
	
	        JSONArray jsonarry = new JSONArray();
	        
	        /*printing outbound callback parameters*/
	        Enumeration<String> parameterNames = request.getParameterNames();
	        while (parameterNames.hasMoreElements()) {
	            String paramName = parameterNames.nextElement();
	            String[] paramValues = request.getParameterValues(paramName);
	            for (String paramValue : paramValues) {
	            	jsonobj.put(paramName, paramValue);
	                System.out.println("param : " + paramName + "=" + paramValue);
	            }
	        }
	        try (PrintWriter out = response.getWriter()) {
	            out.println("OK");
	            out.println(jsonarry.put(jsonobj).toString());
	            out.close();
	           
	        }
	
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
    }
}
