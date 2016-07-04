<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Form</title>
</head>
<body style="background-color:rgba(0,0,0,.075);">
 <div id="agileFormHolder" style="margin:0 auto;width:450px">
<%=(String)request.getAttribute("formHtml") %>  
 <a class="powertiny" href="http://www.agilecrm.com/" title="Powered by Agile" style="display:block !important;visibility:visible !important;text-indent:0 !important;position:relative !important;height:auto !important;width:95px !important;overflow:visible !important;text-decoration:none;cursor:pointer !important;margin:0 auto !important">
<img class="w-full" src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container" height="30" width="113" style="margin-left: -24px;">
<b style="font-size: 12px;color: #1a1a1a;font-weight: 100;padding:12px">Powered</b>
</a>
<style>
.theme1 legend,.theme2 legend,.theme3 legend,.theme4 legend{
margin-left: -15px;
width: 418px;
padding: 15px;
}
.theme4 legend{
color:#fff;background-color:#6c77c0;
}
.theme3 legend{
color:#fff;background-color:#fa4a86;
}
.theme2 legend{
color:#fff;background-color:#f0ad4e;
}
.theme1 legend{
color:#fff;background-color:#74cfae;
}
@-moz-document url-prefix(){
.theme1 legend,.theme2 legend,.theme3 legend,.theme4 legend{
margin-left: -12px !important;
}
}
form{
border:1px solid #ccc;
background-color:white;
}
</style>
 </div>
</body>
</html>