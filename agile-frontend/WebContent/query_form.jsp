<html lang="en">
<head>
<meta http-equiv="content-type" content="text/html;charset=utf-8" />
<title>Popup</title>
<link
  href="https://fonts.googleapis.com/css?family=Varela:400|Montserrat:700"
  rel="stylesheet" type="text/css">
<style type="text/css">
body {
  background: #fff;
  width: 310px;
  height: 210px;
}
#popup {
  background: #FCFCFC;;
    border: 1px solid #f6f6f6;
  border-radius: 5px 5px 0 0;
  color: #333 !important;
  font: 13px/19px "Varela", Arial, Helvetica, sans-serif !important;
  letter-spacing: 0;
  width: 302px;
  position: fixed;
  bottom: 0;
}
#popup-body {
  border-radius: 8px;
  margin: 25px;
  padding: 20px 20px 20px;
  position: relative;
}
#popup-close {
  color: #848484;
  cursor: pointer;
  font: 28px/28px Arial, Helvetica, sans-serif !important;
  opacity: .6;
  position: absolute;
  right: 15px;
  top: 8px;
  display: none;
}
#popup-close:hover {
  opacity: 1;
}
#popup-title {
  color: #505653 !important;
  font: bold 20px/24px "Montserrat", Arial, Helvetica,
    sans-serif !important;
    padding-top: 5px;
}
#popup-body p {
  margin: 15px 0;
}
#popup-content p:first-child {
    font-size: 11px!important;
  margin-bottom: 20px;
  line-height: 1.5;
}
#popup-content button:hover {
  
  background: rgba(23, 174, 217, 0.43);
}
#popup-footer {
  color: #fff !important;
  font: bold 10px/10px "Montserat", Arial, Helvetica,
    sans-serif !important;
  letter-spacing: 1px;
  padding: 8px;
  text-align: center;
  text-transform: uppercase;
  display: none;
}
#popup-footer a {
  color: #fff;
}
#popup-content {
   word-wrap : break-word;
}
.m-t-sm{
  margin-top: 10px!important;
  height: 5px;
} .m-b-sm{
margin-bottom: 5px!important;
}
#popup-content button {
  background: #17aed9;
  border: 0;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font: bold 13px/19px "Montserat", Arial, Helvetica,
    sans-serif !important;
  padding: 3px 12px;
  text-decoration: none;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;
    display: block;
    box-sizing: border-box;
    text-align: center;
    font-size: 15px!important;
}
</style>
</head>
<body>
<div id="opened">
<div id="popup">
<div id="popup-body">
<div id="popup-title">Support</div>
<div id="popup-content">
<p>How can we help you ?</p>
<button onclick="parent._agile_help_element(document.getElementById('agile-queryform'));">Support</button></div>
<div id="popup-close">x</div>
</div>
<div id="popup-footer">Powered by <a href="https://www.agilecrm.com" target="_blank">AGILE CRM</a></div>
</div>
</div>
</body>
<script type="text/html" id="agile-queryform">
<!DOCTYPE html>
<html>
<body>
<form   action="querysubmit" method="post"  onsubmit="return parent._agile_checkField(this);">
<div class="query-form-div">
<header class="form-header">
<div class="header-div">
<span class="label-header" >Leave us a message  
<a class="close-tag" onclick="parent._agile_closeQuery(this);">&times;</a>
</span>
</div>
</header>
<div class="form-content ">
<div class="form-body">
<label class="name-field">
<div class="name-div">Your name</div>
<input value="" name="name" type="text" id="name">
</label>
<br><br>
<label class="email-field">
<div class="email-div">Email*</div>
<input value="" name="email" type="text" id="email" onkeyup="parent._agile_disableErrorField(this);" onblur="parent._agile_invalidEmail(this);">
<p id="wrong-email"></p>
</label>
<br><br>
<label class="query-field">
<div class="query-div">How can we help you?*</div>
<textarea id="querytext" name="querytext" onkeyup="parent._agile_disableErrorField(this);"></textarea></label>
</div>
<br>
<footer>
<p id="message"></p>
<button value="Submit" name="submit" type="submit" id="agile_submit" >Submit</button
</footer>
</div>
</form>
<style type="text/css">
.query-form-div{
border-radius: .66667rem;
overflow: hidden!important;
width: 95%;
right: 10px;
bottom: 10px;
position: fixed;
border: solid 1px #ddd;
}
.form-header{
background: #f8f8f8;
border-bottom: .09167rem solid #ddd;
padding-top: .4rem!important;
padding-bottom: 1rem!important;
padding-left: 1.66667rem!important;
padding-right: 1.66667rem!important;
}
.label-header{
margin-left: 85px;
font-weight: 700;
font-size: 1rem;
font-family: Montserrat, Arial, Helvetica, sans-serif;
}
.form-header .header-div a.close-tag{
margin-left: 64px;
font-size: 23px;
color: #999;
font-weight: bold;
padding: 0;
cursor: pointer;
background: transparent;
border: 0;
}
.header-div{
line-height: .8;
text-align: center;
}
.form-content{
padding-top: 1rem!important; 
padding-bottom: 15px;
}
.label-field{
margin-bottom: 1.66667rem;
display: block!important;
cursor: default;
width: 100%;
}
.name-field input , .email-field input {
background: #fff;
border: .09167rem solid #dadada;
border-radius: .33333rem;
padding: .5rem .83333rem .83333rem;
color: #939393;
width: 91%;
}

.query-field textarea{
resize: none;
}
.name-field input:hover , .email-field input:hover , .query-field textarea:hover{
border: .09167rem solid rgba(27, 24, 23, 0.32);
}
.name-field input:hover , .email-field input:hover , .query-field textarea:hover{
outline: none
}
.form-body{
margin-left: 37px;
margin-right: 37px;
}
.name-div, .email-div ,.query-div{
margin-bottom: 3px;
color: #999;
font-weight: 700;
font-size: 14px;
font-family: Montserrat, Arial, Helvetica, sans-serif;
}
.query-field textarea{
background: #fff;
border: .09167rem solid #dadada;
border-radius: .33333rem;
padding: .75rem .83333rem .83333rem;
color: #939393;
width: 91%;
height: 6.5rem;
}
footer #agile_submit{
cursor: pointer;
background-color: #17aed9 !important;
margin-left: 272px;
border: none;
border-radius: .33333rem;
padding: 0.7rem 1rem;
}
#message {
margin-left: 35px;
display: inline;
width: 50%;
font-size: 14px;
font-style: italic;
color:#f05050;
display: none;
}
#wrong-email{
margin-left: 3px;
display: inline;
width: 50%;
font-size: 14px;
font-style: italic;
color:#f05050;
display: none;
}
</style>
</body>
</html>
</script>
</html>