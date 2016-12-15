<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%
String _AGILE_VERSION = SystemProperty.applicationVersion.get();
String templateId = request.getParameter("tmpid");
String action = request.getParameter("action");

//Locales JSON
String _LANGUAGE = LanguageUtil.getLanguageKeyFromCookie(request);
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "email-builder");

%>
<!DOCTYPE html>
<html lang="<%=_LANGUAGE%>">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <title>editor email</title>

        <!-- styles -->

        <link href="css/colpick.css" rel="stylesheet"  type="text/css"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link href="css/template.editor.css?v=<%=_AGILE_VERSION%>" rel="stylesheet"/>
        <link href="css/responsive-table.css?v=<%=_AGILE_VERSION%>" rel="stylesheet"/>

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
        <script type="text/javascript" src="js/colpick.js"></script>
        <script type="text/javascript" src="js/template.editor.js?v=<%=_AGILE_VERSION%>"></script>

<style>
.mce-btn button {
    padding: 2px 4px !important;
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

                <div id="tosave" style="width:98%;overflow-y:auto;overflow-x:hidden;padding-bottom:30px;">
                    <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #eeeeee; font-family: Arial;font-size: 12px;line-height: 21px;color: #000000;" >
                        <tr>
                            <td width="100%" id="primary" class="demo" align="center" valign="top" >
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
                                                                <div style="margin:0px 0px 10px 0px;line-height:22px" class="textFix"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "builder-edit-info") %></div>
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
                <div>

  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#add-content" aria-controls="add-content" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-plus"></i> Add Content</a></li>
    <li role="presentation">
    <a href="#customize" aria-controls="customize" role="tab" data-toggle="tab" id="custome-val"><i class="glyphicon glyphicon-cog"></i> Customize</a>
    </li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="add-content">
        <div class="sidebar-nav">
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

                            </li>
                        </ul>
                    </div>
                </div>
    </div>
    <div role="tabpanel" class="form-horizontal tab-pane" id="customize">


 <div class="form-group mr-right">
                    <div class="col-sm-2 control-label widget-label">Default Font</div>
    <div class="col-sm-4 dropdown" >
<select style="min-width: 135px;text-align: right;" class="form-control font-family-picker inline-block">

        <option style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif" >Arial</option>
        <option style="font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace">Courier</option>
        <option style="font-family: Georgia, Times, 'Times New Roman', serif">Georgia</option>
        <option style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica</option>
        <option style="font-family:  'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Geneva, Verdana, sans-serif">Lucida Sans</option>
        <option style="font-family: Tahoma, Verdana, Segoe, sans-serif">Tahoma</option>
        <option style="font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif">Times New Roman</option>
        <option style="font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif">Trebuchet MS</option>
        <option style="font-family: Verdana, Geneva, sans-serif">Verdana</option>
        <option style="font-family: 'Bitter', Georgia, Times, 'Times New Roman', serif">Bitter</option>
        <option style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif">Droid Serif</option>
        <option style="font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif">Lato</option>
        <option style="font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif">Open Sans</option>
        <option style="font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif">Roboto</option>
        <option style="font-family: 'Source Sans Pro', Tahoma, Verdana, Segoe, sans-serif"> Source Sans Pro</option>
        <option style="font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif">Montserrat</option>
        <option style="font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif">Ubuntu</option>

    </select>
  </div>
  </div>



<div class="form-group mr-right">
                    <div class="col-sm-2 control-label widget-label">Font Size</div>
    <div class="col-sm-4 dropdown" >
    <select style="min-width: 135px;text-align: right;" class="form-control font-size-picker inline-block">
        <option>8px</option>
        <option>9px</option>
        <option>10px</option>
        <option>11px</option>
        <option>12px</option>
        <option>14px</option>
        <option>16px</option>
        <option>18px</option>
        <option>20px</option>
        <option>22px</option>
        <option>24px</option>
        <option>26px</option>
        <option>28px</option>
        <option>36px</option>
        <option>48px</option>
        <option>72px</option>
    </select>
  </div>
  </div>


<div class="form-group mr-right">
                    <div class="col-sm-2 control-label widget-label">Line Height</div>
    <div class="col-sm-4 dropdown" >
<select style="min-width: 135px;text-align: right;" class="form-control line-height-picker inline-block">
        <option>16px</option>
        <option>21px</option>
        <option>25px</option>
        <option>28px</option>
    </select>
  </div>
  </div>



<div class="form-group mr-right">
                    <div class="col-sm-2 control-label widget-label">Font Color</div>
    <div class="col-sm-4 dropdown" >
    <div class="wrapper-color-selector" id="font-color">
        <div class="color-style">
            <div class="color-preview" style="background-color:#000000;"></div>
        </div>
        <div class="hex-color" >
            <div class="hex-col-val">#000000</div>
        </div>

    </div>    
  </div>
  <script type="text/javascript">
                $('#font-color').colpick({
                layout: 'hex',
                // colorScheme: 'dark',
                onBeforeShow: function () {
                $(this).colpickSetColor(rgb2hex($('#background-color').val().replace("#","")));
                },
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                        if (!bySetColor){
                            $(el).parent().find(".color-preview").css('background-color', '#' + hex);
                            $(el).parent().find(".hex-col-val").text('#' + hex);
                            $('#tosave').find('table:first').css('color', '#'+ hex);
                        }
                },
                onSubmit: function (hsb, hex, rgb, el) {
                    $('#tosave').find('table:first').css('color', '#'+ hex);
                    $(el).colpickHide();
                }
                }).keyup(function () {
                $(this).colpickSetColor(this.value);
                });
    </script>
</div>



<div class="form-group mr-right">
                    <div class="col-sm-2 control-label widget-label">Content Area </div>
    <div class="col-sm-4 dropdown" >
    <div class="wrapper-color-selector" id="content-bg-color">
        <div class="color-style">
            <div class="color-preview" style="background-color:#ffffff;"></div>
        </div>
        <div class="hex-color" >
            <div class="hex-col-val">#ffffff</div>
        </div>

    </div>    
  </div>
  <script type="text/javascript">
                $('#content-bg-color').colpick({
                layout: 'hex',
                // colorScheme: 'dark',
                onBeforeShow: function () {
                $(this).colpickSetColor(rgb2hex($('#background-color').val().replace("#","")));
                },
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                        if (!bySetColor){
                            $(el).parent().find(".color-preview").css('background-color', '#' + hex);
                            $(el).parent().find(".hex-col-val").text('#' + hex);
                            $('#tosave').find('.main').css('background-color', '#' + hex);
                        }
                },
                onSubmit: function (hsb, hex, rgb, el) {
                    $('#tosave').find('.main').css('background-color', '#' + hex);
                    $(el).colpickHide();
                }
                }).keyup(function () {
                $(this).colpickSetColor(this.value);
                });
    </script>
</div>



<div class="form-group mr-right">
                    <div class="col-sm-2 control-label widget-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "edit-background") %></div>
    <div class="col-sm-4 dropdown" >
    <div class="wrapper-color-selector" id="background-color">
        <div class="color-style">
            <div class="color-preview" style="background-color:#eeeeee;"></div>
        </div>
        <div class="hex-color" >
            <div class="hex-col-val">#eeeeee</div>
        </div>

    </div>    
  </div>
  <script type="text/javascript">
                $('#background-color').colpick({
                layout: 'hex',
                // colorScheme: 'dark',
                onBeforeShow: function () {
                $(this).colpickSetColor(rgb2hex($('#background-color').val().replace("#","")));
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



 </div>
  </div>

</div>
    </div>


            <div class="col-md-3" style="width:370px;">
                <!-- START ELEMENT -->
                <div class="hide" id="settings" style="height:660px;overflow-y:auto;overflow-x:hidden;">

                    <form id="editor" style="margin-top:5px">
                        <h4 class="text text-info"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "text") %></h4>
                        <div class="form-inline" id="font-settings" style="margin-top:5px">
                            <div class="form-group">
                                <label for="fontstyle"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "font-style") %></label>
                                <div id="fontstyle" class="color-circle"><i class="fa fa-font"></i></div>

                            </div>
                        </div>

                    <div class="hide" id='font-style'>
                        <div id="mainfontproperties" >
                            <div class="input-group" style="margin-bottom: 5px">
                                <span class="input-group-addon" style="min-width: 60px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "color") %></span>
                                <input type="text" class="form-control picker" id="colortext" >
                                <span class="input-group-addon"></span>
                                <script type="text/javascript">
                                    $('#colortext').colpick({
                                        layout: 'hex',
                                        // colorScheme: 'dark',
                                        onBeforeShow: function () {
                                            $(this).colpickSetColor(rgb2hex($('#colortext').val().replace("#","")));
                                        },
                                        onChange: function (hsb, hex, rgb, el, bySetColor) {
                                            if (!bySetColor)
                                                $(el).val('#' + hex);
                                        },
                                        onSubmit: function (hsb, hex, rgb, el) {
                                            $(el).next('.input-group-addon').css('background-color', '#' + hex);
                                            $(el).colpickHide();
                                        }
                                    }).keyup(function () {
                                        $(this).colpickSetColor(this.value);
                                    });
                                </script>
                            </div>
                            <div class="input-group" style="margin-bottom: 5px">
                                <span class="input-group-addon" style="min-width: 60px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "font") %></span>
                                <input type="text" class="form-control " id="fonttext" readonly>
                            </div>
                            <div class="input-group" style="margin-bottom: 5px">
                                <span class="input-group-addon" style="min-width: 60px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "size") %></span>
                                <input type="text" class="form-control " id="sizetext" style="width: 100px">
                                &nbsp;
                                <a class="btn btn-default plus" href="#">+</a>
                                <a class="btn btn-default minus" href="#">-</a>
                            </div>

                            <hr/>
                            <div class="text text-right">
                                <a class="btn btn-primary" id="confirm-font-properties"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "Ok") %></a>
                            </div>
                        </div>

                        <div id="fontselector" class="hide" style="min-width: 200px">
                            <ul class="list-group" style="overflow: auto ;display: block;max-height: 200px" >
                                <li class="list-group-item" style="font-family:arial,helvetica,sans-serif;">Arial</li>
                                <li class="list-group-item" style="font-family: Verdana, Geneva, sans-serif">Verdana</li>
                                <li class="list-group-item" style="Times New Roman, Times, serif">Times New Roman</li>
                                <li class="list-group-item" style="font-family: georgia,serif">Georgia</li>
                                <li class="list-group-item" style="font-family:comic sans ms,marker felt-thin,arial,sans-serif;">Comic Sans MS</li>
                                <li class="list-group-item" style="font-family:courier new,courier,monospace;">Courier New</li>
                                <li class="list-group-item" style="font-family:lucida sans unicode,lucida grande,sans-serif;">Lucida</li>
                                <li class="list-group-item" style="font-family: Trebuchet MS,sans-serif">Trebuchet MS</li>
                                <li class="list-group-item" style="font-family: Tahoma, Geneva, sans-serif;">Tahoma</li>
                                <li class="list-group-item" style="font-family: Impact,Charcoal, sans-serif">Impact</li>
                                <li class="list-group-item" style="font-family: Arial Black,Gadget, sans-serif">Arial Black</li>
                                <li class="list-group-item" style="font-family: Helvetica, sans-serif">Helvetica</li>
                            </ul>
                        </div>
                    </div>
                        <div class="panel panel-body panel-default html5editor" id="html5editor"></div>
                    </form>

                    <div id="imageproperties" style="margin-top:5px">
                        <h4 class="text text-info" id="imageHeaderId"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "image") %></h4>

                        <div class="form-group" id="video-record-btn-holder" style="display:none;">

                            <div class="row">
                                <div class="col-xs-8">
                                    <h5><span>Record a video</span><h5>
                                </div>
                                <div class="col-xs-4">
                                    <button type="button" class="btn btn-default" id="videoRecordBtnNew" style="width:73px;">
                                        <span class="fa fa-video-camera"></span>
                                    </button>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-2 text-right">
                                    <span>(OR)</span>
                                </div>
                            </div>
                            <br/>

                            <div class="row">
                                <div class="col-xs-8">
                                    <input type="text" id="video-link" class="form-control" placeholder="Link to Video URL" aria-describedby="basic-addon11" data-id="none">
                                </div>
                                
                                <div class="col-xs-4">
                                    <button type="button" class="btn btn-default" id="videoRecordBtn">
                                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "select") %></span>
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div class="form-group">

                            <div class="row" id="videoThumbnail" style="display:none;">
                                <label for="video-record-Thumbnail" class="col-xs-8 control-label">Thumbnail</label>
                            </div>
                            <div class="row">
                                <div class="col-xs-8">
                                    <input type="text" id="image-url" class="form-control" data-id="none"/>
                                </div>
                                <div class="col-xs-4">
                                    <a class="btn btn-default" id="browseBtn" onclick="$('#uploadImageToS3Btn').click()"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "browse") %></a>
                                    <input type="file" id="uploadImageToS3Btn" class="hidden">
                                </div>
                            </div>

                        </div>

                        <div class="form-group">
                            
                            <div class="row" id="image-link-holder">
                                <div class="col-xs-11">
                                    <div class="input-group">
                                        <span class="input-group-addon" id="basic-addon11"><i class="fa fa-paperclip"></i></span>
                                        <input type="text" id="image-link" class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "link-to-web-link") %>' aria-describedby="basic-addon11" data-id="none">
                                    </div>
                                    <br>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-xs-11">
                                    <input type="text" id="image-alt-text" class="form-control" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "alternate-text") %>' data-id="none">
                                    <br>
                                </div>
                            </div>

                            <div class="row">
                                <div id="image-width-height" >
                                <div class="col-xs-1">
                                    W:
                                </div>
                                <div class="col-xs-3">
                                    <input type="text" id="image-w" class="form-control" name="director" />
                                </div>

                                <div class="col-xs-1">
                                    H:
                                </div>

                                <div class="col-xs-3">
                                    <input type="text" id="image-h"class="form-control" name="writer" />
                                </div>
                                </div>
                                <div class="col-xs-4" style="float: right">

                                    <a class="btn btn-primary" href="#" id="change-image"></i>&nbsp;<%=LanguageUtil.getLocaleJSONValue(localeJSON, "Apply") %></a>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div id="social-links">
                        <h4 class="text text-info"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "social") %></h4>
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
                    </div>

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


                    <div id="buttons" style="max-width: 400px">
                        <h4 class="text text-info"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "buttons") %></h4>
                        <div class="form-group">
                            <select class="form-control">
                                <option value="center"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-align-center") %></option>
                                <option value="left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-align-left") %></option>
                                <option value="right"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-align-right") %></option>
                            </select>
                        </div>
                        <ul id="buttonslist" class="list-group">
                            <li class="hide" style="padding:10px; border:1px solid #DADFE1; border-radius: 4px">
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
                                    <label for="buttonStyle"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-style") %></label>
                                    <div   class="color-circle buttonStyle" data-original-title="" title="">
                                        <i class="fa fa-font"></i>
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

                </div>

                <div id="buttonstxt" style="max-width: 400px">
                    <h4 class="text text-info"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "buttons") %></h4>
                    <ul id="buttonstxtlist" class="list-group">
                        <li class="hide"
                            style="padding: 10px; border: 1px solid #DADFE1; border-radius: 4px">
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
                                <label for="buttonStyleTxt"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "btn-style") %></label>
                                <div class="color-circle buttonStyleTxt" data-original-title=""
                                    title="">
                                    <i class="fa fa-font"></i>
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
                                        <span class="input-group-addon" style="width: 50px;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "bg-color") %></span> <span class="input-group-addon pickerTxt"
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

                </div>

                <div id="common-settings">

                    <h4 class="text text-info"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "style") %></h4>
                    <form id="background" class="form-inline">
                        <div class="form-group">
                            <label for="bgcolor"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "background") %></label>
                            <div class="color-circle" id="bgcolor"></div>
                            <script type="text/javascript">
                                    $('#bgcolor').colpick({
                                        layout: 'hex',
                                        onBeforeShow: function () {
                                            $(this).colpickSetColor(rgb2hex($('#bgcolor').css('backgroundColor')).replace("#",""));
                                        },
                                        onChange: function (hsb, hex, rgb, el, bySetColor) {
                                            if (!bySetColor)
                                                $(el).css('background-color', '#' + hex);
                                        },
                                        onSubmit: function (hsb, hex, rgb, el) {
                                            $(el).css('background-color', '#' + hex);

                                            $('#' + $('#path').val()).css('background-color', '#' + hex);
                                            $(el).colpickHide();
                                        }

                                    }).keyup(function () {
                                        $(this).colpickSetColor(this.value);
                                    });
                                </script>
                        </div>
                    </form>

                    <form id="padding-setting" class="form-inline">
                        <h4 class="text text-info"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "padding") %></h4>
                        <left>
                            <table class="table-condensed">
                                <tbody>
                                    <tr class="row">
                                        <td></td>
                                        <td>
                                        Top: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="number" class="form-control"
                                            placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "top") %>' value="15px" id="ptop" name="ptop"
                                            style="width: 90px; margin-right: 5px">px</td>
                                        <td></td>
                                    </tr>
                                    <tr class="row">
                                        <td></td>
                                        <td>
                                        Bottom: &nbsp;&nbsp;<input type="number" class="form-control"
                                            placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "bottom") %>' value="15px" id="pbottom" name="pbottom"
                                            style="width: 90px; margin-right: 5px">px</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </left>
                    </form>
                </div>

                <div class="text text-right" style="margin-top: 5px">
                    <a href="#" id="saveElement" class="btn btn-primary"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "done") %></a>
                </div>
            </div>
            <!-- END SETTINGS -->
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