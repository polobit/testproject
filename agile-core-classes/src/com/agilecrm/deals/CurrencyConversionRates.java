package com.agilecrm.deals;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class CurrencyConversionRates {
	public static ObjectifyGenericDao<CurrencyConversionRates> dao = new ObjectifyGenericDao<CurrencyConversionRates>(
			CurrencyConversionRates.class);

	@NotSaved(IfDefault.class)
	public String currencyRates = null;

	@NotSaved(IfDefault.class)
	public String baseRate = null;

	public void save() {
		dao.put(this);
	}

	public void delete() {
		dao.delete(this);
	}

}
