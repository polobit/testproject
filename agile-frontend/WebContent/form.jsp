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
	<script>
		var formNumber = <%=formId%>;
	</script>
   </head>
   <body>
      <div class="container">
         <div class="row">
           <textarea id="render" style="width:0px;height:0px;display:none;" class="hidden"></textarea>
           <div id="agileFormHolder" style="margin:0 auto;width:450px"></div>           
           <script data-main="misc/formbuilder/main-built.js" src="misc/formbuilder/assets/lib/require.js?v=3" ></script>
         </div>
      </div>
   </body>
</html>