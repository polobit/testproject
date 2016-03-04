var tpl_directory = {

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            deferreds.push(head.js(CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + view + ".js" + "?_=" + _AGILE_VERSION));
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

$(function(){
     console.time("loadtemplates");
     tpl_directory.loadTemplates(["contact-view", "case", "document", "workflow", "portlets", "web-rules", "landingpages", "admin", "admin-settings"],
        function () {
            console.timeEnd("loadtemplates");
        });
});