<%
String formId = request.getParameter("form");
String template = request.getParameter("template");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Form Builder</title>
      
      <link href="misc/formbuilder/bootstrap.min.css" rel="stylesheet">
      <link href="misc/formbuilder/builder-themes.css?v=3" rel="stylesheet">
      <link href="misc/formbuilder/custom.css?v=3-3" rel="stylesheet">
      <link href="misc/formbuilder/formbuilder-topmenu.css" rel="stylesheet">

      <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
      <style type="text/css">
      input[type=url],textarea{border:1px solid #ccc;border-radius:4px;box-shadow:0 1px 1px rgba(0,0,0,.075) inset;color:#555;font-size:14px;line-height:1.42857;transition:border-color .15s ease-in-out 0s,box-shadow .15s ease-in-out 0s;width:100%;margin:0}
         .agile-label{float:left;overflow:hidden;padding:7px 25px 0 0;text-align:left;word-wrap:break-word;width:100%;font-size:15px}
         .tooltip {z-index: 2001;}
         .tooltip.right .tooltip-arrow {
                background-color: white;
                border-right-color: #f2f2f2;
                background-color: white;
                  }
         .tooltip-inner {
             background-color: #f2f2f2;
             color: black;
           }
         .tooltip.in{opacity:1 !important;}
      </style>
	<script>
		var formNumber = <%=formId%>;
   <% if(template != null) { %>
   var formTemplate = '<%=template%>';
   <% } %>
	</script>

   </head>
   <body>
      <header id="header" class="navbar" role="menu">
         <a id="agile-logo" class="navbar-brand navbar-color" href="#navbar-dashboard">
           <i class="glyphicon glyphicon-cloud"></i> 
         </a>
         <span class="navbar-brand" style="font-weight: bold;">Agile Forms</span>
        <div style="float: right;">           
            <button id="form-save" class="btn btn-primary navbar-brand  navbar-color">
               <span class="glyphicon glyphicon-ok"></span> 
               <span>Save now(!)</span>
            </button>
            <a id="form_preview" class="btn btn-primary navbar-brand" target="_blank" disabled>
               <span class="glyphicon glyphicon-eye-open"></span>
               <span>Preview</span> 
            </a>
            <a id="form_back" class="btn btn-default navbar-brand">
               <span class="glyphicon glyphicon-chevron-left text-muted"></span><span class="text-muted">Back</span>
            </a>
         </div>
      </header>
      <div class="container">
         <div class="row">
            <!-- Building Form. -->
            <div class="col-md-6">
               <div class="clearfix">
                  <!-- <h2 id="form-label">Your Form</h2> -->
                  <!-- <input id="form-save" type="button" class="btn btn-info" value="Save Form"> -->
                  <hr style="margin-top: 30px;">
                  <div id="build">
                     <form id="target" class="form-horizontal">
                     </form>
                  </div>
               </div>
            </div>
            <!-- / Building Form. -->
            <!-- components children -->
            <div class="col-md-6">
               <!-- <h2>Drag & Drop components</h2> -->
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
      <script type="text/javascript">
         var a = document.getElementById('agile-logo');
         a.href = window.location.origin;
         var a = document.getElementById('form_back');
         a.href = window.location.origin+"/#forms";
      </script>
   </body>
</html>