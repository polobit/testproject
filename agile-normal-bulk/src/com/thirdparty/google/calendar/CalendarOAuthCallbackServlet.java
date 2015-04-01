package com.thirdparty.google.calendar;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.thirdparty.google.GoogleServiceUtil;

public class CalendarOAuthCallbackServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
        String code = req.getParameter("code");
        String sate = req.getParameter("state");
        HashMap<String, Object> result = GoogleServiceUtil.refreshGoogleCalenderToken(code);

        System.out.println(result);
        JSONObject obj = new JSONObject();
        String prefsJSONString = "";
        try
        {
            obj.put("access_token", result.get("access_token"));
            System.out.println(result.get("expires_in").toString());
            obj.put("expires_at", System.currentTimeMillis()
                    + (Integer.valueOf(result.get("expires_in").toString()) - 120) * 1000);
            String refresh_token = String.valueOf(result.get("refresh_token"));
            String access_token = String.valueOf(result.get("access_token"));

            GoogleCalenderPrefs pref = new GoogleCalenderPrefs(refresh_token, access_token);
            pref.setExpiryTime(Integer.valueOf(result.get("expires_in").toString()));
            pref.save();

            ObjectMapper mapper = new ObjectMapper();
            prefsJSONString = mapper.writeValueAsString(pref);

        }
        catch (JSONException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        System.out.println(prefsJSONString);
        res.getWriter().println("<script>window.opener.att(" + prefsJSONString + ");window.close();</script>");
    }
}
