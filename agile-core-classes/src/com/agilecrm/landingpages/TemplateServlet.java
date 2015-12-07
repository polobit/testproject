package com.agilecrm.landingpages;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * 
 */
public class TemplateServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
    	
    	String defaultTemplateId = request.getParameter("id");
    	
    	ServletContext context = getServletContext();
    	String templatesPath = context.getRealPath("misc/landingpage/templates");    	
    	
    	File template = new File(templatesPath + "/" + defaultTemplateId);
    	System.out.println("agency is directroy " + template.isDirectory());
    	System.out.println("agency is file " + template.exists());
    	
    	JSONObject page = new JSONObject();
    	try {
			
	    	page.put("name", "index");
	    	page.put("html", "");
	    	page.put("css", "");
	    	page.put("js", "");
	    	
	    	if(!defaultTemplateId.isEmpty() && template.exists() && template.isDirectory()) {
	    		try {
	    			String html = readFile(templatesPath + "/" + defaultTemplateId + "/index.html");
	    			String styles = readFile(templatesPath + "/" + defaultTemplateId + "/css/styles.css");
	    			String scripts = readFile(templatesPath + "/" + defaultTemplateId + "/js/scripts.js");
	    			
	    			System.out.println("in readfles");
	    			
	    	    	page.put("name", "index");
	    	    	page.put("html", html);
	    	    	page.put("css", styles);
	    	    	page.put("js", scripts);
	    		}
	    		catch (FileNotFoundException fileExp) {
	    			fileExp.printStackTrace();
	    		}
	    	}
	    	
	    	JSONArray pagesArray = new JSONArray();
	    	pagesArray.put(page);
	    	
	    	JSONObject pages = new JSONObject();
	    	pages.put("pages", pagesArray);
	    	
	    	response.setContentType("application/json");
	    	PrintWriter out = response.getWriter();    	
	    	out.print(pages.toString());
	    	
		} catch (JSONException e1) {
			e1.printStackTrace();
		}
    	
    	
    }
    
   public String readFile(String fileName) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(fileName));
        try {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null) {
                sb.append(line);
                sb.append("\n");
                line = br.readLine();
            }
            return sb.toString();
        } finally {
            br.close();
        }
    }

}