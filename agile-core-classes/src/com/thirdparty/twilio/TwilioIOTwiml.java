package com.thirdparty.twilio;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.social.TwilioUtil;

/**
 * Servlet implementation class TwilioIOTwiml
 * url pattern : twiml
 */
public class TwilioIOTwiml extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TwilioIOTwiml() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String fileUrl = request.getParameter("fid");
		response.setContentType("application/xml");
		String twiML = TwilioUtil.sendAudioFileToTwilio(fileUrl);
		System.out.println(twiML);
	    response.getWriter().print(twiML);
	}

}
