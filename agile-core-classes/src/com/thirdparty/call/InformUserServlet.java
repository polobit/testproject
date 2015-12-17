package com.thirdparty.call;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.thirdparty.PubNub;


/**
 * Servlet implementation class InformUserServlet
 */
public class InformUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InformUserServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		service(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		service(request,response);
	}
	
	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		System.out.println("message received");
		try
		{
			ServletInputStream in = request.getInputStream();
			   BufferedReader reader = new BufferedReader(new InputStreamReader(in));

			   String data = "";
			   String line = "";
			   while ((line = reader.readLine()) != null)
			   {
				 data += line;
			   }
			  
			   if(data.equals("")){
				   return;
			   }
			 
			System.out.println(data.toString());   
			JSONObject messageJson = new JSONObject(data.toString());
			//structure is type,state,callId,number,displayName,domain,userId
			String userId = messageJson.getString("userId");
			PubNub.pubNubPush(userId + "_Channel", messageJson);
			
		}
		
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		}
	}

}
