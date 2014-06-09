package com.agilecrm.social;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ListIterator;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.widgets.Widget;

import facebook4j.Facebook;
import facebook4j.FacebookException;
import facebook4j.FacebookFactory;
import facebook4j.Friend;
import facebook4j.ResponseList;
import facebook4j.User;
import facebook4j.auth.AccessToken;
//import org.codehaus.jettison.json.JSONObject;

/**
 * The <code>StripePluginUtil</code> class acts as a Client to Stripe server
 * 
 * <code>StripePluginUtil</code> class contains methods to retrieve stripe
 * customers details
 * 
 * @author Tejaswi
 * @since February 2013
 */
public class FacebookUtil
{


	/**
     * Retrieves Stripe customer details and invoices from Stripe plugin server
     * 
     * @param widget
     *            {@link Widget} to retrieve stripe access token
     * @param customerId
     *            ID of the customer in Stripe
     * @return {@link JSONObject} form of the response returned from Stripe
     * @throws Exception
     */
    public  String getContactsByEmail(Widget widget, String name) throws Exception
	   
    {
    		Facebook facebook = new FacebookFactory().getInstance();
    		facebook.setOAuthAppId(Globals.FACEBOOK_APP_ID, Globals.FACEBOOK_APP_SECRET);
    		facebook.setOAuthAccessToken(new AccessToken(widget.getProperty("token"), null));
    		
    		ResponseList<User> results = facebook.searchUsers(name);
    		
    		System.out.println("responseis"+results.size());
    		int count = (results.size()>25)?25:results.size();
    		JSONArray userArr = new JSONArray();
    		for(int i=0;i<count;i++)
    		{
    			JSONObject user = new JSONObject();
    			User temp = results.get(i);
     			user.put("userId",temp.getId());
     			URL pictureurl = null;
    			
    			if(temp.getId()!=null)
    			{
     				pictureurl = facebook.getPictureURL(temp.getId());
    				User u = facebook.getUser(temp.getId());
    				
    			
    			user.put("userName",u.getName());
    			user.put("userPicUrl",pictureurl.toString());
     			user.put("email",u.getEmail());
    			user.put("lacation",u.getLocation());
    			user.put("weburl",u.getWebsite());
    			user.put("fbpage",u.getLink());
    			user.put("hometown",u.getHometown());
    			}
    			userArr.put(user);
    		}
    		return new JSONObject().put("profiles",userArr).toString();
		

    }
    
    public String getFacebookProfileById(Widget widget,String id) throws Exception
    {
    	//sendRequest();
    	User fbuser = null;
    	JSONObject fbJson = null;
    	try
    	{
    	Facebook facebook = new FacebookFactory().getInstance();
		facebook.setOAuthAppId(Globals.FACEBOOK_APP_ID, Globals.FACEBOOK_APP_SECRET);
		facebook.setOAuthAccessToken(new AccessToken(widget.getProperty("token"), null));
		
		fbuser= facebook.getUser(id);
		
		fbJson = new JSONObject();
		fbJson.put("url",fbuser.getLink().toString());
		fbJson.put("name",fbuser.getName());
		fbJson.put("location",fbuser.getLocation());
		
		System.out.println(facebook.getMe());
	//	System.out.println(facebook.postStatusMessage("hello agile crm"));
		System.out.println((facebook.friends()).getFriendlists());
		System.out.println();
		ResponseList<Friend> frnds = (facebook.friends()).getFriends();
		System.out.println("frnds"+frnds);
		if(frnds.size()!=0)
		{
			ListIterator<Friend> li = frnds.listIterator();
			while(li.hasNext())
			{
				Friend frnd = li.next();
				if(id.equalsIgnoreCase(frnd.getId()))
				{
					fbJson.put("isFriend","true");
				}
				else
				{
					fbJson.put("isFriend","false");
				}
					
			}
		}
		else
		{
			fbJson.put("isFriend","false");
		}
		
		
		
		
		//ResponseList<Friendlist> fl = fm.getFriendlists(id);
		
		
	//	sendRequest();
    	}
    	catch(FacebookException e)
    	{
    		e.printStackTrace();
    	}
    	catch (Exception e)
    	{
    		e.printStackTrace();
    	}
    	return fbJson.toString();
    }
    
    public  String postOnWall(Widget widget, String id,String message) throws Exception
	   
    {
    	
    	String url = "https://www.facebook.com/dialog/feed?%20%20%20app_id=1472962409608031%20%20%20&display=popup&from=me&to="+id+"&caption=An%20example%20caption%20%20%20%20&link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F%20%20%20&redirect_uri=http://localhost:8888/scribe";
			//SignpostUtil.accessURLWithOauth(Globals.FACEBOOK_APP_ID,Globals.FACEBOOK_APP_SECRET,widget.getProperty("token"),"","https://graph.facebook.com/me","GET","","Facebook");
    	sendRequest(url);
    		return "";
    }
    
    
    public void sendRequest(String url) throws Exception
    {
    	
    	//mutualfriends  me/friends/655258604544085
    	//mutual friends 655258604544085.context/mutual_friends
    	//posts
    	//String url = "https://graph.facebook.com/v2.0/me/friendlists ?access_token=CAAU7pskxM18BAAXXwAHAxkNi2J9e7ZCT0Xw1EC4Cs1neJ9cmEyJ2ZC25Fcx5ZC5JVjUXY2yLNIqAOWsAcueiciJh16kgCIv1p60Ps0LVJJ1lMbmnVaKnYYDl7bP2Gn5Sb3dwk35FISAuLbGBNi4WJD2iv4BHf5CA8DHW1eDaOZCzSEBwZAZC6X";
    	 
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
 
		// optional default is GET
		con.setRequestMethod("GET");
 
		//add request header
		//con.setRequestProperty("access_token", "CAAU7pskxM18BABPTAXeSyaLNwie1zycI6x3NrkM1skAU54ZCaVKfdkK829763i7NMTuaj2wahcz2RGwEWPZAZC7UFybzav1FRUGlpe04XwUs7Bm7Ill5RPUSj2nT2D8NXyUp1KfCZC1YwwZB8JIhrmuWyjg7IR0olnhkAz4khEGW08gQpQ8OYK4Wje14CxDsZD");
 
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);
 
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
 
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
 
		//print result
		System.out.println(response.toString());
 
	}
    
    
}

