package com.agilecrm.knowledgebase.entity;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
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
	List<LandingPageKnowledgebase> landingpagekblist = LandingPageKnowledgebase.dao.fetchAll();
	Long lpkbid =  landingpagekblist.get(0).kbLandingpageid;
	System.out.println(lpkbid+"xyz");
	return lpkbid;
}

}
