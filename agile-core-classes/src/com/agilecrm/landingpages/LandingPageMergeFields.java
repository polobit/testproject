package com.agilecrm.landingpages;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;

public class LandingPageMergeFields {

  private Map<String, String> requestParamsMap = new HashMap<String, String>();
  private Cookie[] cookies;
  private LandingPageHelper lpHelper;
  private HttpServletRequest request;

  public LandingPageMergeFields(LandingPageHelper lpHelper, HttpServletRequest request) {
    super();
    this.lpHelper = lpHelper;
    this.request = request;
    init();
  }


  private void init() {
    String trackingEmail = null;

    readAllRequestParams();

    lpHelper.mergeFieldsJson = new JSONObject(requestParamsMap);

    if (isYesAndPushRequest()) {
      trackingEmail = getTrackEmailFromYesAndPush();
    } else {
      trackingEmail = getTrackEmailFromCookies();
    }

    if (trackingEmail != null && !trackingEmail.isEmpty()) {
      Contact knownContact = ContactUtil.searchContactByEmail(trackingEmail);
      if (knownContact != null) {
        JSONObject contactJSON = AgileTaskletUtil.getSubscriberJSON(knownContact);
        if (contactJSON != null) {
          JSONObject onlyContactJSON;
          try {
            onlyContactJSON = contactJSON.getJSONObject("data");
            if (lpHelper.mergeFieldsJson.length() == 0) {
              lpHelper.mergeFieldsJson = onlyContactJSON;
            } else {
              for (String key : JSONObject.getNames(onlyContactJSON)) {
                lpHelper.mergeFieldsJson.put(key, onlyContactJSON.get(key));
              }
            }
          } catch (JSONException e) {

          }
        }
      }
    }
  }

  private boolean isYesAndPushRequest() {
    if ("cd".equalsIgnoreCase(requestParamsMap.get("fwd")) && request.getParameter("data") != null) {
      return true;
    }
    return false;
  }

  private void readAllRequestParams() {
    @SuppressWarnings("unchecked")
    Enumeration<String> parameterNames = request.getParameterNames();
    while (parameterNames.hasMoreElements()) {
      String key = (String) parameterNames.nextElement();
      if (!"data".equalsIgnoreCase(key)) {
        requestParamsMap.put(key, StringEscapeUtils.escapeHtml(request.getParameter(key)));
      }
    }
  }

  private String getTrackEmailFromYesAndPush() {
    try {
      JSONObject agileData = new JSONObject(request.getParameter("data"));
      if (agileData.has("email")) {
        return agileData.getString("email");
      }
    } catch (JSONException e) {
      System.out.println("data param is not json");
    }
    return null;
  }

  private String getTrackEmailFromCookies() {
    cookies = request.getCookies();
    if (cookies != null) {
      String agileTrackingEmailCookieKey = lpHelper.getDomainOwnerJsApiKey() + "-agile-email";
      for (Cookie cookie : cookies) {
        if (agileTrackingEmailCookieKey.equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }

}
