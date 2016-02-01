package com.agilecrm.core.api.prefs;



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

import javax.ws.rs.core.MediaType;



import org.json.JSONArray;

import org.json.JSONException;



import com.agilecrm.account.DocumentTemplates;

import com.agilecrm.account.util.DocumentTemplatesUtil;



/**

 * <code>DocumentTemplatesPrefsAPI</code> includes REST calls to interact with

 * {@link DocumentTemplates} class. It performs all CRUD Operations for

 * DocumentTemplates.

 * 

 */

@Path("/api/document/templates")
public class DocumentTemplatesPrefsAPI

{

/**

* Gets all DocumentTemplates. This method is called if TEXT_PLAIN is request

* 

* @return DocumentTemplates List.

*/

@GET

@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })

public List<DocumentTemplates> getAllDocumentTemplates()

{

return DocumentTemplatesUtil.getAllDocumentTemplates();

}



/**

* Gets DocumentTemplates with respect to id.

* 

* @param id

*            - DocumentTemplates id.

* @return DocumentTemplates

*/

@Path("/{template-id}")

@GET

@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })

public DocumentTemplates getDocumentTemplate(@PathParam("template-id") Long id)

{

return DocumentTemplatesUtil.getDocumentTemplate(id);

}



/**

* Saves DocumentTemplates.

* 

* @param document

*            - DocumentTemplates object to be saved.

* @return DocumentTemplates.

*/

@POST

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })

@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })

public DocumentTemplates createDocumentTemplate(DocumentTemplates document)

{

document.save();

return document;

}



/**

* Updates DocumentTemplates.

* 

* @param document

*            - DocumentTemplates object to be updated.

* @return DocumentTemplates.

*/

@PUT

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })

@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })

public DocumentTemplates updateDocumentTemplate(DocumentTemplates document)

{

document.save();

return document;

}



/**

* Deletes DocumentTemplates with respect to id.

* 

* @param id

*            - DocumentTemplates Id.

*/

@Path("/{document-id}")

@DELETE

public void deleteDocumentTemplate(@PathParam("document-id") Long id)

{

DocumentTemplates document = DocumentTemplatesUtil.getDocumentTemplate(id);

if (document != null)

document.delete();

}



/**

* Deletes bulk of document templates based on their ids.

* 

* @param model_ids

*            Array of documentTemplate ids as String.

* @throws JSONException

*/

@Path("bulk")

@POST

@Consumes(MediaType.APPLICATION_FORM_URLENCODED)

public void deleteDocumentTemplates(@FormParam("ids") String model_ids) throws JSONException

{

JSONArray documentsJSONArray = new JSONArray(model_ids);

DocumentTemplates.dao.deleteBulkByIds(documentsJSONArray);

}



/**

* Gets all DocumentTemplates. This method is called if TEXT_PLAIN is request

* 

* @return DocumentTemplates List.

*/

@Path("/count")

@GET

@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })

public int getCount()

{

return DocumentTemplatesUtil.getCount();

}

}