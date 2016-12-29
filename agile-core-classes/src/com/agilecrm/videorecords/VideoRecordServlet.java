package com.agilecrm.videorecords;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.util.FileStreamUtil;


public class VideoRecordServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  /**
   * @see HttpServlet#HttpServlet()
   */
  public VideoRecordServlet() {
    super();
    // TODO Auto-generated constructor stub
  }

  /**
   * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
   */
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    doPost(request, response);
  }

  /**
   * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

    response.addHeader("Access-Control-Allow-Origin", "*");
    response.setContentType("text/html; charset=UTF-8");
    PrintWriter out = response.getWriter();

    VideoRecord videoRecord = null;

    try {
      String idPath = request.getPathInfo();

      if (StringUtils.isEmpty(idPath)) {
        throw new Exception("No video found.");
      }

      String videoId = idPath.substring(1);
      if (videoId.matches("[0-9]+")) {
        VideoRecordUtil videoRecordUtil = new VideoRecordUtil();
        videoRecord = videoRecordUtil.get(Long.parseLong(videoId));
      }
      if (videoRecord != null) {
    	String embedFlag = request.getParameter("embed");
        ServletContext context = getServletContext();
        String dirPath = context.getRealPath("misc/video-record");
        String defaultTemplate = "";
        if(embedFlag != null && embedFlag.equalsIgnoreCase("true")){
        	defaultTemplate = FileStreamUtil.readResource(dirPath + "/player-template-embed.html");
        	String autoplay = request.getParameter("autoplay");
            if(autoplay != null && autoplay.equals("1"))
              defaultTemplate = defaultTemplate.replace("{{AUTO_PLAY}}", "true");
            else
              defaultTemplate = defaultTemplate.replace("{{AUTO_PLAY}}", "false");
        }else{
        	defaultTemplate = FileStreamUtil.readResource(dirPath + "/player-template.html");
        	String name = request.getParameter("n");
        	String calenderLink = request.getParameter("c");
        	if(name != null && !name.isEmpty() && !name.equalsIgnoreCase("{{first_name}}")) {
        	  defaultTemplate = defaultTemplate.replace("{{NAME}}", name);
        	} else {
        	  defaultTemplate = defaultTemplate.replace("{{NAME}}", "");
        	}
        	if(calenderLink != null && !calenderLink.isEmpty() && !calenderLink.equalsIgnoreCase("{{owner.calendar_url}}")) {
        	  defaultTemplate = defaultTemplate.replace("{{CALENDAR}}", calenderLink);
        	} else {
        	  defaultTemplate = defaultTemplate.replace("{{CALENDAR}}", ""); 
        	}
        }
        defaultTemplate = defaultTemplate.replace("{{VIDEO_SOURCE}}", videoRecord.url);
        out.write(defaultTemplate);
      } else {
        throw new Exception("No video found.");
      }

    } catch (Exception e) {
      out.print("<h1>" + e.getMessage() + "</h1>");
    }


  }

}
