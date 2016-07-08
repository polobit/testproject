package com.agilecrm.knowledgebase.entity;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.landingpages.LandingPage;
import com.agilecrm.landingpages.LandingPageUtil;

import java.util.List;

public class LandingPageKnowledgebase
{
	@Id
	public Long id;
    
	public  Long kbLandingpageid; 
	 
public static ObjectifyGenericDao<LandingPageKnowledgebase> dao = new ObjectifyGenericDao<LandingPageKnowledgebase>(
		LandingPageKnowledgebase.class);

public  Long getkbLandingpageid()
{
	try{	
	List<LandingPageKnowledgebase> landingpagekblist = LandingPageKnowledgebase.dao.fetchAll();
	Long lpkbid =  landingpagekblist.get(0).kbLandingpageid;
	LandingPage landingPage = LandingPageUtil.getLandingPage(lpkbid);
	if(landingPage == null)
		return null;
	
	return lpkbid;
	}
	catch(Exception e){
			return null;
	}
	
	
	
}

}
