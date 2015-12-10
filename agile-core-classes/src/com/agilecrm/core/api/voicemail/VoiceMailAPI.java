package com.agilecrm.core.api.voicemail;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.voicemail.VoiceMail;
import com.agilecrm.voicemail.util.VoiceMailUtil;

@Path("/api/voicemails")
public class VoiceMailAPI
{

	/**
	 * Returns list of voice mails. This method is called if TEXT_PLAIN is
	 * request.
	 * 
	 * @return list of voice mails.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<VoiceMail> getAllVoiceMails(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
	{
		if (count != null)
		{
			return VoiceMailUtil.getVoiceMails((Integer.parseInt(count)), cursor);
		}
		return VoiceMailUtil.getVoiceMails();
	}

	@Path("{voicemail-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public VoiceMail getVoiceMail(@PathParam("voicemail-id") Long id)
	{
		VoiceMail voicemail = VoiceMailUtil.getVoiceMail(id);
		return voicemail;
	}

	@Path("{voicemail-id}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteDocument(@PathParam("voicemail-id") Long id)
	{
		try
		{
			VoiceMail voicemail = VoiceMailUtil.getVoiceMail(id);
			if (voicemail != null)
				voicemail.delete();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}


	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public VoiceMail createVoiceMail(VoiceMail voicemail)
	{
		voicemail.save();
		return voicemail;
	}

	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public VoiceMail updateVoiceMail(VoiceMail voicemail)
	{
		voicemail.save();
		return voicemail;
	}

	/**
	 * Deletes bulk
	 * 
	 * 
	 * 
	 * @param model_ids
	 *             ids, read as form parameter from request url
	 * @throws JSONException
	 */
	@Path("bulk")
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void deleteVoiceMails(@FormParam("ids") String model_ids) throws JSONException
	{
		JSONArray voicemailJSONArray = new JSONArray(model_ids);
		VoiceMail.dao.deleteBulkByIds(voicemailJSONArray);
	}

}
