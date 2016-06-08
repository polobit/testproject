<!DOCTYPE html>
<html>

<body>
<form action="querysubmit" method= "post" onsubmit="return checkField(this);">
<div class="query-form-div">
<header class="form-header">
<div class="header-div">
<span class="label-header" >Leave us a message
</span>
<a class="close-tag">x</a>
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
<div class="email-div">Email address*</div>
<input value="" name="email" type="email" id="email" onblur="validateEmail(this);">
<p id="wrong-email" style="color:#f05050; margin-left: 35px; display: inline;width: 50%;"></p>
</label>
<br><br>
<label class="query-field">
<div class="query-div">Query*</div>
<textarea id="querytext" name="querytext" id="query" ></textarea></label>
</div>
<br>
<footer>
<p id="error-message" style="color:#f05050; margin-left: 35px; display: inline;width: 50%;"></p>
<button value="Submit" name="submit" type="submit" >Submit</button
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
font-size: 1rem!important;
}
.form-header .close-tag{
margin-left: 95px;
font-size: 21px;
color: #999;
font-weight: 700;
cursor: pointer;
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
.name-field input , .email-field input , .query-field textarea{
background: #fff;
border: .09167rem solid #dadada;
border-radius: .33333rem;
padding: .5rem .83333rem .83333rem;
color: #939393;
width: 100%;
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
}
.query-field textarea{
background: #fff;
border: .09167rem solid #dadada;
border-radius: .33333rem;
padding: .75rem .83333rem .83333rem;
color: #939393;
width: 100%;
height: 6.5rem;
}
footer button{
cursor: pointer;
border-color: #ccc;
background-color: #fafafa;
color: #333;
padding: 5px 10px 5px 10px;
margin-left: 278px;
}
</style>
<script type="text/javascript">
function checkField(field){
  if(document.getElementById('email').value=="" ){
  document.getElementById('error-message').innerHTML = "please fill this rquired field.";
  return false;
  }
  else if(document.getElementById('query').value==""){
  document.getElementById('error-message').innerHTML = "please fill this rquired field.";
  return false;
  }
}
function validateEmail(email){
  var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  if (!reg.test(email.value)){
  document.getElementById('wrong-email').innerHTML = "please provide a valid email.";
  return false;
  }
}
</script>
</body>

</html>
