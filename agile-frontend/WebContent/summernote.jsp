<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> 
<title>Agile CRM - HTML Editor</title>

	<%
	    String CSS_PATH = "/";
		//String CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";
	%> 
	 
	<%
		//String LIB_PATH = "//dpm72z3r2fvl4.cloudfront.net/js/";
		String LIB_PATH = "/";
	%>
	
<!-- <script src="//code.jquery.com/jquery-1.9.1.min.js"></script>  -->
<script type="text/javascript" src="<%= LIB_PATH%>lib/jquery.min.js"></script>

<link rel="stylesheet" type="text/css" href="flatfull/css/bootstrap.css">
<!-- <script type="text/javascript" src="//netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min.js"></script> -->
<script type="text/javascript" src="<%= LIB_PATH%>lib/bootstrap.min.js"></script>


<link rel="stylesheet" type="text/css" href="flatfull/css/app.css">
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" />


<link rel="stylesheet" href="js/designer/summernote/summernote.css">
<link rel="stylesheet" href="js/designer/summernote/summernote_custom.css">
<script type="text/javascript" src="js/designer/summernote/summernote.js"></script>
<script type="text/javascript" src="js/designer/summernote/summernote_util.js"></script>
<!-- <script type="text/javascript" src="js/designer/summernote/plugins/customfields.js"></script>
<script type="text/javascript" src="js/designer/summernote/plugins/chart.js"></script> -->
</head>
<body style="background-color:#f0f3f4!important">
<div  >
    <div  >
        <!-- wrapper begins -->
        <div  >
            <div  >
                <!-- Back button style="margin-top: 10px; padding-left: 25px; padding-right: 30px; -->
                <div class = "m-t-sm btn-rounded">
                    <div style="display:inline-block; float: left;" id="navigate-back">
                        <!-- Back link to navigate to history back  -->
                        <a href="#" class="btn btn-default btn-large"> &lt; Back </a>
                    </div>
                    <div style="display: block; float:right;">
                        <a href="#" id="top_save_html" class="btn btn-default btn-large" style="cursor:pointer; font-weight: bold;">Save</a>
                    </div>
                    <div style="clear: both;"></div>
                </div>
                <div id="inline-css-verification-css" style="display: none;">
                <div class="alert danger info-block alert-warning text-black">
                    <div>
                      <i class="icon-warning-sign"></i>
              <strong>Using embedded CSS?
              <!--<a href="#trigger-add" style="float: right;cursor: pointer;font-weight: normal;">How to add trigger?</a>-->
              </strong>
                      <p>Your email appears to be using embedded CSS (as it has a &lt;style&gt;tag defined). Such emails may not render properly in some email clients. We recommend you to convert the CSS styling to Inline styling for better compatibility. Try an  <a style="display:inline" onclick="parent.window.open('http://templates.mailchimp.com/resources/inline-css/')" class="block">online converter</a></p>
                    </div>
                </div>
            </div>
            <div id="inline-css-verification-link" style="display: none;">
                <div class="alert danger info-block alert-warning text-black">
                    <div>
                      <i class="icon-warning-sign"></i>
              <strong>Using external resources?
              <!--<a href="#trigger-add" style="float: right;cursor: pointer;font-weight: normal;">How to add trigger?</a>-->
              </strong>
                      <p>Your email appears to be using some external resources (as it has a &lt;link&gt; tag in it). Such emails may not render properly in some email clients. We recommend removing all external links for CSS or Fonts, for better compatibility.</p>
                    </div>
                </div>
            </div>
            </div>
            <!-- .block_head ends -->
            <div class="block_content center" class="note-editable" >
                <!-- out.println(Util.getHTMLMessageBox("","error", "errormsg")); -->
                <form method="post" action="somepage" class ="m-t-sm btn-rounded">
                    <p id="loading-msg">Loading HTML Editor...</p>
                     <textarea name="content" id='content' rows="30" cols="90" style="display:none;margin-left: 25px;background-color:white
                     "></textarea>
                    <br/>
                    <p>
                    <a href="#" id="top_save_html" class="btn btn-default btn-large" style="cursor:pointer; font-weight: bold;float: right;margin-bottom: 10px;">Save</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</div>

</body>
</html>
