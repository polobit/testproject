package com.thirdparty.ecommerce;

public class Product
{
    public String id;
    public String name;
    public String cost;
    public String quantity;
    public String sku;

    @Override
    public String toString()
    {
	return "Product [id=" + id + ", name=" + name + ", cost=" + cost + ", quantity=" + quantity + ", sku=" + sku + "]";
    }
}