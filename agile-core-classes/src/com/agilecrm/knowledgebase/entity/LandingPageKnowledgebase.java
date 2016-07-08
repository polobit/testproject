package com.agilecrm.knowledgebase.entity;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.landingpages.LandingPage;
import com.agilecrm.landingpages.LandingPageUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;

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
	{
		long id = landingpagekblist.get(0).id;
		deletekblpid(id);
		return null;
	}
	
	return lpkbid;
	}
	catch(Exception e){
			return null;
	}	
}

public Void deletekblpid(Long id) throws EntityNotFoundException{
	
	LandingPageKnowledgebase lbkbobj = LandingPageKnowledgebase.dao.get(id);
	
	LandingPageKnowledgebase.dao.delete(lbkbobj);

	return null;
	
}	

}
