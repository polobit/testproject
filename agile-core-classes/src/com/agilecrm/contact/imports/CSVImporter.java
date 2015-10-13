package com.agilecrm.contact.imports;

import java.io.IOException;
import java.io.InputStream;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.core.api.ObjectMapperProvider;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessControl.AccessControlClasses;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.taskqueue.DeferredTask;

public abstract class CSVImporter<T> implements CSVImportable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    protected String domain;
    protected BlobKey blobKey;
    protected Long domainUserId;
    // Holds the mapper object which is sent after
    private String entityMapper;

    private BillingRestriction billingRestriction;
    private UserAccessControl userAccessControl;
    private DomainUser user;
    private InputStream blobStream;
    protected final Class<T> clazz;

    public CSVImporter(String domain, BlobKey blobKey, Long domainUserId, String entityMapper, Class<T> clazz)
    {
	this.domain = domain;
	this.blobKey = blobKey;
	this.domainUserId = domainUserId;
	this.clazz = clazz;
	this.entityMapper = entityMapper;
    }

    protected T getMapperEntity() throws JsonParseException, JsonMappingException, IOException
    {
	ObjectMapper mapper = new ObjectMapperProvider().getContext(clazz);
	return (T) mapper.readValue(entityMapper, clazz);
    }

    /**
     * Fetches user who initiated that request
     * 
     * @return
     */
    protected final DomainUser getDomainUser()
    {
	if (user != null)
	    return user;

	return user = DomainUserUtil.getDomainUser(domainUserId);
    }

    protected final InputStream getInputStream() throws IOException
    {
	return blobStream = new BlobstoreInputStream(blobKey);
    }

    @Override
    public final BillingRestriction getBillingRestriction()
    {
	if (billingRestriction != null)
	    return billingRestriction;

	billingRestriction = BillingRestrictionUtil.getBillingRestrictionFromDB();
	// TODO Auto-generated method stub

	return billingRestriction;
    }

    @Override
    public final UserAccessControl getUserAccessControl()
    {
	if (userAccessControl != null)
	    return userAccessControl;

	userAccessControl = UserAccessControl.getAccessControl(AccessControlClasses.Contact, null, getDomainUser());

	// TODO Auto-generated method stub
	return userAccessControl;
    }
}

interface CSVImportable extends DeferredTask
{
    public BillingRestriction getBillingRestriction();

    public UserAccessControl getUserAccessControl();
}
