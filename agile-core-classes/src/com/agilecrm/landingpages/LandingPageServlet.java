package com.agilecrm.landingpages;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class LandingPageServlet
 */
public class LandingPageServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LandingPageServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("text/html");
    	PrintWriter out = response.getWriter();
    	
		try {
			String idPath = request.getPathInfo();
			Long landingPageId = 0L;
			if(idPath != null && !idPath.isEmpty()) {
				
				landingPageId = Long.parseLong(idPath.substring(1));				
				LandingPage landingPage = LandingPageUtil.getLandingPage(landingPageId);
				if(landingPage != null) {
					String fullXHtml = landingPage.html;
					fullXHtml = fullXHtml.replace("</head>", "<style>"+landingPage.css+"</style></head>");
					fullXHtml = fullXHtml.replace("</body>", "<script>"+landingPage.css+"</script></body>");
					out.print(fullXHtml);
				} else {
					throw new NumberFormatException();
				}
				
			} else {
				throw new Exception();
			}
		} catch (NumberFormatException e) {
			out.print("<h1>No landing page found.</h1>");
		} catch (Exception e) {
			//redirect to agilecrm.com
			response.sendRedirect("https://www.agilecrm.com/");
		}
		
	}

}
