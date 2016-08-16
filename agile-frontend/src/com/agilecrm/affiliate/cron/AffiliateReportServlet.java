package com.agilecrm.affiliate.cron;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.json.JSONException;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.agilecrm.affiliate.Affiliate;
import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.affiliate.util.AffiliateDetailsUtil;
import com.agilecrm.affiliate.util.AffiliateUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

/**
 * @author Santhosh
 * 
 * Servlet implementation class AffiliateReportServlet
 * 
 * Servlet to send report to management every month with all users details  
 */
public class AffiliateReportServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AffiliateReportServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		//Fetches all namespaces
      	Set<String> namespaces = NamespaceUtil.getAllNamespacesNew();
      	Map<String, Object> map = new HashMap<String, Object>();
      	Calendar calendar = Calendar.getInstance();
		// add -1 month to current month
		calendar.add(Calendar.MONTH, -1);
		// set DATE to 1, so first date of previous month
		calendar.set(Calendar.DATE, 1);

		Long firstDateOfPreviousMonth = calendar.getTime().getTime();

		// set actual maximum date of previous month
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		Long lastDateOfPreviousMonth = calendar.getTime().getTime();
      	for(String namespace : namespaces){
      		NamespaceManager.set(namespace);
      		try{
      			List<DomainUser> users = DomainUserUtil.getAllAdminUsers(namespace);
      			for(DomainUser user : users){
      				List<Affiliate> affiliates = AffiliateUtil.getAffiliates(user.id, firstDateOfPreviousMonth, lastDateOfPreviousMonth);
      				if(affiliates.size() > 0){
      					map.put("userId", user.id);
      					AffiliateDetails affDetails = AffiliateDetailsUtil.getAffiliateDetailsbyUserId(user.id);
      					if(affDetails != null && affDetails.getPaypalId() != null)
      						map.put("paypalId", affDetails.getPaypalId());
      					// MORE DETAILS
      					/*int totalAmount = 0;
      					int totalCommission = 0;
      					for(Affiliate affiliate : affiliates){
      						Map<String, Object> details = new HashMap<String, Object>();
      						details.put("name",affiliate.getEmail());
      						details.put("domain",affiliate.getDomain());
      						int amount = affiliate.getAmount()/100;
      						int commission = affiliate.getCommission();
      						details.put("amount",amount);
      						details.put("commission",commission);
      						int commissionAmount = (amount/100) * commission;
      						details.put("commissionAmount",commissionAmount);
      						totalAmount = totalAmount + amount;
      						totalCommission = totalCommission + commissionAmount;
      					}*/
      					String details;
						try {
							details = AffiliateUtil.getTotalCommisionAmount(user.id, firstDateOfPreviousMonth, lastDateOfPreviousMonth);
							JSONParser parser = new JSONParser();
	      					JSONObject json = (JSONObject) parser.parse(details);
	      					map.put("commission", json.getInt("commission"));
						} catch (JSONException | ParseException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
      					
      				}
      			}
      		}finally{
      			
      		}
      	}
      	String month = new SimpleDateFormat("MMM").format(calendar.getTime());
      	SendMail.sendMail("mogulla@agilecrm.com", SendMail.AFFILIATE_REPORT_SUBJECT+month, SendMail.AFFILIATE_REPORT, map);
	}

}
