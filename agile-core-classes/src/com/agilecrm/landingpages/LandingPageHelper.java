package com.agilecrm.landingpages;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import com.agilecrm.account.APIKey;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Key;

public class LandingPageHelper {
  
  private LandingPage landingPage = null;  
  private String agileDomainURL = "https://%s.agilecrm.com";
  
  public String requestingDomain = NamespaceManager.get();
  public String cnameHost = "";
  
  public boolean showBrandMessage = true;
  public boolean setAnalyticsCode = true;
  public boolean compileMergeFields = true;
  public boolean enableWebrules = true;
  
  public JSONObject mergeFieldsJson = null;
  
  private String headerContent = "";
  private String footerContent = "";
  
  private String pageHeader = "";
  private String pagefooter = "";
  private String fullPage = ""; 
  private String domainOwnerJsApiKey = "";

  private String formSubmitCode = "<script>(function(a){var b=a.onload,p=false;if(p){a.onload=\"function\"!=typeof b?function(){try{_agile_load_form_fields()}catch(a){}}:function(){b();try{_agile_load_form_fields()}catch(a){}}};a.document.forms[\"agile-form\"].onsubmit=function(a){a.preventDefault();try{_agile_synch_form_v3()}catch(b){this.submit()}}})(window);</script>";

  public LandingPageHelper() {
    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
      agileDomainURL = "http://localhost:8888";
    }
  }

  public LandingPageHelper(LandingPage landingPage) {
    this();
    this.landingPage = landingPage;
    setContent();
  }
  
  public void addContentToHeader(String html) {
    this.headerContent += html;
  }

  public void addContentToFooter(String html) {
    this.footerContent += html;
  }
  
  public String getPageHeader() {
    return pageHeader;
  }

  public String getPagefooter() {
    return pagefooter;
  }

  public String getFullPage() {
    return fullPage;
  }
  
  public String getDomainOwnerJsApiKey() {
    if(domainOwnerJsApiKey.isEmpty()) {
      getDomainOwnerJsApiKeyFromDataStore();
      return domainOwnerJsApiKey;
    }
    return domainOwnerJsApiKey;
  }
  
  private void getDomainOwnerJsApiKeyFromDataStore() {
    if(requestingDomain != null) {
      NamespaceManager.set(requestingDomain);
    }
    Key<DomainUser> userKey = DomainUserUtil.getDomainOwnerKey(requestingDomain);
    Long domainUserId = userKey.getId();
    APIKey apiKey = APIKey.getAPIKeyRelatedToUser(domainUserId);
    if(apiKey != null && apiKey.js_api_key != null) {
      domainOwnerJsApiKey = apiKey.js_api_key;
    }
  }
  
  private String getAnalyticsCode() {
    String analyticsCode = "<script src=\"" + String.format(agileDomainURL,requestingDomain) + "/stats/min/agile-min.js\"></script>";
    
    analyticsCode += "<script>";
    if(requestingDomain != null) {
      analyticsCode += "_agile.set_account('" + getDomainOwnerJsApiKey() + "', '" + requestingDomain + "');";
    } else {
      analyticsCode += "_agile.set_account('" + getDomainOwnerJsApiKey() + "', 'localhost');"; 
    }
    
    if (!cnameHost.isEmpty()) {
        analyticsCode += "_agile.set_tracking_domain('" + cnameHost + "');";
    }
    analyticsCode += " _agile.track_page_view();";
    
    if(enableWebrules) {
      analyticsCode += "_agile_execute_web_rules();";
    }
    
    analyticsCode += "</script>";
    
    return analyticsCode;
  }
  
  private String getBrandMessage() {
    Long brandMessageLaunchedTime = 1473835250L;                
    String brandMessageStyles = "float: right;  font-family: helvetica; background-color: rgba(0,0,0,.5); bottom: 0; position: fixed; right: 0;  font-size: medium; border-bottom-color: gray; z-index: 100000;";
    String brandMessageEl = "<div style='"+brandMessageStyles+"'><a target='_blank' style='padding-left: 5px;padding-right: 5px;color: #ffffff;' href='https://www.agilecrm.com/?utm_source=Landing%20Page&utm_medium=Poweredby%20Landingpage'><span style='font-size: small;'> Powered by Agile</span></a></div>";
    
    if(BillingRestrictionUtil.getBillingRestrictionFromDB().planDetails.isFreePlan() && landingPage.created_time > brandMessageLaunchedTime ) {
      return brandMessageEl;
    }
    
    return "";
  }
  
  public void setContent() {
    if(landingPage.elements_css != null && !landingPage.elements_css.isEmpty()){
      addContentToHeader("<style id=\"elements-css\">" + landingPage.elements_css + "</style>");
    }    
    addContentToHeader("<style>" + landingPage.css + "</style>");
    
    addContentToFooter("<script>" + landingPage.js + "</script>");
  }

  public void constructPageCode() {
    
    String rawHtml = landingPage.html;
    if (rawHtml == null) {
      rawHtml = "";
    }
    
    if(landingPage.version < 2.0) {
      rawHtml = getResponsiveMediaIFrame(rawHtml);
      rawHtml = getFormEmbedCode(rawHtml,requestingDomain);
      addContentToFooter(formSubmitCode);
    }
      
    String analyticsCode = "";
    if (setAnalyticsCode) {
      analyticsCode = getAnalyticsCode(); 
    }
    if (showBrandMessage) {
      analyticsCode += getBrandMessage(); 
    }
  
    addContentToFooter(analyticsCode);
    
    if(mergeFieldsJson != null && compileMergeFields) {
      rawHtml = MustacheUtil.compile(rawHtml, mergeFieldsJson);
    }
    
    Document lpDocument = Jsoup.parse(rawHtml);
    Element lpHeadSection = lpDocument.head();
    Element lpBodySection = lpDocument.body();    
    lpHeadSection.append(headerContent);    
    lpBodySection.append(footerContent);
    
    pageHeader = lpHeadSection.html();
    pagefooter = lpBodySection.html();
    fullPage = lpDocument.toString();
    
  }
  
  public String getSourceCode() {
    constructPageCode();
    return fullPage;
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


  private String getFormEmbedCode(String fullHtml, String domain) {
    
    String responsiveMediaIFrame = "<div id=\""+domain+"_%s\" class=\"agile_crm_form_embed form-embed-container\"></div>";
    Pattern p = Pattern.compile("<div data-embed-agile-form=\"(.*?)\" class=\"form-embed-container\"(?:[^>\"']|\"[^\"]*\"|'[^']*')*>(.*?)</div>",Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    Matcher m = p.matcher(fullHtml);
    
    while(m.find()){
        fullHtml = fullHtml.replace(m.group(0), String.format(responsiveMediaIFrame, m.group(1)));
    }
    
    return fullHtml;
  }

}


