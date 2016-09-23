package com.agilecrm.videorecords;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.landingpages.LandingPage;

public class VideoRecordUtil {
  public static ObjectifyGenericDao<VideoRecord> dao = new ObjectifyGenericDao<VideoRecord>(
      VideoRecord.class);

  public VideoRecord get(Long id) {
    try {
      return dao.get(id);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  public List<VideoRecord> getAll(String fieldName) {
	  try {
		  //return dao.fetchAll();
		  return dao.ofy().query(VideoRecord.class).order(fieldName).list();
		  
	} catch (Exception e) {
		e.printStackTrace();
		return null;
	}
  }

}
