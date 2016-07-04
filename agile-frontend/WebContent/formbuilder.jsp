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
      <link href="misc/formbuilder/custom.css?v=2" rel="stylesheet">
      <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
      <style type="text/css">
      input[type=url],textarea{border:1px solid #ccc;border-radius:4px;box-shadow:0 1px 1px rgba(0,0,0,.075) inset;color:#555;font-size:14px;line-height:1.42857;transition:border-color .15s ease-in-out 0s,box-shadow .15s ease-in-out 0s;width:100%;margin:0}
         .agile-label{float:left;overflow:hidden;padding:7px 25px 0 0;text-align:left;word-wrap:break-word;width:100%;font-size:15px}
      </style>
	<script>
		var formNumber = <%=formId%>;
   <% if(template != null) { %>
   var formTemplate = '<%=template%>';
   <% } %>
	</script>

   </head>
   <body>
      <div class="container">
         <br>
         <div class="row">
            <!-- Building Form. -->
            <div class="col-md-6">
               <div class="clearfix">
                  <h2 id="form-label">Your Form</h2>
                  <input id="form-preview" type="button"  onclick="formView()" class="btn btn-info" data-toggle="modal" data-target="#myModal" style="margin-top: -40px;margin-left: 340px;padding-right: 10px;"value="Preview Form">
                  <input id="form-save" type="button" class="btn btn-info" value="Save Form">
                  <hr style="margin-top: 30px;">
                  <!--Adding content for formPreview-->
                   <div class="modal fade" id="myModal" role="dialog">
                      <div class="modal-dialog">
    
                         <!-- Modal content-->
                        <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">This is how your Form looks:</h4>
                        </div>
                        <div class="modal-body">
                        <p  id="formContent" style="overflow: scroll;overflow-x: hidden;border: 1px solid #ccc;height: 450px;"></p>
                         <script>
                         function formView(){
                           if(document.getElementById("render")!=null){
                            var pContent=document.getElementById("render").value; 
                           document.getElementById("formContent").innerHTML = "<div style='margin:25px 50px;align:center;'>"+pContent+"</div>";
                          
                         }
                      }

                         </script>
                        </div>
                         <div class="modal-footer">
                         <button type="button" class="btn btn-default" data-dismiss="modal" style="color:#fff;background-color:#7266ba">Close</button>
                        </div>
                        </div>
      
                     </div>
                  </div>
                  <!--Adding content for formPreview-->
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