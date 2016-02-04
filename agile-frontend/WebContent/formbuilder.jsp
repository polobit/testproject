<%
String formId = request.getParameter("form");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Form Builder</title>
      <link href="misc/formbuilder/bootstrap.min.css" rel="stylesheet">
      <link href="misc/formbuilder/custom.css?v=2" rel="stylesheet">
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
            <!-- Building Form. -->
            <div class="col-md-6">
               <div class="clearfix">
                  <h2 id="form-label">Your Form</h2>
                  <input id="form-save" type="button" class="btn btn-info" value="Save Form">
                  <hr>
                  <div id="build">
                     <form id="target" class="form-horizontal">
                     </form>
                  </div>
               </div>
            </div>
            <!-- / Building Form. -->
            <!-- components children -->
            <div class="col-md-6">
               <h2>Drag & Drop components</h2>
               <div class="clearfix"></div>
               <hr>
               <div class="tabbable">
                  <ul class="nav nav-tabs" id="formtabs">
                     <!-- Tab nav -->
                  </ul>
                  <form id="components" class="form-horizontal">
                     <fieldset>
                        <div class="tab-content">
                           <!-- Tabs look snippets go here -->
                        </div>
                     </fieldset>
                  </form>
               </div>
            </div>
            <!-- / whose components -->
         </div>
      </div>
      <!-- /container back -->
      <script data-main="misc/formbuilder/main.js" src="misc/formbuilder/assets/lib/require.js?v=3" ></script>
   </body>
</html>