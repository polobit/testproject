package com.agilecrm;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceLineItem;
import com.stripe.model.Plan;

/**
 * Servlet implementation class InvoicePdfServlet
 */
public class InvoicePdfServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InvoicePdfServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		JSONObject jsonObj = new JSONObject();
		try {
			String invoiceId = request.getParameter("inv_id");
			if (StringUtils.isBlank(invoiceId))
				throw new Exception("Invalid Id.");
			Invoice invoice = StripeUtil.getInvoice(invoiceId);
			if (invoice == null)
				throw new Exception("Invoice Not found.");
			System.out.println(invoice);
			JSONObject invoiceJSON = getInvoiceJSON(request, invoice);
			System.out.println("Invoice JSON::: "+invoiceJSON);
			String invoiceTemplate = MustacheUtil.templatize("invoice_pdf_html.html", invoiceJSON);
			response.setContentType("application/pdf");
			SimpleDateFormat invoiceMonthFormat = new SimpleDateFormat("MMM");
			response.setHeader("Content-Disposition","attachment; filename="+invoiceMonthFormat.format(new Date(invoice.getDate()))+"-Invoice.pdf");
			Document document = new Document();
			PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());
			document.open();
			document.setPageCount(1);
			document.setPageSize(PageSize.A4);
			InputStream is = new ByteArrayInputStream(invoiceTemplate.getBytes());
			XMLWorkerHelper.getInstance().parseXHtml(writer, document, is);

			document.close();
			
			
			
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			System.out.println(ExceptionUtils.getMessage(e));
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println(ExceptionUtils.getMessage(e));
			e.printStackTrace();
		}
		
	}
	public JSONObject getInvoiceJSON(HttpServletRequest request, Invoice invoice) throws Exception
	{
		System.out.println("converting invoice to json");
		JSONObject invoiceObj = new JSONObject();
		
		String userId = DomainUserUtil.getCurrentDomainUser().email;
		System.out.println("userId = " + userId);
		if (StringUtils.isBlank(userId))
			throw new Exception("Invalid User.");
		invoiceObj.put("user_id", userId);
		String companNname = AccountPrefsUtil.getAccountPrefs().company_name;
		if(companNname != null && !companNname.equals("My company"))
			invoiceObj.put("company_name", companNname);
		invoiceObj.put("cust_id", invoice.getCustomer());
		invoiceObj.put("cust_id", invoice.getId());
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yy");
		
		invoiceObj.put("payment_date", format.format(new Date(invoice.getDate() * 1000)));
		invoiceObj.put("detailed_collection", formatInvoiceCollections(invoice));
		invoiceObj.put("total", convertAmountToReadable(invoice.getTotal()/100));
		
		return invoiceObj;
	}
	
	JSONArray formatInvoiceCollections(Invoice invoice) throws Exception
	{
		JSONArray payments_desp_JSON = new JSONArray();
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yy");
		int i = 1;
		for(InvoiceLineItem lines: invoice.getLines().getData()){
			JSONObject json = new JSONObject();
			Plan plan = lines.getPlan();
			json.put("index", i);
			i++;
			if(plan.getName().toLowerCase().contains("email")){
				json.put("plan_type", "Emails");
				json.put("description", lines.getQuantity()*1000+" Emails");
				json.put("description2", "(charged @ "+convertAmountToReadable(plan.getAmount()/100)+"/1000)");
			}else {
				json.put("plan_type", plan.getName()+" ("+plan.getAmount()/100+"/"+plan.getInterval()+")");
				String description = lines.getDescription();
				if(description != null && !description.equals("")){
					if(description.toLowerCase().contains("unused time on"))
						json.put("description", "Balance from previous transaction");
					else if(description.toLowerCase().contains("remaining"))
						json.put("description", "Changed on "+description.substring(description.indexOf("after")+5));
				}else{
					json.put("description", "Changed on "+format.format(new Date(lines.getPeriod().getStart()*1000)));
				}
				
			}
			json.put("amount", convertAmountToReadable(lines.getAmount()/100));
			
		payments_desp_JSON.put(json);
		}
		return payments_desp_JSON;
		
	}
	String convertAmountToReadable(Integer amount)
	{

		String str = amount + "";

		System.out.println("str = " + str);

		if ((str + "").indexOf("-") == 0)
			str = str.replace("-", "-$");
		else
			str = "$" + str;

		return str;

	}

}
