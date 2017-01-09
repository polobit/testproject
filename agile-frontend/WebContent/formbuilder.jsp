<%@page import="com.agilecrm.customtheme.util.CustomThemesUtil"%>
<%@page import="com.agilecrm.customthemes.CustomTheme"%>
<%@page import="java.util.List"%>
<%@page import="com.google.appengine.labs.repackaged.org.json.JSONObject"%>
<%@page import="com.google.appengine.labs.repackaged.org.json.JSONArray"%>
<%@page import="com.google.appengine.repackaged.com.google.gson.Gson"%>
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
      <link href="misc/formbuilder/font-awesome.min.css" rel="stylesheet">
      <link href="misc/formbuilder/custom.css?v=3-5" rel="stylesheet">  
      <link href="misc/formbuilder/builder-themes.css?v=6" rel="stylesheet">
      <link href="misc/formbuilder/formbuilder-topmenu.css?t=3" rel="stylesheet">
      <link href="misc/formbuilder/formthemes.css?t=1" rel="stylesheet">
      <link href="misc/formbuilder/formbuilder-transparency.css" rel="stylesheet">
      <script src="misc/formbuilder/formthemes/jscolor.js"></script>
      <script src="misc/formbuilder/formthemes/jquery-min.js"></script>
      <script src="misc/formbuilder/formthemes/dropDownNewSampleThemeJS.js"></script>
      
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
   var customthemes=null;
      <%
        List<CustomTheme> custThmList=CustomThemesUtil.fetchAllCustomThemes();
        System.out.println("hi..........."+custThmList);
        %>
   customthemes=<%=net.sf.json.JSONSerializer.toJSON(custThmList) %>
   var isCopyForm = window.location.href.includes("&copy=1");
   var isFormChange = false;
   if(isCopyForm || typeof formTemplate != "undefined"){
      isFormChange = true;
   }
  </script>

   </head>
   <body>
      <header id="header" class="navbar navbar-fixed-top" role="menu">
         <a id="agile-logo" title="Go to Agile Dashboard" class="navbar-brand" href="#navbar-dashboard">
           <i class="fa fa-cloud"></i> 
         </a>
         <span class="navbar-brand" style="font-weight: bold;">Form Builder</span>
        <div style="float: right;" id="top-right-items"> 
             <select class="themesSelectEle navbar-brand">
                  <option id="chooseTheme">Choose Theme</option>
                  <optgroup id="defaultThmEle"  label="Default Themes">
                  <option id="theme1" value="theme1">Theme1</option>
                  <option id="theme2" value="theme2">Theme2</option>
                  <option id="theme3" value="theme3">Theme3</option>
                  <option id="theme4" value="theme4">Theme4</option>
                  </optgroup>
                  <optgroup id="custThmEle" label="Custom Themes">
                  <option id="addNewTheme">+ Add new</option>
                  </optgroup>
             </select>
             <a id="form_preview" class="btn btn-primary navbar-brand" target="_blank" disabled>
               <span>Preview</span> 
            </a>          
            <a id="form_back" class="btn btn-default navbar-brand">
               <span>Back</span>
            </a>
            <a id="form-save" class="btn navbar-brand  navbar-color">
               <span>Save</span>
            </a>
            <a id="form-copy-dropdown" class="btn btn-primary navbar-brand  navbar-color" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></a>
            <ul id="copyform-ul" class="dropdown-menu pull-right">
                <li>
                    <a id="copy-formbuilder">
                        <i class="fa fa-clipboard" style="width: 20px;"></i>Create a Copy
                    </a>
                </li>
            </ul>
         </div>
      </header>
      <div id="loader">
         <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><br>
         <span>Loading...</span>
      </div>
      <div class="container">
         <div class="row">
            <!-- Building Form. -->
            <div class="col-md-6">
               <div class="clearfix">
                  <!-- <h2 id="form-label">Your Form</h2> -->
                  <!-- <input id="form-save" type="button" class="btn btn-info" value="Save Form"> -->
                 
                 
                <%@ include file="/misc/formbuilder/custom-theme-builder.html" %>     
                
                <hr style="margin-top: 30px;">
                  <div id="build">
                     <form id="target" class="form-horizontal">
                     </form>
                     <style id="agileCustTheme" type="text/css"></style>
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
         <div class="modal fade in" id="formNextActionModal" data-keyboard="false" data-backdrop="static"></div>
      </div>
      <!-- /container back -->
      
      <script type="text/javascript">
      if(formNumber && !isCopyForm){
         var a = document.getElementById('form_preview');
         a.removeAttribute("disabled");
         a.href = window.location.origin+"/forms/"+formNumber;
         $("#form-copy-dropdown").css("display","block");
         $("#copy-formbuilder").attr("href",window.location.origin+"/formbuilder?form="+formNumber+"&copy=1");
      }  
         var a = document.getElementById('agile-logo');
         a.href = window.location.origin;
         var a = document.getElementById('form_back');
         a.href = window.location.origin+"/#forms";
         window.onbeforeunload = function(event) {
            if(isFormChange){
               var closeText = "Do you want to Close?";
               event.returnValue = closeText;
               return closeText;
            }
         }
      </script>
      <script data-main="misc/formbuilder/main-built-9.js" src="misc/formbuilder/assets/lib/require.js?v=3" ></script>
      
   </body>
</html>
