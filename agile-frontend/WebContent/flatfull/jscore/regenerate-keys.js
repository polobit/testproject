function initializeRegenerateKeysListeners() {
    $(".prettyprint").css({
            "padding": "0px",
            "border": "none"
    });

    $("#api_key_code").off('click').on("click", "#api_key_generate_icon", function(e) {
        e.preventDefault();
        regenerate_api_key('core/api/api-key/key');
    });
    $("#jsapi_key_code").off('click').on("click", "#jsapi_key_generate_icon", function(e) {
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
    if (confirm("Resetting the API Key will break all existing integrations you may have setup using the current key. Are you sure you want to reset the API key?")) {
        $.ajax({
            url: url,
            type: 'POST',
            success: function() {
                update_admin_settings_api_key_template();
            }
        })
    } else return;
}

function prettify_api_add_events() {
    prettyPrint();

    initializeRegenerateKeysListeners();
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
    $(".allowed-domain-delete").on('click', function(e) {
        e.preventDefault();
        $(this).closest("tr").remove();
        var allowed_domains = get_allowed_domains();
        put_allowed_domains(allowed_domains);
    });
    $("#update_blocked_ips").on('click', function(e) {
        e.preventDefault();
        $(this).attr("disabled", "disabled");
        var blocked_ips = get_blocked_ips();
        var new_blocked_ip = $("#new_blocked_ip").val();
        if (!new_blocked_ip || is_duplicate_blocked_ip(new_blocked_ip, blocked_ips) || !is_valid_ip(new_blocked_ip)) {
            $(this).removeAttr("disabled");
            return;
        }
        blocked_ips = blocked_ips ? blocked_ips + ", " + new_blocked_ip : new_blocked_ip;
        put_blocked_ips(blocked_ips);
    });

    $(".blocked-ip-delete").on('click', function(e) {
        e.preventDefault();
        $(this).closest("tr").remove();
        var blocked_ips = get_blocked_ips();
        put_blocked_ips(blocked_ips);
    });
    try {
        if (ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "PRO")
            $("#tracking-webrules, .tracking-webrules-tab").hide();
        else
            $("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
    } catch (e) {
        $("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
    }
}