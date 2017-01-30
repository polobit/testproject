package com.campaignio.servlets.util;

import java.net.URI;
import java.net.URISyntaxException;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.util.EmailLinksConversion;

public class SpamTracker 
{
	
	public static final String[] blockedDomains = {"case-3020", "case-3022", "secure342", "billing-upgrade"};
	
	public static boolean isSpamDomain(String url)
	{
		try {
			if(StringUtils.isBlank(url))
				return true;
			
			url = StringUtils.trim(url);
			
			System.out.println("URL is " + url);
			
			// Get host from URL
			if(StringUtils.startsWith(url, "http"))
			{
				try 
				{
					URI uri = new URI(url);
					url = uri.getHost();
				} catch (URISyntaxException e) {
					e.printStackTrace();
				}
			}
			
			String tokens[] = StringUtils.split(url, '.');
			
			if(tokens.length < 3)
				return false;
			
			// Checks whether domain is blocked
			for(String domain : blockedDomains)
			{
				if(StringUtils.containsIgnoreCase(tokens[1], domain))
				{
					System.err.println("Obtained URL " + url + " matches with our Spam rules.");
					return true;
				}
			}
			
			for(String domain : EmailLinksConversion.skippedURLDomains)
			{
				// Check whether subdomain is same as root domain. Eg; apple.apple.com
				if(StringUtils.containsIgnoreCase(tokens[0], domain)
						&& !StringUtils.containsIgnoreCase(tokens[1], domain))
				{
					System.err.println("Obtained URL " + url + " matches with our Spam rules.");
					return true;
				}
			}
		} catch (Exception e) {
			System.err.println("Exception occured while checking Spam domain");
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		
		return false;
	}
	
	public static void main(String[] args) {
		System.out.println(isSpamDomain("https://apple.apple.com"));
	}

}
