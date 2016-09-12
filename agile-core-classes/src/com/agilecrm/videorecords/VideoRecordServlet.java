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
        ServletContext context = getServletContext();
        String dirPath = context.getRealPath("misc/video-record");
        String defaultTemplate = FileStreamUtil.readResource(dirPath + "/player-template.html");
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
