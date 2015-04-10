package com.thirdparty.ecommerce;

import java.util.ArrayList;
import java.util.List;

public class Product
{
    public String id;
    public String name;
    public String cost;
    public String quantity;
    public String sku;
    public List<String> categories = new ArrayList<String>();
	
    @Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", cost=" + cost
				+ ", quantity=" + quantity + ", sku=" + sku + ", categories="
				+ categories + "]";
	}
    
}