package com.agilecrm.customthemes;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class CustomTheme {

	@Id
	public Long id;
	
	@Indexed
    @NotSaved(IfDefault.class)
	public String name;
	
	@Indexed
    @NotSaved(IfDefault.class)
	public String themeCss;
	
	public static ObjectifyGenericDao<CustomTheme> dao = new ObjectifyGenericDao<CustomTheme>(CustomTheme.class);
	
	public CustomTheme(){
		
	}
	public CustomTheme(String name, String themeCss) {
		this.name = name;
		this.themeCss = themeCss;
	}
	
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getThemeCss() {
		return themeCss;
	}


	public void setThemeCss(String themeCss) {
		this.themeCss = themeCss;
	}


	public void saveTheme(){
		 dao.put(this);
	}

	public List<CustomTheme> fetchAllThemes(){
		return dao.fetchAll();
	}
	
	public void deleteTheme(){
		dao.delete(this);
	}
	
}
