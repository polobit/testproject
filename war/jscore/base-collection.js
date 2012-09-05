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
        console.log("parsing " + this.restKey + " " + response[this.restKey]);
        
        if (response && response[this.restKey]) 
        	return response[this.restKey];
        
        return response;
    }
});

var Base_List_View = Backbone.View.extend({
    events: {
        "click .delete": "deleteItem",
        "click .edit" : "edit"
        
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
        _.bindAll(this, 'render', 'appendItem', 'checkScroll', 'fetchNextCursorResults');
        this.collection = new BaseCollection([], {
            restKey: this.options.restKey,
            sortKey: this.options.sortKey
        });
        this.collection.url = this.options.url;
        this.collection.bind('sync', this.appendItem);
        
        var that = this;
        this.collection.bind('reset', function(){that.render(true)});
        

        // Listen on scroll events if cursor is set
        if(this.options.cursor)
        {
        	// Check for Scrolling
            $(window).scroll(this.checkScroll);
        }
        
        // Call render which shows loading
        this.render();
        
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
    
        $(this.el).empty(); 
        $(this.el).html(getTemplate((this.options.templateKey + '-collection'), {}));
        _(this.collection.models).each(function (item) { // in case collection is not empty
            this.appendItem(item);
        }, this);
        
       return this;
    },
    fetchNextCursorResults: function () {
       
    	var that = this;
        
    	// We are starting a new load of results so set isLoading to true
        this.isLoading = true;
       
        // If cursor is not present, just unbind
        if(!this.collection.cursor)
        {
        	//console.log("Reached end of the results");
        	// Unbind
            $(window).unbind('scroll', this.checkScroll);
        	return;
        }
        else
        	console.log("C=" + this.collection.cursor);
        
        // Fetch is Backbone.js native function for calling and parsing the collection url
        this.collection.fetch({ 
        	add:true,
        	data:{c: this.collection.cursor},
        	success: function (collection, response) {
            
        		//console.log(response);
        		if (response && response.cursor && response.cursor != null) 
        		{
        			//console.log('updating cursor ' + response.cursor);
        			that.collection.cursor = response.cursor;
        			that.render();
        		}
        		else
        		{
        			that.collection.cursor = null;
        			// Unbind
        			$(window).unbind('scroll', this.checkScroll);
        		}
        	  
        		// Now we have finished loading set isLoading back to false
        		that.isLoading = false;
          }
        });      
      },
    checkScroll: function () {
    	
    	// Unbind if current route is not contacts
    	if(!Current_Route && Current_Route != 'contacts')
    	{
    		//$(window).unbind('scroll', this.checkScroll);
    		return;
    	}
    	
    	// Check Scroll Position
    	//console.log(this.el.scrollTop + " " + this.isLoading);
        var triggerPoint = 100; // 100px from the bottom
          if( !this.isLoading && this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight ) {
            this.fetchNextCursorResults();
          }
      }
});