package com.agilecrm.landingpages;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.account.APIKey;
import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

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
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("text/html");
    	PrintWriter out = response.getWriter();
    	
		try {
				LandingPage landingPage = LandingPageUtil.getLandingPage(request);
				if(landingPage == null)
				throw new Exception("No landing page found.");
				
				String fullXHtml = landingPage.html;
				
				String domainHost = "http://localhost:8888";
				if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production) {
					domainHost = "https://" + NamespaceManager.get() +  ".agilecrm.com";		
					//domainHost = "https://" + NamespaceManager.get() + "-dot-sandbox-dot-agilecrmbeta.appspot.com";
				}
				
				String formSubmitCode = "<script>(function(a){var b=a.onload,p=false;if(p){a.onload=\"function\"!=typeof b?function(){try{_agile_load_form_fields()}catch(a){}}:function(){b();try{_agile_load_form_fields()}catch(a){}}};a.document.forms[\"agile-form\"].onsubmit=function(a){a.preventDefault();try{_agile_synch_form_v3()}catch(b){this.submit()}}})(window);</script>";
				String analyticsCode = "<script src=\""+domainHost+"/stats/min/agile-min.js\"></script>"
						+ "<script> _agile.set_account('%s', '"+NamespaceManager.get()+"'); _agile.track_page_view();</script>";
				
				ObjectifyGenericDao<APIKey> dao = new ObjectifyGenericDao<APIKey>(APIKey.class);
				APIKey apiKey = dao.ofy().query(APIKey.class).get();
				if(apiKey != null && apiKey.js_api_key != null) {
					analyticsCode = String.format(analyticsCode, apiKey.js_api_key);
				}					
				
				fullXHtml = fullXHtml.replace("</head>", "<style>"+landingPage.css+"</style></head>");
				fullXHtml = fullXHtml.replace("</body>", formSubmitCode+"<script>"+landingPage.js+"</script>"+analyticsCode+"</body>");
				
				out.print(fullXHtml);
				
		} catch (Exception e) {
			out.print("<h1>"+e.getMessage()+"</h1>");
		}
		
	}
}
