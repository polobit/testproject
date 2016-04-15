package com.agilecrm.landingpages;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.forms.Form;
import com.agilecrm.forms.util.FormUtil;


/**
 * 
 */
public class CustomElementServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
    	
    	ServletContext context = getServletContext();
    	String elementsDirPath = context.getRealPath("misc/landingpage/elements");
    	
    	File folder = new File(elementsDirPath);
    	File[] listOfFiles = folder.listFiles();
    	
    	JSONArray elementsJsonArray = new JSONArray();
    	
    	try {
    		
    	    for (int i = 0; i < listOfFiles.length; i++) {
    		      if (listOfFiles[i].isFile()) {
    		    	     		    	  
    		    	  String fileContent = readFile(elementsDirPath + "/" + listOfFiles[i].getName());
    		    	  
    		    	  Pattern SCRIPT_PATTERN = Pattern.compile("<script>(.+?)</script>", Pattern.DOTALL);
    		    	  Pattern STYLE_PATTERN = Pattern.compile("<style.*?>(.+?)</style>", Pattern.DOTALL);
    		    	  Pattern HTML_PATTERN = Pattern.compile("</style.*?>(.+?)<script>", Pattern.DOTALL);
    		    	  
    		    	  JSONObject element = new JSONObject();
    		    	  element.put("css", "");
    		    	  element.put("html", "");
    		    	  element.put("config", "");
    		    	  
    		    	  Matcher m1 = STYLE_PATTERN.matcher(fileContent);
    		    	  if (m1.find()) {
    		    		  element.put("css", m1.group(1));
    		    	  }
    		    	  
    		    	  Matcher m2 = HTML_PATTERN.matcher(fileContent);
    		    	  if (m2.find()) {
    		    	      element.put("html", m2.group(1));
    		    	  }    		    	  
    		    	  
    		    	  Matcher m3 = SCRIPT_PATTERN.matcher(fileContent);
    		    	  if (m3.find()) {
    		    	      element.put("config", m3.group(1));
    		    	  }
    		    	  
    		    	  elementsJsonArray.put(element);	    	  
    		    	  
    		      }
    	    }
    	    
    	    //load agile forms
    	    
    	    List<Form> forms = FormUtil.getAllForms();
    	    
    	    String formConfig = "({name: '%s',nodes: ['form'],frameworks: ['bootstrap'],types: ['flow'],validChildren: ['flow'],previewScale: '0.25',category: 'agileforms',"
    	    		+ "links: ['https://s3.amazonaws.com/agilecrm/landing/public/agileformv2.css'],"
    	    		+ "icon: 'newspaper',description: 'Agile form'});";
    	    
    	    for(Form form : forms) {    	    	
    	    	if(form.formHtml != null) {
    	    		form.formHtml = form.formHtml.replace("<div class=\"agile-custom-clear\"></div>", "");
        	    	JSONObject formElement = new JSONObject();
        	    	formElement.put("css", "");      	    	
    	    		formElement.put("config", String.format(formConfig, form.formName));
    	    		formElement.put("html", form.formHtml);
    	    		elementsJsonArray.put(formElement);
    	    	}
    	    }
    	    
    	    
    	    
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
    	
    	response.setContentType("application/json");
    	PrintWriter out = response.getWriter();    	
    	out.print(elementsJsonArray.toString());
    	
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