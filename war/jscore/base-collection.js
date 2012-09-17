var BaseModel = Backbone.Model.extend({});

var BaseCollection = Backbone.Collection.extend({
    model: BaseModel,
    initialize: function (models, options) {
        this.restKey = options.restKey;
        if (options.sortKey) this.sortKey = options.sortKey;
    },
    comparator: function (item) {
        if (this.sortKey) {
            // console.log("Sorting on " + this.sortKey);
            return item.get(this.sortKey);
        }
        return item.get('id');
    },
    parse: function (response) {
        // console.log("parsing " + this.restKey + " " + response[this.restKey]);
        
        if (response && response[this.restKey]) 
        	return response[this.restKey];
        
        return response;
    }
});

var Base_List_View = Backbone.View.extend({
    events: {
        "click .delete": "deleteItem",
        "click .edit" : "edit",
        "delete-checked .agile_delete": "deleteItem",
        
    },
    initialize: function () {
        _.bindAll(this, 'render', 'deleteItem', 'edit'); // every function that uses 'this' as the current object should be in here 
        this.model.bind("destroy", this.close, this);
        this.model.bind("change", this.render, this);
    },
    deleteItem: function () {
        this.model.destroy();
        this.remove();
    },
    edit: function(e)
    {
    	/*console.log(this.model);
    	console.log("Editing " + this.model.get("edit_template"));
  
    	// Edit  
    	if(this.model.get("edit_template"))
    	{
    		console.log("Moving to edit");
    		var editView = new Base_Model_View({
              model: this.model,
              isNew: true,
              template: this.model.get("edit_template")
    		});
    		var el = editView.render().el;
    		$('#content').html(el);
    	}*/
    },
    render: function () {
    	// console.log(this.model.toJSON());
        $(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
        return this;
    }
});


var Base_Collection_View = Backbone.View.extend({
	
    initialize: function () {
        _.bindAll(this, 'render', 'appendItem');
        this.collection = new BaseCollection([], {
            restKey: this.options.restKey,
            sortKey: this.options.sortKey
        });
        this.collection.url = this.options.url;
        this.collection.bind('sync', this.appendItem);
        
        var that = this;
        this.collection.bind('reset', function(){that.render(true)});
        
        // Call render which shows loading
        this.render();
    
        // Add infiniscroll
        if(this.options.cursor)
        {       	        
        	this.page_size = this.options.page_size;
        	if(!this.page_size)
        		this.page_size = 20;
        
        	// Get max
        	// console.log("Inifinite Scolling started");
        	this.infiniScroll = new Backbone.InfiniScroll(this.collection, {success: this.render, untilAttr: 'cursor', param: 'cursor', strict: true, pageSize: this.page_size});	       	
        	
        	this.collection.url = this.collection.url + "?page_size=" + this.page_size;
        }
       
    },
    appendItem: function (base_model) {
    	
    	// Add Model Data if present
    	if(this.options.modelData)
    	{
    		// console.log("Adding custom data");
    		base_model.set(this.options.modelData);
    	}
    	
        var itemView = new Base_List_View({
            model: base_model,
            template: (this.options.templateKey + '-model'),
            tagName: this.options.individual_tag_name
        });
        $(('#' + this.options.templateKey + '-model-list'), this.el).append(itemView.render().el);
    },
    render: function (force_render) {
    	
    	// If collection in not reset
    	if(force_render == undefined) {
    		$(this.el).html(LOADING_HTML);
    		return this;
    	}
    	
    	// Remove loading 
    	if($(this.el).html() == LOADING_HTML)
    		$(this.el).empty(); 
        
        $(this.el).html(getTemplate((this.options.templateKey + '-collection'), this.collection.toJSON()));
        _(this.collection.models).each(function (item) { // in case collection is not empty
            this.appendItem(item);
        }, this);
        
        // Add checkboxes to specified tables by triggering this event
        $('body').trigger('agile_collection_loaded');
        
        
        // For the first time fetch, disable Scroll bar if results are lesser
        if(this.page_size && (this.collection.length < this.page_size))
        {
        	console.log("Disabling infini scroll");
        	this.infiniScroll.destroy();
        }
        
       return this;
    }
});