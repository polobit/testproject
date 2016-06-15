<!DOCTYPE html>
<html>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js">  </script>
<body>
<form onsubmit="return checkField(this);">
<div class="query-form-div">
<header class="form-header">
<div class="header-div">
<span class="label-header" >Leave us a message  
<a class="close-tag" onclick="parent.closeQueryIframe();">&times;</a>
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
<input value="" name="email" type="text" id="email" onkeyup="disableErrorField();" onblur="invalidEmail();">
<p id="wrong-email"></p>
</label>
<br><br>
<label class="query-field">
<div class="query-div">How can we help you?*</div>
<textarea id="querytext" name="querytext" onkeyup="disableErrorField();"></textarea></label>
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
<script type="text/javascript">
function checkField(field){
  if(document.getElementById('email').value=="" ){
  document.getElementById('message').innerHTML = "Please fill email field."; 
  document.getElementById('message').style="display: inline;"; 
  document.getElementById("agile_submit").style="margin-left: 110px;"
  return false;
  }
  else if(document.getElementById('querytext').value==""){
  document.getElementById('message').innerHTML = "Please fill query  field.";
  document.getElementById('message').style="display: inline;";
  document.getElementById("agile_submit").style="margin-left: 110px;";
  return false;
  }
 $.ajax({
    url: "querysubmit",
    type: "POST",
    data : {'name' :$('#name').val(),'email':$('#email').val(),'querytext':$('#querytext').val()},
    success:function(result){
      $('.query-form-div').find('.form-content').html("Query has been submitted successfully.");
      $('.query-form-div').find('.form-content').css("margin-left", "85px");
      $('.query-form-div').find('.form-content').css("color", "#146519");      
    }  
  });

 return false; 
}

function invalidEmail(){
  if(document.getElementById('email').value!=''){
    var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
      if (!reg.test(email.value)){
         document.getElementById('wrong-email').innerHTML = "Please provide a valid email.";
         document.getElementById('wrong-email').style='display: inline;';
      }
      else{
        document.getElementById('wrong-email').innerHTML="";
        document.getElementById('wrong-email').style='display: none;';
      }
  }
}
function disableErrorField(){
  if(document.getElementById('message').innerHTML!==''){
    document.getElementById('message').innerHTML='';
    document.getElementById("agile_submit").style="margin-left: 272px;";
    document.getElementById('message').style='display: none;';
  }
}

</script>
</body>

</html>
