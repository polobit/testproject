package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.company.Company;

@Path("/api/companies")
public class CompanyAPI
{

    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Company> getCompanies()
    {
	return Company.getAllCompanies();
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Company createCompany(Company company)
    {
	company.save();
	return company;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Company updateContact(Company company)
    {
	company.save();
	return company;
    }
}
