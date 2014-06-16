package com.thirdparty.shopify;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

public class Utils {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		
			  

			String url ="https://0f99730e50a2493463d263f6f6003622:1a27610dee9600dd8366bf76d90b5589@shopatmyspace.myshopify.com/admin/customers.json";
			try{
                CloseableHttpClient client = HttpClients.createDefault();
				HttpGet get = new HttpGet(url);
			    CloseableHttpResponse response = client.execute(get);
				BufferedReader br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
				String line;
				while((line= br.readLine())!=null){
					System.out.println(line);
					//service.save(new JSONObject(line));
				}

			}catch(Exception e){
				e.printStackTrace();
			}		  
			
			  
		

	}

}
