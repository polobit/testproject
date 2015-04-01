package com.agilecrm.core.api.contacts;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.VCard;
import com.agilecrm.contact.util.ContactUtil;

/**
 * 
 * <code>VCardAPI</code> includes REST calls to interact with {@link VCard}
 * class to get the VCard string using {@link Contact} properties.
 * <p>
 * It is called from client side to generate VCard string for the contacts based
 * on properties to produce QR Code. It also interacts with {@link ContactUtil}
 * class to fetch the data of Contact class from database.
 * </p>
 * 
 * @author mantra
 * 
 */

@Path("/api/VCard")
public class VCardAPI
{
    /**
     * Gets the VCard String of particular contact based on properties.
     * 
     * @param id
     * @return VCard String
     */
    @Path("/{contact-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getVcard(@PathParam("contact-id") Long id)
    {
	Contact contact = ContactUtil.getContact(id);
	VCard vcard = new VCard(contact.getProperties());
	return vcard.getVCardString();
    }
}