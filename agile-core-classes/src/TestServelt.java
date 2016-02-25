import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.HTTPUtil;

public class TestServelt extends HttpServlet {

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String url = "http://54.87.153.50:8080/exchange-app/appointment?user_name=phanitest%40mantratech.onmicrosoft.com&password=Mantra123&server_url=https%3A%2F%2Foutlook.office365.com%2Fews%2Fexchange.asmx&starting_date=2016-02-01+12%3A00%3A00&ending_date=2016-03-14+12%3A00%3A00";
		PrintWriter pw = resp.getWriter();
		String jsonResult = HTTPUtil.accessURL(url);
		pw.print(jsonResult);

	}
}
