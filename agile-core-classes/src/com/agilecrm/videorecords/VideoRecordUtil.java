package com.agilecrm.videorecords;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;

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

  public List<VideoRecord> getAll() {
    try {
      return dao.fetchAll();
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

}
