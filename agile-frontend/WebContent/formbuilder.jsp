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
      <link href="flatfull/css/min/lib-all-new.css" rel="stylesheet">
      <link href="misc/formbuilder/custom.css?v=2" rel="stylesheet">
      <link href="misc/formbuilder/formthemes.css" rel="stylesheet">
      <script src="misc/formbuilder/formthemes/jscolor.js"></script>
      <script src="misc/formbuilder/formthemes/jquery-min.js"></script>
      <script src="misc/formbuilder/formthemes/dropDownNewSampleThemeJS.js"></script>
      
      <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script> -->
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
                  <div class="btn-group open" style="margin-top: -40px;margin-left: 210px;padding-right: 10px;">
                    <a href="#" onclick="createCustTheme()" class="btn btn-default btn-sm" data-toggle="modal" data-target="#customThemeModal"><i class="fa fa-plus-circle"></i> Add Theme</a>
                    <button class="btn btn-default btn-sm dropdown-toggle" onclick="chooseThemeFunc()" data-toggle="dropdown" aria-expanded="true" style="padding-bottom: 13px;padding-top: 11px;"><span class="caret"></span>
                    </button>
         
                    <div class="dropdown-content">
                      <div class="themeDiv">
                        <i class="fa fa-check"></i>
                        <a href="#" class="themeEle" onclick="selectedThemeFunc(this)">default</a>
                      </div>
                      <div class="themeDiv">
                        <i class="ipadding"></i>
                        <a href="#" class="themeEle" onclick="selectedThemeFunc(this)">theme1</a>
                      </div>
                      <div class="themeDiv">
                        <i class="ipadding"></i>
                        <a href="#" class="themeEle" onclick="selectedThemeFunc(this)">theme2</a>
                      </div>
                      <div class="themeDiv">
                        <i class="ipadding"></i>
                        <a href="#" class="themeEle" onclick="selectedThemeFunc(this)">theme3</a>
                      </div>
                      <div id="lable4" class="themeDiv">
                        <i class="ipadding"></i>
                        <a href="#" class="themeEle" onclick="selectedThemeFunc(this)">theme4</a>
                      </div>  
                    </div>
                  </div>
            <div class="modal fade" id="customThemeModal" role="dialog">
                      <div class="modal-dialog" style="width: 1032px;height: 365px;left:0px;">
    
                         <!-- Modal content-->
                        <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal" style="color: #fff;
                        background-color: #7266ba;margin-right: 44px;float: right;text-align: center;" onclick="saveCustTheme()">Save</button>
                        
                        <div class="modal-title">
                        <label>Custom Theme:</label><!-- <input type="text" name="themeName"> -->
                      </div>
                        </div>
                        
                        <div class="modal-body" style="height: 400px;overflow-y: auto;">
                 <div style="display:-webkit-box;border-bottom: 1px solid #9E9E9E;padding-bottom: 10px;"><label>Theme Name:</label><input type="text" name="themeName" id="themeName" onblur="validThemeNameFunc()" maxlength="15"><span id="errorSpan" style="display: table-cell;color:red;"></span></div>
    
        <!--ThemeBuilder Div-->
    <div class ="col-sm-6 outerSelectTheme" >
      <!--Select Div Start-->
      <div class="selectDiv">
        <label>Select</label>
          
            <div class="">
              <select>
                  <option value="alignment">Alignment</option>
                  <option value="border">Border</option>
                  <option value="font">Font</option>
                  <option value="background">Background</option>
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
            <select>
                <option value="formtitle">Form Title</option>
                  <option value="submitbutton">Submit Button</option>
              </select>
            </div>
        </div>
        <!--Align Form Elements Start-->
        <!--Align Start-->
        <div class="innerAlignmentTheme innerAlignmentAlignStart">
          <span style="margin-left: 10px;font-weight: bold;">Align</span>
          <div class="">
            <select>
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
              <select>
                <option>Form</option>
              </select>
            </div>
          </div>
          <!-- Border Form Elements End-->
          <!-- Border Width Start-->
          <div class="innerBorderTheme innerBorderWidthTheme">
            <label>Width</label>
            <div>
              <select>
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
          <div class="innerBorderTheme colorTheme innerBorderColorTheme">
            <div><label>Choose Color</label></div>
             <input class="jscolor innerColorTheme" style="color:#000000;" size="11" value="000000">
          </div>
          <!-- Border Color End-->
        </div>
      <!--Border Div  End-->

      <!--Font Div Start-->
      <div class="outerFontTheme">
         <!--Font Form Elements Start -->
        <div class="innerFontTheme innerFontEleTheme">
          <label>Form Elements</label>
          <div>
              <select>
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
              <select>
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
        <!--Font Style Start -->
        <div class="innerFontTheme innerFontStyleDiv">
          <label>Font Style</label>
          <div class="innerFontUlDiv">
            <select>
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </div>

        </div>
        <!--Font Style End-->
        <!--Font Weight Start -->
        <div class="innerFontTheme innerFontWeightDiv">
          <label>Font Weight</label>
          <div>
            <select>
              <option value="normal">Normal</option>
              <option value="lighter">Lighter</option>
              <option value="bold">Bold</option>
              <option value="bolder">Bolder</option>
            </select>
          </div>
        </div>
        <!--Font Weight End -->
        <!--Font Size Start -->
        <div class="innerFontTheme ">
          <label>Font Size</label>
          <div class="innerFontSizeUlDiv">
            <select>
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
        <!--Font Color Start -->
        <div class="innerFontTheme colorTheme">
          <div class="colorTheme">
            <div><label>Choose Color</label></div>
             <input class="jscolor innerColorTheme" style="color:#000000;" size="11" value="000000">
          </div>
        </div>
        <!--Font Color End -->
      </div>
      <!--Font Div End-->
      <!--Background ThemeComponent Start -->
      <div class="outerBackgroundTheme">
        <!--Form Elements for Background Change Start -->
        <div class="innerBackgroundTheme innerBackgroundFormEle">
          <label>Form Elements</label>
          <div>
            <select>
              <option>Form</option>
              <option>Header</option>
              <!-- <option>Body</option> -->
              <option>Footer</option>
              <option>Button</option>
            </select>
          </div>
        </div>
        <!--Form Elements for Background Change End-->
        <!--Background Theme Component Start -->
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
        <!--Background Theme Component End -->
        <!--Backdround Color Component Start -->
        <div class="innerBackgroundTheme colorTheme">
          <div class="colorTheme">
            <div><label>Choose Color</label></div>
             <input class="jscolor innerColorTheme" style="color: rgb(0, 0, 0);" size="11" value="FFFFFF
             ">
          </div>
        </div>
        <!--Backdround Color Component End-->
      </div>
      <!--Background ThemeComponent End -->
    </div>
    <!--ThemeBuilder Div-->                  
    <div class="col-sm-6 createCustomFormContent" style="margin:0 auto;width:450px;margin-top:20px;margin-left: 20px;">
    </div>
        </div>
              <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal" style="color:#fff;background-color:#7266ba">Close</button>
              </div>
             </div>
      
                     </div>
                  </div>

                 
                  <input id="form-preview" type="button"  onclick="formView()" class="btn btn-info" data-toggle="modal" data-target="#myModal" style="margin-top: -40px;margin-left: 340px;padding-right: 17px;background-color: #fff;color: #000;border-color: #ccc;height: 31px;font-size: 12px;"value="Preview Form">
                  <input id="form-save" type="button" class="btn btn-info" style="background-color: #fff;color: #000;border-color: #ccc;height: 31px;font-size: 12px;padding-left: 22px;" value="Save Form">
                  <hr style="margin-top: 30px;">
                  <!--Adding content for formPreview-->
                   <div class="modal fade" id="myModal" role="dialog">
                      <div class="modal-dialog" style="left:0px;">
    
                         <!-- Modal content-->
                        <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">This is how your Form looks:</h4>
                        </div>
                        <div class="modal-body">
                        <p  id="formContent" style="overflow: scroll;overflow-x: hidden;border: 1px solid #ccc;height: 450px;"></p>
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
       <script>
                  var formtheme="default";
                  var chooseThemeFuncHitCount=0;
                  var customthemes=null;
                  var formClasses=null;
                  var themesListAsArr=["default","theme1","theme2","theme3","theme4"];
                  function chooseThemeFunc(){
                    <%
                    List<CustomTheme> custThmList=CustomThemesUtil.fetchAllCustomThemes();
                    System.out.println("hi..........."+custThmList);
                    %>
                    chooseThemeFuncHitCount++;
                   /* $("#lable4").nextAll().remove();*/
                    if(chooseThemeFuncHitCount==1){
                      customthemes=<%=net.sf.json.JSONSerializer.toJSON(custThmList) %>

                    /*Edit Form CustTheme Class Fetching*/
                    console.log("hi.........."+customthemes);
                    if(customthemes!=null){
                      for(i=0;i<customthemes.length;i++){
                        var custId=customthemes[i].id;
                        var custName=customthemes[i].name;
                        themesListAsArr.push(custName);
                        var custCss=customthemes[i].themeCss;
                        var custIdName=custName+":"+custId;
                        var inputTheme='<div class="themeDiv"><i class="ipadding"></i><a href="#" class="themeEle'+"\t"+custIdName+'"  onclick="selectedThemeFunc(this)">'+custName+'</a><a href="#" class="themeEleDelete fa fa-times-circle-o" onclick="deleteTheme(this)"></a></div>';
                              
                         $(inputTheme).insertAfter("#lable4");
                        }
                        if(formClasses!=null){
                          var formClassesList=formClasses.split(" ");
                          $.each(themesListAsArr,function(index1,value1){
                         
                            $.each(formClassesList,function(index2,value2){
                              if(value1==value2){
                                formtheme=value2;
                                var themeElem=$(".themeEle");
                                $.each(themeElem,function(index,value){
                                  if($(this).text()==formtheme){
                                    var firstDiv=$(".themeDiv")[0];
                                    $(firstDiv).find("i").removeClass("fa");
                                    $(firstDiv).find("i").removeClass("fa-check");
                                    $(firstDiv).find("i").addClass("ipadding");
                                    var parentDiv=$(this).parent();
                                    $(parentDiv).find("i").addClass("fa");
                                    $(parentDiv).find("i").addClass("fa-check");
                                    $(parentDiv).find(i).removeClass("ipadding");
                                  }
                                });
                              }
                            });
                         });
                        }
                      }
                       /*customthemes=null;*/
                     }
                 
                    $(".dropdown-content").css("display","block");
                  }
                  
                  function selectedThemeFunc(identifier){
                    var themeDivArr=$(".themeDiv");
                    $.each(themeDivArr,function(index,value){
                      $(this).find("i").removeClass("fa");
                      $(this).find("i").removeClass("fa-check");
                      $(this).find("i").addClass("ipadding");
                     });
                    var themeVal= $(identifier).text();
                    $(identifier).parent().find("i").addClass("fa");
                    $(identifier).parent().find("i").addClass("fa-check");
                    $(identifier).find("i").removeClass("ipadding");

                    console.log(themeVal);
                    if(themeVal=="default"){
                      formtheme="default";
                    }
                    else{
                      formtheme=themeVal;
                      }
                     $(".dropdown-content").css("display","none");
                  }

                  function formView(){
                           if(document.getElementById("render")!=null){
                            var pContent=document.getElementById("render").value; 
                           document.getElementById("formContent").innerHTML = "<div id='formContentDiv' style='margin:25px 50px;align:center;'>"+pContent+"</div>";
                           }
                           if(formtheme!=null && formtheme!="default"){
                              if(formtheme=="theme1"||formtheme=="theme2"||formtheme=="theme3"||formtheme=="theme4"){
                                  $(".form-view").addClass(formtheme);
                                  $(".form-view fieldset").css("border","1px solid #ccc");
                              }
                              else {
                                $(".form-view").addClass(formtheme);
                                $.ajax({
                                      type : 'POST',
                                      url :  window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes/getCustomThemeByName',
                                      async : false,
                                      contentType : 'application/json',
                                      data : formtheme,
                                      success: function(data){
                                        console.log("DATA COMING!!!"+data);
                                        var style='<style id="'+data.name+data.id+'" type="text/css">'+data.themeCss+'</style>';
                                        $("#formContentDiv").append(style);
                                      },
                                      error: function(){
                                        alert("Theme style not been appended!!");
                                        
                                      }});
                              }
                            
                           }
                         }
                  function saveCustTheme(){
                    var custTheme="";
                    var themeName=$("#themeName").val();
                    var isThemeNameExist=false;
                    if(themeName!=null && (themeName.length>0)){
                      if(!isThemeNameExist){
                       for(i=0;i<themeArray.length;i++){
                          for(j=0;j<themeArray[i].form_element.length;j++){
                            var ele=themeArray[i].form_element[j].ele;
                            var elecss=themeArray[i].form_element[j].css;
                            custTheme=custTheme+"."+themeName+"\t"+elecss;
                            console.log("output coming!!!"+ele);
                            console.log("output coming!!!"+elecss);
                          }
                        }
                        console.log("Final CustomTheme::::"+custTheme);
                        var customTheme = {};
                        customTheme.name=themeName;
                        customTheme.themecss=custTheme;
                        $.ajax({
                          type : 'POST',
                          url : window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes',
                          async : false,
                          contentType : 'application/json',
                          data : JSON.stringify(customTheme),
                          success: function(data){
                            console.log(data);
                            if(data!=undefined && data!=""){
                              customthemes.push(data);
                              $("#themeName").val("");
                              var inputTheme='<div class="themeDiv"><i class="ipadding"></i><a href="#" class="themeEle'+"\t"+data.name+data.id+'"  onclick="selectedThemeFunc(this)">'+data.name+'</a><a href="#" class="themeEleDelete fa fa-times-circle-o" onclick="deleteTheme(this)"></a></div>';
                              
                              $(inputTheme).insertAfter("#lable4");
                            }
                            
                          },
                          error: function(){
                            alert("Form with this name is already saved, or this is an invalid form name. Please change form name and try again.");
                            $("#themeName").val("");
                          }});
                      }
                    }
                  }
                  function validThemeNameFunc(){
                    var themeName=$("#themeName").val();
                    var themeNamePattern=/^[a-z][a-zA-Z0-9]+/;
                    var isThemeNameExist=false;
                    if(themeName==null || themeName.length<=0){
                      $("#errorSpan").text("Please provide valid theme name ");
                      $("#themeName").val("");
                    }
                    if(themeName.split(" ").length>1){
                      $("#errorSpan").text("Space not allowed");
                      $("#themeName").val("");
                    }
                    else {
                        if(!themeNamePattern.test(themeName)){
                       
                          $("#errorSpan").text("Provided theme name should starts with a letter and should contain atleast two characters and not contain special characters");
                          $("#themeName").val("");
                       }
                        else{
                          
                              $.each( themesListAsArr, function( index, value ) {
                                  if(value==themeName){
                                    isThemeNameExist=true;
                                    $("#errorSpan").text("Provided theme name matches with existing themes.Please provide valid theme name.");
                                    $("#themeName").val("");
                                   }
                              });
                              if(!isThemeNameExist){
                                $("#errorSpan").text("");
                              }
                        }
                      }
                  }

                  function deleteTheme(identifier){
                    var deleteThemeVal=$(identifier).prev().text();
                    var isDeleteSelectTheme=$(identifier).prev().prev().hasClass("fa-check");
                    if(isDeleteSelectTheme==true){
                      var themeElem=$(".themeDiv");
                      $(themeElem[0]).find("i").addClass("fa");
                      $(themeElem[0]).find("i").addClass("fa-check");
                      $(themeElem[0]).find("i").removeClass("ipadding");
                    }
                  var parentDiv=$(identifier).parent();
                     console.log("Requsted deleteThemeVal is:"+deleteThemeVal+"\t"+parentDiv);
                     $.ajax({
                                type : 'GET',
                                url :  window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes/deleteTheme?themeName='+deleteThemeVal,
                                success: function(data){
                                  console.log("DATA COMING!!!"+data);
                                  
                                    $(parentDiv).remove();
                                    $.each( themesListAsArr, function( index, value ){
                                      if(value==deleteThemeVal)
                                      themesListAsArr.splice(index,1);
                                    });

                                    $.each( customthemes, function( index, value ) {
                                        if(this.name==deleteThemeVal){
                                         customthemes.splice(index,1); 
                                        }  
                                    });
                                  
                                },
                                error: function(err){
                                  alert("Theme is not getting deleted AJAX ERROR is::"+JSON.stringify(err, null, 2));
                                }
                      });
                  }
                  function createCustTheme(){
                    if($("#render")!=null){
                        var pContent=document.getElementById("render").value;
                           $(".createCustomFormContent").html(pContent);
                      }
                  }
                  
                </script>
      <script data-main="misc/formbuilder/main.js" src="misc/formbuilder/assets/lib/require.js?v=3" ></script>
   </body>
</html>