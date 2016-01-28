<%
Long id = (long)0;
String content = "";
long unixTime = System.currentTimeMillis() / 1000L;
%>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <title>editor email</title>

        <!-- styles -->

        <link href="css/colpick.css" rel="stylesheet"  type="text/css"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link href="css/themes/default.css" rel="stylesheet" type="text/css"/>
        <link href="css/template.editor.css?t=<%=unixTime%>" rel="stylesheet"/>
        <link href="css/responsive-table.css" rel="stylesheet"/>


<%
String templateId = request.getParameter("tmpid");
String action = request.getParameter("action");
%>

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

</script>

        <!--[if lt IE 9]>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
        <![endif]-->
        <script type="text/javascript"> var path = '/';</script>
       <!-- <script type="text/javascript" src="http://feather.aviary.com/js/feather.js"></script> -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/ui/1.9.2/jquery-ui.min.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>

        <script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.2.6/plugins/colorpicker/plugin.min.js"></script>
        <script type="text/javascript" src="js/colpick.js"></script>
        <script type="text/javascript" src="js/template.editor.js?t=<%=unixTime%>"></script>

<style>
.mce-btn button {
    padding: 2px 4px !important;
}
</style>
    </head>
    <body class="edit" style="overflow-x: hidden;" onload="parent.onEmailBuilderLoad()" id="builderFullBodyHolder">
        <div class="navbar navbar-inverse navbar-fixed-top navbar-layoutit hidden">
            <div class="navbar-header">
                <button data-target="navbar-collapse" data-toggle="collapse" class="navbar-toggle" type="button">
                    <span class="glyphicon-bar"></span>
                    <span class="glyphicon-bar"></span>
                    <span class="glyphicon-bar"></span>
                </button>
                <a onclick="return confirm('Are you sure you want to navigate to list of templates ?');" class="btn btn-warning" href="#">back to templates</a>
            </div>

            <div class="collapse navbar-collapse">
                <ul class="nav" id="menu-layoutit">
                    <li>
                        <span id="messagefromphp"></span>
                        <span id="messagefromphp2"></span>
                        <div class="btn-group" data-toggle="buttons-radio">
                            <button type="button" class="btn btn btn-default" id="sourcepreview"><i class="glyphicon-eye-open glyphicon"></i> Preview</button>
                        </div>
                        <div class="btn-group">
                            <a class="btn btn btn-warning" href="#save" id="save" ><i class="glyphicon glyphicon-floppy-disk"></i> Save</a>
                        </div>
                    </li>
                </ul>
            </div><!--/.navbar-collapse -->
            <textarea id="templateHtmlContent" class="hidden"><%@ include file="template.html" %></textarea>
        </div><!--/.navbar-fixed-top -->

        <div class="row">
            <div class="sidebar-nav">
                <!-- Nav tabs -->

                <div id="elements">
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
                            <!-- button -->
                            <%@ include file="blocks/button.html" %>
                            <!--Image + Text -->
                            <%@ include file="blocks/image-text.html" %>
                            <!-- TEXT AND IMAGE IN COLUMN TEXT ON RIGHT SIDE -->
                            <%@ include file="blocks/image-text-right.html" %>
                            <!-- TEXT AND IMAGE IN COLUMN TEXT ON LEFT SIDE -->
                            <%@ include file="blocks/image-text-left.html" %>
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
                <!-- END DROP ELEMENTS -->
                <!-- START ELEMENT -->
                <div class="hide" id="settings">

                    <form class="form-inline" id="common-settings">
                        <h4 class="text text-info">Padding</h4>
                            <center>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td><input type="text" class="form-control" placeholder="top" value="15px" id="ptop" name="ptop" style="width: 60px; margin-right: 5px"></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td><input type="text" class="form-control" placeholder="left" value="15px" id="pleft" name="mtop" style="width: 60px; margin-right: 5px"></td>
                                            <td></td>
                                            <td><input type="text" class="form-control" placeholder="right" value="15px" id="pright" name="mbottom" style="width: 60px; margin-right: 5px"></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td><input type="text" class="form-control" placeholder="bottom" value="15px" id="pbottom" name="pbottom" style="width: 60px; margin-right: 5px"></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </center>

                    </form>

                    <h4  class="text text-info">Style</h4>
                    <form id="background"  class="form-inline">
                        <div class="form-group">
                            <label for="bgcolor">Background</label>
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

                    <div id="imageproperties" style="margin-top:5px">
                         <h4 class="text text-info">Image</h4>
                        <div class="form-group">
                            
                            <div class="row">
                                <div class="col-xs-11">
<div class="input-group">
<span class="input-group-addon" id="basic-addon11"><i class="fa fa-paperclip"></i></span>
<input type="text" id="image-link" class="form-control" placeholder="Add link to image" aria-describedby="basic-addon11" data-id="none">
</div><br>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-8">
                                    <input type="text" id="image-url" class="form-control" data-id="none"/>
                                </div>
                                <div class="col-xs-4">
                                    <a class="btn btn-default" id="browseBtn" onclick="$('#uploadImageToS3Btn').click()">Browse</a>
                                    <input type="file" id="uploadImageToS3Btn" class="hidden">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
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

                                <div class="col-xs-4">

                                    <a class="btn btn-warning" href="#" id="change-image"><i class="fa fa-edit"></i>&nbsp;Apply</a>
                                </div>

                            </div>
                        </div>


                    </div>
                    <form id="editor" style="margin-top:5px">
                        <h4 class="text text-info">Text</h4>
                    <div class="form-inline" id="font-settings" style="margin-top:5px">
                        <div class="form-group">
                            <label for="fontstyle">Font style</label>
                            <div id="fontstyle" class="color-circle"><i class="fa fa-font"></i></div>

                        </div>
                    </div>

                    <div class="hide" id='font-style'>
                        <div id="mainfontproperties" >
                            <div class="input-group" style="margin-bottom: 5px">
                                <span class="input-group-addon" style="min-width: 60px;">Color</span>
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
                                <span class="input-group-addon" style="min-width: 60px;">Font</span>
                                <input type="text" class="form-control " id="fonttext" readonly>
                            </div>
                            <div class="input-group" style="margin-bottom: 5px">
                                <span class="input-group-addon" style="min-width: 60px;">Size</span>
                                <input type="text" class="form-control " id="sizetext" style="width: 100px">
                                &nbsp;
                                <a class="btn btn-default plus" href="#">+</a>
                                <a class="btn btn-default minus" href="#">-</a>
                            </div>

                            <hr/>
                            <div class="text text-right">
                                <a class="btn btn-info" id="confirm-font-properties">OK</a>
                            </div>
                        </div>

                        <div id="fontselector" class="hide" style="min-width: 200px">
                            <ul class="list-group" style="overflow: auto ;display: block;max-height: 200px" >
                                <li class="list-group-item" style="font-family: arial">Arial</li>
                                <li class="list-group-item" style="font-family: verdana">Verdana</li>
                                <li class="list-group-item" style="font-family: helvetica">Helvetica</li>
                                <li class="list-group-item" style="font-family: times">Times</li>
                                <li class="list-group-item" style="font-family: georgia">Georgia</li>
                                <li class="list-group-item" style="font-family: tahoma">Tahoma</li>
                                <li class="list-group-item" style="font-family: pt sans">PT Sans</li>
                                <li class="list-group-item" style="font-family: Source Sans Pro">Source Sans Pro</li>
                                <li class="list-group-item" style="font-family: PT Serif">PT Serif</li>
                                <li class="list-group-item" style="font-family: Open Sans">Open Sans</li>
                                <li class="list-group-item" style="font-family: Josefin Slab">Josefin Slab</li>
                                <li class="list-group-item" style="font-family: Lato">Lato</li>
                                <li class="list-group-item" style="font-family: Arvo">Arvo</li>
                                <li class="list-group-item" style="font-family: Vollkorn">Vollkorn</li>
                                <li class="list-group-item" style="font-family: Abril Fatface">Abril Fatface</li>
                                <li class="list-group-item" style="font-family: Playfair Display">Playfair Display</li>
                                <li class="list-group-item" style="font-family: Yeseva One">Yeseva One</li>
                                <li class="list-group-item" style="font-family: Poiret One">Poiret One</li>
                                <li class="list-group-item" style="font-family: Comfortaa">Comfortaa</li>
                                <li class="list-group-item" style="font-family: Marck Script">Marck Script</li>
                                <li class="list-group-item" style="font-family: Pacifico">Pacifico</li>
                            </ul>
                        </div>
                    </div>
                        <div class="panel panel-body panel-default html5editor" id="html5editor"></div>
                    </form>

                    <div id="social-links">
                        <h4 class="text text-info">Social</h4>
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
                        </ul>
                    </div>

                    <div id="buttons" style="max-width: 400px">
                        <h4 class="text text-info">Buttons</h4>
                        <div class="form-group">
                            <select class="form-control">
                                <option value="center">Align buttons to Center</option>
                                <option value="left">Align buttons to Left</option>
                                <option value="right">Align buttons to Right</option>
                            </select>
                        </div>
                        <ul id="buttonslist" class="list-group">
                            <li class="hide" style="padding:10px; border:1px solid #DADFE1; border-radius: 4px">
                                <span class="orderbutton"><i class="fa fa-bars"></i></span>
                                <span class="pull-right trashbutton"><i class="fa fa-trash"></i></span>

                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Enter Button Title" name="btn_title"/>
                                </div>
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1"><i class="fa fa-paperclip"></i></span>
                                    <input type="text" class="form-control"  placeholder="Add link to button" aria-describedby="basic-addon1" name="btn_link"/>
                                </div>
                                <div class="input-group" style="margin-top:10px">
                                    <label for="buttonStyle">Button Style</label>
                                    <div   class="color-circle buttonStyle" data-original-title="" title="">
                                        <i class="fa fa-font"></i>
                                    </div>
                                    <div class="stylebox hide" style="width:400px">
                                        <!--
                                     <div class="input-group " style="margin-bottom: 5px">
                                         <span class="input-group-addon"><i class="fa fa-font"></i></span>
                                         <input type="text" class="form-control fontstyle" name="fontstyle" readonly style="cursor:pointer;background-color: #fff"/>
                                     </div>-->
                                        <label> Button Size</label>
                                        <div class="input-group " style="margin-bottom: 5px">
                                            <span class="input-group-addon button"  ><i class="fa fa-plus" style="  cursor : pointer;"></i></span>
                                            <input type="text" class="form-control text-center"  placeholder="Button Size"  name="ButtonSize"/>
                                            <span class="input-group-addon button"  ><i class="fa fa-minus" style="  cursor : pointer;"></i></span>
                                        </div>
                                        <label> Font Size</label>
                                        <div class="input-group " style="margin-bottom: 5px">

                                            <span class="input-group-addon font"  ><i class="fa fa-plus" style="  cursor : pointer;"></i></span>
                                            <input type="text" class="form-control text-center"  placeholder="Font Size"  name="FontSize"/>
                                            <span class="input-group-addon font"  ><i class="fa fa-minus" style="  cursor : pointer;"></i></span>
                                        </div>
                                        <div class="input-group background" style="margin-bottom: 5px">
                                            <span class="input-group-addon " style="width: 50px;">Background Color</span>
                                            <span class="input-group-addon picker" data-color="bg"></span>
                                        </div>

                                        <div class="input-group fontcolor" style="margin-bottom: 5px" >
                                            <span class="input-group-addon" style="width: 50px;">Font Color</span>
                                            <span class="input-group-addon picker" data-color="font"></span>
                                            <script type="text/javascript">
                                                $('.picker').colpick({
                                                    layout: 'hex',
                                                    // colorScheme: 'dark',
                                                    onBeforeShow: function () {
                                                        $(this).colpickSetColor(rgb2hex($(this).css('backgroundColor')).replace("#",""));
                                                    },
                                                    onChange: function (hsb, hex, rgb, el, bySetColor) {
                                                        if (!bySetColor)
                                                            $(el).css('background-color', '#' + hex);
                                                        var color = $(el).data('color');
                                                        var indexBnt = getIndex($(el).parent().parent().parent().parent().parent(), $('#buttonslist li')) - 1;
                                                        if (color === 'bg') {
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('background-color', '#' + hex);
                                                            $(el).parent().parent().parent().parent().find('div.color-circle').css('background-color', '#' + hex);
                                                        } else {
                                                            $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBnt + ') a')).css('color', '#' + hex);
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
                                            <a href="#" class="btn btn-xs btn-default confirm">Ok</a>
                                        </div>
                                    </div>
                                    <div class="fontselector" class="hide" style="min-width: 200px">
                                        <ul class="list-group" style="overflow: auto ;display: block;max-height: 200px" >
                                            <li class="list-group-item" style="font-family: arial">Arial</li>
                                            <li class="list-group-item" style="font-family: verdana">Verdana</li>
                                            <li class="list-group-item" style="font-family: helvetica">Helvetica</li>
                                            <li class="list-group-item" style="font-family: times">Times</li>
                                            <li class="list-group-item" style="font-family: georgia">Georgia</li>
                                            <li class="list-group-item" style="font-family: tahoma">Tahoma</li>
                                            <li class="list-group-item" style="font-family: pt sans">PT Sans</li>
                                            <li class="list-group-item" style="font-family: Source Sans Pro">Source Sans Pro</li>
                                            <li class="list-group-item" style="font-family: PT Serif">PT Serif</li>
                                            <li class="list-group-item" style="font-family: Open Sans">Open Sans</li>
                                            <li class="list-group-item" style="font-family: Josefin Slab">Josefin Slab</li>
                                            <li class="list-group-item" style="font-family: Lato">Lato</li>
                                            <li class="list-group-item" style="font-family: Arvo">Arvo</li>
                                            <li class="list-group-item" style="font-family: Vollkorn">Vollkorn</li>
                                            <li class="list-group-item" style="font-family: Abril Fatface">Abril Fatface</li>
                                            <li class="list-group-item" style="font-family: Playfair Display">Playfair Display</li>
                                            <li class="list-group-item" style="font-family: Yeseva One">Yeseva One</li>
                                            <li class="list-group-item" style="font-family: Poiret One">Poiret One</li>
                                            <li class="list-group-item" style="font-family: Comfortaa">Comfortaa</li>
                                            <li class="list-group-item" style="font-family: Marck Script">Marck Script</li>
                                            <li class="list-group-item" style="font-family: Pacifico">Pacifico</li>
                                        </ul>
                                    </div>

                                </div>


                            </li>
                        </ul>

                        <hr/>
                        <div class="form-group">
                            <a  class="btn btn-default form-control" href="#" id="add-button">Add one more button</a>
                        </div>

                    </div>

                    <div id="buttonstxt" style="max-width: 400px">
                        <h4 class="text text-info">Buttons</h4>
                        <ul id="buttonstxtlist" class="list-group">
                            <li class="hide" style="padding:10px; border:1px solid #DADFE1; border-radius: 4px">
                                <span class="pull-right trashbutton"><i class="fa fa-trash"></i></span>

                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Enter Button Title" name="btn_title"/>
                                </div>
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1"><i class="fa fa-paperclip"></i></span>
                                    <input type="text" class="form-control"  placeholder="Add link to button" aria-describedby="basic-addon1" name="btn_link"/>
                                </div>
                                <div class="input-group" style="margin-top:10px">
                                    <label for="buttonStyleTxt">Button Style</label>
                                    <div   class="color-circle buttonStyleTxt" data-original-title="" title="">
                                        <i class="fa fa-font"></i>
                                    </div>
                                    <div class="styleboxtxt hide" style="width:400px">
                                        <!--
                                     <div class="input-group " style="margin-bottom: 5px">
                                         <span class="input-group-addon"><i class="fa fa-font"></i></span>
                                         <input type="text" class="form-control fontstyle" name="fontstyle" readonly style="cursor:pointer;background-color: #fff"/>
                                     </div>-->
                                        <label> Button Size</label>
                                        <div class="input-group " style="margin-bottom: 5px">
                                            <span class="input-group-addon button"  ><i class="fa fa-plus" style="  cursor : pointer;"></i></span>
                                            <input type="text" class="form-control text-center"  placeholder="Button Size"  name="ButtonSize"/>
                                            <span class="input-group-addon button"  ><i class="fa fa-minus" style="  cursor : pointer;"></i></span>
                                        </div>
                                        <label> Font Size</label>
                                        <div class="input-group " style="margin-bottom: 5px">

                                            <span class="input-group-addon font"  ><i class="fa fa-plus" style="  cursor : pointer;"></i></span>
                                            <input type="text" class="form-control text-center"  placeholder="Font Size"  name="FontSize"/>
                                            <span class="input-group-addon font"  ><i class="fa fa-minus" style="  cursor : pointer;"></i></span>
                                        </div>
                                        <div class="input-group background" style="margin-bottom: 5px">
                                            <span class="input-group-addon " style="width: 50px;">Background Color</span>
                                            <span class="input-group-addon pickerTxt" data-color="bg"></span>
                                        </div>

                                        <div class="input-group fontcolor" style="margin-bottom: 5px" >
                                            <span class="input-group-addon" style="width: 50px;">Font Color</span>
                                            <span class="input-group-addon pickerTxt" data-color="font"></span>
                                            
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
                                                        if (color === 'bg') {
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('background-color', '#' + hex);
                                                            $(el).parent().parent().parent().parent().find('div.color-circle').css('background-color', '#' + hex);
                                                        } else {
                                                            $($('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + indexBnt + ')')).css('color', '#' + hex);
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
                                            <a href="#" class="btn btn-xs btn-default confirm">Ok</a>
                                        </div>
                                    </div>
                                    <div class="fontselector" class="hide" style="min-width: 200px">
                                        <ul class="list-group" style="overflow: auto ;display: block;max-height: 200px" >
                                            <li class="list-group-item" style="font-family: arial">Arial</li>
                                            <li class="list-group-item" style="font-family: verdana">Verdana</li>
                                            <li class="list-group-item" style="font-family: helvetica">Helvetica</li>
                                            <li class="list-group-item" style="font-family: times">Times</li>
                                            <li class="list-group-item" style="font-family: georgia">Georgia</li>
                                            <li class="list-group-item" style="font-family: tahoma">Tahoma</li>
                                            <li class="list-group-item" style="font-family: pt sans">PT Sans</li>
                                            <li class="list-group-item" style="font-family: Source Sans Pro">Source Sans Pro</li>
                                            <li class="list-group-item" style="font-family: PT Serif">PT Serif</li>
                                            <li class="list-group-item" style="font-family: Open Sans">Open Sans</li>
                                            <li class="list-group-item" style="font-family: Josefin Slab">Josefin Slab</li>
                                            <li class="list-group-item" style="font-family: Lato">Lato</li>
                                            <li class="list-group-item" style="font-family: Arvo">Arvo</li>
                                            <li class="list-group-item" style="font-family: Vollkorn">Vollkorn</li>
                                            <li class="list-group-item" style="font-family: Abril Fatface">Abril Fatface</li>
                                            <li class="list-group-item" style="font-family: Playfair Display">Playfair Display</li>
                                            <li class="list-group-item" style="font-family: Yeseva One">Yeseva One</li>
                                            <li class="list-group-item" style="font-family: Poiret One">Poiret One</li>
                                            <li class="list-group-item" style="font-family: Comfortaa">Comfortaa</li>
                                            <li class="list-group-item" style="font-family: Marck Script">Marck Script</li>
                                            <li class="list-group-item" style="font-family: Pacifico">Pacifico</li>
                                        </ul>
                                    </div>

                                </div>


                            </li>
                        </ul>

                    </div>

                    <div class="text text-right" style="margin-top:5px">
                        <a href="#" id="saveElement" class="btn btn-info">done</a>
                    </div>
                </div>
                <!-- END SETTINGS -->

            </div>
            <!--/span-->

            <a href="#" class="btn btn-info btn-xs" id="edittamplate">Edit background</a>
            <div id="tosave" data-id="<%=id%>"  data-paramone="11" data-paramtwo="22" data-paramthree="33">
                <!-- inizio parte html da salvare -->
                <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #eeeeee" >
                    <tr>
                        <td width="100%" id="primary" class="main demo" align="center" valign="top" >
                            <div class="column" style="min-height:150px;">

<div class="lyrow dragitem">
    <a href="#close" class="remove label label-danger"><i class="glyphicon-remove glyphicon"></i></a>

    <span class="drag label label-default"><i class="glyphicon glyphicon-move"></i></span>
    <span class="configuration"> <a href="#" class="btn btn-default btn-xs clone"><i class="fa fa-clone"></i> </a>  </span>

    <div class="preview">
        <div class="icon text-block"></div>
        <label>Text</label>
    </div>
    <div class="view">
        <div class="row clearfix">
            <table width="640" class="main" cellspacing="0" cellpadding="0" border="0" style="background-color:#FFFFFF" align="center" data-type='text-block'>
                <tbody>
                    <tr>
                        <td class="block-text" data-clonable="true" align="left" style="padding:10px 50px 10px 50px;font-family:Arial;font-size:13px;color:#000000;line-height:22px">
                            <div style="margin:0px 0px 10px 0px;line-height:22px" class="textFix">This is a Text Block! Click on this text to edit it. You can add content easily by dragging content blocks from the right sidebar. Drag this and other blocks around to re-order them.</div>
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
            <div id="download-layout">

            </div>
        </div>
        <!--/row-->
        <!-- Button trigger modal -->


        <!-- Modal -->
        <div class="modal fade" id="previewModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="min-width:120px">
                    <div class="modal-header hidden">
                        <input id="httphref" type="text" name="href" value="http://" class="form-control" />
                    </div>
                    <div class="modal-body" align="center">
                        <div class="btn-group  previewActions">
                            <a class="btn btn-default btn-sm active" href="#" data-val="iphone">smartphone</a>
                            <a class="btn btn-default btn-sm " href="#" data-val="smalltablet">tablet</a>
                            <a class="btn btn-default btn-sm " href="#" data-val="ipad">ipad</a>
                        </div>
                         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <iframe id="previewFrame"  class="iphone"></iframe>
                    </div>
                    <div class="modal-footer">

                        <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <textarea id="imageid" class="hide"></textarea>
        <textarea id="download" class="hide"></textarea>
        <textarea id="selector" class="hide"></textarea>
        <textarea  id="path" class="hide"></textarea>




        <div class="modal fade" id="previewimg" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="min-width:120px">
                    <div class="modal-header">
                        Imagegallery
                    </div>
                    <div class="modal-body" align="center">
                        
                    </div>
                    <div class="modal-footer">

                        <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

    </body>

</html>
