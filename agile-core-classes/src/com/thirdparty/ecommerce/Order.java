package com.thirdparty.ecommerce;

import java.util.ArrayList;
import java.util.List;
import com.thirdparty.ecommerce.Product;

public class Order
{
    public long id;
    public String status;
    public String billingAddress;
    public String shippingAddress;
    public String grandTotal;
    public List<Product> products = new ArrayList<Product>();
    public String note;
    public String paymentMethod;

    @Override
    public String toString()
    {
	return "Order [id=" + id + ", status=" + status + ", billingAddress=" + billingAddress + ", shippingAddress=" + shippingAddress + ", grandTotal="
		+ grandTotal + ", products=" + products + ", note=" + note + "]";
    }
}