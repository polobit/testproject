function setupTagsTypeAhead(models) {
    var tags = [];

    // Iterate
    _(models).each(function (item) { // in case collection is not empty
        var tag = item.get("tag");
        if ($.inArray(tag, tags) == -1) tags.push(tag);
    });

    //console.log("Tags " + tags);
    $('.tags-typeahead').typeahead({
        source: tags
    });
}


function setupTags(cel) {
    // Add Tags
    var TagsCollection = Backbone.Collection.extend({
        url: '/core/api/tags',
        sortKey: 'tag',
        parse: function (response) {
            return response.tag;
        }
    });
    var tagsCollection = new TagsCollection();
    tagsCollection.fetch({
        success: function () {
            var tagsHTML = getTemplate('tagslist', tagsCollection.toJSON());
            var len = $('#tagslist', cel).length;
            $('#tagslist', cel).html(tagsHTML);

            setupTagsTypeAhead(tagsCollection.models);
        }
    });

}

function getTags(id) {

    // Add Tags
    if (isValidField(id)) {
        var tags = $('#' + id).val();
        
        // Replace multiple space with single space
        tags =  tags.replace(/ +(?= )/g,'');

        // Replace ,space with space
        tags = tags.replace(", ", " ");

        // Replace , with spaces
        tags = tags.replace(",", " ");

        return tags.split(" ");
    }

}