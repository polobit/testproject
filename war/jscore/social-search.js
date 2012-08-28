/*------------- Social Search Collection --------------*/
var SocialSearchCollection = Backbone.Collection.extend({
    parse: function (response) {
        if (response && response.socialSearchResult) return response.socialSearchResult;
    }
});
/*----------- End of Social Search Collection ----------*/

/*----------------- Social Search View -----------------*/
var SocialSearchesListView = Backbone.View.extend({
    template: 'social-search',
    tagName: 'li',
    initialize: function () {
        _.bindAll(this, 'render', 'appendItem');
        this.collection = new SocialSearchCollection();
        this.collection.bind('sync', this.appendItem);
        this.collection.bind('reset', this.render);
    },

    appendItem: function (note) {
        var itemView = new Note_List_View({
            model: note
        });

        $('#noteslist', this.el).append(itemView.render().el);
    },
    render: function () {

        $(this.el).empty();
        console.log(this.collection.toJSON());
        $(this.el).html(getTemplate(this.template, this.collection.toJSON()));


        // Store in cahce
        if (localStorage && JSON && localStorage.getItem(this.key) == null && this.collection.length != 0) {
            localStorage.setItem(this.key, JSON.stringify(this.collection.toJSON()));
        }

        /*_(this.collection.models).each(function(item){ // in case collection is not empty
    	        this.appendItem(item);
    	      }, this);*/

        return this;
    }
});
/*------------- End of Social Search View --------------*/