package com.agilecrm.core.api.videorecords;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.videorecords.VideoRecord;
import com.agilecrm.videorecords.VideoRecordUtil;

@Path("/api/video-record")
public class VideoRecordAPI {
  public VideoRecordUtil videoRecordUtil = new VideoRecordUtil();

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public List<VideoRecord> getAll() {
    return videoRecordUtil.getAll();
  }

  @Path("{video-record-id}")
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public VideoRecord get(@PathParam("video-record-id") Long id) {
    return videoRecordUtil.get(id);
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public VideoRecord create(VideoRecord videoRecord) {
    videoRecord.save();
    return videoRecord;
  }

  @PUT
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public VideoRecord update(VideoRecord videoRecord) {
    videoRecord.save();
    return videoRecord;
  }

}
