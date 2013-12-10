package com.agilecrm.core.api;

import java.util.Arrays;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;

import com.agilecrm.gadget.GadgetTemplate;

@Path("api/template")
public class TemplatesAPI
{
    @Path("/all")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getTemplateNames(@QueryParam("directory") String directory)
    {
	JSONArray response = new JSONArray(Arrays.asList(GadgetTemplate
		.getFilesNames(directory)));

	return response.toString();
    }

    @Path("/content")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getTemplate(@QueryParam("path") String path)
    {
	return GadgetTemplate.getTemplate(path);
    }
}
