;var tpl_directory = {

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            deferreds.push(load_urls_on_ajax_stop(CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + view + ".js" + "?_=" + _AGILE_VERSION));
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

$(function(){
     if(!HANDLEBARS_PRECOMPILATION)
          return;

     console.time("loadtemplates");
     tpl_directory.loadTemplates(["contact-view", "case", "document", "workflow", "portlets", "web-rules", "landingpages", "settings", "admin", "admin-settings", "tickets"],
        function () {
            console.timeEnd("loadtemplates");
        });
});