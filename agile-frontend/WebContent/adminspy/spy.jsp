<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%
String _AGILE_VERSION = SystemProperty.applicationVersion.get();
%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="min/all.css">
</head>
<body>

<!-- Email Search field -->
<form class="navbar-form navbar-left" role="search" method="get" id="form">
  <div class="controls form-group">
    <input type="text" class="email form-control" id="emailsearch" name="searchbox" style="height:32px;" >
    <input class="searchbutton btn btn-default" type="button" value="Submit" name="submit">
  </div>
</form>
<!-- End of Email Search field -->

<div id="content">
</div>
<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>
<script src="https://cdn.jsdelivr.net/jquery.validation/1.14.0/jquery.validate.min.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js"></script>
<script type="text/javascript" src="min/all.js?_=<%=_AGILE_VERSION%>"></script>
<!--Setting the account-->
<script type="text/javascript" src="https://mctest.agilecrm.com/stats/min/agile-min.js"> </script> 
<script type="text/javascript" >
var a =  _agile.set_account('fl5qv213433bpc32l2kbfe80s0','our');
_agile.get_deals = function (callback, email)
{
  _agile._filter(function(){
     agile_getOurDeals(callback, email);           // Get deals related to contact
  });
};
_agile.get_tasks = function (callback, email)
{
  this._filter(function(){
     agile_getOurTasks(callback, email);           //  Get tasks related to contact
  });
};
/**
 * Get a contact opportunity based on email
 * 
 * @param email
 *        email of the contact
 */
function agile_getOurDeals(callback, email)
{
  if (!email)
  {
    if (!agile_guid.get_email())
    {
      return;
    }
    else 
      email = agile_guid.get_email();
  }
  // Get
  var agile_url = agile_id.getURL() + "/contacts/get-our-deals?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
  
  // Callback
  agile_json(agile_url, callback);
}

/**
* Get tasks of contact based on email
* 
* @param email {String}
*             email of the contact
* 
* @return callback
*           callback function for getTask
*/
function agile_getOurTasks(callback, email)
{
  // Check if email is passed else get email from cookie
  if (!email)
  {
    if (!agile_guid.get_email())
    {
      return;
    }
    else
      email = agile_guid.get_email();
  }
  
  // Get
  var agile_url = agile_id.getURL() + "/contacts/get-our-tasks?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
  
  // Callback
  agile_json(agile_url, callback);
}

</script>
<script type="text/javascript">
var _agile_contact;
function isValidForm(form) {

     $(form).validate({
        rules : {
          atleastThreeMonths : true,
          multipleEmails: true,
          email: true,
          checkedMultiSelect: true,
          phone: true
        },
        debug : true,
        errorElement : 'span',
        errorClass : 'help-inline',
        ignore: ':hidden:not(.checkedMultiSelect)',

        // Higlights the field and addsClass error if validation failed
        highlight : function(element, errorClass) {
          $(element).closest('.controls').addClass('single-error');
        },

        // Unhiglights and remove error field if validation check passes
        unhighlight : function(element, errorClass) {
          $(element).closest('.controls').removeClass('single-error');
        },
        invalidHandler : function(form, validator) {
          var errors = validator.numberOfInvalids();
        },
        errorPlacement: function(error, element) {
            if (element.hasClass('checkedMultiSelect')) {
               error.appendTo($(element).parent());
              } else {
                  error.insertAfter(element);
              }
        }
      });

      return $(form).valid();
  }
  $('#emailsearch').keypress(function(event){
        
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
           $(".searchbutton").trigger('click');
        }
        event.stopPropagation();
  });
  //Email validation

   $(function(){
       $(".searchbutton").click(function(e){
             // Get email value
            var emailId = $("#emailsearch").val();

            if(!isValidForm("form"))
              return;

             // Set email
            _agile.set_email(emailId);

             // Get contact from agile
            _agile.get_contact(emailId, {
             success: function (data) {

              _agile_contact = data;
                console.log("success");
                // Render Detail View of Contact
                viewContactDetails(data);


                // InPostrenderCallback start tasks 
            },
            error: function (data) {
                  alert("No such contact exist.")
                 console.log("error");
             }
           });

       });
   });
</script>

<!--Include all files-->

<%@include file="min/all.html"%>

</body>
</html>
