<%
String formId = request.getParameter("id");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Form</title>
      <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->      
	<style type="text/css">
	.form-view{font-family:Tahoma,Geneva,sans-serif;margin:0 auto;width:450px;}.agile-group{margin-bottom:15px}.agile-label{float:left;overflow:hidden;padding:7px 25px 0 0;text-align:right;word-wrap:break-word;width:109px;font-size:15px}.agile-group label{font-weight:400}.agile-label::first-letter{text-transform:capitalize}.agile-field{display:inline-block}.agile-field-small{width:100px}.agile-field-medium{width:150px}.agile-field-large{width:200px}.agile-field-xlarge{width:250px}.agile-height-small{padding:5px 10px!important}.agile-height-default{padding:6px 12px!important}.agile-height-large{padding:10px 16px!important}.agile-field input[type=email],.agile-field input[type=text]{padding:6px 12px}.agile-field select{border-radius:4px;border:1px solid #ccc;width:100%;box-shadow:0 1px 1px rgba(0,0,0,.075) inset}.agile-input-group{border-collapse:separate;display:table;position:relative}.agile-input-group input[type=email],.agile-input-group input[type=text]{display:table-cell}.agile-input-group .agile-group-addon:first-child,.agile-input-group input[type=email]:first-child,.agile-input-group input[type=text]:first-child{border-bottom-right-radius:0;border-top-right-radius:0}.agile-input-group .agile-group-addon:last-child,.agile-input-group input[type=email]:last-child,.agile-input-group input[type=text]:last-child{border-bottom-left-radius:0;border-top-left-radius:0}.agile-group-addon:first-child,.agile-input-group input[type=email]:first-child,.agile-input-group input[type=text]:first-child{border-right:0 none}.agile-group-addon{background:#eee;border:1px solid #ccc;display:table-cell;font-size:14px;padding:3px 12px;text-align:center}.agile-group-addon-append{border-bottom-right-radius:4px;border-top-right-radius:4px}.agile-group-addon-prepend{border-top-left-radius:4px;border-bottom-left-radius:4px}input[type=email],input[type=password],input[type=text],textarea{border:1px solid #ccc;border-radius:4px;box-shadow:0 1px 1px rgba(0,0,0,.075) inset;color:#555;font-size:14px;line-height:1.42857;transition:border-color .15s ease-in-out 0s,box-shadow .15s ease-in-out 0s;width:100%;margin:0}input[type=email]:focus,input[type=password]:focus,input[type=text]:focus,textarea:focus{border:1px solid #66afe9}.agile-btn-red{background:#ff604f!important;margin-left:10px}.help-block{color:#999;margin:0;font-size:14px;text-transform:capitalize}legend{border-bottom:1px solid #eee;margin-bottom:12px;padding-bottom:14px;width:100%;font-weight:700;font-size:20px}fieldset{border:none}.agile-custom-clear{clear:both}#agile-error-msg{position:relative;top:2px;left:8px;color:red;font-size:12px}.hidden{display:none !important;}
	</style>
	<script>
		var formNumber = <%=formId%>;
	</script>
   </head>
   <body>
      <div class="container">
         <div class="row">
           <textarea id="render" style="width:0px;height:0px;display:none;" class="hidden"></textarea>
           <div id="agileFormHolder"></div>           
           <script data-main="misc/formbuilder/main-built.js" src="misc/formbuilder/assets/lib/require.js?v=3" ></script>
         </div>
      </div>
   </body>
</html>