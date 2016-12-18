package com.agilecrm.imap;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.FetchProfile;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import javax.mail.search.AndTerm;
import javax.mail.search.BodyTerm;
import javax.mail.search.FromStringTerm;
import javax.mail.search.OrTerm;
import javax.mail.search.RecipientTerm;
import javax.mail.search.SearchTerm;
import javax.mail.search.SubjectTerm;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.sun.mail.imap.IMAPFolder;
import com.sun.mail.imap.IMAPFolder.FetchProfileItem;
import com.sun.mail.imap.IMAPStore;

public class IMAPInboxUtil
{
    /**
     * Returns IMAPFolder . Getting folder from attribute overcome non-english
     * Gmail Folder names like 'Todos' in Spanish for All Mail in Gmail
     * 
     * @param store
     *            - Message store
     * @return Folder if exists, otherwise null folderName
     * @throws MessagingException
     */

    public static Folder getAllMailFolder(IMAPStore store) throws Exception
    {

	Folder folder = null;
	// Fetches all available folders
	IMAPFolder[] foldersList = (IMAPFolder[]) store.getDefaultFolder().list("*");
	for (IMAPFolder imapFolder : foldersList)
	{
		
	    if (Arrays.asList(imapFolder.getAttributes()).contains("\\All"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
	}

	return folder;
    }

    /**
     * It return all available folders in mail server
     * 
     * @param store
     * @return
     * @throws Exception
     */
    public static JSONArray getAllFolders(IMAPStore store) throws Exception
    {
	// Fetches all available folders
	IMAPFolder[] foldersList = (IMAPFolder[]) store.getDefaultFolder().list("*");
	JSONArray folders = new JSONArray();
	for (IMAPFolder imapFolder : foldersList)
	    folders.put(imapFolder.getFullName());
	return folders;
    }

    /**
     * It returns default mail server folder names. It user doesn't mention
     * specific folder names, we use these default folders to fetch mails
     * 
     * @return
     * @throws Exception
     */
    public static JSONArray getDefaultFolders(IMAPStore store) throws Exception
    {
	JSONArray defaultFolders = new JSONArray();
	List<IMAPFolder> folders = getListOfFolders(store, null);
	if (folders != null)
	{
	    for (IMAPFolder folder : folders)
		defaultFolders.put(folder.getFullName());
	}
	return defaultFolders;
    }

    /**
     * Returns IMAPFolder . Getting folder from attribute overcome non-english
     * Gmail Folder names like 'Todos' in Spanish for All Mail in Gmail
     * 
     * @param store
     *            - Message store
     * @return Folder if exists, otherwise null folderName
     * @throws MessagingException
     */
    public static Folder getSentMailFolder(IMAPStore store) throws Exception
    {
	Folder folder = null;
	// Fetches all available folders
	IMAPFolder[] foldersList = (IMAPFolder[]) store.getDefaultFolder().list("*");
	for (IMAPFolder imapFolder : foldersList)
	{
		if(imapFolder.getFullName().equalsIgnoreCase("[Gmail]/Sent Mail")){
	    	folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }else if (imapFolder.getFullName().equalsIgnoreCase("Sent"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
	    else if (imapFolder.getFullName().equalsIgnoreCase("Sent Items"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
	    else if (imapFolder.getFullName().equalsIgnoreCase("Sent Mail"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    } 
	}
	return folder;
    }
    /**
     * For getting draft mail folder
     * @param store
     * @return
     * @throws Exception
     */
    public static Folder getDraftMailFolder(IMAPStore store) throws Exception
    {
	Folder folder = null;
	// Fetches all available folders
	IMAPFolder[] foldersList = (IMAPFolder[]) store.getDefaultFolder().list("*");
	for (IMAPFolder imapFolder : foldersList)
	{
		if(imapFolder.getFullName().equalsIgnoreCase("[Gmail]/Drafts")){
	    	folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }else if (imapFolder.getFullName().equalsIgnoreCase("Draft"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
	    else if (imapFolder.getFullName().equalsIgnoreCase("Draft Items"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
	    else if (imapFolder.getFullName().equalsIgnoreCase("Draft Mail"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    } 
	}
	return folder;
    }
    /**
     * For getting trash mail folder
     * @param store
     * @return
     * @throws Exception
     */
    public static Folder getTrashMailFolder(IMAPStore store) throws Exception
    {
	Folder folder = null;
	// Fetches all available folders
	IMAPFolder[] foldersList = (IMAPFolder[]) store.getDefaultFolder().list("*");
	for (IMAPFolder imapFolder : foldersList)
	{
		if(imapFolder.getFullName().equalsIgnoreCase("[Gmail]/Trash")){
	    	folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
		else if (imapFolder.getFullName().equalsIgnoreCase("Trash"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
	    else if (imapFolder.getFullName().equalsIgnoreCase("Trash Items"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    }
	    else if (imapFolder.getFullName().equalsIgnoreCase("Trash Mail"))
	    {
			folder = store.getFolder(imapFolder.getFullName());
			return folder;
	    } 
	}
	return folder;
    }

    /**
     * This method is responsible for searching messages in a folder based on
     * particular email or email subject, and returns matched emails
     * 
     * @param folder
     * @param searchEmail
     * @param searchEmailSubject
     * @param count
     * @param offset
     * @return
     */
    public static Message[] searchMessagesInFolder(IMAPFolder folder, String searchEmail, String searchEmailSubject,
	    int count, int offset, String search_content) throws Exception
    {
	Message[] messages = null;
	if (folder != null)
	{
	    folder.open(Folder.READ_ONLY);
	    // Split by comma separator
	    String[] emailsArray= new String[0];
	   /* if(searchEmail != null && !searchEmail.equals("") && searchEmail != ""){
	    	emailsArray = StringUtils.split(searchEmail, ",");
	    }*/
	    messages = getSearchMessages(folder, emailsArray, searchEmailSubject, count, offset, search_content);
	}
	return messages;
    }

    /**
     * This method responsible search messages in a IMAP folder, once messages
     * retrieved from server and prefetches the required information from IMAP
     * folder
     * 
     * @param inbox
     * @param searchEmail
     * @param searchEmailSubject
     * @param count
     * @param offset
     * @return
     */
    public static Message[] getSearchMessages(IMAPFolder folder, String[] searchEmails, String searchEmailSubject,
	    int count, int offset,String search_content) throws Exception
    {
		Message[] messages = null;
		List<Message> message = new ArrayList<Message>();
		if(search_content != null && !search_content.equals("") && search_content != ""){
			SearchTerm searchTerm = getSearchTerm(folder, search_content);
			if (searchTerm != null){
			    messages = folder.search(searchTerm);
			    FetchProfile fetchProfile = new FetchProfile();
			    fetchProfile.add(FetchProfile.Item.ENVELOPE);
			    fetchProfile.add(FetchProfileItem.FLAGS);
			    fetchProfile.add(FetchProfileItem.CONTENT_INFO);
			    folder.fetch(messages, fetchProfile);
			}
		}else{
			int msgcount = folder.getMessageCount();
			if(msgcount < count)
				count = msgcount;
			
			int start = msgcount+1-count;
			int end = msgcount+1-offset;
			
			if(start > 0 && end > 0 && msgcount > 0){
				messages = folder.getMessages(start, end);
				FetchProfile fetchProfile = new FetchProfile();
			    fetchProfile.add(FetchProfile.Item.ENVELOPE);
			    fetchProfile.add(FetchProfileItem.FLAGS);
			    fetchProfile.add(FetchProfileItem.CONTENT_INFO);
			    folder.fetch(messages, fetchProfile);
			}else{
				return messages;
			}
		}
		return messages;
    }

    /**
     * This method is responsible for building search criteria for finding
     * emails in a IMAP folder
     * 
     * @param searchEmail
     * @param searchEmailSubject
     * @return
     */
    public static SearchTerm getSearchTerm(IMAPFolder folder, String[] searchEmails, String searchEmailSubject)
	    throws Exception
    {

	List<SearchTerm> searchTerms = new ArrayList<SearchTerm>();
	List<SearchTerm> subjectTerms = new ArrayList<SearchTerm>();
	SearchTerm searchTerm = null;

	for (String searchEmail : searchEmails)
	{
	    if (StringUtils.isNotBlank(searchEmail))
	    {
		Address address = new InternetAddress(searchEmail);
		SearchTerm toTerm = new RecipientTerm(Message.RecipientType.TO, address);
		SearchTerm ccTerm = new RecipientTerm(Message.RecipientType.CC, address);
		SearchTerm bccTerm = new RecipientTerm(Message.RecipientType.BCC, address);
		searchTerms.add(toTerm);
		searchTerms.add(ccTerm);
		searchTerms.add(bccTerm);
		SearchTerm fromStringTerm = new FromStringTerm(searchEmail);
		if (!(folder.getFullName().equalsIgnoreCase("Sent"))
		        && !(folder.getFullName().equalsIgnoreCase("Sent Items"))
		        && !(folder.getFullName().equalsIgnoreCase("Sent Mail")))
		    searchTerms.add(fromStringTerm);
		if (StringUtils.isNotBlank(searchEmailSubject))
		{
		    SearchTerm andTerm = new AndTerm(new SubjectTerm(searchEmailSubject), fromStringTerm);
		    subjectTerms.add(andTerm);
		}
	    }
	}
	// If subject is null, search based on email
	if (StringUtils.isBlank(searchEmailSubject))
	{
	    SearchTerm[] recipientTerms = getSearchTerms(searchTerms);
	    searchTerm = new OrTerm(recipientTerms);
	}
	else
	{
	    SearchTerm[] recipientTerms = getSearchTerms(subjectTerms);
	    searchTerm = new OrTerm(recipientTerms);
	}
	return searchTerm;

    }

    /**
     * Converts list of search terms into Array of search terms
     * 
     * @param searchTerms
     * @return
     */
    public static SearchTerm[] getSearchTerms(List<SearchTerm> searchTerms) throws Exception
    {
	SearchTerm[] searchTermArray = new SearchTerm[searchTerms.size()];
	for (int i = 0; i < searchTerms.size(); i++)
	    searchTermArray[i] = searchTerms.get(i);
	return searchTermArray;
    }

  
    /**
     * Reads email messages and constructs them in a JSON format, server will
     * send JSON email messages into Client
     * 
     * @param messages
     * @param count
     * @param offset
     * @return
     * @throws Exception
     */
    public static JSONArray getMessages(List<Message> messages, int count, int offset, int messagecount) throws Exception
    {
	JSONArray searchResults = new JSONArray();
	try
	{
		
		if(messages != null){
			
		if (messages.size() <= 0)
		{
		    return searchResults;
		}
		if(messages.size() <= 10){
			int  messagesize = messages.size()-1;
			while(messagesize >= 0){
				Message message = messages.get(messagesize);
				
				JSONObject messageJSON = new JSONObject();
				if(messagesize == 0)
					messageJSON.put("count",messagecount);
				
				messageJSON.put("subject", message.getSubject());
				messageJSON.put("id",message.getMessageNumber());
				Date date = message.getSentDate();
				messageJSON.put("date_secs", date.getTime());
				messageJSON.put("date", date);
				Address[] from = message.getFrom();
				if(from != null){
					messageJSON.put("from", InternetAddress.toString(from)); //messageJSON.put("from", MimeUtility.decodeText(InternetAddress.toString(from)));
				}else{
					messageJSON.put("from", from);
				}
				Address[] to = message.getAllRecipients();
				if(to != null){
					messageJSON.put("to", InternetAddress.toString(to));
				}else{
					messageJSON.put("to", to);
				}
				if(message.isSet(Flags.Flag.SEEN)){
					messageJSON.put("flags", "read");
				}else{
					messageJSON.put("flags", "unread");
				}
				
				searchResults.put(messageJSON);
				
				messagesize--;
			}
		}else{
			
			int counter = messages.size()-count;
			int  messagesize = messages.size()-offset;
			for(int i=messagesize;i>=counter;i--){
				Message message = messages.get(i);
				
				JSONObject messageJSON = new JSONObject();
				messageJSON.put("count",messagecount);
				messageJSON.put("subject", message.getSubject());
				messageJSON.put("id", message.getMessageNumber());
				Date date = message.getSentDate();
	
				messageJSON.put("date_secs", date.getTime());
				messageJSON.put("date", date);
				String mimeType = message.getContentType();
				messageJSON.put("mime_type", mimeType);
	
				messageJSON.put("from", MimeUtility.decodeText(InternetAddress.toString(message.getFrom())));
				messageJSON.put("to", MimeUtility.decodeText(InternetAddress.toString(message.getAllRecipients())));
				String flag = "";
				if(message.isSet(Flags.Flag.SEEN)){
					flag = "read";
				}else{
					flag = "unread";
				}
				messageJSON.put("flags", flag);
				
				searchResults.put(messageJSON);
			}
		}
		}else{
			return searchResults;
		}
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    e.printStackTrace();
	    throw e;
	}
	return searchResults;
    }

    /**
     * Merges the list of JSON Arrays into a single JSON Array
     * 
     * @param arrs
     * @return
     * @throws Exception
     */
    public static JSONArray concatArray(JSONArray... arrs) throws Exception
    {
	JSONArray result = new JSONArray();
	for (JSONArray arr : arrs)
	{
	    for (int i = 0; i < arr.length(); i++)
	    {
		result.put(arr.get(i));
	    }
	}
	return result;
    }

    /**
     * Gets folder objects from mail server by using folderName If folderNames
     * is null then it returns All Mail/Inbox+Sent folders
     * 
     * @param store
     * @param folderNamesStr
     * @return
     * @throws Exception
     */
    public static List<IMAPFolder> getListOfFolders(IMAPStore store, String folderNamesStr) throws Exception
    {
	List<IMAPFolder> folders = new ArrayList<IMAPFolder>();
	
	if (StringUtils.isNotBlank(folderNamesStr))
	{
		if(!StringUtils.equals(folderNamesStr, "Sent") && !StringUtils.equals(folderNamesStr, "Draft") && !StringUtils.equals(folderNamesStr, "Trash")){
			
			IMAPFolder folder = (IMAPFolder) store.getFolder(folderNamesStr);
			if (folder != null && folder.exists())
			    folders.add(folder);
		}else{
			if(StringUtils.equals(folderNamesStr, "Sent")){
				IMAPFolder sent = (IMAPFolder) IMAPInboxUtil.getSentMailFolder(store);
				if (sent != null && sent.exists())
				    folders.add(sent);
			}else if(StringUtils.equals(folderNamesStr, "Draft")){
				IMAPFolder sent = (IMAPFolder) IMAPInboxUtil.getDraftMailFolder(store);
				if (sent != null && sent.exists())
				    folders.add(sent);
			}else if(StringUtils.equals(folderNamesStr, "Trash")){
				IMAPFolder sent = (IMAPFolder) IMAPInboxUtil.getTrashMailFolder(store);
				if (sent != null && sent.exists())
				    folders.add(sent);
			}
		}
	}
	else
	{
	    // Get 'All Mail' Folder
	    IMAPFolder allMailFolder = (IMAPFolder) IMAPInboxUtil.getAllMailFolder(store);
	    if (allMailFolder == null || !allMailFolder.exists())
	    {
	    	IMAPFolder[] foldersList = (IMAPFolder[]) store.getDefaultFolder().list("*");
	    	for (IMAPFolder imapFolder : foldersList)
	    	{
	    		folders.add((IMAPFolder)store.getFolder(imapFolder.getFullName()));
	    	}
	    	if(folders.size() == 0){
				IMAPFolder inbox = (IMAPFolder) store.getFolder("INBOX");
				IMAPFolder sent = (IMAPFolder) IMAPInboxUtil.getSentMailFolder(store);
				if (inbox != null && inbox.exists())
				    folders.add(inbox);
				if (sent != null && sent.exists())
				    folders.add(sent);
	    	}
	    }
	    else
		folders.add(allMailFolder);
	}
	return folders;
    }
    
    /**
     * Rajesh Code
     */
    
    /**
     * This method is responsible for building search criteria for finding
     * emails in a IMAP folder
     * 
     * @param searchEmail
     * @param searchEmailSubject
     * @return
     */
    public static SearchTerm getSearchTerm(IMAPFolder folder, String search_content)
	    throws Exception
    {
    	List<SearchTerm> searchTerms = new ArrayList<SearchTerm>();
    	SearchTerm searchTerm = null;
	      if (StringUtils.isNotBlank(search_content)){
	    	if(search_content.contains("@") || StringUtils.contains("@", search_content)){
	    		Address address = new InternetAddress(search_content);
	    		SearchTerm toTerm = new RecipientTerm(Message.RecipientType.TO, address);
	    		SearchTerm ccTerm = new RecipientTerm(Message.RecipientType.CC, address);
	    		SearchTerm bccTerm = new RecipientTerm(Message.RecipientType.BCC, address);
	    		searchTerms.add(toTerm);
	    		searchTerms.add(ccTerm);
	    		searchTerms.add(bccTerm);
	    		
	    		FromStringTerm fromTerm = new FromStringTerm(search_content);
	    		searchTerms.add(fromTerm);
	    		
	    		SearchTerm[] recipientTerms = getSearchTerms(searchTerms);
	    	    searchTerm = new OrTerm(recipientTerms);
	    	}else{
	    		 searchTerm = new OrTerm(new SubjectTerm(search_content), new BodyTerm(search_content));
	    	}
	      }
    	return searchTerm;
    }
    /**
     * Gets the individual email message from multipart email message
     * 
     * @param o
     * @return
     * @throws Exception
     */
    public static String getMessage(Multipart o) throws Exception{
		Multipart mp = (Multipart) o;
		int count3 = mp.getCount();	
		System.out.println("count of multipart message: "+count3);
		for (int j = 0; j < count3; j++){
		    BodyPart b = mp.getBodyPart(j);
		    
		    Object o2 = b.getContent();
		    if ((o2 instanceof String)){
		    	return (String) o2;
		    }
		    if ((o2 instanceof Multipart)){
		    	Multipart mp2 = (Multipart) o2;
				return getMessage(mp2);
		    }else if ((o2 instanceof InputStream)){
		    	System.out.println("**This is an InputStream BodyPart**");
		    }
		}
		return "";
    }

    public static JSONArray getMailContent(IMAPStore store,int msgnum, String foldername) throws Exception{
    	JSONArray searchResults = new JSONArray();
    	try{
    		Folder folder;
    		if(StringUtils.equals(foldername, "Sent")){
    			folder = getSentMailFolder(store);
    		}else if(StringUtils.equals(foldername, "Draft")){
    			folder = getDraftMailFolder(store);
    		}else if(StringUtils.equals(foldername, "Trash")){
    			folder = getTrashMailFolder(store);
    		}
    		else{
    			folder = store.getFolder(foldername);
    		}
	    	folder.open(Folder.READ_WRITE);
	    	JSONObject messageJSON = new JSONObject();
	    	
	    	MimeMessage msg = (MimeMessage)folder.getMessage(msgnum);
	        MimeMessage cmsg = new MimeMessage(msg);
	        Object o = cmsg.getContent();
	        cmsg.setFlag(Flags.Flag.SEEN, true);
	        
	        
			if ((o instanceof String)){
				System.out.println("transfer content========="+(String)o +"================"+o);
			    messageJSON.put("message", (String) o);
			}else if ((o instanceof Multipart)){
			    String multi = getMessage((Multipart) o);
			    System.out.println("transfer content========="+(String)multi +"================"+multi);
			    messageJSON.put("message", (String) multi);
			}else if ((o instanceof InputStream)){
			    System.out.println("**This is an InputStream message**");
			}
			searchResults.put(messageJSON);
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    	return searchResults;
    }
    
    public static void sendReply() {
    	
    }
}
