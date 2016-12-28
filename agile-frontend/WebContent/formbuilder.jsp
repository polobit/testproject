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
      <link href="misc/formbuilder/custom.css?v=3-4" rel="stylesheet">      
      <link href="misc/formbuilder/builder-themes.css?v=5" rel="stylesheet">
      <link href="misc/formbuilder/formbuilder-topmenu.css?t=1" rel="stylesheet">
      <link href="misc/formbuilder/formthemes.css?t=2" rel="stylesheet">
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
  </script>

   </head>
   <body>
      <header id="header" class="navbar navbar-fixed-top" role="menu">
         <a id="agile-logo" title="Go to Agile Dashboard" class="navbar-brand" href="#navbar-dashboard">
           <i class="fa fa-cloud"></i> 
         </a>
         <span class="navbar-brand" style="font-weight: bold;">Form Builder</span>
        <div style="float: right;"> 
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
                 
                 
            <div class="modal fade" id="customThemeModal" role="dialog">
                      <div class="modal-dialog" style="width: 1032px;height: 365px;left:0px;">
    
                         <!-- Modal content-->
                        <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" onclick="closeAddTheme()">&times;</button>
                        <div class="modal-title">
                        <form class="form-inline"><div><label style="margin-right: 25px;
                        ">Theme Name<span class="field_req">*</span></label><input type="text" class="form-control" name="themeName" id="themeName"  maxlength="20" style="width: 21%;"><span id="errorSpan" style="margin-left:8px;color:#d9534f;"></span></div></form>

                      </div>
                        </div>
                        
                        <div class="modal-body" style="height: 400px;">
                        
    <!--ThemeBuilder Div-->
    <div class ="col-sm-6 outerSelectTheme" >
      <!--Select Div Start-->
      <div class="selectDiv">
        <label>Select</label>
          
            <div class="">
              <select class="form-control">
                  <option value="alignment">Alignment</option>
                  <option value="border">Border</option>
                  <option value="font">Font</option>
                  <!--<option value="background">Background</option> --> 
                  <option value="color">Color</option>
               </select>
              </div>
      </div>
      <!--Select Div End-->
      
      <!--Alignment Div Start-->
      <div class="outerAlignmentTheme">
        <!--Align Form Elements Start-->
        <div class="innerAlignmentTheme innerAlignmentFormEle">
          <label>Form Elements</label>
          <div class="">
            <select class="form-control">
                <option value="formtitle">Form Title</option>
                  <!-- <option value="submitbutton">Submit Button</option> -->
              </select>
            </div>
        </div>
        <!--Align Form Elements Start-->
        <!--Align Start-->
        <div class="innerAlignmentTheme innerAlignmentAlignStart">
          <span style="font-weight: bold;">Align</span>
          <div class="">
            <select class="form-control">
                  <option value="center">Center</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  
              </select>
            </div>
        </div>
        <!--Align End-->
      </div>
      <!--Alignment Div End-->
      <!--Border Div Start -->
        <div class="outerBorderTheme">
          <!-- Border Form Elements Start-->
          <div class="innerBorderTheme innerBorderThemeFormEle ">
            <label>Form Elements</label>
            <div>
              <select class="form-control">
                <option>Form</option>
              </select>
            </div>
          </div>
          <!-- Border Form Elements End-->
          <!-- Border Width Start-->
          <div class="innerBorderTheme innerBorderWidthTheme">
            <label>Width</label>
            <div>
              <select class="form-control">
                <option>None</option>
                <option>Thin</option>
                <option>Medium</option>
                <option>Thick</option>
              </select>
            </div>
          </div>
          <!-- Border Width End-->
          <!-- Border Style Start-->
          <div class="innerBorderTheme innerBorderStyleTheme">
            <label>Border Style:</label>
            <div class="ulDiv"> 
              <ul>
                <li class="selected"><p class="solidBorder" name="solid"></p></li>
                <li><p class="dottedBorder" name="dotted"></p></li>
                <li><p class="dashedBorder" name="dashed"></p></li>
                <li><p class="doubledBorder" name="doubled"></p></li>
              </ul>
            </div>
          </div>
          <!-- Border Style End-->
          <!-- Border Color Start-->
          <!-- <div class="innerBorderTheme colorTheme innerBorderColorTheme">
            <div><label>Choose Color</label></div>
             <input class="jscolor innerColorTheme" style="color:#000000;" size="11" value="000000">
          </div> -->
          <!-- Border Color End-->
        </div>
      <!--Border Div  End-->

      <!--Font Div Start-->
      <div class="outerFontTheme">
         <!--Font Form Elements Start -->
        <div class="innerFontTheme innerFontEleTheme">
          <label>Form Elements</label>
          <div>
              <select class="form-control">
                <option>Title</option>
                <option>Field Label</option>
                <option>Button Text</option>
              </select>
            </div>
        </div>
        <!--Font Form Elements End -->
        <!--Font Type Start -->
        <div class="innerFontTheme innerFontFamilyTheme">
          <label>Font</label>
          <div>
              <select class="form-control">
                <option value="Arial,Arial,Helvetica,sans-serif">Arial</option>
                <option value="Arial Black,Arial Black,Gadget,sans-serif">Arial Black</option>
                <option value="Courier New,Courier New,Courier,monospace">Courier New</option>
                <option value="Georgia,Georgia,serif">Georgia</option>
                <option value="Impact,Charcoal,sans-serif">Impact</option>
                <option value="Lucida Console,Monaco,monospace">Lucida Console</option>
                <option value="Lucida Sans Unicode,Lucida Grande,sans-serif">Lucida Sans Unicode</option>
                <option value="Palatino Linotype,Book Antiqua,Palatino,serif">Palatino Linoty</option>
                <option value="Tahoma,Geneva,sans-serif">Tahoma</option>
                <option value="Times New Roman,Times,serif">Times New Roman</option>
                <option value="Trebuchet MS,Helvetica,sans-serif">Trebuchet MS</option>
                <option value="Verdana,Geneva,sans-serif">Verdana</option>
                <option value="Gill Sans,Geneva,sans-serif">Gill Sans</option>

              </select>
            </div>
        </div>
        <!--Font Type End -->
        <div class="row">
        <!--Font Style Start -->
        <div class="innerFontTheme innerFontStyleDiv col-md-4">
          <label>Style</label>
          <div class="innerFontSizeUlDiv">
            <select class="form-control" style="padding-left:11px;">
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </div>

        </div>
        <!--Font Style End-->
        <!--Font Weight Start -->
        <div class="innerFontTheme innerFontWeightDiv col-md-4">
          <label>Weight</label>
          <div class="innerFontSizeUlDiv">
            <select class="form-control" style="padding-left:11px;">
              <option value="normal">Normal</option>
              <!-- <option value="lighter">Lighter</option> -->
              <option value="bold">Bold</option>
              <!-- <option value="bolder">Bolder</option> -->
            </select>
          </div>
        </div>
        <!--Font Weight End -->
        <!--Font Size Start -->
        <div class="innerFontTheme innerFontSizeDiv col-md-4">
          <label>Size</label>
          <div class="innerFontSizeUlDiv">
            <select class="form-control" style="padding-left:11px;">
              <option>8</option>
              <option>10</option>
              <option>12</option>
              <option>14</option>
              <option>18</option>
              <option>24</option>
              <option>28</option>
              <option>34</option>
              <option>54</option>
              <option>78</option>
            </select>
          </div>
        </div>
        <!--Font Size End -->
        </div>
        <!--Font Color Start -->
        <!-- <div class="innerFontTheme colorTheme">
          <div class="colorTheme">
            <div><label>Choose Color</label></div>
             <input class="jscolor innerColorTheme" style="color:#000000;" size="11" value="000000">
          </div>
        </div> -->
        <!--Font Color End -->
      </div>
      <!--Font Div End-->
      <!--Background ThemeComponent Start -->
      <!--<div class="outerBackgroundTheme">
        
        <div class="innerBackgroundTheme innerBackgroundFormEle">
          <label>Form Elements</label>
          <div>
            <select>
              <option>Form</option>
              <option>Header</option>
              <option>Body</option> 
              <option>Footer</option>
              <option>Button</option>
            </select>
          </div>
        </div>
       
        <div class="innerBackgroundTheme innerBackgroundImageTheme">
          <div class="ulDiv bgImgLit">
            <ul>
              <li class="selected" name="img1">
                <img src="" alt="" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/0.png" alt="Smiley face" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/1.png" alt="Smiley face" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/4.png" alt="Smiley face" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/5.png" alt="Smiley face" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/28.png" alt="Smiley face" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/9.png" alt="Smiley face" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/15.png" alt="Smiley face" height="42" width="42">
              </li>
              <li>
                <img src="/misc/landingpage/public/images/textures/16.png" alt="Smiley face" height="42" width="42">
              </li>
            </ul>
          </div>
        </div>
        
        <div class="innerBackgroundTheme colorTheme">
          <div class="colorTheme">
            <div><label>Choose Color</label></div>
             <input class="jscolor innerColorTheme" style="color: rgb(0, 0, 0);" size="11" value="FFFFFF
             ">
          </div>
        </div>
        
      </div>-->
      <!--Background ThemeComponent End -->
      <!--Color ThemeComponent Start -->
      <div class="outerColorThemeEle">
        <div class="innerColorThemeEle">
           <label>Form Elements</label>
          <div>
            <select class="form-control">
                <option value="formBorder">Form Border</option>
                <option value="formBackground">Form Background</option>
                <option value="title">Title</option>
                <option value="fieldLabel">Field Label</option>
                <option value="buttonText">Button Text</option>
                <option value="buttonBackground">Button Background</option>
            </select>
          </div>
        </div>
        <div class="innerColorThemeEle">
          <div class="colorTheme">
            <label>Choose Color</label>
             <input class="jscolor innerColorTheme form-control" style="color: rgb(0, 0, 0);" size="11" value="000000
             ">
          </div>
        </div>
      </div>
      <!--Color ThemeComponent End -->
    </div>
    <!--ThemeBuilder Div-->                  
    <div class="col-sm-6 createCustomFormContent" style="margin:0 auto;width:450px;margin-top:20px;margin-left: 10%;">
    </div>
        </div>
              <div class="modal-footer">
              
                <button type="button" class="btn btn-sm btn-default" onclick="closeAddTheme()" data-dismiss="modal" >Close</button>
                <button type="button" class="btn btn-sm btn-primary save" style="background-color: #7266ba;border-color: #7266ba;" onclick="saveCustTheme()">Save</button>
              </div>
             </div>
      
                     </div>
                  </div>

                <!-- Apply or delete theme popup--> 
                <div class="modal fade" id="customThemeAppyDelModal" role="dialog">
                    <div class="modal-dialog" style="left: 0;position: static;margin-top: 107px;">
                      
                        <div class="modal-content">
                           <div class="modal-header">
                             <button type="button" id="closetheme" class="close" data-dismiss="modal" onclick="closeApplyTheme(this)">&times;</button>
                             <div class="modal-title">Confirmation</div>
                           </div>
                           <div id="applyThemeBody" class="modal-body">
                           
                           </div>
                           <div class="modal-footer">
                              <button type="button" id="deltheme" class="btn btn-sm btn-danger" onclick="closeApplyTheme(this)" data-dismiss="modal">Delete</button>
                              <button type="button" id="applytheme" class="btn btn-sm" onclick="closeApplyTheme(this)" data-dismiss="modal">Apply</button>
                           </div>
                        </div>
                     </div>
                  </div>      
                <!-- Apply or delete theme popup--> 
                  <!-- <input id="form-save" type="button" class="btn btn-info" style="/*background-color: #fff;color: #000;border-color: #ccc;*/font-size: 13px;padding-left: 19px;padding-right: 19px;padding-bottom: 8px;padding-top: 10px;margin-right: 35px;margin-top: -36px;" value="Save Form"> -->

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
      <script>
                  var formtheme="default";
                  var chooseThemeFuncHitCount=0;
                  var customthemes=null;
                  var formClasses=null;
                  var themesListAsArr=["default"];
                  var currApplThm=null;
                  var defaultThemes = ["theme1","theme2","theme3","theme4"];
                  
                  <%
                    List<CustomTheme> custThmList=CustomThemesUtil.fetchAllCustomThemes();
                    System.out.println("hi..........."+custThmList);
                    %>
                    customthemes=<%=net.sf.json.JSONSerializer.toJSON(custThmList) %>
                  function chooseThemeFunc(){
                    
                    if(currApplThm==null){
                      currApplThm="Choose Theme";
                    }
                   chooseThemeFuncHitCount++;
                    if(chooseThemeFuncHitCount==1){
                      

                    /*Edit Form CustTheme Class Fetching*/
                    if(customthemes!=null){
                     console.log("No of Custom Themes::"+customthemes.length);
                      for(i=0;i<customthemes.length;i++){
                        var custId=customthemes[i].id;
                        var custName=customthemes[i].name;
                        themesListAsArr.push(custName);
                        var custCss=customthemes[i].themeCss;
                        var custIdName=custName+":"+custId;
                        var inputTheme='<option id="form'+custId+'">'+custName+'</option>';
                         //$(inputTheme).insertAfter("#theme4");
                         //$("#custThmEle").add(inputTheme);
                        /* var custOptionEle = $("#custThmEle");
                         $(inputTheme).appendTo(custOptionEle);*/
                         $(inputTheme).insertBefore("#addNewTheme");
                         if(formClasses!=null){
                          var formClassesList=formClasses.split(" ");
                              if(formClassesList.indexOf("form"+custId)>-1){
                                    $("#form"+custId).attr("selected","true");
                            }
                         }
                        }
                      }
                    }
                  }
                  
                  function selectedThemeFunc(identifier){
                    var themeId=$(".themesSelectEle option:selected").attr("id");
                    var themeVal=$(".themesSelectEle option:selected").val();
                    console.log("Selected Theme Value:"+themeVal);
                    if(themeVal=="Choose Theme"){
                      formtheme="Choose Theme";
                      currApplThm="Choose Theme";
                    }
                    else{
                      formtheme=themeVal;
                    }
                    if(formtheme != null){
                        $.each( customthemes, function( index, value ) {
                            $(document.getElementById("target")).removeClass("form"+value.id);
                            $(document.getElementById("agileCustTheme")).empty();
                        });
                        $.each(defaultThemes,function(index,value){
                           $(document.getElementById("target")).removeClass(value);
                           $(document.getElementById("agileCustTheme")).empty();
                        });

                        if(formtheme != "Choose Theme"){
                           $.each(defaultThemes,function(index,value){
                                 if(value==formtheme){
                                    currApplThm=value;
                                    $(document.getElementById("target")).addClass(value);
                                    return;
                                 }
                           });
                            $.each( customthemes, function( index, value ) {
                                 if(value.name==formtheme){
                                     currApplThm=value.name;
                                     $(document.getElementById("target")).addClass("form"+value.id);
                                     $(document.getElementById("agileCustTheme")).text(value.themeCss);
                                     return;
                                 }
                            }); 
                        }
                     }
                  
                  }
                  
                  function saveCustTheme(){
                    var thmExist=validThemeNameFunc();
                    var custTheme="";
                    var themeName=$("#themeName").val();
                    
                    if(themeName!=null && (themeName.length>0)){
                      if(thmExist!=undefined && !thmExist){
                        $.ajax({
                          type : 'POST',
                          url : window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes/saveThemeOnlyWithName',
                          contentType : 'application/json',
                          data : themeName,
                          success:function(data){
                            console.log("SAVED CUSTOM DATA ID COMING!!!"+data.id);
                            if(data!=null && data!=""){
                              themeclass = "form"+data.id;
                              for(i=0;i<themeArray.length;i++){
                                for(j=0;j<themeArray[i].form_element.length;j++){
                                  var ele=themeArray[i].form_element[j].ele;
                                  var elecss=themeArray[i].form_element[j].css;
                                  custTheme=custTheme+"."+themeclass+"\t"+elecss;
                                 }
                              }
                              var customTheme = {};
                              customTheme.id = data.id;
                              customTheme.name=themeName;
                              customTheme.themecss=custTheme;
                              $.ajax({
                                type : 'POST',
                                url : window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes/updateTheme',
                                contentType : 'application/json',
                                data : JSON.stringify(customTheme),
                                success: function(data){
                                    
                                    if(data!=undefined && data!=""){
                                    customthemes.push(data);
                                    themesListAsArr.push(data.name);
                                    var inputTheme='<option id="form'+data.id+'">'+data.name+'</option>';
                                    //$(inputTheme).insertAfter("#chooseTheme");
                                    /*var custOptionEle = $("#custThmEle");
                                    $(inputTheme).appendTo(custOptionEle);*/
                                    $(inputTheme).insertBefore("#addNewTheme");
                                    $(".themesSelectEle").val(data.name);
                                   }
                                  },
                                  error: function(){
                                    alert("Form with this name is already saved, or this is an invalid form name. Please change form name and try again.");
                                  }
                              });
                          }
                          },
                        });

                          //$(".themesSelectEle").val(currApplThm);
                          $(".createCustomFormContent").empty();
                          $('#customThemeModal').modal('hide');
                          $("#errorSpan").text("");
                          $("#themeName").val("");
                          /*$("#header").css("z-index","2001");
                          $(".popover").css("z-index","2000");*/
                          $("#header").css("z-index","0");
                          $(".popover").css("z-index","50");
                          $('#customThemeAppyDelModal').removeData('bs.modal').modal({backdrop: 'static', keyboard: false});
                        }
                        
                      }
                      
                    }
                  function validThemeNameFunc(){
                    var themeName=$("#themeName").val();
                    var themeNamePattern=/^[a-z][a-zA-Z0-9]+/;
                    var isThemeNameExist=false;
                    if(themeName==null || themeName.length<=0){
                      $("#errorSpan").text("This field is required.");
                    }
                    else{
                          $.each(defaultThemes,function(index,value){
                              if(value.toUpperCase() === themeName.toUpperCase()){
                                 isThemeNameExist=true;
                                 $("#errorSpan").text("Same kind of name already exists.");
                                 return;
                              }
                          });
                          if(isThemeNameExist == false){
                              $.each( themesListAsArr, function( index, value ) {
                                 if(value.toUpperCase() === themeName.toUpperCase()){
                                   isThemeNameExist=true;
                                   $("#errorSpan").text("Same kind of name already exists.");
                                   return;
                                 }
                              });
                          } 
                          
                          if(!isThemeNameExist){
                            $("#errorSpan").text("");
                          }
                    }
                    
                     return isThemeNameExist;
                  }

                function deleteTheme(themeName){
                  var deleteThemeVal = themeName;
                  var deleteThemeId = $(".themesSelectEle option:selected").attr("id");
                  $.ajax({
                                type : 'GET',
                                url :  window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes/deleteTheme?themeName='+deleteThemeVal,
                                success: function(data){
                                  console.log("DELETED THEME?"+data);
                                  
                                   $.each( themesListAsArr, function( index, value ){
                                      if(value==deleteThemeVal)
                                      themesListAsArr.splice(index,1);
                                    });

                                    $.each( customthemes, function( index, value ) {
                                       if(deleteThemeId.includes(this.id)){
                                            customthemes.splice(index,1);
                                            if($(document.getElementById("target")).hasClass(deleteThemeId)){
                                            $(document.getElementById("target")).removeClass(deleteThemeId);
                                            $(document.getElementById("agileCustTheme")).empty();
                                            } 
                                        }  
                                    });
                                    if(currApplThm==themeName){
                                      currApplThm="Choose Theme";
                                      selectedThemeFunc();
                                    }
                                    $(".themesSelectEle option:selected").remove();
                                    $(".themesSelectEle").val(currApplThm);
                                },
                                error: function(err){
                                  alert("Theme is not getting deleted AJAX ERROR is::"+JSON.stringify(err, null, 2));
                                }
                      });
                  }

                  function createCustTheme(){

                    if($("#render")!=undefined && $("#render")!=null){
                          var pContent=document.getElementById("render").value;
                          $(".createCustomFormContent").html(pContent);
                          $.each(defaultThemes,function(index,value){
                              var classesList =  $(".createCustomFormContent .form-view").attr("class")
                              if(value!="form-view" &&classesList.indexOf(value)>-1){
                                 $(".createCustomFormContent .form-view").removeClass(value);
                              }
                          });
                     }
                    defaultFormEleFun();
                    custThemePopUpCode();

                  }

                  function closeAddTheme(){
                     $(".createCustomFormContent").empty();
                     $("#themeName").val("");
                     $("#errorSpan").text("");
                     $(".themesSelectEle").val(currApplThm);
                     $(".createCustomFormContent").empty();
                     $("#header").css("z-index","2001");
                     $(".popover").css("z-index","2000");
                  }

                  $(".themesSelectEle").change(function(identifier){
                        chooseThemeFunc();
                        var themeId=$(".themesSelectEle option:selected").attr("id");
                        
                        if(themeId == "addNewTheme"){
                          
                          createCustTheme();
                          $("#header").css("z-index","0");
                          $(".popover").css("z-index","50");
                          $('#customThemeModal').removeData('bs.modal').modal({backdrop: 'static', keyboard: false});
                        }
                        else if(themeId=="chooseTheme" || themeId == "theme1" || themeId == "theme2" || themeId == "theme3" || themeId == "theme4"){
                          selectedThemeFunc(identifier);
                        }
                        else{
                          $("#header").css("z-index","0");
                          $(".popover").css("z-index","50");
                          $("#applyThemeBody").html("Are you sure you want to delete or apply <strong>"+$(".themesSelectEle").val()+"</strong> theme?");
                          $('#customThemeAppyDelModal').removeData('bs.modal').modal({backdrop: 'static', keyboard: false});
                          }
                  });
                  $("#themeName").keypress(function(event){
                     if (event.which == '13') {
                        event.preventDefault();
                     }
                  });
                  function closeApplyTheme(identifier){

                    var selectedVal = identifier.id;
                    if(selectedVal == "applytheme"){
                      selectedThemeFunc(identifier);
                      $("#header").css("z-index","2001");
                      $(".popover").css("z-index","2000");
                    }
                    else if(selectedVal == "deltheme"){
                      var currThm=$(".themesSelectEle").val();
                      deleteTheme(currThm);
                      $("#header").css("z-index","2001");
                      $(".popover").css("z-index","2000");
                    }
                    else if(selectedVal == "closetheme"){
                      $(".themesSelectEle").val(currApplThm);
                      $("#header").css("z-index","2001");
                      $(".popover").css("z-index","2000");
                    }
                  }
                  
      </script>
      <script type="text/javascript">
      if(formNumber){
         var a = document.getElementById('form_preview');
         a.removeAttribute("disabled");
         a.href = window.location.origin+"/forms/"+formNumber;
      }  
         var a = document.getElementById('agile-logo');
         a.href = window.location.origin;
         var a = document.getElementById('form_back');
         a.href = window.location.origin+"/#forms";
         window.onbeforeunload = function(event) {
               var closeText = "Do you want to Close?";
               event.returnValue = closeText;
               return closeText;
         }
      </script>
      <script data-main="misc/formbuilder/main.js" src="misc/formbuilder/assets/lib/require.js?v=3" ></script>
      <style>

      .modal-content{
          position: relative;
          border: 1px solid rgba(0,0,0,.2);
          border-radius: 0;
          outline: 0;
          box-shadow: 0 3px 9px rgba(0,0,0,.5);
      }

      .modal-header .close{
         opacity: .2;
         outline:none;
      }
      .modal-title{
          font-weight: normal;
          margin: 0;
          font-size: 16px;
          line-height: 1.42857143;
          color: #58666e;
      }
      .modal-body{
          background: #fff;
          position: relative;
          padding: 15px;
      }
      .modal-footer{
          padding: 10px;
          background-color: rgba(0,0,0,0.025);


          text-align: right;
          border-top: 1px solid #e5e5e5;
      }
      .modal-footer .checkbox{
          margin-top: 4px;
          margin-bottom: 4px;
          position: relative;
          display: block;
      }

      .modal-footer .checkbox label{
            min-height: 20px;
          padding-left: 20px;
          margin-bottom: 0;
          font-weight: normal;
          cursor: pointer;
          float: left!important;
          display: inline-block;
          max-width: 100%;
          font-family: "Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif;
          font-size: 13px;
          -webkit-font-smoothing: antialiased;
          line-height: 1.69;
          color: #58666e;
      }


      .close-button{
          outline:none;
          color: #fff!important;
          background-color: #7266ba;
          border-color: #7266ba;
          border-radius: 2px;
          outline: 0!important;
          padding: 4px 9px;
          font-size: 12px;
          line-height: 1.7;
          border: 1px solid transparent;
      }
           
</style>
   </body>
</html>