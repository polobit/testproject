package com.agilecrm.deals;

import java.io.IOException;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.json.JSONException;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class CurrencyConversionRates {
	public static ObjectifyGenericDao<CurrencyConversionRates> dao = new ObjectifyGenericDao<CurrencyConversionRates>(
			CurrencyConversionRates.class);
	@Id
	public Long id;

	@NotSaved(IfDefault.class)
	public String currencyRates = null;

	@NotSaved(IfDefault.class)
	public String baseRate = null;
	
	@NotSaved(IfDefault.class)
	public Long updated_time = 0L;

	public void save() {
		dao.put(this);
	}

	public void delete() {
		dao.delete(this);
	}
	@PrePersist
    private void PrePersist() throws IOException, JSONException
    {
		updated_time = System.currentTimeMillis() / 1000 ;
		System.out.println("updated time for currency rates is "+updated_time);
    }

}
