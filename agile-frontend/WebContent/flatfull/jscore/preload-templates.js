;var tpl_directory = {

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            deferreds.push(load_urls_on_ajax_stop(CLOUDFRONT_PATH + "tpl/min/precompiled/locales/" + _LANGUAGE + "/" + view + ".js" + "?_=" + _agile_get_file_hash(view + ".js")));
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

$(function(){
     if(!HANDLEBARS_PRECOMPILATION)
          return;
      
     // startFunctionTimer("loadtemplates");
     tpl_directory.loadTemplates(["contact-view", "case", "document", "workflow", "portlets", "web-rules", "landingpages", "settings", "admin", "admin-settings", "tickets"],
        function () {
            endFunctionTimer("loadtemplates");
        });
});