package com.agilecrm.account.util;

import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.account.EmailTemplateCategory;
import com.agilecrm.db.ObjectifyGenericDao;
import com.amazonaws.util.StringUtils;


/**
 * <code>EmailTemplateCategoryUtil</code> is the utility class for
 * {@link EmailTemplateCategory}. It fetches emailTemplateCategory with respect to id,
 * all emailTemplateCategory in order.
 * 
 * @author Prakash kumar
 */
public class EmailTemplateCategoryUtil {

	/**
	 * Initialize DataAccessObject.
	 */
	private static ObjectifyGenericDao<EmailTemplateCategory> dao = new ObjectifyGenericDao<EmailTemplateCategory>(
			EmailTemplateCategory.class);
	
	/**
	 * Locates EmailTemplateCategory based on id.
	 * 
	 * @param id
	 *            EmailTemplateCategory id.
	 * @return EmailTemplateCategory object with that id if exists, otherwise null.
	 */
	public static EmailTemplateCategory getEmailTemplateCategory(Long id){
		try{
			return dao.get(id);
			
		}catch (Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
			return null;
		}
	}
	
	
	/**
	 * Returns all EmailTemplateCategory orderBy fieldName.
	 * 
	 * @param fieldName
	 *            EmailTemplateCategory name.
	 * @return list of all EmailTemplateCategory.
	 */
	public static List<EmailTemplateCategory> getAllEmailTemplateCategory(String fieldName){
		try {
			  return dao.ofy().query(EmailTemplateCategory.class).order(fieldName).list();
			  
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	/**
	 * Returns emailTemplateCategory-name count. It avoids saving duplicate emailTemplateCategory-names.
	 * 
	 * @param categoryName
	 *            - EmailTemplateCategory name.
	 * @return int
	 */
	public static int getEmailTemplateCategoryNameCount(String categoryName){
		if(StringUtils.isNullOrEmpty(categoryName)){
			return 0;
		}
		return dao.ofy().query(EmailTemplateCategory.class).filter("name_dummy", categoryName.trim().toLowerCase()).count();
	}
	
	
	/**
	 * Returns count of EmailTemplate Categories
	 * 
	 * @return int
	 */
	public static int getCount(){
		return EmailTemplateCategory.dao.count();
	}
}
