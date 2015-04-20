<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Agile CRM</title>
<link rel="stylesheet" type="text/css" href="/css/bootstrap-blue.min.css">
</head>
<body style="background: url(&quot;../img/multilogin-bg.png&quot;) repeat scroll 0 0;overflow-x: hidden;">
<div class="row">
	<div class="col-md-12">
		<div style="margin: 120px auto;width: 500px;box-shadow: 0 0 7px 0px #ddd;padding: 16px 35px;background: #fff;">
			<div>
				<h2 style="text-align: center;">
					<b>The new UI is in Beta</b>
				</h2>
				<br>
			</div>
			<div class="pull-left" style="width: 130px;margin-right: 20px;">
				<img src="img/new-ui-terms.png" alt="">
			</div>
			<div class="pull-left" style="width: calc(100% - 150px);/* text-align: justify; */">
				<p>You may try out the new user interface while it is&nbsp;undergoing improvements. However, there may be some usability or functionality issues, and you are advised not to use it for any critical operations.&nbsp;We appreciate your time and welcome your feedback.</p>&nbsp;
			</div>
			<div class="clearfix"></div>
			<div align="right">
				<input class="btn btn-primary" type="button" value="I understand. Take me there." onclick="navigateTonewUI();">
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
function navigateTonewUI(){
	window.location.href = window.location.origin+'?newui=true';
}
</script>
</body>
</html>