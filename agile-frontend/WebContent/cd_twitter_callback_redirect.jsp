<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Please Wait</title>

<script type="text/javascript" src="lib/jquery.min.js"></script>

<script type="text/javascript">

$(function()
{	
	var referral_type = "<%=request.getParameter("referral_type")%>";
 	var token = "<%=request.getParameter("token")%>";
	var tokenSecret = "<%=request.getParameter("tokenSecret")%>";
	var account = "<%=request.getParameter("account")%>";
	
	// Fetches profile image url
	var profileImgUrl = "<%=request.getParameter("profileImgUrl")%>";
	if(referral_type != null && referral_type != "null")
		window.opener.trackReferrals(referral_type); 
	else
		window.opener.popupTwitterCallback(token, tokenSecret, account, profileImgUrl);
	window.close();
});


</script>

</head>


<body>

Please wait, <%=request.getParameter("account")%>

</body>
</html>