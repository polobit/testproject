/**
 * Loads widgets on a contact, creates a collection view
 */
function loadWidgets(el, contact)
{

    // Create Data JSON
    var data = {
        contact: contact
    };

    // Creates collection view, collection is sorted based on position i.e., set
    // when sorted using jquery ui sortable
    var view = new Base_Collection_View(
    {
        url: '/core/api/widgets',
        restKey: "widget",
        templateKey: "widgets",
        individual_tag_name: 'li',
        sortKey: 'position',
        modelData: data
    });

    // Fetches the widget collection, on success widget scripts are loaded form
    // the url specified in widget model attribute url.
    view.collection.fetch(
    {
        success: function ()
        {
        	console.log(view.collection.toJSON())

            // Iterates through all the models (widgets) in the
            // collection, and scripts are loaded from the url in the
            // widget
            _(view.collection.models).each(function (model)
            {
                // In case collection is not empty
                var id = model.get("id");
                var url = model.get("url");
                $.get(url, "script");

                console.log(model.toJSON());
                
                // Sets the data element in the div
                // We can retrieve this in get plugin prefs
                $('#' + model.get('name'), el).data('model', model);

            }, this);

            // Loads jquery-ui to get sortable functionality on widgets
            head.js(LIB_PATH + 'lib/jquery-ui.min.js', function ()
            {

                // Make widgets sortable
                $(".widget-sortable", newEl).sortable(
                {
                    update: function (event, ui)
                    {
                        var models = [];

                        // Store the save
                        $('.widget-sortable li').each(function (index)
                        {
                        	var model_name = $(this).find('.widget').attr('id');

                            // Get Model, model is set as data to widget element
                            var model = $('#' + model_name).data('model');

                            // console.log(modelId);
                            models.push(
                            {
                                id: model.get("id"),
                                position: index
                            });
                        });

                        // Stores the positions at server
                        $.ajax(
                        {
                            type: 'POST',
                            url: '/core/api/widgets/positions',
                            data: JSON.stringify(models),
                            contentType: "application/json; charset=utf-8",
                            dataType: 'json'
                        });
                    }
                });
                
                // Disable selection after sorted
                $(".widget-sortable", newEl)
                    .disableSelection();
            });
        }
    });

    var newEl = view.render().el;

    $('#widgets', el).html(newEl);
}