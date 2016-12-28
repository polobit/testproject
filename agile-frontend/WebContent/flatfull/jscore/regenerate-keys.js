function initializeRegenerateKeysListeners() {
    $(".prettyprint").css({
            "padding": "9px 15px; ",
            "border": "none"
    });

    $("#api_key_generate_icon").on("click",function(e) {
        e.preventDefault();
        regenerate_api_key('core/api/api-key/key');
    });
    $("#jsapi_key_generate_icon").off('click').on("click", function(e) {
        e.preventDefault();
        regenerate_api_key('core/api/api-key/jskey');
    });
}

function update_admin_settings_api_key_template(){
	$.ajax({
		url : 'core/api/api-key',
		type : 'GET',
		dataType : 'json', 
		success : function(data){

			getTemplate("admin-settings-api-key-model", data, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$("#admin-prefs-tabs-content").html($(template_ui));
				 prettify_api_add_events();
			}, null);
		}
	})
}

function regenerate_api_key(url) {
    showAlertModal("regenerate_api_key", "confirm", function(){
        $.ajax({
            url: url,
            type: 'POST',
            success: function() {
                update_admin_settings_api_key_template();
            }
        })
    });
}

 function validateWhitelable(){
       // e.preventDefault();
         $("#validate_whitelabel").html("Validating..");
          $("#validate_whitelabel").attr("disabled",true);
          
        var whitelabel_domain = $("#whitelabel-domain").val();
        var pattern = /^[a-z0-9-\.]+\.[a-z]{2,4}/;
        if(!pattern.test(whitelabel_domain))
             $("#empty_domain_message").removeClass("hide");
         else
         {
             $("#empty_domain_message").addClass("hide");
             validateSendgridWhitelabel(whitelabel_domain)
         }
    }

function prettify_api_add_events() {
    prettyPrint();

    initializeRegenerateKeysListeners();
    $("#update_allowed_domains").off('click');
    $("#update_allowed_domains").on('click', function(e) {
        e.preventDefault();
        $(this).attr("disabled", "disabled");
        var allowed_domains = get_allowed_domains();
        var new_allowed_domain = $("#new_allowed_domain").val();
        if (!new_allowed_domain || is_duplicate_allowed_domain(new_allowed_domain, allowed_domains)) {
            $(this).removeAttr("disabled");
            return;
        }
        allowed_domains = allowed_domains ? allowed_domains + ", " + new_allowed_domain : new_allowed_domain;
        put_allowed_domains(allowed_domains);
    });
$("#webhook_accordian").on('click', function(e) {
        e.preventDefault();
        if($("#webhook-accordian-template").html() != "")
            return;
        setTimeout(function(){
             App_Admin_Settings.webhookSettings();
        },500)
       
    });

 $("sendgrid-dkim_accordian").off('click');
 $("#sendgrid-dkim_accordian").on('click', function(e) {
    e.preventDefault();
    var view = new Base_Model_View({ url : '/core/api/emails/sendgrid/permission', template : "admin-setting-sendgrid-whitelabel-permission",
    
        postRenderCallback : function(e)
            {
               if($("#sendgrid-dkim-restriction-template").html().search("undefined")==-1)
                    {
                        $("#get_whitelabel_key").attr("disabled",true);
                        $("#validate_whitelabel").attr("disabled",true);
                        $("#whitelabel-domain").attr("disabled",true);
                    }
                else
                {
                    $("#get_whitelabel_key").attr("disabled",false);
                    $("#validate_whitelabel").attr("disabled",false);
                    $("#whitelabel-domain").attr("disabled",false);
                    $("#sendgrid-dkim-restriction-template").html("");
                }
                console.log( $("#sendgrid-dkim-restriction-template").html()+"hhh");
            }
       });
    $("#sendgrid-dkim-restriction-template").html(view.render().el);
    return;
    });

$("#js-security_accordian").on('click', function(e) {
        e.preventDefault();
        if($("#js-security-accordian-template").html() != "")
            return;
        setTimeout(function(){
             App_Admin_Settings.jsSecuritySettings();
        },500)
       
    });

$("#sso-login_accordian").on('click', function(e) {
        e.preventDefault();
        if($("#sso-login-accordian-template").html() != "")
            return;
        setTimeout(function(){
             App_Admin_Settings.ssoLoginSettings();
        },500)
       
    });

    $(".allowed-domain-delete").off('click');
    $(".allowed-domain-delete").on('click', function(e) {
        e.preventDefault();
        $(this).closest("tr").remove();
        var allowed_domains = get_allowed_domains();
        put_allowed_domains(allowed_domains);
    });

   
        
        $("#get_my_ip").on('click',function(e){
             $("#new_blocked_ip").val(USER_IP_ADDRESS);
              $("#ip_error_message").addClass("hide");
            $("#empty_ip_message").addClass("hide");
        });
  
    $("#update_blocked_ips").off('click');
    $("#update_blocked_ips").on('click', function(e) {
        e.preventDefault();
        $("#ip_error_message").addClass("hide");
            $("#empty_ip_message").addClass("hide");
        $(this).attr("disabled", "disabled");
        var blocked_ips = get_blocked_ips();
        var new_blocked_ip = $("#new_blocked_ip").val();
        if (!new_blocked_ip || is_duplicate_blocked_ip(new_blocked_ip, blocked_ips) || !is_valid_ip(new_blocked_ip)) {
            $(this).removeAttr("disabled");
            
            if(is_duplicate_blocked_ip(new_blocked_ip, blocked_ips))
            $("#ip_error_message").removeClass("hide");
            else
            $("#empty_ip_message").removeClass("hide");  
            return;
        }
        blocked_ips = blocked_ips ? blocked_ips + ", " + new_blocked_ip : new_blocked_ip;
        put_blocked_ips(blocked_ips);
        $("#ip_error_message").addClass("hide");
        $("#empty_ip_message").addClass("hide");

    });

    $(".blocked-ip-delete").off('click');
    $(".blocked-ip-delete").on('click', function(e) {
        e.preventDefault();
        $(this).closest("tr").remove();
        var blocked_ips = get_blocked_ips();
        put_blocked_ips(blocked_ips);
    });

    //Sendgrid DKIM and SPF verification

    $("#whitelabel-domain").on('keypress', function(event){
      if(event.keyCode == 13)
         $("#get_whitelabel_key").click();
    });

    $("#get_whitelabel_key").off('click');
    $("#get_whitelabel_key").on('click', function(e) {
        e.preventDefault();
         $("#sendgrid-whitelabel-key-template").html("");
        var whitelabel_domain = $("#whitelabel-domain").val();

        var pattern = /^[a-z0-9-\.]+\.[a-z]{2,4}/;
        if(!pattern.test(whitelabel_domain))
             $("#empty_domain_message").removeClass("hide");
         else
         {
             $("#empty_domain_message").addClass("hide");
             getSendgridWhitelabel(whitelabel_domain)
         }
    });

    //@function for the to call the validate 
  //method and returns the result as per the validation
 $("#validate_anaytical_code").off('click');
     $("#validate_anaytical_code").on('click', function(e) {
         e.preventDefault();
          $("#invalidate-tracking-code").addClass("hide");
           $("#validate-tracking-code").addClass("hide");

         var websiteUrl = $("#verification_anaytical_code").val();
         if(websiteUrl=="" || !isUrlValid(websiteUrl))
              $("#empty_url").removeClass("hide");
          else
          {
              $("#empty_url").addClass("hide");
              validateAnalyticalCode(websiteUrl);
          }
     });
    try {
        if (ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "PRO" || ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "ENTERPRISE")
            $("#tracking-webrules, .tracking-webrules-tab").hide();
        else
            $("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
    } catch (e) {
        $("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
    }
}

function getSendgridWhitelabel(domainName)
{   
     var view = new Base_Model_View({ url : '/core/api/emails/sendgrid/whitelabel?emailDomain='+domainName,
     template : "admin-setting-sendgrid-whitelabel",
    });
  $("#sendgrid-whitelabel-key-template").html(view.render().el);
}


function validateSendgridWhitelabel(domainName)
{   
   var view = new Base_Model_View({ url : '/core/api/emails/sendgrid/whitelabel/validate?emailDomain='+domainName,
     template : "admin-setting-sendgrid-whitelabel-validate",
    });
  $("#sendgrid-whitelabel-key-template").html(view.render().el);
}
//validate the web analytical code callback function
function validateAnalyticalCode(websiteUrl)
 {   
    $("#validate_anaytical_code").text("Verifying...");
    $.ajax({
        url : 'core/api/api-key/validate?website_url='+websiteUrl,
        type : 'POST',
     //   dataType : 'json', 
        async: true,
        success : function(data){

            if(data=="Tracking code is valid.")
            {
             $("#validate-tracking-code").removeClass("hide");
             $("#validate-tracking-code").html("<span style='color:green;font-size: 13px;margin-left: 0px;'>"+data+"</span>");
          }

           else
           {
            $("#invalidate-tracking-code").removeClass("hide");
             $("#invalidate-tracking-code").html("<span style='color: #f05050;font-size: 13px;margin-left: 0px;'>"+data+"</span>");
        
          }

          $("#validate_anaytical_code").text("Verify");
        },
        error: function (data) {
        console.log(data);
      }
    })
}
/*
*@function for the validating website URL
*starts 
*/
function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}
