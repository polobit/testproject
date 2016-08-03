package com.agilecrm.landingpages;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.FileStreamUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Query;

public class LandingPageUtil
{
	public String requestingDomain = NamespaceManager.get();
	public String cnameHost = "";
	
	/**
	 * ObjectifyDao of LandingPage.
	 */
	public static ObjectifyGenericDao<LandingPage> dao = new ObjectifyGenericDao<LandingPage>(LandingPage.class);

	public static LandingPage getLandingPage(Long id)
	{
		try
		{
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	public LandingPage getLandingPage(HttpServletRequest req)
	{
		String protocol = "http://";
		Map<String, String> reqHeaders = getHeadersInfo(req);
		String cname = reqHeaders.get("cname");
		System.out.println(cname);
			if(cname != null) {
				String cnameURLWithOutQueryString = "";
				try {
					URL landingPageURL = new URL(protocol+cname);
					cnameURLWithOutQueryString = landingPageURL.getProtocol()+"://"+landingPageURL.getHost()+landingPageURL.getPath();
					System.out.println("Query String excluded : " + cnameURLWithOutQueryString);
				} catch (MalformedURLException e) {
					System.out.println("MalformedURLException");
					return null;
				}
				
				String oldNameSpace = NamespaceManager.get();
				NamespaceManager.set("");
				
				try
				{
					Query<LandingPageCNames> q = null;
					ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
					q = dao.ofy().query(LandingPageCNames.class);
					q.filter("cname", cnameURLWithOutQueryString);
					LandingPageCNames lpCNames =  q.get();
					if(lpCNames == null)
						return null;
					
					requestingDomain = lpCNames.domain;
					cnameHost = lpCNames.cname_host;
					
					NamespaceManager.set(lpCNames.domain);
					return getLandingPage(lpCNames.landing_page_id);
				}
				finally
				{
					NamespaceManager.set(oldNameSpace);
				}
				
				
			} else {
				String idPath = req.getPathInfo();
				
				if(StringUtils.isEmpty(idPath))
					return null;
							
				return LandingPageUtil.getLandingPage(Long.parseLong(idPath.substring(1)));
			}
	}
	
	//get request headers
	public static Map<String, String> getHeadersInfo(HttpServletRequest req) {

		Map<String, String> map = new HashMap<String, String>();

		Enumeration<?> headerNames = req.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String key = (String) headerNames.nextElement();
			String value = req.getHeader(key);
			map.put(key, value);
		}

		return map;
	}

	public static List<LandingPage> getLandingPages(String fieldName)
	{
		
		try
		{
//			return dao.fetchAll();
			return dao.ofy().query(LandingPage.class).order(fieldName).list();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	public static List<LandingPage> getLandingPages(int max, String cursor ,String fieldName)
	{
//		if (max != 0)
//			return dao.fetchAll(max, cursor);
		return getLandingPages(fieldName);
	}

	public static int getCount()
	{
		return LandingPage.dao.count();
	}
	
	
	public static LandingPageCNames getLandingPageCNames(Long id)
	{
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");		
		try
		{
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public static LandingPageCNames getLandingPageCNamesForPage(Long pageId)
	{
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			
			q.filter("landing_page_id", pageId);
			List<LandingPageCNames> lpCnames = q.list();
			
			int noOfLandingPages = lpCnames.size();
			if(noOfLandingPages != 0) {
				for(int j = 0; j < noOfLandingPages; j++) {
					LandingPageCNames lpCname = lpCnames.get(j);
					if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development || (lpCname != null && lpCname.domain.equals(oldNameSpace))) {
						return lpCname;
					}
				}
			}
			
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public boolean isNameExists(String name,String id) {
		String oldNameSpace = NamespaceManager.get();
		
		try
		{
			Query<LandingPage> q = null;
			ObjectifyGenericDao<LandingPage> dao = new ObjectifyGenericDao<LandingPage>(LandingPage.class);
			q = dao.ofy().query(LandingPage.class);
			q.filter("name", name);
			LandingPage lpNames =  q.get();
			if(lpNames != null && lpNames.id != null && !id.equals(lpNames.id+""))
			{
				return true;			
			}
			else
			{
				return false;
			}
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public boolean isCNameExists(String cname) {
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			q.filter("cname", cname);
			LandingPageCNames lpCNames =  q.get();
			if(lpCNames != null && lpCNames.id != null)
			{
				return true;			
			}
			else
			{
				return false;
			}
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public boolean isCNameExists(String cname, Long cNameId) {
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			q.filter("cname", cname);
			q.filter("id != ", cNameId);
			LandingPageCNames lpCNames =  q.get();
			if(lpCNames != null && lpCNames.id != null)
			{
				return true;			
			}
			else
			{
				return false;
			}
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public static boolean deleteLandingPageCNames(JSONArray pageIds)
	{
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			int noOfPages = pageIds.length();
			for(int i = 0; i < noOfPages; i++) {
				q = dao.ofy().query(LandingPageCNames.class);
				q.filter("landing_page_id", pageIds.getLong(i));
				List<LandingPageCNames> lpCnames = q.list();
				
				int noOfLandingPages = lpCnames.size();
				if(noOfLandingPages != 0) {
					for(int j = 0; j < noOfLandingPages; j++) {
						LandingPageCNames lpCname = lpCnames.get(j);
						if(lpCname != null && lpCname.domain.equals(oldNameSpace)) {
							dao.delete(lpCname);
						}
					}
				}
			}
			return true;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return false;
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public static boolean deleteAllLandingPageCNamesAssociatedWithDomain(String namespace)
	{	
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			q.filter("domain", namespace);
			List<LandingPageCNames> lpcnames = q.list();
			if(lpcnames.size() != 0) {
				dao.deleteAll(lpcnames);
			}
			return true;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return false;
		}
		
	}
	
	public static boolean hasRightsToAddDomain(String cnameDomain) {
		//current user domain
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			q.filter("cname_host", cnameDomain);
			if(q.count() == 0)
			{
				return true;
			}
			else
			{
				List<LandingPageCNames> lpcnames = q.list();
				if(lpcnames.size() != 0) {
					LandingPageCNames lpcname = lpcnames.get(0);
					if(lpcname.domain != null && lpcname.domain.equals(oldNameSpace)) {
						return true;
					}
				}
				return false;
			}
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public static String  getFullHtmlCode(LandingPage landingPage) {
		
		String fullXHtmlJson = landingPage.blocks;		
	    String fullbodyHtml = "";
	   
		try
		{
//		    String fileContent = FileStreamUtil.readResource("D:/jpreddy/EclipseWorkSpace/final/.metadata/.plugins/org.eclipse.wst.server.core/tmp0/agile-java-server/agile-frontend.war/misc/pagebuilder/elements/skeleton.html");
		    String fileContent = FileStreamUtil.readResource("misc/pagebuilder/elements/skeleton.html");		    
		    
		    String meta = "";
			if (landingPage.title != null && !landingPage.title.isEmpty()) {
				meta += "<title>" + landingPage.title + "</title>";
			}
			if (landingPage.description != null && !landingPage.description.isEmpty()) {
				meta += "<meta name=\"description\" content=\""+ landingPage.description + "\"/>";
			}
			if (landingPage.tags != null && !landingPage.tags.isEmpty()) {
				meta += "<meta name=\"keywords\" content=\""+ landingPage.tags + "\"/>";
			}
			fileContent = fileContent.replace("<!--pageMeta-->", meta);
			
			if(landingPage.header_includes != null && !landingPage.header_includes.isEmpty()) {
				fileContent = fileContent.replace("<!--headerIncludes-->", landingPage.header_includes);
			}
			
		    Document skeletonDoc = Jsoup.parse(fileContent);
		    Element mainPageElement = skeletonDoc.getElementById("page");
		    
		    JSONArray jsonArray = new JSONArray(fullXHtmlJson); 
		    for (int i = 0; i < jsonArray.length(); i++) {					
		        JSONObject lpElements = jsonArray.getJSONObject(i);				        
		        Document doc = Jsoup.parse(lpElements.getString("frameContent"));
		        fullbodyHtml = fullbodyHtml + doc.body().getElementById("page").children();				        
		    }
		    
		    mainPageElement.html(fullbodyHtml);
		    return skeletonDoc.toString();
		}
		catch (Exception e) {
	    	    System.out.println(ExceptionUtils.getFullStackTrace(e));
	    	    return null;
		}
		
	}
	
}
