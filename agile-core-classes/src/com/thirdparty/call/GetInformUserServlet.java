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
public class GetInformUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetInformUserServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try
		{
			String data = request.getParameter("prak");
			System.out.println("in get --> " + data);
			JSONObject messageJson;
			messageJson = new JSONObject(data);
			//structure is type,state,callId,number,displayName,domain,userId
			String userId = messageJson.getString("userId");
			PubNub.pubNubPush(userId + "_Channel", messageJson);
			return;
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("post method called but nothing to execute...");
	}
}
