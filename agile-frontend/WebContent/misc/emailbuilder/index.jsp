<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@ page contentType="text/html;charset=UTF-8"%>
<%
String _AGILE_VERSION = SystemProperty.applicationVersion.get();
String templateId = request.getParameter("tmpid");
String action = request.getParameter("action");

//Locales JSON
String _LANGUAGE = LanguageUtil.getLanguageKeyFromCookie(request);
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "email-builder");
System.out.println("language = " + localeJSON);
%>
<!DOCTYPE html>
<html lang="<%=_LANGUAGE%>">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <title>editor email</title>

        <!-- styles -->

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <!--  <link href="css/template.editor.css?v=<%=_AGILE_VERSION%>" rel="stylesheet"/>
        <link href="css/responsive-table.css?v=<%=_AGILE_VERSION%>" rel="stylesheet"/>
        <link href="css/colpick.css" rel="stylesheet"  type="text/css"/>  -->

        <link href="build/emailbuilder.min.css?v=<%=_AGILE_VERSION%>" rel="stylesheet"/>

<script>
var AGILE_EB_ROOT = window.location.origin + "/";
var AGILE_EB_OPTIONS = {};
AGILE_EB_OPTIONS['action'] = "new";
AGILE_EB_OPTIONS['templateId'] = "";
<% if(action != null) { %>
    AGILE_EB_OPTIONS['action'] = '<%=action%>';
<% } %>
<% if(templateId != null) { %>
    AGILE_EB_OPTIONS['templateId'] = '<%=templateId%>';
<% } %>
var localeJSON = <%=localeJSON%>;
</script>

        <!--[if lt IE 9]>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
        <![endif]-->
        <script type="text/javascript"> var path = '/';</script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/ui/1.9.2/jquery-ui.min.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

        <!--<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>-->
        <script src="/js/designer/tinymce/tinymce.min.js"></script>
        <!--<script type="text/javascript" src="js/colpick.js"></script>
        <script type="text/javascript" src="js/template.editor.js?v=<%=_AGILE_VERSION%>"></script>-->

        <script type="text/javascript" src="build/emailbuilder.min.js?v=<%=_AGILE_VERSION%>"></script>

<style>
.mce-btn button {
    padding: 2px 4px !important;
}
.mce-listbox button {
    padding-right: 15px !important;
}
.main {
    width: 638px !important;
}
.edit .demo:after {
    content: '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "body") %>'!important;
}
</style>
    </head>
    <body class="edit" style="overflow: hidden;" onload="parent.onEmailBuilderLoad()" id="builderFullBodyHolder">

        <a class="hide" href="#save" id="sourcepreview"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "preview") %></a>
        <a class="hide" href="#save" id="save" ><i class="glyphicon glyphicon-floppy-disk"></i> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "save") %></a>
        <textarea id="templateHtmlContent" class="hidden"><%@ include file="template.html" %></textarea>

        <div class="row" style="margin:0">

            <div class="col-md-8" style="padding-top:15px;border-right:1px solid #dee5e7">

                <div id="tosave" style="overflow-y:auto;overflow-x:hidden;padding-bottom:30px;height: 800px;">
                    <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #eeeeee;font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 12px;line-height: 21px;color: #000000;" >
                        <tr>
                            <td width="100%" id="primary" class="main demo" align="center" valign="top" >
                                <div class="column" style="min-height:150px;">

                                    <div class="lyrow dragitem">
                                        <a href="#close" class="remove label label-danger"><i class="glyphicon-remove glyphicon"></i></a>

                                        <span class="drag label label-default"><i class="glyphicon glyphicon-move"></i></span>
                                        <span class="configuration"> <a href="#" class="btn btn-default btn-xs clone"><i class="fa fa-clone"></i> </a>  </span>

                                        <div class="preview">
                                            <div class="icon text-block"></div>
                                            <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "text") %></label>
                                        </div>
                                        <div class="view">
                                            <div class="row clearfix">
                                                <table width="640" class="main" cellspacing="0" cellpadding="0" border="0" style="background-color:#FFFFFF" align="center" data-type='text-block'>
                                                    <tbody>
                                                        <tr>
                                                            <td class="block-text" data-clonable="true" align="left" style="padding:10px 50px 10px 50px;">
                                                                <div style="margin:0px 0px 10px 0px;font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 12px;line-height: 21px;color: #000000;" class="textFix"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "builder-edit-info") %></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="col-md-4" style="padding-top:15px">
    
<!-- start of block-drag -->
<div id="block-drag">

  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#add-content" aria-controls="add-content" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-plus"></i> Add Content</a></li>
    <li role="presentation">
    <a href="#customize" aria-controls="customize" role="tab" data-toggle="tab" id="custom-val"><i class="glyphicon glyphicon-cog"></i> Customize</a>
    </li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="add-content">
        <div class="sidebar-nav" style="margin-top: 10px;margin-left: -15px;">
                    <div id="elements" style="position:relative;">
                        <ul class="nav nav-list accordion-group">
                            <li class="rows" id="estRows">

                                <!-- title and subtitle -->
                                <%@ include file="blocks/title-subtitle.html" %>
                                <!-- horizontal rule -->
                                <%@ include file="blocks/horizontal-rule.html" %>
                                <!-- text -->
                                <%@ include file="blocks/text.html" %>
                                <!-- image -->
                                <%@ include file="blocks/image.html" %>

                                <%@ include file="blocks/video-record.html" %>
                                
                                <!-- button -->
                                <%@ include file="blocks/button.html" %>
                                <!--Image + Text -->
                                <%@ include file="blocks/image-text.html" %>
                                                                
                                <!-- IMG + TEXT 2 columns -->
                                <%@ include file="blocks/column-2-image-text.html" %>

                                <%@ include file="blocks/column-2-text.html" %>

                                <!-- IMG +TEXT 3 columns -->
                                <%@ include file="blocks/column-3-image-text.html" %>

                                <%@ include file="blocks/column-3-text.html" %>

                                <!-- SOCIAL LINKS -->
                                <%@ include file="blocks/social-links.html" %>

                                <%@ include file="blocks/image-caption.html" %>

                            </li>
                        </ul>
                    </div>
                </div>
    </div>
    <div role="tabpanel" class="tab-pane" id="customize">


 <div class="panel panel-default" style="border: 0; margin: 0;">
    <div class="panel-heading panel-click" style="margin-bottom: 5px;">
        <h3 class="panel-title">Font Styles
            <span class="pull-right " ><i class="glyphicon glyphicon-chevron-up"></i></span>
        </h3>
    </div>
        <div class="panel-body" style="display: block;">
            
            <div class="form-horizontal">
    
    <div class="form-group">
            <div class="col-sm-4 control-label">Default Font</div>
    <div class="col-sm-8">
        <select class="form-control font-family-picker">

        <option value= 'Arial, "Helvetica Neue", Helvetica, sans-serif' style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif" >Arial</option>
        <option value='"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace' style="font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace">Courier</option>
        <option value='Georgia, Times, "Times New Roman", serif' style="font-family: Georgia, Times, 'Times New Roman', serif">Georgia</option>
        <option value='"Helvetica Neue", Helvetica, Arial, sans-serif' style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica</option>
        <option value='"Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Geneva, Verdana, sans-serif' style="font-family:  'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Geneva, Verdana, sans-serif">Lucida Sans</option>
        <option value='Tahoma, Verdana, Segoe, sans-serif' style="font-family: Tahoma, Verdana, Segoe, sans-serif">Tahoma</option>
        <option value='TimesNewRoman, "Times New Roman", Times, Beskerville, Georgia, serif' style="font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif">Times New Roman</option>
        <option value='"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif' style="font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif">Trebuchet MS</option>
        <option value='Verdana, Geneva, sans-serif' style="font-family: Verdana, Geneva, sans-serif">Verdana</option>
        <option value='Bitter, Georgia, Times, "Times New Roman", serif' style="font-family: 'Bitter', Georgia, Times, 'Times New Roman', serif">Bitter</option>
        <option value='"Droid Serif", Georgia, Times, "Times New Roman", serif' style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif">Droid Serif</option>
        <option value='Lato, Tahoma, Verdana, Segoe, sans-serif' style="font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif">Lato</option>
        <option value='"Open Sans, "Helvetica Neue", Helvetica, Arial, sans-serif' style="font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif">Open Sans</option>
        <option value='Roboto, Tahoma, Verdana, Segoe, sans-serif' style="font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif">Roboto</option>
        <option value='"Source Sans Pro", Tahoma, Verdana, Segoe, sans-serif' style="font-family: 'Source Sans Pro', Tahoma, Verdana, Segoe, sans-serif"> Source Sans Pro</option>
        <option value='Montserrat, "Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif' style="font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif">Montserrat</option>
        <option value='Ubuntu, Tahoma, Verdana, Segoe, sans-serif' style="font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif">Ubuntu</option>

    </select>
            </div>
        </div>

    
    <div class="form-group">
        <div class="col-sm-4 control-label">Font Size</div>  
    <div class="col-sm-8">
        <select class="form-control font-size-picker">
            <option>8px</option>
            <option>9px</option>
            <option>10px</option>
            <option>11px</option>
            <option selected="selected">12px</option>
            <option>14px</option>
            <option>16px</option>
            <option>18px</option>
            <option>20px</option>
            <option>22px</option>
            <option>24px</option>
            <option>26px</option>
            <option>28px</option>
        </select>
    </div>
    </div>


    
    <div class="form-group">
        <div class="col-sm-4 control-label">Line Height</div>  
        <div class="col-sm-8">
        <select class="form-control line-height-picker">
            <option>16px</option>
            <option>18px</option>
            <option>20px</option>
            <option>21px</option>
            <option>22px</option>
            <option>24px</option>
            <option>25px</option>
            <option>26px</option>
            <option>28px</option>
        </select>
        </div>
    </div>


<div class="form-group">
                    <div class="col-sm-4 control-label">Font Color</div>
    <div class="col-sm-8" id="font-color">
  
        <div class="input-group"> 
            <div class="input-group-addon color-preview"></div> 
            <div class="form-control hex-col-val"> </div>
        </div>
        
    </div>

    <script type="text/javascript">
                $('#font-color').colpick({
                layout: 'hex',
                // colorScheme: 'dark',
                onBeforeShow: function () {
                $(this).colpickSetColor(rgb2hex($(this).find('.color-preview').css('background-color').replace("#","")));
                },
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                        if (!bySetColor){
                            $(el).parent().find(".color-preview").css('background-color', '#' + hex);
                            $(el).parent().find(".hex-col-val").text('#' + hex);
                            $('#tosave').find('.textFix').css('color', '#'+ hex);
                        }
                },
                onSubmit: function (hsb, hex, rgb, el) {
                    $('#tosave').find('.textFix').css('color', '#'+ hex);
                    $(el).colpickHide();
                }
                }).keyup(function () {
                $(this).colpickSetColor(this.value);
                });
    </script>
    
</div>

        </div> <!-- end of form horizontal -->
    </div> <!-- end of body -->
</div>  <!-- end of panel -->


  

<div class="panel panel-default" style="border: 0; margin: 0;">
    <div class="panel-heading panel-click" style="margin-bottom: 5px;">
        <h3 class="panel-title">Background Color
            <span class="pull-right panel-collapsed" ><i class="glyphicon glyphicon-chevron-down"></i></span>
        </h3>
    </div>
        <div class="panel-body" style="display: none;"> 
            <div class="form-horizontal">

    <div class="form-group">
                    <div class="col-sm-4 control-label">Content</div>
    <div class="col-sm-8" id="content-bg-color">
  
        <div class="input-group"> 
            <div class="input-group-addon color-preview"></div> 
            <div class="form-control hex-col-val"> </div>
        </div>
        
    </div>

    <script type="text/javascript">
                $('#content-bg-color').colpick({
                layout: 'hex',
                // colorScheme: 'dark',
                onBeforeShow: function () {
                $(this).colpickSetColor(rgb2hex($(this).find('.color-preview').css('background-color').replace("#","")));
                },
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                        if (!bySetColor){
                            $(el).parent().find(".color-preview").css('background-color', '#' + hex);
                            $(el).parent().find(".hex-col-val").text('#' + hex);
                            $('#tosave').find('#primary .main:not([data-color=true])').css('background-color', '#' + hex);
                        }
                },
                onSubmit: function (hsb, hex, rgb, el) {
                    $('#tosave').find('#primary .main:not([data-color=true])').css('background-color', '#' + hex);
                    $(el).colpickHide();
                }
                }).keyup(function () {
                $(this).colpickSetColor(this.value);
                });
    </script>
    
</div>


<div class="form-group">
                    <div class="col-sm-4 control-label">Template</div>
    <div class="col-sm-8" id="background-color">
  
        <div class="input-group"> 
            <div class="input-group-addon color-preview"></div> 
            <div class="form-control hex-col-val"> </div>
        </div>
        
    </div>

    <script type="text/javascript">
                $('#background-color').colpick({
                layout: 'hex',
                // colorScheme: 'dark',
                onBeforeShow: function () {
                $(this).colpickSetColor(rgb2hex($(this).find('.color-preview').css('background-color').replace("#","")));
                },
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                        if (!bySetColor){
                            $(el).parent().find(".color-preview").css('background-color', '#' + hex);
                            $(el).parent().find(".hex-col-val").text('#' + hex);
                            $('#path').val('tosave table:first');
                            $('#' + $('#path').val()).css('background-color', '#' + hex);
                        }
                },
                onSubmit: function (hsb, hex, rgb, el) {
                    $('#path').val('tosave table:first');
                    $('#' + $('#path').val()).css('background-color', '#' + hex);
                    $(el).colpickHide();
                }
                }).keyup(function () {
                $(this).colpickSetColor(this.value);
                });
    </script>
    
</div>



</div><!-- end of form horizontal -->
</div> <!-- end of body -->
</div>  <!-- end of panel --> 



</div>
 </div>
  </div> <!-- end of block-drag -->


 <!-- settings popup start -->
<div class="hide" id="settings" style="height:625px;overflow-y:auto;overflow-x:hidden;">

    <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active">
            <a href="#tiny-editor" aria-controls="tiny-editor" role="tab" id="content-tab" data-toggle="tab" aria-expanded="true"><i class="glyphicon glyphicon-edit"></i> Content</a>
        </li>
        <li role="presentation" class="">
        <a href="#block-customize" aria-controls="block-customize" role="tab" id="customize-tab" data-toggle="tab" aria-expanded="false"><i class="glyphicon glyphicon-cog"></i> Customize</a>
        </li>
    </ul>

<!-- start of tab-content -->
<div class="tab-content">

   <!-- start of tiny-editor -->
    <div role="tabpanel" class="tab-pane active" id="tiny-editor">
        <div class="sidebar-nav">

            <form id="editor" style="margin-top:10px;margin-bottom:13px;">
                        <div class="panel panel-body panel-default html5editor" id="html5editor"></div>
                    </form>

        </div>

        <!-- start of image properties -->
        <div id="imageproperties" style="margin-top:5px;margin-left:0;" class="form-horizontal">
                        
                        <div class="form-group" id="video-record-btn-holder" style="display:none;">

                            <div class="form-group" style="margin-bottom: -10px;">
                                <div class="col-sm-8" style="margin-left: 35px;">
                                    <h5><span>Record a video</span><h5>
                                </div>
                                <div class="col-sm-3 ">
                                    <button type="button" class="btn btn-default" id="videoRecordBtnNew" style="width:65px;">
                                        <span class="fa fa-video-camera"></span>
                                    </button>
                                </div>
                            </div>

                        
                            <h5 style="text-align:center;">(OR)</h5>
                        
                        
                            <div class="form-group" style="margin-bottom: -10px;">
                                <div class="col-sm-8" style="margin-left: 35px;">
                                    <input type="text" id="video-link" class="form-control" placeholder="Link to Video URL" aria-describedby="basic-addon11" data-id="none">
                                </div>
                                
                                <div class="col-sm-3 pull-right" >
                                    <button type="button" class="btn btn-default" id="videoRecordBtn">
                                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "select") %></span>
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div class="form-group">

                            <div class="" id="videoThumbnail" style="display:none;">
                                <!-- <label for="video-record-Thumbnail" class="col-xs-8 control-label">Thumbnail</label> -->
                            </div>
                          
                              <div class="col-sm-3 control-label">Image</div>
                                
                                <div class="col-sm-9">
                                    <div class="input-group">
                                      <input type="text" id="image-url" class="form-control" data-id="none"/>
                                      <span class="input-group-btn">
                                        <a id="browseBtn" class="btn btn-default browseBtn" onclick="$('#uploadImageToS3Btn').click()">Browse</a>
                                         <input type="file" id="uploadImageToS3Btn" class="hidden">
                                      </span>
                                    </div><!-- /input-group -->
                                  </div>

                        </div>

                        <!-- start of image link -->
                        <div class="form-group" id="image-link-holder">
                            
                            <div >
                             <div class="col-sm-3 control-label">Link</div>
                                
                                <div class="col-sm-9">
                                    <div class="input-group">
                                        
                                            <span class="input-group-addon" id="basic-addon11"><i class="fa fa-paperclip"></i></span>
                                            <input type="text" id="image-link" class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "link-to-web-link") %>' aria-describedby="basic-addon11" data-id="none">
                                        
                                    </div><!-- /input-group -->
                                </div>

                            </div>
                        </div> <!-- end of image link -->
                         
                        
                        <!-- start of alt text -->
                        <div class="form-group"> 
                            <div class="col-sm-3 control-label">Alt Text</div>
                                
                                <div class="col-sm-9">
                                    
                                    <input type="text" id="image-alt-text" class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "alternate-text") %>' data-id="none">
                                                                     
                                </div>    
                        </div> <!-- end of alt text -->



<div id="image-width-height">

<!-- start of image width -->
    <div class="form-group">

        <div class="col-sm-3 control-label">Width</div>

            <div class="col-sm-9" >
                <div class="input-group"> 
                    <input type="number" class="form-control" placeholder='width' id="image-w" name="ptop" >
                    <div class="input-group-addon color-preview">px</div> 
                </div>
                
            </div>

    </div> <!-- end of image width -->


    <!-- start of image height -->
     <div class="form-group">
       
            <div class="col-sm-3 control-label">Height</div>
            
            <div class="col-sm-9" >
                <div class="input-group"> 
                    <input type="number" class="form-control" placeholder='Height' id="image-h" name="image-h" >
                    <div class="input-group-addon color-preview">px</div> 
                </div>
                
            </div>
        
    </div> <!-- end of image height -->

</div>

        <!-- start of image alignment -->        
                    <div class="form-group" id="select_alignment">
                            
                            <div >
                             <div class="col-sm-3 control-label">Alignment</div>
                                
                                <div class="col-sm-9">
                                    <select class="form-control image-align-picker">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>

                            </div>
                        </div> <!-- end of image alignment -->

                        
                    </div> <!-- end of image properties -->

        <!-- start of social links -->
        <div id="social-links" style="margin-top:-10px;">
                        <ul class="list-group" id="social-list">
                            <li>
                                <div class="input-group">
                                    <span class="input-group-addon" ><i class="fa fa-2x fa-facebook-official"></i></span>
                                    <input type="text" class="form-control social-input" name="facebook" style="height:48px"/>
                                    <span class="input-group-addon" ><input  type="checkbox" checked="checked" name="facebook" class="social-check"/></span>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <span class="input-group-addon" ><i class="fa fa-2x fa-twitter"></i></span>
                                    <input type="text" class=" form-control social-input" name="twitter" style="height:48px"/>
                                    <span class="input-group-addon" ><input type="checkbox" checked="checked" name="twitter" class="social-check"/></span>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <span class="input-group-addon" ><i class="fa fa-2x fa-linkedin"></i></span>
                                    <input type="text" class=" form-control social-input" name="linkedin" style="height:48px"/>
                                    <span class="input-group-addon" ><input type="checkbox" checked="checked" name="linkedin" class="social-check"/></span>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <span class="input-group-addon" ><i class="fa fa-2x fa-youtube"></i></span>
                                    <input type="text" class=" form-control social-input" name="youtube" style="height:48px"/>
                                    <span class="input-group-addon" ><input type="checkbox" checked="checked" name="youtube" class="social-check" /></span>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <span class="input-group-addon" ><i class="fa fa-2x fa-instagram"></i></span>
                                    <input type="text" class=" form-control social-input" name="instagram" style="height:48px"/>
                                    <span class="input-group-addon" ><input type="checkbox" checked="checked" name="instagram" class="social-check" /></span>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <span class="input-group-addon" ><i class="fa fa-2x fa-pinterest"></i></span>
                                    <input type="text" class=" form-control social-input" name="pinterest" style="height:48px"/>
                                    <span class="input-group-addon" ><input type="checkbox" checked="checked" name="pinterest" class="social-check" /></span>
                                </div>
                            </li>
                        </ul>
                    </div> <!-- end of social links -->


        <!-- start of buttons -->
        <div id="buttons" style="max-width: 400px;margin-top:5px;margin-left: -5px;">
                        <div class="form-group">
                            <select class="form-control">
                                <option value="center"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-align-center") %></option>
                                <option value="left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-align-left") %></option>
                                <option value="right"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-align-right") %></option>
                            </select>
                        </div>
                        <ul id="buttonslist" class="list-group" style="list-style: none;">
                            <li class="hide" style="padding:10px; border:1px solid #DADFE1; border-radius: 4px;margin-bottom:10px;">
                                <span class="orderbutton"><i class="fa fa-bars"></i></span>
                                <span class="pull-right trashbutton"><i class="fa fa-trash"></i></span>

                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-title") %>' name="btn_title"/>
                                </div>
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1"><i class="fa fa-paperclip"></i></span>
                                    <input type="text" class="form-control"  placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "add-link-to-btn") %>' aria-describedby="basic-addon1" name="btn_link"/>
                                </div>
                                <div class="input-group" style="margin-top:10px">
                                    <label for="buttonStyle" style="margin-top: 5px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-style") %></label>
                                    <div   class="color-circle buttonStyle" data-original-title="" title="">
                                        <i class="fa fa-font" style="line-height: 26px;"></i>
                                    </div>
                                    <div class="stylebox hide" style="width:400px">
                                        <!--
                                     <div class="input-group " style="margin-bottom: 5px">
                                         <span class="input-group-addon"><i class="fa fa-font"></i></span>
                                         <input type="text" class="form-control fontstyle" name="fontstyle" readonly style="cursor:pointer;background-color: #fff"/>
                                     </div>
                                        <label> Button Size</label>
                                        <div class="input-group " style="margin-bottom: 5px">
                                            <span class="input-group-addon button"  ><i class="fa fa-plus" style="  cursor : pointer;"></i></span>
                                            <input type="text" class="form-control text-center"  placeholder="Button Size"  name="ButtonSize"/>
                                            <span class="input-group-addon button"  ><i class="fa fa-minus" style="  cursor : pointer;"></i></span>
                                        </div>-->
                                    <label> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "font-size") %></label>
                                    <div class="input-group " style="margin-bottom: 5px">

                                        <span class="input-group-addon font"><i
                                            class="fa fa-plus" style="cursor: pointer;"></i></span> <input
                                            type="text" class="form-control text-center"
                                            placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "font-size") %>' name="FontSize" /> <span
                                            class="input-group-addon font"><i class="fa fa-minus"
                                            style="cursor: pointer;"></i></span>
                                    </div>
                                    <div class="input-group background" style="margin-bottom: 5px">
                                        <span class="input-group-addon " style="width: 50px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "bg-color") %></span> <span class="input-group-addon picker" data-color="bg"></span>
                                    </div>

                                    <div class="input-group fontcolor" style="margin-bottom: 5px">
                                        <span class="input-group-addon" style="width: 50px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "font-color") %></span> <span class="input-group-addon picker"
                                            data-color="font"></span>
                                        <script type="text/javascript">
                                                $('.picker').colpick({
                                                    layout: 'hex',
                                                    // colorScheme: 'dark',
                                                    onBeforeShow: function () {
                                                        $(this).colpickSetColor(rgb2hex($(this).css('backgroundColor')).replace("#",""));
                                                    },
                                                    onChange: function (hsb, hex, rgb, el, bySetColor) {                     if (!bySetColor)
                                                            $(el).css('background-color', '#' + hex);
                                                        var color = $(el).data('color');
                                                        var indexBnt = getIndex($(el).parent().parent().parent().parent().parent(), $('#buttonslist li')) - 1;
var length = $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a span')).length;
                                                        if (color === 'bg') {
                                                        //to make outlook responsive
                                                        if(length > 0){
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('border', '15px solid #' + hex);
                                                             $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('background-color', '#' + hex);
                                                        }else{
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('background-color', '#' + hex);
                                                        }
                                                            $(el).parent().parent().parent().parent().find('div.color-circle').css('background-color', '#' + hex);
                                                        }else {
                                                        if(length > 0){
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a span')).css('color', '#' + hex);
                                                        }else{
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('color', '#' + hex);
                                                        }
                                                            $(el).parent().parent().parent().parent().find('div.color-circle').css('color', '#' + hex);
                                                        }

                                                    },
                                                    onSubmit: function (hsb, hex, rgb, el) {
                                                        $(el).css('background-color', '#' + hex);
                                                        $(el).colpickHide();
                                                        var color = $(el).data('color');
                                                        var indexBnt = getIndex($(el).parent().parent().parent().parent().parent(), $('#buttonslist li')) - 1;
                                                        if (color === 'bg') {
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('background-color', '#' + hex);
                                                        } else {
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('color', '#' + hex);
                                                        }


                                                    }

                                                }).keyup(function () {
                                                    $(this).colpickSetColor(this.value);
                                                });
                                            </script>

                                    </div>
                                    <div class="text text-right">
                                        <a href="#" class="btn btn-xs btn-default confirm"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "Ok") %></a>
                                    </div>
                                </div>
                                <div class="fontselector" class="hide" style="min-width: 200px">
                                    <ul class="list-group"
                                        style="overflow: auto; display: block; max-height: 200px">
                                        <li class="list-group-item" style="font-family: arial">Arial</li>
                                        <li class="list-group-item" style="font-family: verdana">Verdana</li>
                                        <li class="list-group-item" style="font-family: helvetica">Helvetica</li>
                                        <li class="list-group-item" style="font-family: times">Times</li>
                                        <li class="list-group-item" style="font-family: georgia">Georgia</li>
                                        <li class="list-group-item" style="font-family: tahoma">Tahoma</li>
                                        <li class="list-group-item" style="font-family: pt sans">PT
                                            Sans</li>
                                        <li class="list-group-item"
                                            style="font-family: Source Sans Pro">Source Sans Pro</li>
                                        <li class="list-group-item" style="font-family: PT Serif">PT
                                            Serif</li>
                                        <li class="list-group-item" style="font-family: Open Sans">Open
                                            Sans</li>
                                        <li class="list-group-item" style="font-family: Josefin Slab">Josefin
                                            Slab</li>
                                        <li class="list-group-item" style="font-family: Lato">Lato</li>
                                        <li class="list-group-item" style="font-family: Arvo">Arvo</li>
                                        <li class="list-group-item" style="font-family: Vollkorn">Vollkorn</li>
                                        <li class="list-group-item" style="font-family: Abril Fatface">Abril
                                            Fatface</li>
                                        <li class="list-group-item"
                                            style="font-family: Playfair Display">Playfair Display</li>
                                        <li class="list-group-item" style="font-family: Yeseva One">Yeseva
                                            One</li>
                                        <li class="list-group-item" style="font-family: Poiret One">Poiret
                                            One</li>
                                        <li class="list-group-item" style="font-family: Comfortaa">Comfortaa</li>
                                        <li class="list-group-item" style="font-family: Marck Script">Marck
                                            Script</li>
                                        <li class="list-group-item" style="font-family: Pacifico">Pacifico</li>
                                    </ul>
                                </div>

                            </div>


                        </li>
                    </ul>

                    <hr />
                    <div class="form-group">
                        <a class="btn btn-default form-control" href="#" id="add-button"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "add-one-more-btn") %></a>
                    </div>

                </div>  <!-- end of buttons -->



                <!-- start of buttons text -->
                <div id="buttonstxt" style="max-width: 400px">
                    <ul id="buttonstxtlist" class="list-group" style="margin-left:-5px;list-style: none;">
                        <li class="hide"
                            style="padding: 10px; border: 1px solid #DADFE1; border-radius: 4px; margin-bottom: 10px;">
                            <span class="pull-right trashbutton"><i
                                class="fa fa-trash"></i></span>

                            <div class="form-group">
                                <input type="text" class="form-control"
                                    placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-title") %>' name="btn_title" />
                            </div>
                            <div class="input-group">
                                <span class="input-group-addon" id="basic-addon1"><i
                                    class="fa fa-paperclip"></i></span> <input type="text"
                                    class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "add-link-to-btn") %>'
                                    aria-describedby="basic-addon1" name="btn_link" />
                            </div>
                            <div class="input-group" style="margin-top: 10px">
                                <label for="buttonStyleTxt" style="margin-top: 5px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-style") %></label>
                                <div class="color-circle buttonStyleTxt" data-original-title=""
                                    title="">
                                    <i class="fa fa-font" style="line-height:26px;"></i>
                                </div>
                                <div class="styleboxtxt hide" style="width: 400px">
                                    <!--
                                     <div class="input-group " style="margin-bottom: 5px">
                                         <span class="input-group-addon"><i class="fa fa-font"></i></span>
                                         <input type="text" class="form-control fontstyle" name="fontstyle" readonly style="cursor:pointer;background-color: #fff"/>
                                     </div>
                                        <label> Button Size</label>
                                        <div class="input-group " style="margin-bottom: 5px">
                                            <span class="input-group-addon button"  ><i class="fa fa-plus" style="  cursor : pointer;"></i></span>
                                            <input type="text" class="form-control text-center"  placeholder="Button Size"  name="ButtonSize"/>
                                            <span class="input-group-addon button"  ><i class="fa fa-minus" style="  cursor : pointer;"></i></span>
                                        </div>-->
                                    <label> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "font-size") %></label>
                                    <div class="input-group " style="margin-bottom: 5px">

                                        <span class="input-group-addon font"><i
                                            class="fa fa-plus" style="cursor: pointer;"></i></span> <input
                                            type="text" class="form-control text-center"
                                            placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "font-size") %>' name="FontSize" /> <span
                                            class="input-group-addon font"><i class="fa fa-minus"
                                            style="cursor: pointer;"></i></span>
                                    </div>
                                    <div class="input-group background" style="margin-bottom: 5px">
                                        <span class="input-group-addon " style="width: 50px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "bg-color") %></span> <span class="input-group-addon pickerTxt"
                                            data-color="bg"></span>
                                    </div>

                                    <div class="input-group fontcolor" style="margin-bottom: 5px">
                                        <span class="input-group-addon" style="width: 50px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "font-color") %></span> <span class="input-group-addon pickerTxt"
                                            data-color="font"></span>

                                        <script type="text/javascript">
                                                $('.pickerTxt').colpick({
                                                    layout: 'hex',
                                                    // colorScheme: 'dark',
                                                    onBeforeShow: function () {
                                                        $(this).colpickSetColor(rgb2hex($(this).css('backgroundColor')).replace("#",""));
                                                    },
                                                    onChange: function (hsb, hex, rgb, el, bySetColor) {
                                                        if (!bySetColor)
                                                            $(el).css('background-color', '#' + hex);
                                                        var color = $(el).data('color');
                                                        var indexBnt = getIndex($(el).parent().parent().parent().parent().parent(), $('#buttonstxtlist li')) - 1;
                            var length = $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ') span')).length;
                                                        if (color === 'bg') {
                                                        if(length > 0){
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('border', '15px solid #' + hex);
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('background-color', '#' + hex);
                                                        }else{
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('background-color', '#' + hex);
                                                         }   
                                                            $(el).parent().parent().parent().parent().find('div.color-circle').css('background-color', '#' + hex);
                                                        } else {
                                                        if(length >0 ){
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ') span')).css('color', '#' + hex);
                                                        }else{
                                                             $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('color', '#' + hex);
                                                        }
                                                            $(el).parent().parent().parent().parent().find('div.color-circle').css('color', '#' + hex);
                                                        }
                                                    },
                                                    onSubmit: function (hsb, hex, rgb, el) {
                                                        $(el).css('background-color', '#' + hex);
                                                        $(el).colpickHide();
                                                        var color = $(el).data('color');
                                                        var indexBnt = getIndex($(el).parent().parent().parent().parent().parent(), $('#buttonstxtlist li')) - 1;
                                                        if (color === 'bg') {
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('background-color', '#' + hex);
                                                        } else {
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('color', '#' + hex);
                                                        }


                                                    }

                                                }).keyup(function () {
                                                    $(this).colpickSetColor(this.value);
                                                });
                                            </script>


                                    </div>
                                    <div class="text text-right">
                                        <a href="#" class="btn btn-xs btn-default confirm"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "Ok") %></a>
                                    </div>
                                </div>
                                <div class="fontselector" class="hide" style="min-width: 200px">
                                    <ul class="list-group"
                                        style="overflow: auto; display: block; max-height: 200px">
                                        <li class="list-group-item" style="font-family: arial">Arial</li>
                                        <li class="list-group-item" style="font-family: verdana">Verdana</li>
                                        <li class="list-group-item" style="font-family: helvetica">Helvetica</li>
                                        <li class="list-group-item" style="font-family: times">Times</li>
                                        <li class="list-group-item" style="font-family: georgia">Georgia</li>
                                        <li class="list-group-item" style="font-family: tahoma">Tahoma</li>
                                        <li class="list-group-item" style="font-family: pt sans">PT
                                            Sans</li>
                                        <li class="list-group-item"
                                            style="font-family: Source Sans Pro">Source Sans Pro</li>
                                        <li class="list-group-item" style="font-family: PT Serif">PT
                                            Serif</li>
                                        <li class="list-group-item" style="font-family: Open Sans">Open
                                            Sans</li>
                                        <li class="list-group-item" style="font-family: Josefin Slab">Josefin
                                            Slab</li>
                                        <li class="list-group-item" style="font-family: Lato">Lato</li>
                                        <li class="list-group-item" style="font-family: Arvo">Arvo</li>
                                        <li class="list-group-item" style="font-family: Vollkorn">Vollkorn</li>
                                        <li class="list-group-item" style="font-family: Abril Fatface">Abril
                                            Fatface</li>
                                        <li class="list-group-item"
                                            style="font-family: Playfair Display">Playfair Display</li>
                                        <li class="list-group-item" style="font-family: Yeseva One">Yeseva
                                            One</li>
                                        <li class="list-group-item" style="font-family: Poiret One">Poiret
                                            One</li>
                                        <li class="list-group-item" style="font-family: Comfortaa">Comfortaa</li>
                                        <li class="list-group-item" style="font-family: Marck Script">Marck
                                            Script</li>
                                        <li class="list-group-item" style="font-family: Pacifico">Pacifico</li>
                                    </ul>
                                </div>

                            </div>


                        </li>
                    </ul>

                </div> <!-- end of button text -->

   
   <div class="form-group" style="padding-top:6px;">
        <div class="col-xs-4 pull-right" style="text-align:right;padding: 0;">

        <a class="btn btn-primary settings-panel-close" href="#" id="settings-panel-close"></i>Save & Close</a>
            
        </div>
        
    </div>




    </div> <!-- end of tiny-editor -->


    <!-- start of block-customize -->
    <div role="tabpanel" class="tab-pane" id="block-customize" style="margin-top: 10px;">


<div id="common-settings">

<div class="form-horizontal">

<!-- start of padding top -->
    <div class="form-group">
            <div class="col-sm-5 control-label">Padding Top</div>
        <div class="col-sm-7" id="padding-setting">
      
        <div class="input-group"> 
            <input type="number" class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "top") %>' id="ptop" name="ptop" >
            <div class="input-group-addon color-preview">px</div> 
        </div>
            
        </div>
    </div> <!-- end of padding top -->


    <!-- start of padding bottom -->
     <div class="form-group">
                        <div class="col-sm-5 control-label">Padding Bottom</div>
        <div class="col-sm-7" id="padding-setting">
      
        <div class="input-group"> 
            <input type="number" class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "top") %>' id="pbottom" name="pbottom" >
            <div class="input-group-addon color-preview">px</div> 
        </div>
            
        </div>
    </div> <!-- end of padding bottom -->


    <!-- start of block background color -->
    <div class="form-group">
                        <div class="col-sm-5 control-label">Background Color</div>
        <div class="col-sm-7" id="bgcolor">
      
            <div class="input-group"> 
                <div class="input-group-addon color-preview"></div> 
                <div class="form-control hex-col-val"> </div>
            </div>
            
        </div>

        <script type="text/javascript">
                    $('#bgcolor').colpick({
                    layout: 'hex',
                    // colorScheme: 'dark',
                    onBeforeShow: function () {
                    $(this).colpickSetColor(rgb2hex($(this).find('.color-preview').css('background-color').replace("#","")));
                    },
                    onChange: function (hsb, hex, rgb, el, bySetColor) {
                            if (!bySetColor){
                                $(el).parent().find(".color-preview").css('background-color', '#' + hex);
                                $(el).parent().find(".hex-col-val").text('#' + hex);
                                $('#' + $('#path').val()).css('background-color', '#' + hex);
                                $('#' + $('#path').val()).attr('data-color',true);
                            }
                    },
                    onSubmit: function (hsb, hex, rgb, el) {
                        $('#' + $('#path').val()).css('background-color', '#' + hex);
                        $('#' + $('#path').val()).attr('data-color',true);
                        $(el).colpickHide();
                    }
                    }).keyup(function () {
                    $(this).colpickSetColor(this.value);
                    });
        </script>
        
    </div> <!-- end of block background color -->


    <!-- start of background image -->
    <!-- <div class="form-group">
        <div class="col-sm-5 control-label">Background Image</div>
        <div class="col-sm-7">
            <div class="input-group">
            <input type="text" id="bg-image-url" class="form-control" data-id="none">
                <span class="input-group-btn">
                <a id="bg-image-browseBtn" class="btn btn-default browseBtn" onclick="$('#uploadBgImageToS3ThroughBtn').click()">Browse</a>
                <input type="file" id="uploadBgImageToS3ThroughBtn" class="hidden">
                </span>
            </div>
        </div>
    </div> --> <!-- end of background image -->


    <!-- start of image caption settings -->
    <div id="image-caption-settings">
    <hr>
        <div class="form-group">
            <div class="col-sm-5 control-label">Caption Position</div>
                <div class="col-sm-7" >
                    <select class="form-control" id="image-caption-position">
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    </select>
                </div>
        </div>
    </div> <!-- end of image caption settings -->



    <div class="form-group" style="padding-top:6px;">
        <div class="col-xs-4 pull-right" style="margin-right: 8px;">

        <a class="btn btn-primary settings-panel-close" href="#" id="settings-panel-close"></i>Save & Close</a>
            
        </div>
        
    </div>


</div>
                
            
            </div> <!-- end of settings  -->

    </div> <!-- end of block-customize -->


</div> <!-- end of tab-content -->                  

                    <!-- <div id="user-poll">
                        <h4 class="text text-info">User Poll</h4>
                        <ul class="list-group" id="poll-list">
                            <li class="hide" >
                                <div class="input-group">
                                <input type="text" class="form-control" name="poll_value" placeholder="poll" style="width:45%">
                                <input type="text" class="form-control" name="poll_tag" placeholder="Related Tag" style="width:55%">
                                <span class="input-group-addon delbutton"><a>x</a></span>
                                </div>
                            </li>
                        </ul>
                        <div>
                                <div>
                                    <button class="btn pull-right" id="add-poll">Add More</button>
                                </div>
                                <br><br><br>
                                <div>
                                <input type="text" class="form-control" name="poll_url" placeholder="Redirect URL">
                                </div>
                        </div>
                        <br>
                    </div> -->        


</div>
    </div>

        <div id="download-layout"></div>
    </div>

    <!--/row-->


    <!-- Modal -->
    <div class="modal fade" id="previewModal" tabindex="-1" role="dialog"
        aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content" style="min-width: 120px;">
                <div class="modal-header hidden">
                    <input id="httphref" type="text" name="href" value="http://"
                        class="form-control" />
                </div>
                <div class="modal-body" align="center">
                    <div class="btn-group  previewActions">
                        <a class="btn btn-default btn-sm active" href="#"
                            data-val="iphone"><i class="fa fa-mobile fa-2x"></i></a> <a
                            class="btn btn-default btn-sm " href="#" data-val="smalltablet"><i class="fa fa-tablet fa-2x" aria-hidden="true"></i></a>
                        <a class="btn btn-default btn-sm " href="#" data-val="ipad"><i class="fa fa-desktop  fa-2x" aria-hidden="true"></i></a>
                    </div>
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <iframe id="previewFrame" class="iphone"></iframe>
                </div>
                <div class="modal-footer">

                    <button type="button" class="btn btn-info" data-dismiss="modal"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "CLOSE") %></button>
                </div>
            </div>
        </div>
    </div>
    <textarea id="imageid" class="hide"></textarea>
    <textarea id="download" class="hide"></textarea>
    <textarea id="selector" class="hide"></textarea>
    <textarea id="path" class="hide"></textarea>
    <a class="hide" id="sendTestEmail" href="#">.</a>
</body>

</html>