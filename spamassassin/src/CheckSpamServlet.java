import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

public class CheckSpamServlet extends HttpServlet {

	/**
	 * This servlet getting request from google app engine and gives response them
	 */
	private static final long serialVersionUID = 1L;

	public void doPost(HttpServletRequest req, HttpServletResponse resp)throws IOException {
		
		resp.setContentType("text/json");
		
		//Get the InputStream of the Response
		InputStream is = null;
	    try
	    {
	    	is = req.getInputStream();
	    }
	    catch(IOException ie)
	    {
	    	System.err.println("IOException occured, getting error stream.");
	    }
		
			// Get the response
			BufferedReader breader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
			String output = "";
			String inputLine;
			String fileName=breader.readLine();
			
		while ((inputLine = breader.readLine()) != null)
		{
		    output +=inputLine+"\n";
		}
			breader.close();
		
			//Email Template file writing
			
			SpamFileWriter spamFile=new SpamFileWriter();
			spamFile.emailTemplateWriter(output, fileName);
			
			// Execute spamassassin command from shell script file
		    ProcessBuilder builder = new ProcessBuilder("spamassassin", "-p", "/home/spam-assassin/Mail-SpamAssassin-3.4.1/rules", "<", "/home/spam-assassin/"+fileName+".txt");
			
			//ProcessBuilder builder = new ProcessBuilder("spamassassin","-D","</home/spam-assassin",fileName+".txt");
			//builder.directory(new File("/"));
		     builder.redirectErrorStream(true);
			Process process = builder.start();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader( process.getInputStream()));
			String line = null;
			JSONObject obj = new JSONObject();
			
		//Reading output from Console
		while ((line = reader.readLine()) != null){
			 try{
					//Fetching spam score from console log
					if(line.contains("X-Spam-Status:"))
					{	
								// Adding the score in Json object
								String score[]=line.split(" ", 4);
								score=score[2].split("=");
								obj.put("score",score[1]);
								System.out.println(obj.toString());
								
					 }
					//Adding the reason in JSon Object
					if(line.contains("pts rule name              description")){
						line=reader.readLine();
						if(line.contains("---- ---------------------- --------------------------------------------------"))
						{  
							while(line!=null && !(line.isEmpty())){
									line=reader.readLine();
									String temp[]=line.trim().split(" ", 3);
									
									if(temp.length==3 && !(StringUtils.isAlpha(temp[0]))){
										if(temp[1].contains("EMPTY_MESSAGE"))
											temp[2] +=reader.readLine();
											obj.append("reason",new JSONArray(temp));
								}
							 }
						}	
					 }
			   }
			catch(Exception e){
				System.err.println(e);
			}
		  }//End Of While
		
		resp.getWriter().println(obj);
		Process p= Runtime.getRuntime().exec("rm /home/spam-assassin/" +fileName+".txt");
		
		}//End of doPost
}//End of Class
