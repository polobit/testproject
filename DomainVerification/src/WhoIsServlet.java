

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.http.*;

@SuppressWarnings("serial")
public class WhoIsServlet extends HttpServlet {
	
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp)throws IOException {
		doGet(req, resp);
	}
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)throws IOException {
		resp.setContentType("text/json");
		resp.getWriter().print(req.getRemoteAddr()+req.getHeader("HTTP_X_FORWARDED_FOR")+req.getHeader("X_FORWARDED_FOR"));
		
	     String domain=req.getParameter("domain");
		ProcessBuilder builder = new ProcessBuilder("whois", domain);
		builder.directory(new File("/home/spam-assassin/"));
		builder.redirectErrorStream(true);
		Process process = builder.start();
		BufferedReader reader = new BufferedReader(new InputStreamReader( process.getInputStream()));
		String line = null;
		 String data="";
		//Reading output from Console
		while ((line = reader.readLine()) != null){			
			resp.getWriter().println(line);
		}
		
		
		}//End of doPost
}//End of Class
