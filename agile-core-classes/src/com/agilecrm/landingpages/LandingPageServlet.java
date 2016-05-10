package com.agilecrm.landingpages;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

		response.setContentType("text/html; charset=UTF-8");
    	PrintWriter out = response.getWriter();
    	String oldNameSpace = NamespaceManager.get();
    	
		try {
				LandingPageUtil lpUtil = new LandingPageUtil();
				LandingPage landingPage = lpUtil.getLandingPage(request);
				if(landingPage == null)
				throw new Exception("No landing page found.");
				
				String fullXHtml = landingPage.html;
				fullXHtml = getResponsiveMediaIFrame(fullXHtml);				
				
				String domainHost = "http://localhost:8888";
				if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production) {
					domainHost = "https://" + lpUtil.requestingDomain +  ".agilecrm.com";		
					//domainHost = "https://" + lpUtil.requestingDomain + "-dot-sandbox-dot-agilecrmbeta.appspot.com";
				}
				
				String formSubmitCode = "<script>(function(a){var b=a.onload,p=false;if(p){a.onload=\"function\"!=typeof b?function(){try{_agile_load_form_fields()}catch(a){}}:function(){b();try{_agile_load_form_fields()}catch(a){}}};a.document.forms[\"agile-form\"].onsubmit=function(a){a.preventDefault();try{_agile_synch_form_v3()}catch(b){this.submit()}}})(window);</script>";
				
				String analyticsCode = "<script src=\""+domainHost+"/stats/min/agile-min.js\"></script>"
						+ "<script> _agile.set_account('%s', '"+lpUtil.requestingDomain+"');";
				
				if (!lpUtil.cnameHost.isEmpty()) {
					analyticsCode += "_agile.set_tracking_domain('"+lpUtil.cnameHost+"');";
				}
				
				analyticsCode += " _agile.track_page_view();</script>";
				
				NamespaceManager.set(lpUtil.requestingDomain);
				
				fullXHtml = getFormEmbedCode(fullXHtml);
				
				ObjectifyGenericDao<APIKey> dao = new ObjectifyGenericDao<APIKey>(APIKey.class);
				APIKey apiKey = dao.ofy().query(APIKey.class).get();
				if(apiKey != null && apiKey.js_api_key != null) {
					analyticsCode = String.format(analyticsCode, apiKey.js_api_key);
				}					
				
				if(landingPage.elements_css != null){
					fullXHtml = fullXHtml.replace("</head>", "<style id=\"elements-css\">"+landingPage.elements_css+"</style></head>");	
				}
				fullXHtml = fullXHtml.replace("</head>", "<style>"+landingPage.css+"</style></head>");
				fullXHtml = fullXHtml.replace("</body>", formSubmitCode+"<script>"+landingPage.js+"</script>"+analyticsCode+"</body>");
				
				out.write(fullXHtml);
				
		} catch (Exception e) {
			out.print("<h1>"+e.getMessage()+"</h1>");
		} finally {
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	private String getResponsiveMediaIFrame(String fullHtml) {
		
		String responsiveMediaIFrame = "<div class=\"embed-responsive embed-responsive-16by9\"><iframe class=\"embed-responsive-item\" src=\"%s\"></iframe></div>";
		Pattern p = Pattern.compile("<img[^>]*data-src=[\"]*([\\w\\s-.:\\/,]+)[\"]*[^>]*>",Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(fullHtml);
		
		while(m.find()){
			fullHtml = fullHtml.replaceAll(m.group(0), String.format(responsiveMediaIFrame, m.group(1)));
		}
		
		return fullHtml;
	}
	
	
	private String getFormEmbedCode(String fullHtml) {
		
		String responsiveMediaIFrame = "<div id=\""+NamespaceManager.get()+"_%s\" class=\"agile_crm_form_embed\"></div>";
		Pattern p = Pattern.compile("<div id=\"(.*?)\" class=\"embed-container\"(?:[^>\"']|\"[^\"]*\"|'[^']*')*>(.*?)</div>",Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
		Matcher m = p.matcher(fullHtml);
		
		while(m.find()){
			fullHtml = fullHtml.replace(m.group(0), String.format(responsiveMediaIFrame, m.group(1)));
		}
		
		return fullHtml;
	}
	
	
}
