!function(){var e=Handlebars.template,n=Handlebars.templates=Handlebars.templates||{};n["shopify-custom-field-template"]=e(function(e,n,a,t,l){function s(){return'\n	<p>Shopify id for each contact is stored in a text custom field. You have no custom fields defined. Please <a href="#custom-fields">create one</a>.</p>\n'}function i(e,n){var t,l="";return l+='\n	<p>Shopify id for each contact is stored in a text custom field. Select the custom field to be used.</p>\n	<select name="shopify_field" id="shopify_custom_field_name" class="required span10" style="width:100%" >\n     		<option class="default-select" value="">-Select-</option>\n		',t=a.each.call(e,e&&e.custom_fields,{hash:{},inverse:u.noop,fn:u.program(4,o,n),data:n}),(t||0===t)&&(l+=t),l+='\n	</select>\n	<p>Or, you can <a href="#custom-fields">create </a> a new text custom field.</p>\n	<a href="#" class="btn" id="save_shopify_name" style="text-decoration:none;">Save</a>\n'}function o(e,n){var t,l,s="";return s+='\n			<option value="',(l=a.field_label)?t=l.call(e,{hash:{},data:n}):(l=e&&e.field_label,t=typeof l===h?l.call(e,{hash:{},data:n}):l),s+=f(t)+'">',(l=a.field_label)?t=l.call(e,{hash:{},data:n}):(l=e&&e.field_label,t=typeof l===h?l.call(e,{hash:{},data:n}):l),s+=f(t)+" \n			</option>\n		"}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{};var r,p,d,c="",h="function",f=this.escapeExpression,u=this,m=a.helperMissing;return c+='\n<div class="widget_content">\n',p=a.if_equals||n&&n.if_equals,d={hash:{},inverse:u.program(3,i,l),fn:u.program(1,s,l),data:l},r=p?p.call(n,(r=n&&n.custom_fields,null==r||r===!1?r:r.length),"0",d):m.call(n,"if_equals",(r=n&&n.custom_fields,null==r||r===!1?r:r.length),"0",d),(r||0===r)&&(c+=r),c+="\n</div>\n\n"}),n["shopify-error-template"]=e(function(e,n,a,t,l){function s(e,n){var t,l,s="";return s+='\n	<div class="ellipsis-multi-line collapse-25" title="',(l=a.message)?t=l.call(e,{hash:{},data:n}):(l=e&&e.message,t=typeof l===c?l.call(e,{hash:{},data:n}):l),s+=h(t)+'" style="height:110px;overflow: hidden;line-height:160%;word-wrap: break-word;padding:0px">\n		',(l=a.message)?t=l.call(e,{hash:{},data:n}):(l=e&&e.message,t=typeof l===c?l.call(e,{hash:{},data:n}):l),(t||0===t)&&(s+=t),s+="\n	</div>\n"}function i(e,n){var t,l,s="";return s+='\n	<div style="line-height:160%;word-wrap: break-word;padding:0px">\n		',(l=a.message)?t=l.call(e,{hash:{},data:n}):(l=e&&e.message,t=typeof l===c?l.call(e,{hash:{},data:n}):l),(t||0===t)&&(s+=t),s+="\n	</div>\n"}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{};var o,r,p,d="",c="function",h=this.escapeExpression,f=this,u=a.helperMissing;return d+="\n",r=a.check_length||n&&n.check_length,p={hash:{},inverse:f.program(3,i,l),fn:f.program(1,s,l),data:l},o=r?r.call(n,n&&n.message,"140",p):u.call(n,"check_length",n&&n.message,"140",p),(o||0===o)&&(d+=o),d+="\n\n"}),n["shopify-line-item-template"]=e(function(e,n,a,t,l){function s(e){var n,a="";return a+='\n<div style="margin-top: 24px;margin-left: 33px;">\n<div class="row">\n	<div class="pull-left">'+p((n=e&&e.title,typeof n===r?n.apply(e):n))+'</div>\n	<div class="pull-right">'+p((n=e&&e.currency,typeof n===r?n.apply(e):n))+"&nbsp;"+p((n=e&&e.price,typeof n===r?n.apply(e):n))+'</div>\n</div>\n\n<div class="row">\n	<div class="pull-left">Quantity</div>\n	<div class="pull-right">'+p((n=e&&e.quantity,typeof n===r?n.apply(e):n))+"</div>\n</div>\n</div>\n"}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{};var i,o="",r="function",p=this.escapeExpression,d=this;return o+="\n\n",i=a.each.call(n,n,{hash:{},inverse:d.noop,fn:d.program(1,s,l),data:l}),(i||0===i)&&(o+=i),o+="\n\n\n\n"}),n["shopify-login-template"]=e(function(e,n,a,t,l){return this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{},'\n<div class="widget_content" style="border-bottom:none;line-height: 160%;width:295px;">\n<p style=\'margin: 10px 0px 5px 13px;\'>Link your shopify account</p>\n<div class=\'input-append input-prepend\'>\n	<span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;">https://</span>\n	  <input id="shop" style="margin-left: -3px;margin-right: -3px;width: 116px;" required="required" name="shopname"  type="text" placeholder="Enter shop domain">\n    <span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;border-radius: 3px;\nmargin-left: -3px;">.myshopify.com</span>\n    \n    </div>\n<a href ="#" id ="widget_shopify" class="btn" style="margin-left: -1px;margin-top:10px;">Connect</a>\n</div>\n\n'}),n["shopify-order-error-template"]=e(function(e,n,a,t,l){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{};var s,i,o="",r="function",p=this.escapeExpression;return o+='\n<div class="widget_content">\n\n\n<li><a href="https://',(i=a.shop)?s=i.call(n,{hash:{},data:l}):(i=n&&n.shop,s=typeof i===r?i.call(n,{hash:{},data:l}):i),o+=p(s)+"/admin/customers/"+p((s=n&&n[0],s=null==s||s===!1?s:s.name,typeof s===r?s.apply(n):s))+'" target="_blank">'+p((s=n&&n[0],s=null==s||s===!1?s:s.name,typeof s===r?s.apply(n):s))+'</a></li>\n\n</div>\n\n<div class="sub_header">\n	<h4>Order Details</h4>\n</div>\n<div> No Order found</div>\n\n\n'}),n["shopify-profile-addcontact-template"]=e(function(e,n,a,t,l){return this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{},'\n<div class="widget_content">\n		<div>No customer found</div>\n		<a class="btn" id="shopify_add_contact" style="margin-top:10px;cursor:pointer;" href="#"><i class="icon-plus"></i>Add Customer</a> \n	</div>\n\n'}),n["shopify-profile-template"]=e(function(e,n,a,t,l){function s(e,n){var t,l,s,i="";return i+='\n\n<ul style="margin:0px;" style="border-bottom:1px solid #eee">\n<li class="row-fluid sub_header_li">\n\n<div class="pull-left">\n\n<a class="order"  data-toggle="collapse" data-placement="top" title= "Order" style="cursor:pointer;" href="#" value="'+c((t=e&&e.id,typeof t===d?t.apply(e):t))+'">Order No #'+c((t=e&&e.id,typeof t===d?t.apply(e):t))+'</a>\n\n</div> <div class="pull-right">',(l=a.currency)?t=l.call(e,{hash:{},data:n}):(l=e&&e.currency,t=typeof l===d?l.call(e,{hash:{},data:n}):l),i+=c(t)+"&nbsp;"+c((t=e&&e.subtotal_price,typeof t===d?t.apply(e):t))+'</div>\n\n<div id="collapse-'+c((t=e&&e.id,typeof t===d?t.apply(e):t))+'" class="collapse" style="color: rgba(0, 0, 0, 0.5);"></div>\n\n\n<div class="pull-left">\n<small><time class="time-ago pull-left" datetime="',(l=a.updated_at)?t=l.call(e,{hash:{},data:n}):(l=e&&e.updated_at,t=typeof l===d?l.call(e,{hash:{},data:n}):l),i+=c(t)+'">'+c((l=a.iso_date_to_normalizeDate||e&&e.iso_date_to_normalizeDate,s={hash:{},data:n},l?l.call(e,e&&e.updated_at,s):h.call(e,"iso_date_to_normalizeDate",e&&e.updated_at,s)))+'</time></small></div>					\n<div class="pull-right"><span class="badge">',(l=a.financial_status)?t=l.call(e,{hash:{},data:n}):(l=e&&e.financial_status,t=typeof l===d?l.call(e,{hash:{},data:n}):l),i+=c(t)+"</span></div><br>\n</li>\n</ul>\n\n\n\n \n\n"}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{};var i,o,r,p="",d="function",c=this.escapeExpression,h=a.helperMissing,f=this;return p+='\n<div class="widget_content">\n\n\n<li><a href="https://'+c((i=n&&n[0],i=null==i||i===!1?i:i.shop,typeof i===d?i.apply(n):i))+"/admin/customers/"+c((i=n&&n[0],i=null==i||i===!1?i:i.id,typeof i===d?i.apply(n):i))+'" target="_blank">'+c((i=n&&n[0],i=null==i||i===!1?i:i.name,typeof i===d?i.apply(n):i))+"</a></li>\n\n<div>Total spent &nbsp;&nbsp;"+c((i=n&&n[0],i=null==i||i===!1?i:i.currency,typeof i===d?i.apply(n):i))+"&nbsp; "+c((i=n&&n[0],i=null==i||i===!1?i:i.total_spent,typeof i===d?i.apply(n):i))+'</div>\n</div>\n<div class="sub_header" style="font-weight:bold;">\n	<h4>Order Details</h4>\n</div>\n\n\n',o=a.each_index_slice||n&&n.each_index_slice,r={hash:{},inverse:f.noop,fn:f.program(1,s,l),data:l},i=o?o.call(n,n,1,r):h.call(n,"each_index_slice",n,1,r),(i||0===i)&&(p+=i),p+="\n\n\n\n\n"}),n["shopify-revoke-access-template"]=e(function(e,n,a,t,l){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),l=l||{};var s,i="",o="function",r=this.escapeExpression;return i+="\n\n<div class='widget_content' style='border-bottom:none;line-height: 160%;width:295px;' >\n<div style=\"margin-left: 18px;\"> Linked Shopify account</div>\n <div style=\"margin-left: 18px;\">"+r((s=n&&n.data,s=null==s||s===!1?s:s.shop,typeof s===o?s.apply(n):s))+"</div> \n<p style='margin: 10px 0px 5px 21px;' >\n					<a class='btn btn-danger'id=\"revoke-shopify\" style='text-decoration: none;' widget-name=\"Shopify\">Delete</a>\n					<a href=\"#add-widget\" class='btn ml_5' style='text-decoration: none;' widget-name=\"Shopify\">Cancel</a>\n	</p> \n				\n\n</div>\n\n\n"})}();