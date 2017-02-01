<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<%
String AGILE_VERSION = SystemProperty.applicationVersion.get();

String MAIN_URL = "http://localhost:8888/";
if(!VersioningUtil.isDevelopmentEnv())
    MAIN_URL = VersioningUtil.getURL(NamespaceManager.get(), request);

String S3_BASE_URL = "https://s3.amazonaws.com/agilecrm/pagebuilder/";
String S3_STATIC_FILES_URL = S3_BASE_URL + "static/";
String PAGE_BUILDER_URL = MAIN_URL + "misc/pagebuilder/";
String BUILD_PATH = PAGE_BUILDER_URL + "source/build/";

String idPath = request.getPathInfo();
String pageId = "0";
String SELECTED_TEMPLATE = null;
String copyPageId = "0";
if(idPath != null && !StringUtils.isEmpty(idPath) && !idPath.equals("/")) {
    if(idPath.indexOf("copy") != -1){
        String[] pathArr = idPath.split("-");
        SELECTED_TEMPLATE = pathArr[0].substring(1);
        copyPageId = pathArr[1];
    }else{
        pageId = idPath.substring(1);
    }

} else {
    pageId = "0";
}

//User Language 
String _LANGUAGE = "en";

try{
  UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefsFromRequest(request);
 _LANGUAGE = userPrefs.language;
}catch(Exception e){
	e.printStackTrace();
}

//Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "page-builder");


%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Agile CRM | <%=LanguageUtil.getLocaleJSONValue(localeJSON, "builder-page-title")%></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <link href="<%=BUILD_PATH%>css/main.min.css?v=<%=AGILE_VERSION%>" rel="stylesheet">    
  <link href="<%=BUILD_PATH%>css/builder.min.css?v=<%=AGILE_VERSION%>" rel="stylesheet">      
  <!-- <link rel="shortcut icon" href="<%=S3_STATIC_FILES_URL%>images/favicon.png"> -->
  
  <!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
  <!--[if lt IE 9]>
  <script src="<%=S3_STATIC_FILES_URL%>js/html5shiv.js"></script>
  <script src="<%=S3_STATIC_FILES_URL%>js/respond.min.js"></script>
  <![endif]-->
    
    <script>
    var baseUrl = '<%=PAGE_BUILDER_URL%>';
    var siteUrl = '<%=MAIN_URL%>';
    var agilePageId = <%=pageId%>;
    var s3BaseUrl = '<%=S3_STATIC_FILES_URL%>';
    var CURRENT_AGILE_DOMAIN = '<%=NamespaceManager.get()%>';
    var current_agileform;
    var selectedTemplateId = '<%=SELECTED_TEMPLATE%>';
    var copyPagebuilderId = <%=copyPageId%>;
 	// Locale JSON
    var _AGILE_LOCALE_JSON = <%=localeJSON%>;
    var localeJSON = <%=localeJSON%>;
    var _LANGUAGE = '<%=_LANGUAGE%>';
    </script>
</head>
<body class="builderUI">
        
    <div id="builder">
    
        <div class="menu" id="menu">
      
            <div class="main" id="main">
                                        
                <h3><span class="fui-list"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "blocks")%></h3>
                
                <ul id="elementCats">
                    <li><a href="#" id="all"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "all-blocks")%></a></li>
                </ul>
                
                <a class="toggle" href="#"><img src="<%=S3_STATIC_FILES_URL%>images/logo.svg"></a>
                
                <!-- <hr> -->
                
                <!-- <h3><span class="fui-windows"></span> Pages</h3> -->
                
                <ul id="pages" style="display: none;">
                    <li style="display: none;" id="newPageLI">
                        <input type="text" value="index" name="page">
                        <span class="pageButtons">
                            <a href="" class="fileEdit"><span class="fui-new"></span></a>
                            <a href="" class="fileDel"><span class="fui-cross"></span></a>
                            <a class="btn btn-xs btn-primary btn-embossed fileSave" href="#"><span class="fui-check"></span></a>
                        </span>
                    </li>
                    
                </ul>
        
                <div class="sideButtons clearfix" style="display: none;">
                    <a href="#" class="btn btn-primary btn-sm btn-embossed" id="addPage"><span class="fui-plus"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "add-page")%></a>
                </div>
        
            </div><!-- /.main -->
        
            <div class="second" id="second">
                            
                <ul id="elements">
                
                </ul>
      
            </div><!-- /.secondSide -->
        
        </div><!-- /.menu -->
      
        <div class="container">
   
            <header class="clearfix affix">
                
                <div class="btn-group" style="float: right;">           
                    <button class="btn btn-inverse dropdown-toggle" data-toggle="dropdown">
                        <i class="fui-gear"></i>
                    </button>
                    <button class="btn btn-inverse">
                        <a href="<%=MAIN_URL%>#landing-pages" id="backButton" style="color: #fff"><i class="fui-arrow-left"></i> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "back")%></a>
                    </button>
                    <span class="dropdown-arrow dropdown-arrow-inverse"></span>
                    <ul class="dropdown-menu dropdown-menu-inverse dropdown-menu-right">
                        <li>
                            <a href="#pageSettingsModal" id="pageSettingsButton" data-toggle="modal" data-siteid="6">
                                <span class="fui-arrow-right"></span> 
                                <%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-settings")%>                            </a>
                        </li>
                        <!-- <li class="divider"></li>
                        
                        <li>
                            <a href="<%=MAIN_URL%>#landing-pages" id="backButton">
                                <span class="fui-arrow-left"></span>
                                Back to Landing Pages                  </a>
                        </li> -->

                        
                    </ul>
                </div>
                
                <a href="<%=MAIN_URL%>#landing-page-settings/<%=pageId%>" id="publishPage" target="_blank" class="btn btn-inverse pull-right actionButtons slick" data-toggle="tooltip" data-placement="bottom" title='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "publish-title")%>' style="display: none">
                    <i class="fui-upload"></i> 
                    <span class="slide"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "publish")%></span>
                    <i class="fui-alert text-danger" >
                    </i>
                </a>
                
                <a href="#previewModal" data-toggle="modal" class="btn btn-inverse btn-embossed pull-right slick" style="display: none" id="buttonPreview">
                    <i class="fui-window"></i> 
                    <span class="slide"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "preview")%></span>
                </a>

                <a href="<%=MAIN_URL%>pagebuilder/copy-<%=pageId%>" class="btn btn-inverse btn-embossed pull-right slick" id="pagebuilderCopyBtn">
                    <i class="fui-windows"></i> 
                    <span class="slide"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "create-copy")%></span>
                </a>
                
                                <div class="btn-group" style="float: right;">           
                    <button class="btn btn-primary" id="savePage">
                        <span class="fui-check"></span> 
                        <span class="bLabel"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "nothing-to-save")%></span>
                    </button>
                    <!-- <button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        <span class="caret"></span>
                    </button>
                    <span class="dropdown-arrow dropdown-arrow-inverse"></span>
                    <ul class="dropdown-menu dropdown-menu-inverse">
                        <li><a href="#" id="saveTemplate" data-toggle="modal" data-siteid="6"><span class="fui-arrow-right"></span> Save page template</a></li>
                    </ul> -->
                </div>
                <div class="col-md-4" id="lp-save-msg" style="color: white; text-align: left; float: right; margin-top: 7px; display:none; color: #24bfa0;">Landing page saved.</div>
                <ul class="nav nav-pills nav-inverse pull-left responsiveToggle" id="responsiveToggle">
                    <li>
                        <a href="" data-responsive="mobile">
                            <i class="fa fa-mobile" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li>
                        <a href="" data-responsive="tablet">
                            <i class="fa fa-tablet" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li class="active">
                        <a href="" data-responsive="desktop">
                            <i class="fa fa-desktop" aria-hidden="true"></i>
                        </a>
                    </li>
                </ul>
            
            </header>
            
                        
            <div class="screen" id="screen">
                
                <div class="toolbar">
                
                    <div class="buttons clearfix">
                        <span class="left red"></span>
                        <span class="left yellow"></span>
                        <span class="left green"></span>
                    </div>
                    
                    <div class="title">
                        <span id="pageTitle" class="hidden">index</span>
                    </div>
                    
                </div>
                
                <div id="frameWrapper" class="frameWrapper empty">
                    <div id="pageList">
                        
                    </div>
                    <div class="start" id="start" style="display:none">
                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "drag-info")%></span>
                    </div>
                </div>
            
            </div><!-- /.screen -->
                
        </div><!-- /.container -->
        
        <div id="styleEditor" class="styleEditor">
        
            <a title=" Press Esc to close" href="#" class="close"><span class="fui-cross-circle"></span></a>
            
            <h3><span class="fui-new"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "detail-editor")%></h3>
            
            <ul class="breadcrumb">
                <li><%=LanguageUtil.getLocaleJSONValue(localeJSON, "editing")%>:</li>
                <li class="active" id="editingElement">p</li>
            </ul>
            
            <ul class="nav nav-tabs" id="detailTabs">
                <li class="active"><a href="#tab1" id="default-tab1"><span class="fui-new"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "style")%></a></li>
                <li style="display: none;"><a href="#link_Tab" id="link_Link"><span class="fui-clip"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "link")%></a></li>
                <li style="display: none;"><a href="#image_Tab" id="img_Link"><span class="fui-image"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "Image")%></a></li>
                <li style="display: none;"><a href="#icon_Tab" id="icon_Link"><span class="fa fa-flag"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "icons")%></a></li>
                <li style="display: none;"><a href="#video_Tab" id="video_Link"><span class="fa fa-youtube-play"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "video")%></a></li>
                <li style="display: none;">
                    <a href="#agileform_Tab" id="agileform_link" class="agile-tooltip" data-placement="right" data-original-title=" <%=LanguageUtil.getLocaleJSONValue(localeJSON, "form-tooltip")%>" ><%=LanguageUtil.getLocaleJSONValue(localeJSON, "agile-form")%>
                <sup style="font-size: 9px;color: #337ab7;">?</sup></a>
                </li>
            </ul><!-- /tabs -->
            
            <div class="tab-content">
            
                <div class="tab-pane active" id="tab1">
                    
                    <form class="" role="form" id="stylingForm">
                    
                        <div id="styleElements">
                    
                            <div class="form-group clearfix" style="display: none;" id="styleElTemplate">
                                <label for="" class="control-label"></label>
                                <input type="text" class="form-control input-sm" id="" placeholder="">
                            </div>
                        
                        </div>
                      
                    </form>
                    
                </div>
            
                <!-- /tabs -->
                <div class="tab-pane link_Tab" id="link_Tab">
                    
                    <div class="form-group fullWidth">
                        <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "text-to-display")%></label>
                        <input type="text" class="form-control margin-bottom-20" id="linkText" name="linkText" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "link-text")%>' value="">
                    </div>
                    
                    <div class="form-group hidden">
                        <select id="pageLinksDropdown" class="form-control select select-primary btn-block mbl">
                            <option value="#"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "choose-a-page")%></option>                            
                        </select>
                    </div>
                    
                    <p class="text-center or hidden">
                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "or")%></span>
                    </p>                  
                   
                    <div class="form-group fullWidth">
                        <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "url")%>: </label>
                        <input type="text" class="form-control margin-bottom-20" 
                        id="internalLinksCustom" placeholder="http://somewhere.com/somepage" value="">
                        <span id="err-url-msg" class="internalLinksCustom" style="font-size: 12px;color:#f05050; display:none;">Please enter a valid url</span>
                    </div>
                    <p class="text-center or">
                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "or-cap")%></span>
                    </p>

                    <div class="form-group">
                        <!--<select id="pageLinksDropdown" class="form-control select select-primary btn-block mbl">-->
                        <select id="internalLinksDropdown" class="form-control select select-primary btn-block mbl">
                            <option value="#"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "choose-a-block-link")%></option>

                        </select>
                    </div>
                    <div class="checkbox form-group " style="margin-top:4px; margin-bottom:4px;">
                        <label class="pull-left"  style="padding-left: 0px; margin-top: -16px;"><input type="checkbox" id="newtab-option" value="false"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "open-in-new-tab")%></label>
                    </div>
                    
                </div>
            
                <!-- /tabs -->
                <div class="tab-pane imageFileTab" id="image_Tab">
                    <div style="float: right;margin-top: -15px;" id="choose-media-div">
                        <a style="font-size: 12px; cursor: pointer;" class="choose-media-mode"> change media</a>
                    </div>
                    <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "image-url")%>:</label>
                    
                    <input type="text" class="form-control margin-bottom-20" id="imageURL" placeholder="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "enter-image-url")%>" value=""> 
                    <span id="error-img-msg" class="imageURL" style="font-size: 12px;color:#f05050; display:none;">
                        <%=LanguageUtil.getLocaleJSONValue(localeJSON, "error-image-url")%>
                    </span>
                                 
                    <p class="text-center or">
                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "or-cap")%></span>
                    </p>
                    
                    <a href="#imageModal" data-toggle="modal" type="button" class="btn btn-default btn-embossed btn-block margin-bottom-20"><span class="fui-image"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-img")%></a>

                    <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "alt-text")%></label>
                    
                    <input type="text" class="form-control margin-bottom-20" id="alttxt" placeholder="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "alt-txt-placeholder")%>" value=""> 
                   
                </div><!-- /.tab-pane -->

                <div class="tab-pane agileFormTab" id="agileform_Tab">
                    <div style="float: right;margin-top: -15px;" id="choose-media-div">
                        <a style="font-size: 12px; cursor: pointer;" class="choose-media-mode"> change media</a>
                    </div>
                    <select id="agileform_id" name="agileformlist" class="btn btn-default btn-embossed btn-block ">
                        <option value="default"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "select-form")%></option>
                    </select> 
                      <div  class="margin-bottom-20" id="refresh-formlist"  style="padding: 3px 0px 5px;" >
                        <a class="right agile-tooltip refresh-formlist"  data-placement="right" data-original-title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "refresh-form-tooltip")%>">
                        <i class="fa fa-refresh" aria-hidden="true" style="color: #bdc3c7;"></i></a>
                        <a class="agile-tooltip edit-form right"  target="_new" style="margin-right: 5px; display:none;" data-placement="right" data-original-title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "edit-form-tooltip")%>" >
                        <i class="fa fa-edit" style="color: #bdc3c7;"></i></a>
                    </div>
		           <p class="text-center or">
                         <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "or-cap")%></span>
                    </p>
                    <a target="_new"    href="<%=MAIN_URL%>#form-builder-templates" type="button" class="btn btn-default btn-embossed btn-block margin-bottom-20" id="addnew-formlink"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "add-form")%></a>
                </div> 
                
                <!-- /tabs -->
                <div class="tab-pane iconTab" id="icon_Tab">
                
                    <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "choose-a-icon")%>: </label>
                    
                    <select id="icons" data-placeholder="" class>
                        <option value="fa-adjust">&#xf042; adjust</option>
                        <option value="fa-adn">&#xf170; adn</option>
                        <option value="fa-align-center">&#xf037; align-center</option>
                        <option value="fa-align-justify">&#xf039; align-justify</option>
                        <option value="fa-align-left">&#xf036; align-left</option>
                        <option value="fa-align-right">&#xf038; align-right</option>
                        <option value="fa-ambulance">&#xf0f9; ambulance</option>
                        <option value="fa-anchor">&#xf13d; anchor</option>
                        <option value="fa-android">&#xf17b; android</option>
                        <option value="fa-angellist">&#xf209; angellist</option>
                        <option value="fa-angle-double-down">&#xf103; angle-double-down</option>
                        <option value="fa-angle-double-left">&#xf100; angle-double-left</option>
                        <option value="fa-angle-double-right">&#xf101; angle-double-right</option>
                        <option value="fa-angle-double-up">&#xf102; angle-double-up</option>
                        <option value="fa-angle-down">&#xf107; angle-down</option>
                        <option value="fa-angle-left">&#xf104; angle-left</option>
                        <option value="fa-angle-right">&#xf105; angle-right</option>
                        <option value="fa-angle-up">&#xf106; angle-up
                        </option>
                        
                         <option value="fa-apple">&#xf179; apple
                        </option>
                        
                         <option value="fa-archive">&#xf187; archive
                        </option>
                        
                         <option value="fa-area-chart">&#xf1fe; area-chart
                        </option>
                        
                         <option value="fa-arrow-circle-down">&#xf0ab; arrow-circle-down
                        </option>
                        
                         <option value="fa-arrow-circle-left">&#xf0a8; arrow-circle-left
                        </option>
                        
                         <option value="fa-arrow-circle-o-down">&#xf01a; arrow-circle-o-down
                        </option>
                        
                         <option value="fa-arrow-circle-o-left">&#xf190; arrow-circle-o-left
                        </option>
                        
                         <option value="fa-arrow-circle-o-right">&#xf18e; arrow-circle-o-right
                        </option>
                        
                         <option value="fa-arrow-circle-o-up">&#xf01b; arrow-circle-o-up
                        </option>
                        
                         <option value="fa-arrow-circle-right">&#xf0a9; arrow-circle-right
                        </option>
                        
                         <option value="fa-arrow-circle-up">&#xf0aa; arrow-circle-up
                        </option>
                        
                         <option value="fa-arrow-down">&#xf063; arrow-down
                        </option>
                        
                         <option value="fa-arrow-left">&#xf060; arrow-left
                        </option>
                        
                         <option value="fa-arrow-right">&#xf061; arrow-right
                        </option>
                        
                         <option value="fa-arrow-up">&#xf062; arrow-up
                        </option>
                        
                         <option value="fa-arrows">&#xf047; arrows
                        </option>
                        
                         <option value="fa-arrows-alt">&#xf0b2; arrows-alt
                        </option>
                        
                         <option value="fa-arrows-h">&#xf07e; arrows-h
                        </option>
                        
                         <option value="fa-arrows-v">&#xf07d; arrows-v
                        </option>
                        
                         <option value="fa-asterisk">&#xf069; asterisk
                        </option>
                        
                         <option value="fa-at">&#xf1fa; at
                        </option>
                        
                         <option value="fa-automobile">&#xf1b9; automobile
                        </option>
                        
                         <option value="fa-backward">&#xf04a; backward
                        </option>
                        
                         <option value="fa-ban">&#xf05e; ban
                        </option>
                        
                         <option value="fa-bank">&#xf19c; bank
                        </option>
                        
                         <option value="fa-bar-chart">&#xf080; bar-chart
                        </option>
                        
                         <option value="fa-bar-chart-o">&#xf080; bar-chart-o
                        </option>
                        
                         <option value="fa-barcode">&#xf02a; barcode
                        </option>
                        
                         <option value="fa-bars">&#xf0c9; bars
                        </option>
                        
                         <option value="fa-beer">&#xf0fc; beer
                        </option>
                        
                         <option value="fa-behance">&#xf1b4; behance
                        </option>
                        
                         <option value="fa-behance-square">&#xf1b5; behance-square
                        </option>
                        
                         <option value="fa-bell">&#xf0f3; bell
                        </option>
                        
                         <option value="fa-bell-o">&#xf0a2; bell-o
                        </option>
                        
                         <option value="fa-bell-slash">&#xf1f6; bell-slash
                        </option>
                        
                         <option value="fa-bell-slash-o">&#xf1f7; bell-slash-o
                        </option>
                        
                         <option value="fa-bicycle">&#xf206; bicycle
                        </option>
                        
                         <option value="fa-binoculars">&#xf1e5; binoculars
                        </option>
                        
                         <option value="fa-birthday-cake">&#xf1fd; birthday-cake
                        </option>
                        
                         <option value="fa-bitbucket">&#xf171; bitbucket
                        </option>
                        
                         <option value="fa-bitbucket-square">&#xf172; bitbucket-square
                        </option>
                        
                         <option value="fa-bitcoin">&#xf15a; bitcoin
                        </option>
                        
                         <option value="fa-bold">&#xf032; bold
                        </option>
                        
                         <option value="fa-bolt">&#xf0e7; bolt
                        </option>
                        
                         <option value="fa-bomb">&#xf1e2; bomb
                        </option>
                        
                         <option value="fa-book">&#xf02d; book
                        </option>
                        
                         <option value="fa-bookmark">&#xf02e; bookmark
                        </option>
                        
                         <option value="fa-bookmark-o">&#xf097; bookmark-o
                        </option>
                        
                         <option value="fa-briefcase">&#xf0b1; briefcase
                        </option>
                        
                         <option value="fa-btc">&#xf15a; btc
                        </option>
                        
                         <option value="fa-bug">&#xf188; bug
                        </option>
                        
                         <option value="fa-building">&#xf1ad; building
                        </option>
                        
                         <option value="fa-building-o">&#xf0f7; building-o
                        </option>
                        
                         <option value="fa-bullhorn">&#xf0a1; bullhorn
                        </option>
                        
                         <option value="fa-bullseye">&#xf140; bullseye
                        </option>
                        
                         <option value="fa-bus">&#xf207; bus
                        </option>
                        
                         <option value="fa-cab">&#xf1ba; cab
                        </option>
                        
                         <option value="fa-calculator">&#xf1ec; calculator
                        </option>
                        
                         <option value="fa-calendar">&#xf073; calendar
                        </option>
                        
                         <option value="fa-calendar-o">&#xf133; calendar-o
                        </option>
                        
                         <option value="fa-camera">&#xf030; camera
                        </option>
                        
                         <option value="fa-camera-retro">&#xf083; camera-retro
                        </option>
                        
                         <option value="fa-car">&#xf1b9; car
                        </option>
                        
                         <option value="fa-caret-down">&#xf0d7; caret-down
                        </option>
                        
                         <option value="fa-caret-left">&#xf0d9; caret-left
                        </option>
                        
                         <option value="fa-caret-right">&#xf0da; caret-right
                        </option>
                        
                         <option value="fa-caret-square-o-down">&#xf150; caret-square-o-down
                        </option>
                        
                         <option value="fa-caret-square-o-left">&#xf191; caret-square-o-left
                        </option>
                        
                         <option value="fa-caret-square-o-right">&#xf152; caret-square-o-right
                        </option>
                        
                         <option value="fa-caret-square-o-up">&#xf151; caret-square-o-up
                        </option>
                        
                         <option value="fa-caret-up">&#xf0d8; caret-up
                        </option>
                        
                         <option value="fa-cc">&#xf20a; cc
                        </option>
                        
                         <option value="fa-cc-amex">&#xf1f3; cc-amex
                        </option>
                        
                         <option value="fa-cc-discover">&#xf1f2; cc-discover
                        </option>
                        
                         <option value="fa-cc-mastercard">&#xf1f1; cc-mastercard
                        </option>
                        
                         <option value="fa-cc-paypal">&#xf1f4; cc-paypal
                        </option>
                        
                         <option value="fa-cc-stripe">&#xf1f5; cc-stripe
                        </option>
                        
                         <option value="fa-cc-visa">&#xf1f0; cc-visa
                        </option>
                        
                         <option value="fa-certificate">&#xf0a3; certificate
                        </option>
                        
                         <option value="fa-chain">&#xf0c1; chain
                        </option>
                        
                         <option value="fa-chain-broken">&#xf127; chain-broken
                        </option>
                        
                         <option value="fa-check">&#xf00c; check
                        </option>
                        
                         <option value="fa-check-circle">&#xf058; check-circle
                        </option>
                        
                         <option value="fa-check-circle-o">&#xf05d; check-circle-o
                        </option>
                        
                         <option value="fa-check-square">&#xf14a; check-square
                        </option>
                        
                         <option value="fa-check-square-o">&#xf046; check-square-o
                        </option>
                        
                         <option value="fa-chevron-circle-down">&#xf13a; chevron-circle-down
                        </option>
                        
                         <option value="fa-chevron-circle-left">&#xf137; chevron-circle-left
                        </option>
                        
                         <option value="fa-chevron-circle-right">&#xf138; chevron-circle-right
                        </option>
                        
                         <option value="fa-chevron-circle-up">&#xf139; chevron-circle-up
                        </option>
                        
                         <option value="fa-chevron-down">&#xf078; chevron-down
                        </option>
                        
                         <option value="fa-chevron-left">&#xf053; chevron-left
                        </option>
                        
                         <option value="fa-chevron-right">&#xf054; chevron-right
                        </option>
                        
                         <option value="fa-chevron-up">&#xf077; chevron-up
                        </option>
                        
                         <option value="fa-child">&#xf1ae; child
                        </option>
                        
                         <option value="fa-circle">&#xf111; circle
                        </option>
                        
                         <option value="fa-circle-o">&#xf10c; circle-o
                        </option>
                        
                         <option value="fa-circle-o-notch">&#xf1ce; circle-o-notch
                        </option>
                        
                         <option value="fa-circle-thin">&#xf1db; circle-thin
                        </option>
                        
                         <option value="fa-clipboard">&#xf0ea; clipboard
                        </option>
                        
                         <option value="fa-clock-o">&#xf017; clock-o
                        </option>
                        
                         <option value="fa-close">&#xf00d; close
                        </option>
                        
                         <option value="fa-cloud">&#xf0c2; cloud
                        </option>
                        
                         <option value="fa-cloud-download">&#xf0ed; cloud-download
                        </option>
                        
                         <option value="fa-cloud-upload">&#xf0ee; cloud-upload
                        </option>
                        
                         <option value="fa-cny">&#xf157; cny
                        </option>
                        
                         <option value="fa-code">&#xf121; code
                        </option>
                        
                         <option value="fa-code-fork">&#xf126; code-fork
                        </option>
                        
                         <option value="fa-codepen">&#xf1cb; codepen
                        </option>
                        
                         <option value="fa-coffee">&#xf0f4; coffee
                        </option>
                        
                         <option value="fa-cog">&#xf013; cog
                        </option>
                        
                         <option value="fa-cogs">&#xf085; cogs
                        </option>
                        
                         <option value="fa-columns">&#xf0db; columns
                        </option>
                        
                         <option value="fa-comment">&#xf075; comment
                        </option>
                        
                         <option value="fa-comment-o">&#xf0e5; comment-o
                        </option>
                        
                         <option value="fa-comments">&#xf086; comments
                        </option>
                        
                         <option value="fa-comments-o">&#xf0e6; comments-o
                        </option>
                        
                         <option value="fa-compass">&#xf14e; compass
                        </option>
                        
                         <option value="fa-compress">&#xf066; compress
                        </option>
                        
                         <option value="fa-copy">&#xf0c5; copy
                        </option>
                        
                         <option value="fa-copyright">&#xf1f9; copyright
                        </option>
                        
                         <option value="fa-credit-card">&#xf09d; credit-card
                        </option>
                        
                         <option value="fa-crop">&#xf125; crop
                        </option>
                        
                         <option value="fa-crosshairs">&#xf05b; crosshairs
                        </option>
                        
                        <option value="fa-css">css3 &#xf13c;
                        </option>
                        
                         <option value="fa-cube">&#xf1b2; cube
                        </option>
                        
                         <option value="fa-cubes">&#xf1b3; cubes
                        </option>
                        
                         <option value="fa-cut">&#xf0c4; cut
                        </option>
                        
                         <option value="fa-cutlery">&#xf0f5; cutlery
                        </option>
                        
                         <option value="fa-dashboard">&#xf0e4; dashboard
                        </option>
                        
                         <option value="fa-database">&#xf1c0; database
                        </option>
                        
                         <option value="fa-dedent">&#xf03b; dedent
                        </option>
                        
                         <option value="fa-delicious">&#xf1a5; delicious
                        </option>
                        
                         <option value="fa-desktop">&#xf108; desktop
                        </option>
                        
                         <option value="fa-deviantart">&#xf1bd; deviantart
                        </option>
                        
                         <option value="fa-digg">&#xf1a6; digg
                        </option>
                        
                         <option value="fa-dollar">&#xf155; dollar
                        </option>
                        
                         <option value="fa-dot-circle-o">&#xf192; dot-circle-o
                        </option>
                        
                         <option value="fa-download">&#xf019; download
                        </option>
                        
                         <option value="fa-dribbble">&#xf17d; dribbble
                        </option>
                        
                         <option value="fa-dropbox">&#xf16b; dropbox
                        </option>
                        
                         <option value="fa-drupal">&#xf1a9; drupal
                        </option>
                        
                         <option value="fa-edit">&#xf044; edit
                        </option>
                        
                         <option value="fa-eject">&#xf052; eject
                        </option>
                        
                         <option value="fa-ellipsis-h">&#xf141; ellipsis-h
                        </option>
                        
                         <option value="fa-ellipsis-v">&#xf142; ellipsis-v
                        </option>
                        
                         <option value="fa-empire">&#xf1d1; empire
                        </option>
                        
                         <option value="fa-envelope">&#xf0e0; envelope
                        </option>
                        
                         <option value="fa-envelope-o">&#xf003; envelope-o
                        </option>
                        
                         <option value="fa-envelope-square">&#xf199; envelope-square
                        </option>
                        
                         <option value="fa-eraser">&#xf12d; eraser
                        </option>
                        
                         <option value="fa-eur">&#xf153; eur
                        </option>
                        
                         <option value="fa-euro">&#xf153; euro
                        </option>
                        
                         <option value="fa-exchange">&#xf0ec; exchange
                        </option>
                        
                         <option value="fa-exclamation">&#xf12a; exclamation
                        </option>
                        
                         <option value="fa-exclamation-circle">&#xf06a; exclamation-circle
                        </option>
                        
                         <option value="fa-exclamation-triangle">&#xf071; exclamation-triangle
                        </option>
                        
                         <option value="fa-expand">&#xf065; expand
                        </option>
                        
                         <option value="fa-external-link">&#xf08e; external-link
                        </option>
                        
                         <option value="fa-external-link-square">&#xf14c; external-link-square
                        </option>
                        
                         <option value="fa-eye">&#xf06e; eye
                        </option>
                        
                         <option value="fa-eye-slash">&#xf070; eye-slash
                        </option>
                        
                         <option value="fa-eyedropper">&#xf1fb; eyedropper
                        </option>
                        
                         <option value="fa-facebook">&#xf09a; facebook
                        </option>
                        
                         <option value="fa-facebook-square">&#xf082; facebook-square
                        </option>
                        
                         <option value="fa-fast-backward">&#xf049; fast-backward
                        </option>
                        
                         <option value="fa-fast-forward">&#xf050; fast-forward
                        </option>
                        
                         <option value="fa-fax">&#xf1ac; fax
                        </option>
                        
                         <option value="fa-female">&#xf182; female
                        </option>
                        
                         <option value="fa-fighter-jet">&#xf0fb; fighter-jet
                        </option>
                        
                         <option value="fa-file">&#xf15b; file
                        </option>
                        
                         <option value="fa-file-archive-o">&#xf1c6; file-archive-o
                        </option>
                        
                         <option value="fa-file-audio-o">&#xf1c7; file-audio-o
                        </option>
                        
                         <option value="fa-file-code-o">&#xf1c9; file-code-o
                        </option>
                        
                         <option value="fa-file-excel-o">&#xf1c3; file-excel-o
                        </option>
                        
                         <option value="fa-file-image-o">&#xf1c5; file-image-o
                        </option>
                        
                         <option value="fa-file-movie-o">&#xf1c8; file-movie-o
                        </option>
                        
                         <option value="fa-file-o">&#xf016; file-o
                        </option>
                        
                         <option value="fa-file-pdf-o">&#xf1c1; file-pdf-o
                        </option>
                        
                         <option value="fa-file-photo-o">&#xf1c5; file-photo-o
                        </option>
                        
                         <option value="fa-file-picture-o">&#xf1c5; file-picture-o
                        </option>
                        
                         <option value="fa-file-powerpoint-o">&#xf1c4; file-powerpoint-o
                        </option>
                        
                         <option value="fa-file-sound-o">&#xf1c7; file-sound-o
                        </option>
                        
                         <option value="fa-file-text">&#xf15c; file-text
                        </option>
                        
                         <option value="fa-file-text-o">&#xf0f6; file-text-o
                        </option>
                        
                         <option value="fa-file-video-o">&#xf1c8; file-video-o
                        </option>
                        
                         <option value="fa-file-word-o">&#xf1c2; file-word-o
                        </option>
                        
                         <option value="fa-file-zip-o">&#xf1c6; file-zip-o
                        </option>
                        
                         <option value="fa-files-o">&#xf0c5; files-o
                        </option>
                        
                         <option value="fa-film">&#xf008; film
                        </option>
                        
                         <option value="fa-filter">&#xf0b0; filter
                        </option>
                        
                         <option value="fa-fire">&#xf06d; fire
                        </option>
                        
                         <option value="fa-fire-extinguisher">&#xf134; fire-extinguisher
                        </option>
                        
                         <option value="fa-flag">&#xf024; flag
                        </option>
                        
                         <option value="fa-flag-checkered">&#xf11e; flag-checkered
                        </option>
                        
                         <option value="fa-flag-o">&#xf11d; flag-o
                        </option>
                        
                         <option value="fa-flash">&#xf0e7; flash
                        </option>
                        
                         <option value="fa-flask">&#xf0c3; flask
                        </option>
                        
                         <option value="fa-flickr">&#xf16e; flickr
                        </option>
                        
                         <option value="fa-floppy-o">&#xf0c7; floppy-o
                        </option>
                        
                         <option value="fa-folder">&#xf07b; folder
                        </option>
                        
                         <option value="fa-folder-o">&#xf114; folder-o
                        </option>
                        
                         <option value="fa-folder-open">&#xf07c; folder-open
                        </option>
                        
                         <option value="fa-folder-open-o">&#xf115; folder-open-o
                        </option>
                        
                         <option value="fa-font">&#xf031; font
                        </option>
                        
                         <option value="fa-forward">&#xf04e; forward
                        </option>
                        
                         <option value="fa-foursquare">&#xf180; foursquare
                        </option>
                        
                         <option value="fa-frown-o">&#xf119; frown-o
                        </option>
                        
                         <option value="fa-futbol-o">&#xf1e3; futbol-o
                        </option>
                        
                         <option value="fa-gamepad">&#xf11b; gamepad
                        </option>
                        
                         <option value="fa-gavel">&#xf0e3; gavel
                        </option>
                        
                         <option value="fa-gbp">&#xf154; gbp
                        </option>
                        
                         <option value="fa-ge">&#xf1d1; ge
                        </option>
                        
                         <option value="fa-gear">&#xf013; gear
                        </option>
                        
                         <option value="fa-gears">&#xf085; gears
                        </option>
                        
                         <option value="fa-gift">&#xf06b; gift
                        </option>
                        
                         <option value="fa-git">&#xf1d3; git
                        </option>
                        
                         <option value="fa-git-square">&#xf1d2; git-square
                        </option>
                        
                         <option value="fa-github">&#xf09b; github
                        </option>
                        
                         <option value="fa-github-alt">&#xf113; github-alt
                        </option>
                        
                         <option value="fa-github-square">&#xf092; github-square
                        </option>
                        
                         <option value="fa-gittip">&#xf184; gittip
                        </option>
                        
                         <option value="fa-glass">&#xf000; glass
                        </option>
                        
                         <option value="fa-globe">&#xf0ac; globe
                        </option>
                        
                         <option value="fa-google">&#xf1a0; google
                        </option>
                        
                         <option value="fa-google-plus">&#xf0d5; google-plus
                        </option>
                        
                         <option value="fa-google-plus-square">&#xf0d4; google-plus-square
                        </option>
                        
                         <option value="fa-google-wallet">&#xf1ee; google-wallet
                        </option>
                        
                         <option value="fa-graduation-cap">&#xf19d; graduation-cap
                        </option>
                        
                         <option value="fa-group">&#xf0c0; group
                        </option>
                        
                         <option value="fa-h-square">&#xf0fd; h-square
                        </option>
                        
                         <option value="fa-hacker-news">&#xf1d4; hacker-news
                        </option>
                        
                         <option value="fa-hand-o-down">&#xf0a7; hand-o-down
                        </option>
                        
                         <option value="fa-hand-o-left">&#xf0a5; hand-o-left
                        </option>
                        
                         <option value="fa-hand-o-right">&#xf0a4; hand-o-right
                        </option>
                        
                         <option value="fa-hand-o-up">&#xf0a6; hand-o-up
                        </option>
                        
                         <option value="fa-hdd-o">&#xf0a0; hdd-o
                        </option>
                        
                         <option value="fa-header">&#xf1dc; header
                        </option>
                        
                         <option value="fa-headphones">&#xf025; headphones
                        </option>
                        
                         <option value="fa-heart">&#xf004; heart
                        </option>
                        
                         <option value="fa-heart-o">&#xf08a; heart-o
                        </option>
                        
                         <option value="fa-history">&#xf1da; history
                        </option>
                        
                         <option value="fa-home">&#xf015; home
                        </option>
                        
                         <option value="fa-hospital-o">&#xf0f8; hospital-o
                        </option>
                        
                        <option value="fa-html">html5 &#xf13b;
                        </option>
                        
                         <option value="fa-ils">&#xf20b; ils
                        </option>
                        
                         <option value="fa-image">&#xf03e; image
                        </option>
                        
                         <option value="fa-inbox">&#xf01c; inbox
                        </option>
                        
                         <option value="fa-indent">&#xf03c; indent
                        </option>
                        
                         <option value="fa-info">&#xf129; info
                        </option>
                        
                         <option value="fa-info-circle">&#xf05a; info-circle
                        </option>
                        
                         <option value="fa-inr">&#xf156; inr
                        </option>
                        
                         <option value="fa-instagram">&#xf16d; instagram
                        </option>
                        
                         <option value="fa-institution">&#xf19c; institution
                        </option>
                        
                         <option value="fa-ioxhost">&#xf208; ioxhost
                        </option>
                        
                         <option value="fa-italic">&#xf033; italic
                        </option>
                        
                         <option value="fa-joomla">&#xf1aa; joomla
                        </option>
                        
                         <option value="fa-jpy">&#xf157; jpy
                        </option>
                        
                         <option value="fa-jsfiddle">&#xf1cc; jsfiddle
                        </option>
                        
                         <option value="fa-key">&#xf084; key
                        </option>
                        
                         <option value="fa-keyboard-o">&#xf11c; keyboard-o
                        </option>
                        
                         <option value="fa-krw">&#xf159; krw
                        </option>
                        
                         <option value="fa-language">&#xf1ab; language
                        </option>
                        
                         <option value="fa-laptop">&#xf109; laptop
                        </option>
                        
                         <option value="fa-lastfm">&#xf202; lastfm
                        </option>
                        
                         <option value="fa-lastfm-square">&#xf203; lastfm-square
                        </option>
                        
                         <option value="fa-leaf">&#xf06c; leaf
                        </option>
                        
                         <option value="fa-legal">&#xf0e3; legal
                        </option>
                        
                         <option value="fa-lemon-o">&#xf094; lemon-o
                        </option>
                        
                         <option value="fa-level-down">&#xf149; level-down
                        </option>
                        
                         <option value="fa-level-up">&#xf148; level-up
                        </option>
                        
                         <option value="fa-life-bouy">&#xf1cd; life-bouy
                        </option>
                        
                         <option value="fa-life-buoy">&#xf1cd; life-buoy
                        </option>
                        
                         <option value="fa-life-ring">&#xf1cd; life-ring
                        </option>
                        
                         <option value="fa-life-saver">&#xf1cd; life-saver
                        </option>
                        
                         <option value="fa-lightbulb-o">&#xf0eb; lightbulb-o
                        </option>
                        
                         <option value="fa-line-chart">&#xf201; line-chart
                        </option>
                        
                         <option value="fa-link">&#xf0c1; link
                        </option>
                        
                         <option value="fa-linkedin">&#xf0e1; linkedin
                        </option>
                        
                         <option value="fa-linkedin-square">&#xf08c; linkedin-square
                        </option>
                        
                         <option value="fa-linux">&#xf17c; linux
                        </option>
                        
                         <option value="fa-list">&#xf03a; list
                        </option>
                        
                         <option value="fa-list-alt">&#xf022; list-alt
                        </option>
                        
                         <option value="fa-list-ol">&#xf0cb; list-ol
                        </option>
                        
                         <option value="fa-list-ul">&#xf0ca; list-ul
                        </option>
                        
                         <option value="fa-location-arrow">&#xf124; location-arrow
                        </option>
                        
                         <option value="fa-lock">&#xf023; lock
                        </option>
                        
                         <option value="fa-long-arrow-down">&#xf175; long-arrow-down
                        </option>
                        
                         <option value="fa-long-arrow-left">&#xf177; long-arrow-left
                        </option>
                        
                         <option value="fa-long-arrow-right">&#xf178; long-arrow-right
                        </option>
                        
                         <option value="fa-long-arrow-up">&#xf176; long-arrow-up
                        </option>
                        
                         <option value="fa-magic">&#xf0d0; magic
                        </option>
                        
                         <option value="fa-magnet">&#xf076; magnet
                        </option>
                        
                         <option value="fa-mail-forward">&#xf064; mail-forward
                        </option>
                        
                         <option value="fa-mail-reply">&#xf112; mail-reply
                        </option>
                        
                         <option value="fa-mail-reply-all">&#xf122; mail-reply-all
                        </option>
                        
                         <option value="fa-male">&#xf183; male
                        </option>
                        
                         <option value="fa-map-marker">&#xf041; map-marker
                        </option>
                        
                         <option value="fa-maxcdn">&#xf136; maxcdn
                        </option>
                        
                         <option value="fa-meanpath">&#xf20c; meanpath
                        </option>
                        
                         <option value="fa-medkit">&#xf0fa; medkit
                        </option>
                        
                         <option value="fa-meh-o">&#xf11a; meh-o
                        </option>
                        
                         <option value="fa-microphone">&#xf130; microphone
                        </option>
                        
                         <option value="fa-microphone-slash">&#xf131; microphone-slash
                        </option>
                        
                         <option value="fa-minus">&#xf068; minus
                        </option>
                        
                         <option value="fa-minus-circle">&#xf056; minus-circle
                        </option>
                        
                         <option value="fa-minus-square">&#xf146; minus-square
                        </option>
                        
                         <option value="fa-minus-square-o">&#xf147; minus-square-o
                        </option>
                        
                         <option value="fa-mobile">&#xf10b; mobile
                        </option>
                        
                         <option value="fa-mobile-phone">&#xf10b; mobile-phone
                        </option>
                        
                         <option value="fa-money">&#xf0d6; money
                        </option>
                        
                         <option value="fa-moon-o">&#xf186; moon-o
                        </option>
                        
                         <option value="fa-mortar-board">&#xf19d; mortar-board
                        </option>
                        
                         <option value="fa-music">&#xf001; music
                        </option>
                        
                         <option value="fa-navicon">&#xf0c9; navicon
                        </option>
                        
                         <option value="fa-newspaper-o">&#xf1ea; newspaper-o
                        </option>
                        
                         <option value="fa-openid">&#xf19b; openid
                        </option>
                        
                         <option value="fa-outdent">&#xf03b; outdent
                        </option>
                        
                         <option value="fa-pagelines">&#xf18c; pagelines
                        </option>
                        
                         <option value="fa-paint-brush">&#xf1fc; paint-brush
                        </option>
                        
                         <option value="fa-paper-plane">&#xf1d8; paper-plane
                        </option>
                        
                         <option value="fa-paper-plane-o">&#xf1d9; paper-plane-o
                        </option>
                        
                         <option value="fa-paperclip">&#xf0c6; paperclip
                        </option>
                        
                         <option value="fa-paragraph">&#xf1dd; paragraph
                        </option>
                        
                         <option value="fa-paste">&#xf0ea; paste
                        </option>
                        
                         <option value="fa-pause">&#xf04c; pause
                        </option>
                        
                         <option value="fa-paw">&#xf1b0; paw
                        </option>
                        
                         <option value="fa-paypal">&#xf1ed; paypal
                        </option>
                        
                         <option value="fa-pencil">&#xf040; pencil
                        </option>
                        
                         <option value="fa-pencil-square">&#xf14b; pencil-square
                        </option>
                        
                         <option value="fa-pencil-square-o">&#xf044; pencil-square-o
                        </option>
                        
                         <option value="fa-phone">&#xf095; phone
                        </option>
                        
                         <option value="fa-phone-square">&#xf098; phone-square
                        </option>
                        
                         <option value="fa-photo">&#xf03e; photo
                        </option>
                        
                         <option value="fa-picture-o">&#xf03e; picture-o
                        </option>
                        
                         <option value="fa-pie-chart">&#xf200; pie-chart
                        </option>
                        
                         <option value="fa-pied-piper">&#xf1a7; pied-piper
                        </option>
                        
                         <option value="fa-pied-piper-alt">&#xf1a8; pied-piper-alt
                        </option>
                        
                         <option value="fa-pinterest">&#xf0d2; pinterest
                        </option>
                        
                         <option value="fa-pinterest-square">&#xf0d3; pinterest-square
                        </option>
                        
                         <option value="fa-plane">&#xf072; plane
                        </option>
                        
                         <option value="fa-play">&#xf04b; play
                        </option>
                        
                         <option value="fa-play-circle">&#xf144; play-circle
                        </option>
                        
                         <option value="fa-play-circle-o">&#xf01d; play-circle-o
                        </option>
                        
                         <option value="fa-plug">&#xf1e6; plug
                        </option>
                        
                         <option value="fa-plus">&#xf067; plus
                        </option>
                        
                         <option value="fa-plus-circle">&#xf055; plus-circle
                        </option>
                        
                         <option value="fa-plus-square">&#xf0fe; plus-square
                        </option>
                        
                         <option value="fa-plus-square-o">&#xf196; plus-square-o
                        </option>
                        
                         <option value="fa-power-off">&#xf011; power-off
                        </option>
                        
                         <option value="fa-print">&#xf02f; print
                        </option>
                        
                         <option value="fa-puzzle-piece">&#xf12e; puzzle-piece
                        </option>
                        
                         <option value="fa-qq">&#xf1d6; qq
                        </option>
                        
                         <option value="fa-qrcode">&#xf029; qrcode
                        </option>
                        
                         <option value="fa-question">&#xf128; question
                        </option>
                        
                         <option value="fa-question-circle">&#xf059; question-circle
                        </option>
                        
                         <option value="fa-quote-left">&#xf10d; quote-left
                        </option>
                        
                         <option value="fa-quote-right">&#xf10e; quote-right
                        </option>
                        
                         <option value="fa-ra">&#xf1d0; ra
                        </option>
                        
                         <option value="fa-random">&#xf074; random
                        </option>
                        
                         <option value="fa-rebel">&#xf1d0; rebel
                        </option>
                        
                         <option value="fa-recycle">&#xf1b8; recycle
                        </option>
                        
                         <option value="fa-reddit">&#xf1a1; reddit
                        </option>
                        
                         <option value="fa-reddit-square">&#xf1a2; reddit-square
                        </option>
                        
                         <option value="fa-refresh">&#xf021; refresh
                        </option>
                        
                         <option value="fa-remove">&#xf00d; remove
                        </option>
                        
                         <option value="fa-renren">&#xf18b; renren
                        </option>
                        
                         <option value="fa-reorder">&#xf0c9; reorder
                        </option>
                        
                         <option value="fa-repeat">&#xf01e; repeat
                        </option>
                        
                         <option value="fa-reply">&#xf112; reply
                        </option>
                        
                         <option value="fa-reply-all">&#xf122; reply-all
                        </option>
                        
                         <option value="fa-retweet">&#xf079; retweet
                        </option>
                        
                         <option value="fa-rmb">&#xf157; rmb
                        </option>
                        
                         <option value="fa-road">&#xf018; road
                        </option>
                        
                         <option value="fa-rocket">&#xf135; rocket
                        </option>
                        
                         <option value="fa-rotate-left">&#xf0e2; rotate-left
                        </option>
                        
                         <option value="fa-rotate-right">&#xf01e; rotate-right
                        </option>
                        
                         <option value="fa-rouble">&#xf158; rouble
                        </option>
                        
                         <option value="fa-rss">&#xf09e; rss
                        </option>
                        
                         <option value="fa-rss-square">&#xf143; rss-square
                        </option>
                        
                         <option value="fa-rub">&#xf158; rub
                        </option>
                        
                         <option value="fa-ruble">&#xf158; ruble
                        </option>
                        
                         <option value="fa-rupee">&#xf156; rupee
                        </option>
                        
                         <option value="fa-save">&#xf0c7; save
                        </option>
                        
                         <option value="fa-scissors">&#xf0c4; scissors
                        </option>
                        
                         <option value="fa-search">&#xf002; search
                        </option>
                        
                         <option value="fa-search-minus">&#xf010; search-minus
                        </option>
                        
                         <option value="fa-search-plus">&#xf00e; search-plus
                        </option>
                        
                         <option value="fa-send">&#xf1d8; send
                        </option>
                        
                         <option value="fa-send-o">&#xf1d9; send-o
                        </option>
                        
                         <option value="fa-share">&#xf064; share
                        </option>
                        
                         <option value="fa-share-alt">&#xf1e0; share-alt
                        </option>
                        
                         <option value="fa-share-alt-square">&#xf1e1; share-alt-square
                        </option>
                        
                         <option value="fa-share-square">&#xf14d; share-square
                        </option>
                        
                         <option value="fa-share-square-o">&#xf045; share-square-o
                        </option>
                        
                         <option value="fa-shekel">&#xf20b; shekel
                        </option>
                        
                         <option value="fa-sheqel">&#xf20b; sheqel
                        </option>
                        
                         <option value="fa-shield">&#xf132; shield
                        </option>
                        
                         <option value="fa-shopping-cart">&#xf07a; shopping-cart
                        </option>
                        
                         <option value="fa-sign-in">&#xf090; sign-in
                        </option>
                        
                         <option value="fa-sign-out">&#xf08b; sign-out
                        </option>
                        
                         <option value="fa-signal">&#xf012; signal
                        </option>
                        
                         <option value="fa-sitemap">&#xf0e8; sitemap
                        </option>
                        
                         <option value="fa-skype">&#xf17e; skype
                        </option>
                        
                         <option value="fa-slack">&#xf198; slack
                        </option>
                        
                         <option value="fa-sliders">&#xf1de; sliders
                        </option>
                        
                         <option value="fa-slideshare">&#xf1e7; slideshare
                        </option>
                        
                         <option value="fa-smile-o">&#xf118; smile-o
                        </option>
                        
                         <option value="fa-soccer-ball-o">&#xf1e3; soccer-ball-o
                        </option>
                        
                         <option value="fa-sort">&#xf0dc; sort
                        </option>
                        
                         <option value="fa-sort-alpha-asc">&#xf15d; sort-alpha-asc
                        </option>
                        
                         <option value="fa-sort-alpha-desc">&#xf15e; sort-alpha-desc
                        </option>
                        
                         <option value="fa-sort-amount-asc">&#xf160; sort-amount-asc
                        </option>
                        
                         <option value="fa-sort-amount-desc">&#xf161; sort-amount-desc
                        </option>
                        
                         <option value="fa-sort-asc">&#xf0de; sort-asc
                        </option>
                        
                         <option value="fa-sort-desc">&#xf0dd; sort-desc
                        </option>
                        
                         <option value="fa-sort-down">&#xf0dd; sort-down
                        </option>
                        
                         <option value="fa-sort-numeric-asc">&#xf162; sort-numeric-asc
                        </option>
                        
                         <option value="fa-sort-numeric-desc">&#xf163; sort-numeric-desc
                        </option>
                        
                         <option value="fa-sort-up">&#xf0de; sort-up
                        </option>
                        
                         <option value="fa-soundcloud">&#xf1be; soundcloud
                        </option>
                        
                         <option value="fa-space-shuttle">&#xf197; space-shuttle
                        </option>
                        
                         <option value="fa-spinner">&#xf110; spinner
                        </option>
                        
                         <option value="fa-spoon">&#xf1b1; spoon
                        </option>
                        
                         <option value="fa-spotify">&#xf1bc; spotify
                        </option>
                        
                         <option value="fa-square">&#xf0c8; square
                        </option>
                        
                         <option value="fa-square-o">&#xf096; square-o
                        </option>
                        
                         <option value="fa-stack-exchange">&#xf18d; stack-exchange
                        </option>
                        
                         <option value="fa-stack-overflow">&#xf16c; stack-overflow
                        </option>
                        
                         <option value="fa-star">&#xf005; star
                        </option>
                        
                         <option value="fa-star-half">&#xf089; star-half
                        </option>
                        
                         <option value="fa-star-half-empty">&#xf123; star-half-empty
                        </option>
                        
                         <option value="fa-star-half-full">&#xf123; star-half-full
                        </option>
                        
                         <option value="fa-star-half-o">&#xf123; star-half-o
                        </option>
                        
                         <option value="fa-star-o">&#xf006; star-o
                        </option>
                        
                         <option value="fa-steam">&#xf1b6; steam
                        </option>
                        
                         <option value="fa-steam-square">&#xf1b7; steam-square
                        </option>
                        
                         <option value="fa-step-backward">&#xf048; step-backward
                        </option>
                        
                         <option value="fa-step-forward">&#xf051; step-forward
                        </option>
                        
                         <option value="fa-stethoscope">&#xf0f1; stethoscope
                        </option>
                        
                         <option value="fa-stop">&#xf04d; stop
                        </option>
                        
                         <option value="fa-strikethrough">&#xf0cc; strikethrough
                        </option>
                        
                         <option value="fa-stumbleupon">&#xf1a4; stumbleupon
                        </option>
                        
                         <option value="fa-stumbleupon-circle">&#xf1a3; stumbleupon-circle
                        </option>
                        
                         <option value="fa-subscript">&#xf12c; subscript
                        </option>
                        
                         <option value="fa-suitcase">&#xf0f2; suitcase
                        </option>
                        
                         <option value="fa-sun-o">&#xf185; sun-o
                        </option>
                        
                         <option value="fa-superscript">&#xf12b; superscript
                        </option>
                        
                         <option value="fa-support">&#xf1cd; support
                        </option>
                        
                         <option value="fa-table">&#xf0ce; table
                        </option>
                        
                         <option value="fa-tablet">&#xf10a; tablet
                        </option>
                        
                         <option value="fa-tachometer">&#xf0e4; tachometer
                        </option>
                        
                         <option value="fa-tag">&#xf02b; tag
                        </option>
                        
                         <option value="fa-tags">&#xf02c; tags
                        </option>
                        
                         <option value="fa-tasks">&#xf0ae; tasks
                        </option>
                        
                         <option value="fa-taxi">&#xf1ba; taxi
                        </option>
                        
                         <option value="fa-tencent-weibo">&#xf1d5; tencent-weibo
                        </option>
                        
                         <option value="fa-terminal">&#xf120; terminal
                        </option>
                        
                         <option value="fa-text-height">&#xf034; text-height
                        </option>
                        
                         <option value="fa-text-width">&#xf035; text-width
                        </option>
                        
                         <option value="fa-th">&#xf00a; th
                        </option>
                        
                         <option value="fa-th-large">&#xf009; th-large
                        </option>
                        
                         <option value="fa-th-list">&#xf00b; th-list
                        </option>
                        
                         <option value="fa-thumb-tack">&#xf08d; thumb-tack
                        </option>
                        
                         <option value="fa-thumbs-down">&#xf165; thumbs-down
                        </option>
                        
                         <option value="fa-thumbs-o-down">&#xf088; thumbs-o-down
                        </option>
                        
                         <option value="fa-thumbs-o-up">&#xf087; thumbs-o-up
                        </option>
                        
                         <option value="fa-thumbs-up">&#xf164; thumbs-up
                        </option>
                        
                         <option value="fa-ticket">&#xf145; ticket
                        </option>
                        
                         <option value="fa-times">&#xf00d; times
                        </option>
                        
                         <option value="fa-times-circle">&#xf057; times-circle
                        </option>
                        
                         <option value="fa-times-circle-o">&#xf05c; times-circle-o
                        </option>
                        
                         <option value="fa-tint">&#xf043; tint
                        </option>
                        
                         <option value="fa-toggle-down">&#xf150; toggle-down
                        </option>
                        
                         <option value="fa-toggle-left">&#xf191; toggle-left
                        </option>
                        
                         <option value="fa-toggle-off">&#xf204; toggle-off
                        </option>
                        
                         <option value="fa-toggle-on">&#xf205; toggle-on
                        </option>
                        
                         <option value="fa-toggle-right">&#xf152; toggle-right
                        </option>
                        
                         <option value="fa-toggle-up">&#xf151; toggle-up
                        </option>
                        
                         <option value="fa-trash">&#xf1f8; trash
                        </option>
                        
                         <option value="fa-trash-o">&#xf014; trash-o
                        </option>
                        
                         <option value="fa-tree">&#xf1bb; tree
                        </option>
                        
                         <option value="fa-trello">&#xf181; trello
                        </option>
                        
                         <option value="fa-trophy">&#xf091; trophy
                        </option>
                        
                         <option value="fa-truck">&#xf0d1; truck
                        </option>
                        
                         <option value="fa-try">&#xf195; try
                        </option>
                        
                         <option value="fa-tty">&#xf1e4; tty
                        </option>
                        
                         <option value="fa-tumblr">&#xf173; tumblr
                        </option>
                        
                         <option value="fa-tumblr-square">&#xf174; tumblr-square
                        </option>
                        
                         <option value="fa-turkish-lira">&#xf195; turkish-lira
                        </option>
                        
                         <option value="fa-twitch">&#xf1e8; twitch
                        </option>
                        
                         <option value="fa-twitter">&#xf099; twitter
                        </option>
                        
                         <option value="fa-twitter-square">&#xf081; twitter-square
                        </option>
                        
                         <option value="fa-umbrella">&#xf0e9; umbrella
                        </option>
                        
                         <option value="fa-underline">&#xf0cd; underline
                        </option>
                        
                         <option value="fa-undo">&#xf0e2; undo
                        </option>
                        
                         <option value="fa-university">&#xf19c; university
                        </option>
                        
                         <option value="fa-unlink">&#xf127; unlink
                        </option>
                        
                         <option value="fa-unlock">&#xf09c; unlock
                        </option>
                        
                         <option value="fa-unlock-alt">&#xf13e; unlock-alt
                        </option>
                        
                         <option value="fa-unsorted">&#xf0dc; unsorted
                        </option>
                        
                         <option value="fa-upload">&#xf093; upload
                        </option>
                        
                         <option value="fa-usd">&#xf155; usd
                        </option>
                        
                         <option value="fa-user">&#xf007; user
                        </option>
                        
                         <option value="fa-user-md">&#xf0f0; user-md
                        </option>
                        
                         <option value="fa-users">&#xf0c0; users
                        </option>
                        
                         <option value="fa-video-camera">&#xf03d; video-camera
                        </option>
                        
                         <option value="fa-vimeo-square">&#xf194; vimeo-square
                        </option>
                        
                         <option value="fa-vine">&#xf1ca; vine
                        </option>
                        
                         <option value="fa-vk">&#xf189; vk
                        </option>
                        
                         <option value="fa-volume-down">&#xf027; volume-down
                        </option>
                        
                         <option value="fa-volume-off">&#xf026; volume-off
                        </option>
                        
                         <option value="fa-volume-up">&#xf028; volume-up
                        </option>
                        
                         <option value="fa-warning">&#xf071; warning
                        </option>
                        
                         <option value="fa-wechat">&#xf1d7; wechat
                        </option>
                        
                         <option value="fa-weibo">&#xf18a; weibo
                        </option>
                        
                         <option value="fa-weixin">&#xf1d7; weixin
                        </option>
                        
                         <option value="fa-wheelchair">&#xf193; wheelchair
                        </option>
                        
                         <option value="fa-wifi">&#xf1eb; wifi
                        </option>
                        
                         <option value="fa-windows">&#xf17a; windows
                        </option>
                        
                         <option value="fa-won">&#xf159; won
                        </option>
                        
                         <option value="fa-wordpress">&#xf19a; wordpress
                        </option>
                        
                         <option value="fa-wrench">&#xf0ad; wrench
                        </option>
                        
                         <option value="fa-xing">&#xf168; xing
                        </option>
                        
                         <option value="fa-xing-square">&#xf169; xing-square
                        </option>
                        
                         <option value="fa-yahoo">&#xf19e; yahoo
                        </option>
                        
                         <option value="fa-yelp">&#xf1e9; yelp
                        </option>
                        
                         <option value="fa-yen">&#xf157; yen
                        </option>
                        
                         <option value="fa-youtube">&#xf167; youtube
                        </option>
                        
                         <option value="fa-youtube-play">&#xf16a; youtube-play
                        </option>
                        
                         <option value="fa-youtube-square">&#xf166; youtube-square
                        </option>
                    </select>
                    
                </div><!-- /.tab-pane -->
                
                <!-- /tabs -->
                <div class="tab-pane videoTab" id="video_Tab">
                    
                    <div style="float: right;margin-top: -15px;" id="choose-media-div">
                        <a style="font-size: 12px; cursor: pointer;" class="choose-media-mode"> change media</a>
                    </div>

                    <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "youtube-video-url")%>:</label>
                    
                    <input type="text" class="form-control margin-bottom-20" id="youtubeID" placeholder="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "enter-youtube-video-url")%>" value="">
                    <span id="err-youtube-msg" class="youtubeID" style="font-size: 12px;color:#f05050; display:none;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "validate-video-url")%></span>
                    <p class="text-center or">
                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "or-cap")%></span>
                    </p>
                    
                    <label><%=LanguageUtil.getLocaleJSONValue(localeJSON, "vimeo-video-url")%>:</label>
                    
                    <input type="text" class="form-control margin-bottom-20" id="vimeoID" placeholder="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "enter-vimeo-video-url")%>" value="">
                     <span id="err-vimeo-msg" class="vimeoID" style="font-size: 12px;color:#f05050; display:none;"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "validate-video-url")%></span>
                    <p class="text-center or">
                        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "or-cap")%></span>
                    </p>

                    <label class="agile-tooltip" data-placement="right" data-original-title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "recorded-video-tooltip")%>">
                        <%=LanguageUtil.getLocaleJSONValue(localeJSON, "recorded-video")%>:
                     <sup style="font-size: 9px;color: #337ab7;">?</sup>
                    </label>
                    
                    <select id="videoRecordId" name="videoRecordlist" class="btn btn-default btn-embossed btn-block margin-bottom-20">
                        <option value="">Select Video</option>
                    </select>
                    
                </div><!-- /.tab-pane -->
            
            </div> <!-- /tab-content -->
            
            <div class="alert alert-success" style="display: none;" id="detailsAppliedMessage">
                <button class="close fui-cross" type="button" id="detailsAppliedMessageHide"></button>
                <%=LanguageUtil.getLocaleJSONValue(localeJSON, "changes-applied")%>            </div>
                                
            <div class="margin-bottom-5">
                <button type="button" class="btn btn-primary btn-embossed btn-sm btn-block" id="saveStyling"><span class="fui-check-inverted"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "changes-apply")%></button>
            </div>
                        
            <div class="sideButtons clearfix">
                <button type="button" class="btn btn-inverse btn-embossed btn-xs" id="cloneElementButton"><span class="fui-windows"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "clone")%></button>
                <button type="button" class="btn btn-warning btn-embossed btn-xs" id="resetStyleButton" style="display:none;"><i class="fa fa-refresh"></i> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "reset")%></button>
                <button type="button" class="btn btn-danger btn-embossed btn-xs" data-target="#deleteElement" data-toggle="modal" id="removeElementButton"><span class="fui-cross-inverted"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "remove")%></button>
            </div>
                                                    
        </div><!-- /.styleEditor -->
        
        <div id="hidden">
            <iframe src="<%=PAGE_BUILDER_URL%>elements/skeleton.html" id="skeleton"></iframe>
        </div>
    
        <!-- modals -->        
        
        <div class="modal fade imageModal" id="imageModal" tabindex="-1" role="dialog" aria-hidden="true">
                                                    
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "CLOSE")%></span></button>
                        <h4 class="modal-title" id="myModalLabel"><span class="fui-upload"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-img")%></h4>
                    </div>
                    <div class="modal-body">
                                            
                        <div class="loader" style="display: none;">
                            <img src="<%=S3_STATIC_FILES_URL%>images/loading.gif" alt="Loading...">
                            <%=LanguageUtil.getLocaleJSONValue(localeJSON, "uploading-img")%>...                        </div>
                                            
                        <div class="modal-alerts">
                            
                        </div>
                                                                
                        <div class="modal-body-content">
                            
                            <ul class="nav nav-tabs nav-append-content">
                                <!-- <li><a href="#myImagesTab">My Images</a></li> -->
                                <li id="uploadTabLI" class="active"><a href="#uploadTab"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "preview")%></a></li>
                                <!-- <li><a href="#adminImagesTab">Other Images</a></li> -->                            </ul> <!-- /tabs -->
                            
                            <div class="tab-content">
                            
                                <div class="tab-pane" id="myImagesTab">
                                                                        
                                                                            
                                        <!-- Alert Info -->
                                        <div class="alert alert-info">
                                            <button type="button" class="close fui-cross" data-dismiss="alert"></button>
                                            <%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-img-info")%>                                        </div>
                                        
                                                                                                
                                </div><!-- /.tab-pane -->
                                
                                <div class="tab-pane active" id="uploadTab">
                                    
                                    <form id="imageUploadForm" action="<%=MAIN_URL%>">
                                    
                                        <div class="fileinput fileinput-new" data-provides="fileinput">
                                            <div class="fileinput-preview thumbnail" data-trigger="fileinput"></div>
                                             <button type="button" class="btn btn-primary btn-embossed btn-wide upload  fileinput-exists" id="uploadImageButton"><span class="fui-upload"></span> 
                                                <%=LanguageUtil.getLocaleJSONValue(localeJSON, 
                                                "upload")%></button>
                                            <div style="float:right;">
                                                <span class="btn btn-primary btn-embossed btn-file">
                                                    <span class="fileinput-new"><span class="fui-image"></span>&nbsp;&nbsp;<%=LanguageUtil.getLocaleJSONValue(localeJSON, "select-img")%></span>
                                                    <span class="fileinput-exists"><span class="fui-gear"></span>&nbsp;&nbsp;<%=LanguageUtil.getLocaleJSONValue(localeJSON, "change")%></span>
                                                    <input type="file" name="imageFile" id="imageFile">
                                                </span>
                                            </div>
                                        </div>
                                    
                                    </form>
                                    
                                   
                                
                                </div><!-- /.tab-pane -->
                            
                                <div class="tab-pane" id="adminImagesTab">
                                    
                                    <div class="images masonry-3" id="adminImages">
                                    
                                                                            
                                        <!-- <div class="image">
                                                                    
                                            <div class="imageWrap">
                                                <img src="<%=S3_STATIC_FILES_URL%>elements/images/autumn-507555.jpg">
                                                <div class="ribbon-wrapper-red"><div class="ribbon-red">Admin</div></div>
                                            </div>
                                            
                                                                                        
                                            <div class="buttons clearfix">
                                                <button type="button" class="btn btn-info btn-embossed btn-block btn-sm useImage" data-url="images/autumn-507555.jpg"><span class="fui-export"></span> Insert Image</button>
                                            </div>
                                        
                                        </div> -->
                                                                                
                                                                                                    
                                    </div><!-- /.adminImages -->
                                    
                                </div><!-- /.tab-pane -->
                                    
                            </div> <!-- /tab-content -->
                            
                        </div>
                                                
                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
                        
        </div><!-- /.modal -->
        
        
        <!-- delete single block popup -->
        <div class="modal fade small-modal" id="deleteBlock" tabindex="-1" role="dialog" aria-hidden="true">
                        
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                    
                        <%=LanguageUtil.getLocaleJSONValue(localeJSON, "delete-block-confirm")%>                        
                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                        <button type="button" type="button" class="btn btn-primary btn-embossed" id="deleteBlockConfirm"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "delete")%></button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
                    
        </div><!-- /.modal -->
                
        <!-- reset block popup -->
        <div class="modal fade small-modal" id="resetBlock" tabindex="-1" role="dialog" aria-hidden="true">
                        
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                    
                        <p>
                           <%=LanguageUtil.getLocaleJSONValue(localeJSON, "reset-block-confirm")%>                       </p>
                        <p>
                            <%=LanguageUtil.getLocaleJSONValue(localeJSON, "all-changed-destroyed")%>                        </p>
                        
                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                        <button type="button" type="button" class="btn btn-primary btn-embossed" id="resetBlockConfirm"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "reset-block")%></button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
                    
        </div><!-- /.modal -->
        
        <!-- delete page popup -->
        <div class="modal fade small-modal" id="deletePage" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                    
                        <p>
                            <%=LanguageUtil.getLocaleJSONValue(localeJSON, "delete-page-confirm")%>                        </p>
                        
                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal" id="deletePageCancel"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                        <button type="button" type="button" class="btn btn-primary btn-embossed" id="deletePageConfirm"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "delete-page")%></button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
                    
        </div><!-- /.modal -->
        
        <!-- delete elemnent popup -->
        <div class="modal fade small-modal" id="deleteElement" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                    
                        <p>
                            <%=LanguageUtil.getLocaleJSONValue(localeJSON, "delete-element-info")%>                        </p>
                        
                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal" id="deletePageCancel"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                        <button type="button" type="button" class="btn btn-primary btn-embossed" id="deleteElementConfirm"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "delete-block")%></button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
                    
        </div><!-- /.modal -->
        
        <div id="loader">
            <div>
                <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                <br/>
                <span>Loading...</span>
            </div>
        </div>
    
    </div>
    
    
    <!-- modals -->
    
    <div class="modal fade pageSettingsModal" id="pageSettingsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        
        <div class="modal-dialog modal-lg">
                
            <div class="modal-content">
            
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "CLOSE")%></span></button>
                    <h4 class="modal-title" id="myModalLabel"><span class="fui-gear"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-settings")%> <span class="hidden text-primary pName">index.html</span></h4>
                </div>
                
                <div class="modal-body">
                
                    <div class="loader" style="display: none;">
                        <img src="<%=S3_STATIC_FILES_URL%>images/loading.gif" alt="Loading...">
                        <%=LanguageUtil.getLocaleJSONValue(localeJSON, "saving-page-changes")%>...                    </div>
                    
                    <div class="modal-alerts"></div>
                
                    <form class="form-horizontal" role="form" id="pageSettingsForm" action="<%=MAIN_URL%>">

  <input type="hidden" name="siteID" id="siteID" value="">
  <input type="hidden" name="pageID" id="pageID" value="">
  <input type="hidden" name="pageName" id="pageName" value="">
  
  <div class="optionPane">
            
    <div class="form-group">
      <label for="name" class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-title")%>:</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="pageData_title" name="pageData_title" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-title-sm")%>' value="">
      </div>
    </div>
    
    <div class="form-group">
      <label for="name" class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-meta-desc")%>:</label>
      <div class="col-sm-9">
        <textarea class="form-control" id="pageData_metaDescription" name="pageData_metaDescription" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-meta-desc-sm")%>'></textarea>
      </div>
    </div>
    
    <div class="form-group">
      <label for="name" class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-meta-keywords")%>:</label>
      <div class="col-sm-9">
        <textarea class="form-control" id="pageData_metaKeywords" name="pageData_metaKeywords" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-meta-keywords-sm")%>'></textarea>
      </div>
    </div>
    
    <div class="form-group">
      <label for="name" class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-header")%>:</label>
      <div class="col-sm-9">
        <textarea class="form-control" id="pageData_headerIncludes" name="pageData_headerIncludes" rows="7" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-header-inf")%>' <head> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "head-section")%>></textarea>
      </div>
    </div>
    
    <div class="form-group">
      <label for="name" class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-css")%>:</label>
      <div class="col-sm-9">
        <textarea class="form-control" id="pageData_headerCss" name="pageData_headerCss" rows="7" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-css-applied")%>'></textarea>
      </div>
    </div>

    <div class="form-group">
      <label for="name" class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-js")%>:</label>
      <div class="col-sm-9">
        <textarea class="form-control" id="pageData_headerJs" name="pageData_headerJs" rows="7" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-script-applied")%>'></textarea>
      </div>
    </div>
    
  </div><!-- /.optionPane -->
  
</form>                                
                </div><!-- /.modal-body -->
                                
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal"><span class="fui-cross"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                    <button type="button" class="btn btn-primary btn-embossed" id="pageSettingsSubmittButton"><span class="fui-check"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "save-settings")%></button>
                </div>
                
            </div><!-- /.modal-content -->
            
        </div><!-- /.modal-dialog -->
                
    </div><!-- /.modal -->
    
    
    <div class="modal fade errorModal" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        
        <div class="modal-dialog">
            
            <div class="modal-content">
                
                <div class="modal-body">
                                
                </div><!-- /.modal-body -->
                                
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><span class="fui-cross"></span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "CLOSE")%></button>
                </div>
                
            </div><!-- /.modal-content -->
            
        </div><!-- /.modal-dialog -->
                
    </div><!-- /.modal -->
    
    <div class="modal fade landingPageNameModal" id="landingPageNameModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        
        <div class="modal-dialog">
            
            <div class="modal-content">

            <form id="lpPageNameForm">
                                        
                <div class="modal-body">
  
                  <div class="" style="padding: 30px 20px;">
                            
                    <div class="form-group">
                      <label for="name" class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-title")%>:</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" id="lppagename" name="lppagename" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "page-name")%>' value="" required oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);">
                      </div>
                    </div>
                    
                  </div>
                                                                    
                </div><!-- /.modal-body -->
                                
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary btn-embossed" id="lpPageNameSaveButton"><span class="fui-check"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "save")%></button>
                </div>

            </form>
                
            </div><!-- /.modal-content -->
            
        </div><!-- /.modal-dialog -->
                
    </div><!-- /.modal -->


    <div class="modal fade successModal" id="successModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        
        <div class="modal-dialog">
            
            <div class="modal-content">
                                        
                <div class="modal-body">
                                                                    
                </div><!-- /.modal-body -->
                                
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><span class="fui-cross"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "CLOSE")%></button>
                </div>
                
            </div><!-- /.modal-content -->
            
        </div><!-- /.modal-dialog -->
                
    </div><!-- /.modal -->
       <!-- /.modal for next step instruction -->
    <div class="modal fade instructionModal" id="instructionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

        <div class="modal-dialog" style="max-width: 500px;">
            
            <div class="modal-content">
                
                <div class="modal-header">
                    <button class="close" data-dismiss="modal" style="margin-top: 3px; font-size: 20px;">&times;</button>
                    <h3 class="modal-title">
                        <label id="success-msg" style="margin:-5px -1px; color: green;">
                            <%=LanguageUtil.getLocaleJSONValue(localeJSON, "saved-successfully")%>! 
                        </label>
                    </h3>
                    <i class="fa fa-arrow-right"></i> 
                    <strong> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "next-action")%> </strong> 
                     <%=LanguageUtil.getLocaleJSONValue(localeJSON, "publish-the-landing-page")%>
                    
                </div>      
                <div class="modal-body" style="text-align: center;">
                    <fieldset> 
                        <div class="control-group form-group">
                            <div class="col-xs-6 col-sm-7 text-center">
                                <a  class="lp-view-link agile-link" target="_blank" style="color:#34495e;">
                                    <i class="fui-window" style="font-size:30px;"></i><br> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "preview")%>
                                </a>
                            </div>
                            <div class="col-xs-6 col-sm-2 text-center" style="margin-top:2px;">
                                <a class="lp-publish-link agile-link" target="_blank" style="color:#34495e;">
                                    <i class="fui-upload" style="font-size:30px;" ></i><br><%=LanguageUtil.getLocaleJSONValue(localeJSON, "publish")%>
                                </a>
                            </div>
                        </div>  
                    </fieldset>             
                                                                    
                </div><!-- /.modal-body -->
                                
                <div class="modal-footer" style="padding:15px 22px;">
                    <div class="checkbox col-xs-8 col-sm-6" style="margin-top:4px; margin-bottom:4px;">
                        <label class="pull-left"  style="padding-left: 0px; margin-top: -6px;"><input type="checkbox" id="lp-instruct-popup" value="false"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "dont-show-me-again")%></label>
                    </div>
                    <a class="close-popup agile-link" style="display: inline-block;margin-top: 3px;" href= "<%=MAIN_URL%>#landing-pages"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "back-landingpage")%></a>
                </div>
                
            </div><!-- /.modal-content -->
            
        </div><!-- /.modal-dialog -->
                
    </div><!-- /.modal -->

    <div class="modal fade chooseMedia" id="chooseMediaModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 500px;">            
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                    <h5 class="modal-title" id="myModalLabel">Choose Media</h5>
                </div>
                <div class="modal-body" style="padding: 25px;">
                    <div class="col-md-6">Please choose one media type </div>
                    <select name="choose-media" id="choose-media-option" class="form-control" style="width: 50%;margin-top: -7px;">
                        <option value="form">Form</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>                    
                </div>
                <div class="modal-footer" style="padding: 15px;">
                    <button type="button" id="apply-media" class="btn btn-primary" data-dismiss="modal">Apply</button>
                </div>
            </div>
        </div> <!-- /.modal-dialog -->

    </div>    
    
    <div class="modal fade backModal" id="backModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        
        <div class="modal-dialog">
            
            <div class="modal-content">
                
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "CLOSE")%></span></button>
                    <h4 class="modal-title" id="myModalLabel"> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "are-you-sure")%>?</h4>
                </div>
                        
                <div class="modal-body">
                                
                    <p>
                        <%=LanguageUtil.getLocaleJSONValue(localeJSON, "back-modal-info")%>                    </p>
                                    
                </div><!-- /.modal-body -->
                                
                <div class="modal-footer">
                    <button type="button" class="btn btn-inverse" data-dismiss="modal"><span class="fui-cross"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "stay-on-the-page")%></button>
                    <a href="<%=MAIN_URL%>#landing-pages" class="btn btn-primary btn-embossed" id="leavePageButton"><span class="fui-check"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "leave-the-page")%></a>
                </div>
                
            </div><!-- /.modal-content -->
            
        </div><!-- /.modal-dialog -->
                
    </div><!-- /.modal -->
    
    
    <!-- edit content popup -->
    <div class="modal fade" id="editContentModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                
                    <textarea id="contentToEdit"></textarea>
                    
                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                    <button type="button" type="button" class="btn btn-primary btn-embossed" id="updateContentInFrameSubmit"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "update-content")%></button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
                
    </div><!-- /.modal -->
    
    <!-- preview popup -->
    <div class="modal fade" id="previewModal" tabindex="-1" role="dialog" aria-hidden="true">
        
        <form action="<%=MAIN_URL%>landing/<%=pageId%>" target="_blank" id="markupPreviewForm" method="get" class="form-horizontal">
        
        <!-- <input type="hidden" name="markup" value="" id="markupField"> -->
        
        <div class="modal-dialog">
            
            <div class="modal-content">
                
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "CLOSE")%></span></button>
                    <h4 class="modal-title" id="myModalLabel"><span class="fui-window"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "site-preview")%></h4>
                </div>
                
                <div class="modal-body">
                
                    <p>
                        <%=LanguageUtil.getLocaleJSONValue(localeJSON, "preview-saved-info")%>                    </p>
                    
                </div><!-- /.modal-body -->
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-embossed" data-dismiss="modal"><span class="fui-cross"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "cancel-and-close")%></button>
                    <button type="submit" class="btn btn-primary btn-embossed"><span class="fui-export"></span> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "preview-changes")%></button>
                </div>
                
            </div><!-- /.modal-content -->
            
        </div><!-- /.modal-dialog -->
            
        </form> 
            
    </div><!-- /.modal -->
        
    <div class="sandboxes" id="sandboxes" style="display: none"></div>
  
  <!-- Load JS here for greater good =============================-->
<script>

function showAgileCRMForm(formJson,formHolderId) { 
    var iframe="";
    $("iframe").each(function(i) { 
         if($("iframe")[i].hasAttribute('data-originalurl')){
            var check_agileform=$("iframe")[i].getAttribute('data-originalurl');
            if(check_agileform.includes(window.current_agileform) || (window.current_agileform == null && (check_agileform.includes("agileform") || check_agileform.includes("header10")))){
                var iframe=$("iframe")[i]; 
                var iframe_id=iframe.getAttribute("id");
                var replace_form_class=$('#'+iframe_id).contents().find('.agile_crm_form_embed');
                try{
                if($('#'+iframe_id).contents().find('#agileform').size()!==0 || (check_agileform.includes("header10") && $('#'+iframe_id).contents().find('#agileform_div')!==0  && replace_form_class.length===0)){
                    if(window.current_agileform!=null){
                        $('#'+iframe_id).contents().find('#agileform_div').empty();
                        var div = $("<div class='agile_crm_form_embed' id='"+window.CURRENT_AGILE_DOMAIN+"_"+formJson.id+"' ></div>");
                         div.html(formJson.formHtml); 
                        $('#'+iframe_id).contents().find('#agileform_div').append(div);
                        //$('#'+iframe_id).contents().find('#agileform_div').innerHTML=div;
                        }            
                    return;
                } 
                else {            
                    if(window.current_agileform!=null){
                        replace_form_class.attr("id",window.CURRENT_AGILE_DOMAIN+"_"+formJson.id); 
                        replace_form_class.html(formJson.formHtml);
                    }  
                    else if(replace_form_class.attr("id").includes(formJson.id)){
                        replace_form_class.html(formJson.formHtml);
                    }                    
                    return;
                }         
                }catch(err){}   
            }
         }
    });
}
</script>
    <script src="<%=BUILD_PATH%>js/builder.min.js?v=<%=AGILE_VERSION%>" charset="utf-8"></script>
    <script src="/locales/html5/localize.js?v=<%=AGILE_VERSION%>" charset="utf-8"></script>
<script>
function _agile_get_locale_val(key){
    return _AGILE_LOCALE_JSON[key];
}
</script>
  </body>
</html>
