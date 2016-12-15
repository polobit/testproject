/**
 * Creates backbone router for customer invoices management operations.
 */
var CustomerInvoicesRouter = Backbone.Router.extend({
	
	routes : {
		
		"customer-invoices" : "customerinvoicesview",
		
		"customer-invoices-add" : "customerInvoicesAdd",
		
		"customer-invoices-edit/:id" : "customerInvoicesEdit"
			
	},
	
	/**
	 * Shows invoices list
	 */
	customerinvoicesview : function()
	{
		this.customerInvoicesList = new Base_Collection_View({ url : '/core/api/customerinvoices', 
			templateKey : "customer-invoicesview",
			individual_tag_name : 'tr', sort_collection : false,
			postRenderCallback : function(el)
			{
				console.log(el);
			}});
			
		this.customerInvoicesList.collection.fetch();
		$("#content").html(this.customerInvoicesList.render().el);
	},
	
	/**
	 * Adds new invoice
	 */
	customerInvoicesAdd : function()
	{
		$("#content").html("<div id='invoiceproductschecked_tempdiv'></div>")
		var customer_invoice_products=new Base_Collection_View({ url : '/core/api/products', 
			templateKey : "customer-invoices-products",
			individual_tag_name : 'tr',className:'customer-invoices-products_tr',sort_collection : false,
			postRenderCallback : function(el)
			{
				$(el).addClass("table-responsive");
				console.log("loaded products : ", el);
				
			}});
		customer_invoice_products.collection.fetch({
			success : function(data)
			{
				for(var key in data.models)
				{
					if(!data.models[key].get("qty"))
					{	
						data.models[key].set("qty",1);
						data.models[key].set("total",data.models[key].get("price"));
						data.models[key].set("isChecked",false);
					}	
				}
			}
		});
		
		customer_invoice_products.render();
		var customer_invoices = new Customer_Invoices_Model_View({ url : 'core/api/customerinvoices', 
			template : "customer-invoices-add", isNew : "true",
			prePersist:function(model)
			{
				var arrCheckedProdcts=customer_invoice_products.collection.where({"isChecked":true});
				$.each(arrCheckedProdcts,function(index,value){
					value=value.toJSON();
				});
				model.set("products",arrCheckedProdcts, {silent:true});
			},
			postRenderCallback : function(el)
			{
				console.log('new customer invoice');
				$("#customer_invoices_products_div",el).append(customer_invoice_products.el);
			} });
		$("#invoiceproductschecked_tempdiv").html(customer_invoices.render().el);
		customer_invoices.customer_invoice_products=customer_invoice_products
	},
	
	/**
	 * Edits filter created
	 */
	customerInvoicesEdit : function(id)
	{
		if (!this.customerInvoicesList || this.customerInvoicesList.collection.length == 0 || this.customerInvoicesList.collection.get(id) == null)
		{
			this.navigate("customer-invoices", { trigger : true });
			return;
		}
		$("#content").html("<div id='invoiceproductschecked_tempdiv'></div>")
		//$("#content").html(LOADING_HTML);
		var customer_invoices = this.customerInvoicesList.collection.get(id);
		var CustomerInvoice = new Base_Model_View({ url : 'core/api/customerinvoices', 
			model : customer_invoices, template : "customer-invoices-add",
			postRenderCallback : function(el)
			{
				
			//	$("#content").html(LOADING_HTML);
				
			}, saveCallback : function(data)
			{
				
			} });
		$("#invoiceproductschecked_tempdiv").html(CustomerInvoice.render().el);
		//$("#content").html(LOADING_HTML);
		//CustomerInvoice.render();

	}	
});


var Customer_Invoices_Model_View=Base_Model_View.extend({
	
	initialize1:function()
	{},
	events:{
		'click .customerinvoiceproducts_td_checkbox':"processProductsClick",
		'click .customerinvoiceproducts_td_qty_span':"processProductQtyClick",
		'click .discountcheck':"calculateGrandTotal",
		'keypress .discountvalue':"calculateGrandTotal",
		'render':"afterRender",
		'keypress .customerinvoiceproducts_qty_input':"updateOnEnter",
		'blur .customerinvoiceproducts_qty_input':"close",
		'click .discounttype-input-group-btn ul li a':"toggleDiscountOptionsClick",
		'click .discounttype-select':"toggleDiscountButton",
		
		
		},
		toggleDiscountOptionsClick:function(e)
		{
			var source = event.target || event.srcElement;
			var sText=$(source).text();
			var objButtonGroup=$(source).closest(".discounttype-input-group-btn")
			var objButton=objButtonGroup.children().eq(0);
			var objButtonSpan=objButton.children().eq(0);
			objButtonSpan.text(sText);
			this.toggleDiscountButton();
			this.calculateGrandTotal();
		},
		toggleDiscountButton:function(e)
		{
			var source = event.target || event.srcElement;
			if($(source).parent().hasClass("open"))
				$(source).parent().removeClass("open")
			else
				$(source).parent().addClass("open")
		},
		afterRender:function()
		{
			
		},
		processProductQtyClick:function(e)
		{
			var source = event.target || event.srcElement;
			var jSpan=$(source)
			if($(source).prop("tagName")=="SPAN")
			{
				this.input=jSpan.next()
			}
			else if($(source).prop("tagName")=="TD")
			{
				this.input=$(source).children().eq(1);
				jSpan=$(source).children().eq(0)
			}
				
			this.input.removeClass('hide').addClass('block');
			jSpan.removeClass('block').addClass('hide');
			

		},
		updateOnEnter:function(e)

		{
			if(e.keyCode==13)this.close(e);

		},
		onEdit:function(e)
		{

		this.$el.addClass("editing");

		this.input.focus();

		},

		close:function(e)
		{
		var source = event.target || event.srcElement;		
		var value=$(source).val();
		
		$(source).removeClass('block').addClass('hide');
		
		if(value)
		{
			var objTD=$(source).parent('td');
			objTD.children().eq(0).removeClass('hide').addClass('block');
			var objTR=$(source).closest('tr');
			var objData=objTR.data();
			var objModel= this.customer_invoice_products.collection.get(objData.id)
			var inputCheckbox=objTD.parent().children().eq(0).children().eq(0).children().eq(0);
			if(!$(inputCheckbox).is(':checked'))
			{	
				objModel.set("isChecked",true)
			}	
			objModel.set("qty",value)
		}
		this.calculateGrandTotal();

		},
		calculateGrandTotal:function()
		{

		var iTotal=0;
		for(var key in this.customer_invoice_products.collection.models)
		{
			var iQtyPriceTotal= parseFloat( this.customer_invoice_products.collection.models[key].get("qty")) *parseFloat( this.customer_invoice_products.collection.models[key].get("price"))
			this.customer_invoice_products.collection.models[key].set("total",iQtyPriceTotal)
			var sId=this.customer_invoice_products.collection.models[key].get("id")
			if(this.customer_invoice_products.collection.models[key].get("isChecked"))
				iTotal+=iQtyPriceTotal;		
		}
		var iDiscountAmt=0
		if($("#apply_discount").is(':checked'))
		{
			iDiscountAmt=$("#discount_value").val();
			if(iDiscountAmt!=null && iDiscountAmt!=undefined )
				{
					if($("#discount_type option:selected").text()=="Percent")
					{
						iDiscountAmt=(iTotal *  iDiscountAmt)/100
					}
				}
		}
		iTotal-=iDiscountAmt
		$("#final_total").val(iTotal);
		this.model.set("final_total",iTotal);
		},
		processProductsClick:function(e)
		{
			var source = event.target || event.srcElement;
			var checked = false;
			var iTotal=0;
			var objTR=$(source).closest('tr');
			var objData=objTR.data();
			var _id=$(source).attr("data")
			var objModel= this.customer_invoice_products.collection.get(_id)
			
			if($(source).is(':checked'))
			{
				if(!objTR.hasClass("pseduo-row"))
				{
					objModel.set("isChecked",true)	
				}
				
			}
			else
			{
				objModel.set("isChecked",false)	
				var id=objData.get('id')
			}
			this.calculateGrandTotal();
	}
});