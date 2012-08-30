// To Enable Console in IE - MC
$(function(){
	var alertFallback = false;
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = {};
		if (alertFallback) {
			console.log = function(msg) {
            alert(msg);
         };
		} else {
         console.log = function() {};
		}
	}
});   // To save map of key: first_name and value: contact id 
var CONTACT = [];
	
function contactsTypeAhead(id, el) {
	
	
	$('#' + id, el).typeahead({
		source : function(query, process) {
			
			// Get data on query
			$.getJSON("core/api/contacts/search/" + query,
				function(data) {
				// If not null process data to show	
				if(data != null)
					{
						var contact_names_list = [];
						
						// If result is multiple contacts (Array)
						if(!isArray(data.contact))
							data.contact = [data.contact];
						
							$.each(data.contact, function(index, contact ){
								var contact_name;
								
								$.each(contact.properties, function (index, property) {
									if (property.name == "first_name")
									{
										contact_name = property.value;
									}
									if(property.name == "last_name")
									{
										contact_name = contact_name.concat(" "+property.value);
										
									}
								});
								
								CONTACT[contact_name] = contact;
								contact_names_list.push(contact_name);
							});
							
							
						// Call Process on list of names(Strings)
						process(contact_names_list);
					}
				});
		},
		updater: function (items) {
			
			var tag_not_exist = true;
			
			// If contact tag already exists, returns 
			$.each($('#contact-tags', el).children('li'), function(index, tag) {
				if($(tag).attr('value') == CONTACT[items].id)
					{
						tag_not_exist = false;
						return;
					}
			})
			
			// Add tag 
			if(tag_not_exist)
				$('#contact-tags', el).append('<li class="contact_tags label label-warning" value=' + CONTACT[items].id+' >'+items + '<a class="icon-remove" id="remove_tag"></a></li>');
		},
		minLength : 2
	})
}

// Remove tags 
$('#remove_tag').die().live('click', function(event){
	event.preventDefault();
	$(this).parent().remove();
});

// To save map of key: first_name and value: contact id 
var TAGS = [];
	
function agile_type_ahead(id, el, callback) {
	
	$('#' + id, el).typeahead({
		source : function(query, process) {
			
			// Get data on query
			$.getJSON("core/api/contacts/search/" + query,
				function(data) {
					var items_list = [] ;
				
					// Customize data for type ahead
					if (callback && typeof(callback) === "function")
						{
							items_list = callback(data);							
						}

					// For other tags we have to write else for processing data.. items_list = data...
					
					// To save map of key: tag_name and value: id 
					$.each(data, function(index, item){
						
						tag_name = items_list[index];
						
						TAGS[tag_name] = item.id; 
					});
					
					process(items_list);
		
				});
		},
		updater: function (items) {
			var tag_not_exist = true;		
			
			// If tag already exists returns 
			$.each($('#tags', el).children('li'), function(index, tag) {
				
				if($(tag).attr('value') == TAGS[items])
					{
						tag_not_exist = false;
						return;
					}
			});

			//add tag 
			if(tag_not_exist)				
				$('#tags',el).append('<li class="label label-warning"  style="display: inline-block; vertical-align: middle; margin-right:3px;" value="'+ TAGS[items]+'">'+items+'<a class="icon-remove" id="remove_tag"></a></li>');
		},
		minLength : 2
	})
}

// Remove tags 
$('#remove_tag').die().live('click', function(event){
	event.preventDefault();
	$(this).parent().remove();
});



/*
 * Customization of Type-Ahead data  
 */


// Returns list of contacts names for type ahead
function contacts_typeahead(data){
	if(data != null)
	{
		var contact_names_list = [];
		var CONTACT = [];
		
		// If result is multiple contacts (Array)
		if(!isArray(data))
			data = [data];
		
			$.each(data, function(index, contact ){
				var contact_name;
				
				$.each(contact.properties, function (index, property) {
					if (property.name == "first_name")
					{
						contact_name = property.value;
					}
					if(property.name == "last_name")
					{
						contact_name = contact_name.concat(" "+property.value);
						
					}
				});
				
				CONTACT[contact_name] = contact;
				contact_names_list.push(contact_name);
			});

			return contact_names_list;
	}
	
}

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
        this.collection.bind('reset', this.render);
        
        // Listen on scroll events if cursor is set
        if(this.options.cursor)
        {
        	// Check for Scrolling
            $(window).scroll(this.checkScroll);
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
    render: function () {
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
});/*!JSCore*/
var Base_Model_View = Backbone.View.extend({
    events: {
        "click .save": "save",
        "click .delete": "deleteItem"   	        	
    },
    initialize: function () {
        _.bindAll(this, 'render', 'save', 'deleteItem'); // every function that uses 'this' as the current object should be in here 
        
        
           if (this.options.data != undefined) 
        	   this.model = new Backbone.Model(this.options.data);
           else if(this.options.model)
           		this.model = this.options.model; 
           else
        	   this.model = new Backbone.Model({});
        
        
        this.model.bind("change", this.render, this); // Change is triggered after modal is downloaded	  
       
        if (this.options.url) {
            this.model.url = this.options.url;
        }
        
        if(!this.options.isNew)
        	{
        	 	this.model.fetch();
        	}
    },

    deleteItem: function (e) {
        this.model.destroy({
            success: function (model, response) {
                location.reload(true);
            }
        });
        e.preventDefault();
    },
    save: function (e) {

    	e.preventDefault();
    
    	// Valid & Serialize Form
        var formId = $(this.el).find('form').attr('id');
        var $form = $('#' + formId);
        
        // Validate Form
        if(!isValidForm($form))
        {	
        	return;
        }
        
        // Clear all the values first
        this.model.clear({
            silent: true
        });
        
        // Convert Date String to Epoch
        var json = serializeForm(formId);
     
        this.model.set(json);
        
        var window = this.options.window;
        var reload = this.options.reload;
        
        // Store Modal Id
        var modal = this.options.modal;
        
        this.model.save([],{
        	success: function (model, response) {
        		if(reload)
            		location.reload(true);
            	else if (window)
            		{
            		  Backbone.history.navigate(window, {
                          trigger: true
                      });
            		  
            		  // Reset each element
            		  $form.each (function(){
	    	          	  this.reset();
	    	          	});
            		 
            		  // Hide modal if enabled
            		  if(modal)
          			  {
          				$(modal).modal('hide');
          			  } 
            		  
            		  
            		} 	
            }
        });
    },
    render: function () {
    	if(!this.model.isNew() || this.options.isNew || !$.isEmptyObject(this.model.toJSON()))
    	{
    		$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
    	
        	// Let's try to deserialize too if it is not empty
    		if(this.options.isNew != true)
    			deserializeForm(this.model.toJSON(), $(this.el).find('form'));
        
        	// Call postRenderCallback after rendering if available
        	var callback = this.options.postRenderCallback;
        	if (callback && typeof(callback) === "function") {
        		
        		// execute the callback, passing parameters as necessary
        		callback($(this.el));
        	}
    	}
    	else
    	{
    		$(this.el).html('<img src= "img/21-0.gif"></img>');
    	}
    	return this;
    }
});function isArray(a)
{
    return Object.prototype.toString.apply(a) === '[object Array]';
}


function showCalendar() {
    $('#calendar').fullCalendar({

        events: function (start, end, callback) {
            $.getJSON('/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000, function (doc) {
                
            	if(doc && doc.event)
            	{
            		// console.log(doc.event);
            		
            		// All day should be set to false
            		$.each(doc.event, function(index, v)
            		{
            			
            			doc.event[index].allDay = (doc.event[index].allDay == 'true'); 
            			
            		});
            		
            		// Jersey sends it as a single element if there is only element though it is an array
            		// We convert into array if there is only single element
            		if(isArray(doc.event))
            			callback(doc.event);
            		else
            			callback([doc.event]);
            	}
            });
        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventClick: function (event) {
            // opens events in a popup window
            window.open(event.url, 'gcalevent', 'width=700,height=600');
            return false;
        },

        loading: function (bool) {
            if (bool) {
                $('#loading').show();
            } else {
                $('#loading').hide();
            }
        },
        selectable: true,
		selectHelper: true,
		editable: true,
		theme: false,
		eventClick: function (event) {
            
			// Opens events in a popup window
        	console.log(event);
        	
        	$("#newactivityModal").modal('show');
        	
        	// Deserialize into the modal
        	// To do
        	
         },
        select: function(start, end, allDay) {
        	
        	// Show a new event
            $('#activityModal').modal('show');
            
            // Set Date for Event
            var dateFormat = 'mm-dd-yy';
            $('#task-date-1').val($.datepicker.formatDate(dateFormat, start));
            $("#event-date-1").val($.datepicker.formatDate(dateFormat, start));
            $("#event-date-2").val($.datepicker.formatDate(dateFormat, end));

            
            // Set Time for Event
            if ((start.getHours() == 00) && (end.getHours() == 00) && (end.getMinutes() == 00)) {
                $('#event-time-1').val('');
                $('#event-time-2').val('');
            } else {
                $('#event-time-1').val((start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start.getMinutes());
                $('#event-time-2').val((end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());
            }
            
            
		},
		eventDrop: function(event1, dayDelta, minuteDelta, allDay, revertFunc) {      
	    
			console.log(event1);
			// Confirm from the user about the change
			if (!confirm("Are you sure about this change?")) {
	            revertFunc();
	            return;
	        }
			
			var event = $.extend(true, {}, event1);
			
			
			// Update event if the user changes it in the calendar
			event.start = new Date(event.start).getTime()/1000;
	        event.end = new Date(event.end).getTime()/1000;
	        if(event.end == null || event.end == 0)	        	
	        	event.end = event.start;
	        var eventModel = new Backbone.Model();
	        eventModel.url = 'core/api/events';
	        
	        eventModel.save(event);	        
   	    },
   	    eventClick: function (event) {
   	    	
   	    	// Deserialize
   	    	
   	    	
   	    	// Show edit modal for the event
   	    	$("#updateActivityModal").modal('show');
   	    	return false;
   	    }
   	    
    });
}

function setupCharts(callback)
{
	// Download the lib 
	head.js('lib/flot/jquery.flot.min.js', 'lib/flot/jquery.flot.pie.min.js',
	       		function(){
		 if (callback && typeof(callback) === "function") {
			 // execute the callback, passing parameters as necessary
			 callback();
			}
		});
}


// Pie
function _pie(data, selector)
{
	$.plot(
	   selector, data,  
	   {
	     series: {
	       pie: {
	         show: true,
	         label: {
	           show: true
	         }
	     }
	    },
	    legend: {
	      show: true
	    }
	  }
	);
}

// Show Pie for Milestones
function pieMilestones()
{

	setupCharts(function(){
		
		// Get JSON
		var max = 1543842319; // Set max to really big
		$.getJSON('/core/api/opportunity/stats/milestones', {min:0, max: max }, function(data){
			
			// Convert into labels and data as required by Flot
			var pieData = [];
			$.each(data, function(k,v)
					{
						var item = {};
						item.label = k;
						item.data = v;
						pieData.push(item);
					})
					
					_pie(pieData, $("#pie-deals-chart"));	
			});
		});
}

// Show Bars/Lines for Total and Pipeline
function pieDetails()
{
	setupCharts(function(){
		
		// Get JSON
		var max = 1543842319; // Set max to really big
		$.getJSON('/core/api/opportunity/stats/details', {min:0, max: max }, function(data){
			
			// Convert into labels and data as required by Flot
			var total = {}; total.data = [];
			var pipeline = {}; pipeline.data=[];
			
			// Push as data array for total and pipeline
			$.each(data, function(k,v)
					{
						total.data.push([k*1000, v.total]);
						pipeline.data.push([k*1000, v.pipeline]);
					})
					
			var plotData = [];
			plotData.push(total);
			plotData.push(pipeline);
			
			//console.log(plotData);
			//console.log(JSON.stringify(plotData));
			
			// Line Graph
			/*plotData = [
			            {
			                label: "Total",
			                data: total.data,
			                lines: {show: true},
			                points: {show: true}
			              },
			              {
			                label: "Pipeline",
			                data: pipeline.data,
			                lines: {show: true},
			                points: {show: true}   
			              }
			            ];*/
			
			// Bar Graph
			plotData = [
            {
                label: "Total",
                data: total.data,
                bars: {
                    show: true,
                    barWidth: 1000000000,
                    align: "center"
                  }   
              },
              {
                label: "Pipeline (Total * Probability)",
                data: pipeline.data,
                bars: {
                    show: true,
                    barWidth: 1000000000,
                    align: "center"
                  } ,
                  grid: { hoverable: true, clickable: true }
              }
            ];
			
			// Plot it
			$.plot($("#total-pipeline-chart"), plotData,
				    {xaxis: {mode:"time", timeformat: "%b %y"}}
			);
			
		});
			
	});
}$(function(){ 

	// Notes
	var id;
	$('#contactDetailsTab a[href="#notes"]').live('click', function (e){
		e.preventDefault();
	    id = App_Contacts.contactDetailView.model.id;
		var notesView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/notes",
            restKey: "note",
            templateKey: "notes",
            individual_tag_name: 'tr'
        });
        notesView.collection.fetch();
        $('#notes', this.el).html(notesView.el);
	});
	
	// Deals with id
	$('#contactDetailsTab a[href="#deals"]').live('click', function (e){
		e.preventDefault();
		id = App_Contacts.contactDetailView.model.id;
		var dealsView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/deals" ,
            restKey: "opportunity",
            templateKey: "deals",
            individual_tag_name: 'tr'
        });
        dealsView.collection.fetch();
        $('#deals', this.el).html(dealsView.el);
		
	});
	
	// Events
	$('#contactDetailsTab a[href="#events"]').live('click', function (e){
		e.preventDefault();
		var eventsView = new Base_Collection_View({
			url: 'core/api/events',
            restKey: "events",
            templateKey: "events",
            individual_tag_name: 'tr'
        });
        eventsView.collection.fetch();
        $('#events', this.el).html(eventsView.el);
		
	});
	
	// Mails
	$('#contactDetailsTab a[href="#mail"]').live('click', function (e){
		e.preventDefault();
		var mailsView = new Base_Collection_View({
			url: 'core/api/email?e=' + encodeURIComponent("manohar@invox.com") + '&c=10&o=0',
            templateKey: "email-social",
            individual_tag_name: 'tr'
        });
        mailsView.collection.fetch();
        $('#mail', this.el).html(mailsView.el);
	});
	
	// Activities
	$('#contactDetailsTab a[href="#activities"]').live('click', function (e){
		e.preventDefault();
		var activitiesView = new Base_Collection_View({
			url: 'core/api/stats?e=' + encodeURIComponent("sam@invox.com") ,
			templateKey: "stats",
            individual_tag_name: 'tr'
        });
        activitiesView.collection.fetch();
        $('#activities', this.el).html(activitiesView.el);
	});
	
	// Campaigns
	$('#contactDetailsTab a[href="#campaigns"]').live('click', function (e){
		e.preventDefault();
		var campaignsView = new Base_Collection_View({
			url: '/core/api/logs/contact/' + App_Contacts.contactDetailView.model.id,
            restKey: "logs",
            templateKey: "campaigns",
            individual_tag_name: 'tr'
        });
		campaignsView.collection.fetch();
        $('#campaigns', this.el).html(campaignsView.el);
        
        // var optionsTemplate = "<li> <a value='{{id}}'>{{name}}</a></li>";
        var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
        fillSelect('campaignSelect','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
	});
	    
	 
	// Populate subject and description on select option change
	$('.emailSelect').die().live('change',function(e){
		e.preventDefault();
		var model_id = $('.emailSelect option:selected').attr('value');
			
		var emailTemplatesModel = Backbone.Model.extend({
		     url: '/core/api/email/templates/' + model_id,
		     restKey: "emailTemplates"
		});
		var templateModel = new emailTemplatesModel();
			templateModel.fetch({success: function(data){
				var model = data.toJSON();
				$("#emailForm").find( 'input[name="subject"]' ).val(model.subject);
				$("#emailForm").find( 'textarea[name="body"]' ).val(model.text);
			}});
		    
	});
	
	// Send email
	$('#sendEmail').die().live('click',function(e){
		e.preventDefault();
		var json = serializeForm("emailForm");
		var url =  'core/api/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
		   										 encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
		   										 encodeURIComponent(json.body);
		$.post(url);

	});
	
	// Campaign select 
	$('#campaignSelect').die().live('change',function(e){
		e.preventDefault();
		var workflow_id = $('#campaignSelect option:selected').attr('value');
		var contact_id = App_Contacts.contactDetailView.model.id;
		var url = '/core/api/campaigns/enroll/' + contact_id + '/' + workflow_id;

		$.get(url, function(data){
    		$(".enroll-success").html('<div class="alert alert-success"><a class="close" data-dismiss="alert" href="#">×</a>Enrolled successfully.</div>'); 
	   });
	});

});		$(function(){
	$('#contact-actions-delete').live('click', function(e){
		
		e.preventDefault();
		
		App_Contacts.contactDetailView.model.url = "core/api/contacts/" + App_Contacts.contactDetailView.model.id;
		App_Contacts.contactDetailView.model.destroy({success: function(model, response) {
			  Backbone.history.navigate("contacts",{trigger: true});
		}});

		
		/* Removing from collection did not work - to do later
		console.log("Deleting");
		
		var model =  App_Contacts.contactDetailView.model;
		console.log(model);
		App_Contacts.contactsListView.collection.remove(model);
		
		Backbone.history.navigate("contacts", {trigger: true});
		*/
	});
	
});function contactTableView(base_model) {
    var itemView = new Base_List_View({
        model: base_model,
        template: 'contacts-custom-view-model',
        tagName: this.options.individual_tag_name
    });

    var modelData = this.options.modelData;

    var data = modelData['fields_set'];

    var json = base_model.toJSON();
    
    $('#contacts-custom-view-model-template').empty();

    $.each(data, function (index, element) {
    	$('#contacts-custom-view-model-template').append(getTemplate('contacts-custom-view-' + element, json));
    });

    $(('#contacts-custom-view-model-list'), this.el).append(itemView.render().el);

}


function setupViews(cel) {
	
    // Show the views collection on the actions dropdown 	
   App_Contacts.customView = new Base_Collection_View({
        url: 'core/api/contact-view',
        restKey: "contactView",
        templateKey: "contact-view",
        individual_tag_name: 'li',

    });
    
  // Fetch collection and add to contact collection template
   App_Contacts.customView.collection.fetch({
	  	success: function(){
	  		$("#view-list",cel).html(App_Contacts.customView.render().el);
	  	}	
    })
}


$(function(){
	$('.ContactView').die().live('click',function(e){
		
		e.preventDefault();
		
		var id = $(this).attr('id');
		
		// Gets Model of selected contact-view
		var contactViewModel = App_Contacts.customView.collection.get(id).toJSON();
		
	    var view = new Base_Collection_View({
            url: '/core/api/contacts',
            restKey: "contact",
            modelData: contactViewModel,
            templateKey: "contacts-custom-view",
            individual_tag_name: 'tr'
        });
	    
	    // Defines appendItem for custom view 
	    view.appendItem = contactTableView;
	    
	    // Fetch collection and set tags and contact-views list
	    view.collection.fetch({
	    	success :function() {
	    		setupViews(view.render().el);
	    		setupTags(App_Contacts.contactsListView.el);
	    	}
	    });
	   
	    $('#content').html(view.render().el);
		
	});
});$(function(){
    
    // Filter Contacts- Clone Multiple 
    $("i.filter-contacts-multiple-add").die().live('click', function (e) {
    	var htmlContent = $(this).closest("tr").clone();
    	$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "block");
    	$(this).parents("tbody").append(htmlContent);
    });
   
    // Filter Contacts- Remove Multiple
    $("i.filter-contacts-multiple-remove").die().live('click', function (e) {
 
    		$(this).closest("tr").remove();
    });
});$(function(){
	$('#contacts-model-list > tr').live('click', function(e){
		
		e.preventDefault();
		var data = $(this).find('.data').attr('data');
		console.log(data);
		if(data)
			{
			 Backbone.history.navigate("contact/" + data, {
		            trigger: true
		        });
			}
		
	});
	
	$('#contacts-custom-view-model-list > tr').live('click', function(e){
		
		e.preventDefault();
		var data = $(this).find('.data').attr('data');
		console.log(data);
		if(data)
			{
			 Backbone.history.navigate("contact/" + data, {
		            trigger: true
		        });
			}
		
	});
	
});


function delete_contact_property(contact, propertyName)
{

	
}// Serailize and save continue contact
function serializeAndSaveContinueContact(e, form_id , continueContact) {

    e.preventDefault();
    
    // Read multiple values from continue contact
    var properties = [];
    
    var id = $('#' + form_id + ' input[name=id]').val();
    var obj = {};
    var properties = [];
    properties.push(propertyJSON('first_name', 'fname'));
    properties.push(propertyJSON('last_name', 'lname'));

    if (isValidField('organization')) 
    	properties.push(propertyJSON('company', 'company'));

    if (isValidField('job')) 
    	properties.push(propertyJSON('title', 'title'));
    
    if (isValidField('company')) 
    	properties.push(propertyJSON('company', 'company'));

    if (isValidField('email'))
    	properties.push(propertyJSON('email', 'email'));

    if (isValidField('title')) 
    	properties.push(propertyJSON('title', 'title'));

    $('#' + form_id + ' div.multiple-template').each(function (index, element) {
        var inputElement = $(element).find('input');
        var selectElement = $(element).find('select');
        properties.push({
            "name": inputElement.attr('name'),
            "value": inputElement.val(),
            "subtype": selectElement.val()
        })
    });

    var propertiesList = [];
    propertiesList.push({
        "name": "properties",
        "value": properties
    });
    
    // Convert array into JSON
    for (var i = 0; i < propertiesList.length; ++i) {
        obj[propertiesList[i].name] = propertiesList[i].value;
    }
    if (id != null) obj['id'] = id;
    
    var tags = getTags('tags-new-person');
    if (tags != undefined) obj.tags = tags;

    // Save contact
    var contactModel = new Backbone.Model();
    contactModel.url = 'core/api/contacts';
    contactModel.save(obj,{
    	success: function(data)
    	{
    		if(continueContact){
    			$('#personModal').modal('hide');
    			$('#content').html(getTemplate('continue-contact', data.toJSON()));       
    		}else{
    			$('#personModal').modal('hide');
    			App_Contacts.navigate("contact/" + data.id, { trigger: true });
    		}
    		// Reset each element
  		    $('#' + form_id).each (function(){
	          	  this.reset();
	        });
    	},
    	error: function(model,response)
    	{
    		$("#personModal").find(".duplicate-email").html('<div class="alert alert-error" style="display:none"><a class="close" data-dismiss="alert" href="#">×</a>Please change email. A contact already exists with this email.</div>'); 
			
    		$("#personModal").find(".alert").show();
    	}
    });
   
    return obj;
}

// Deserialize continue Contact
function deserializeContact(contact) {

    var form = $("#content").html(getTemplate("continue-contact", contact));
    
   // $('#' + form.attr('id') + ' input[name=id]').val(contact.id)
    $.each(contact.properties, function (data, element) {
    	
    	  var field_element = $('#' + form.attr('id') + ' div.multiple-template.'+element.name);
          // Generate and populate multiple fields
          fillMultiOptions(field_element, element);
    });
}


// Generated new field for each value in Properties  Author : Yaswanth  08/09/2012
function fillMultiOptions(field_element, element) {

    var append_to = $(field_element).parents('div.control-group');
    var field_element = $(field_element).parents('div.controls:first').clone();
    $(field_element).find('input').val(element.value);
    $(field_element).find('select').val(element.subtype);


    field_element.appendTo(append_to);
}

// Create a property object
function propertyJSON(name, id, type) {
    var json = {};

    if (type == undefined) json.type = "SYSTEM";
    else json.type = type;

    json.name = name;
    json.value = $('#' + id).val();
    return json;
}

// UI Handlers for Continue-contact and continue-company
$(function () {
	// Clone Multiple
    $("i.multiple-add").die().live('click', function (e) {
   
    	// Clone the template
    	$(this).parents("div.control-group").append(
    			$(this).parents().siblings("div.controls:first").clone());		     
    });

    // Remove multiple
    $("i.multiple-remove").live('click', function (e) {
        // Get closest template and remove from the container
        $(this).closest("div.multiple-template").remove();
    });
    
    // Continue editing in the new-person-modal Rammohan 03-08-2012.
    $('#continue-contact').click( function (e) {
    	var model = serializeAndSaveContinueContact(e, 'personForm' , true);
    });
    
    // Update in continue-contact
    $("#update").die().live('click', function (e) {
    	serializeAndSaveContinueContact(e,'continueform');
    });
    
    // Continue editing in the new-company-modal
    $('#continue-company').click(function (e) {
        $("#companyModal").modal('hide');
        alert("test");
        App_Contacts.navigate("continue-company", {
            trigger: true
        });
    });
    
});// Adding custom fields Author: Yaswanth  08-10-2012
$(function(){
	$('.fieldmodal').die().live('click',function(event){
		event.preventDefault();
		
		var modal_id = $(this).attr('id');
		alert(modal_id);
		//Creating model for bootstrap-modal
		var modelView = new Base_Model_View({
			url: '/core/api/custom-fields',
			template: 'custom-field-'+modal_id+'-modal',
			window: 'custom-fields',
			modal: '#'+modal_id+'Modal',
			postRenderCallback: function(el){
				alert('showing modal');
				$('#'+modal_id+'Modal').modal('show');
				}
			});

		
		$('#custom-field-modal').html( modelView.render().el );
	});
});// UI Handlers for activities - event & task
$(function(){ 
	
		// Save task & event - Rammohan 03-08-2012
	    $('#task_event_validate').die().live('click', function (e) {
	    	        e.preventDefault();
	    	       
	    	        // Save functionality for task by checking task or not
	    	        if ($("#hiddentask").val() == "task") { 
	    	        	if (!isValidForm('#taskForm'))
	    		        	return false;
	    	        	$("#activityModal").modal('hide');
    	   	        	var json = serializeForm("taskForm");
	    	        	json.due = new Date(json.due).getTime()/1000.0;
	    	        	$('#taskForm').each (function(){
	    	          	  this.reset();
	    	          	});
	    	        	 
	    	        	var newTask = new Backbone.Model();
	    	        	newTask.url = 'core/api/tasks';
	    	        	newTask.save(json); 
	    	        }
	    	        else
	    	        { 
	    	        	// Save functionality for event
	    	        	if (!isValidForm('#activityForm'))
	    		        	return false;
	    	        	var json = serializeForm("activityForm");
    	          	
	    	          	// Appending start time to start date 
	    	          	var startarray = (json.start_time).split(":"); 	
	     	          	json.start = new Date(json.start).setHours(startarray[0],startarray[1])/1000.0;

	    	          	// Appending end time to end date 
	    	          	var endarray = (json.end_time).split(":");
	    	          	json.end = new Date(json.end).setHours(endarray[0],endarray[1])/1000.0;
	    	        	
	    	            // For validation
	    	        	if(!isValidRange(json.start, json.end))
	    	                   return;
	    	        	
	    	        	$("#activityModal").modal('hide');
	    	        	
	    	        	$('#activityForm').each (function(){
	    	          	  this.reset();
	    	          	});
	    	        	
	    	        	// Deleting start_time and end_time from json 
	    	        	delete json.start_time;
	    	        	delete json.end_time;	

	    	        	var eventModel = new Backbone.Model();
	    	            eventModel.url = 'core/api/events';
	    	            eventModel.save(json,{
	    	                success: function () {
	    	                	$('#calendar').fullCalendar( 'refetchEvents' );                
	    	                   }
	    	               }); 
	    	        }
	    	    }); //End of Task and Event Validation function
			   
	    		// Date Picker
			    $('#task-date-1').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    $('#event-date-1').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    $('#event-date-2').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    $('#update-event-date-1').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    $('#update-event-date-2').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    
			    // Time Picker
			    $('.timepicker').timepicker({defaultTime: 'current', showMeridian: false, template: 'modal'});
			    
			    // Switch Task and Event: changing color and font-weight
			    $("#task").click(function (e) {
			        $("#hiddentask").val("task");
			        $("#task").css("color", "black");
			        $("#event").css("color", "#DD4814");
			        $("#relatedtask").css("display", "block");
			        $("#relatedEvent").css("display", "none");
			    });
			    $("#event").click( function (e) {
			    	$("#hiddentask").val("event");
			        $("#event").css("color", "black");
			    	$("#task").css("color", "#DD4814");
			    	$("#relatedtask").css("display", "none");        
			    	$("#relatedEvent").css("display", "block");
			   });
			    
			    // Tasks checked
			    $('.tasks-select').live('change', function(){
			        if($(this).is(':checked')){
			            
			        	// Complete
			        	var taskId = $(this).attr('data');
			        	completeTask(taskId, $(this))
			        }
			    });
});

// Validate event(start and end durations) 
function isValidRange(startDate, endDate){
	  if (startDate <= endDate)
		  return true;
	  else
		  return false;		  
}function serializeForm(form_id) {
	
	var arr = $('#' + form_id).serializeArray(),
        obj = {};
	
    // Checkboxes are not serialized
    arr = arr.concat(
    $('#' + form_id + ' input[type=checkbox]:not(:checked)').map(
    function () {

    	return {
            "name": this.name,
            "value": false	
        }
    }).get());
    
    // Change the dates properly from human readable strings to epoch
    arr = arr.concat($('#' + form_id + ' input[type=date_input]').map(
   	    function () {
    	     return {
    	            "name" : this.name,
    	            "value": new Date(this.value).getTime() / 1000.0	
    	        };
    	    }).get());
    
    // Serialize tags
    arr = arr.concat( $('#' + form_id + ' .tags').map(
    		 function () {
    			 var values = [];
    			 
    			 if(!isArray($(this).children()));
    			 	
    			 $.each($(this).children(), function(index, data) { 
    				 values.push(($(data).val()).toString())
 	            	
 	            });
    			 
        	     return {
        	            "name" : $(this).attr('name'),
        	            "value":values
        	        };
        	    }).get() );
    
    
    // Multiple select 
    if($('#' + form_id + ' select').attr('id')  == "multipleSelect")  
    	arr = arr.concat({"name": $('#' + form_id + ' select').attr('name'), "value": $('#' + form_id + ' select').val()})

    
    
    // Convert array into JSON
    for (var i = 0; i < arr.length; ++i)  {
    	obj[arr[i].name] = arr[i].value;
    }

  //  obj[ $('#' + form_id + ' select').attr('name') ] = $('#' + form_id + ' select').val();
    return obj;
}

// Deserialize Form
function deserializeForm(data, form)
{
	$.each(data, function(i, el) {
	      var 
	          fel = form.find('*[name="' + i + '"]'),
	          type = "", tag = "";
	      
	       if (fel.length > 0) {
	    	   
	           tag = fel[0].tagName.toLowerCase();
	           
	           if (tag == "select" || tag == "textarea") { //...
	              $(fel).val(el);
	           }
	           else if (tag == "input") 
	           {
	              type = $(fel[0]).attr("type");
	               if (type == "text" || type == "password" || type == "hidden") {
	            	   fel.val(el);
	               } 
	               else if (type == "checkbox") {
	            	   if (el)
		                  {  
		                	  if(el == "true")
		                		  fel.attr("checked", "checked"); 
		                  
		                	  // Set all values as true by default for serialization to work
		                	  fel.val("true");
		                  }
	               }
	               else if (type == "radio") {
	                   fel.filter('[value="'+el+'"]').attr("checked", "checked"); 
	               }
	           }
	    
	           // Deserialize tags
	           else if(fel.hasClass('tags') && tag == "ul")
	          {
	        	   if(!isArray(el))
	        		   {
	        		   		el = [el];
	        		   }
	        	  
	        	  $.each(el, function(index, contact){
	                   var tag_name;
	                   var tag_id = contact.id;
	                   tag_name = getPropertyValue(contact.properties, "first_name") + getPropertyValue(contact.properties, "last_name");
	                   $('#' + fel.attr('id'), form).append('<li class="label label-warning" value="'+tag_id+'" style="display: inline-block; vertical-align: middle; margin-right:3px; ">'+tag_name+'<a class="icon-remove" id="remove_tag"></a></li>');
	                  });	        	    
	           }
	         }

	});
}


function isValidForm(form) {
    
	 console.log($(form).html());
	 console.log("Validating form");
    
	 
	    $(form).validate({
	        debug: true,
	        errorElement: 'span',
	        errorClass: 'help-inline',
	        highlight: function (element, errorClass) {     
	  	      $(element).closest(".control-group").addClass('error'); 
	        },
	        unhighlight: function (element, errorClass) {
	        	 $(element).closest(".control-group").removeClass('error'); 
	        },
	        invalidHandler: function (form, validator) {
	            var errors = validator.numberOfInvalids();
	        }
	    })	
	
    return $(form).valid();
}

function getTemplate(templateName, context, download) 
{
	
	// Check if source is available in body
    var source = $('#' + templateName + "-template").html();    
    if(source)
    {
    	//console.log(templateName + " " + source);
        var template = Handlebars.compile(source);
        return template(context);
    }
    
    // Check if  the download is explicitly set to no
    if(download == 'no')
    {
    	console.log("Not found " + templateName);
    	return;
    }
    
    // Download 
    var templateHTML = '';
    
    // If starts with settings
    if(templateName.indexOf("settings") == 0)
    {
    	templateHTML = downloadSynchronously("settings.js"); 	
    }
    if(templateName.indexOf("admin-settings") == 0)
    {
    	templateHTML = downloadSynchronously("admin-settings.js"); 	
    }
    if(templateName.indexOf("continue") == 0)
    {
    	templateHTML = downloadSynchronously("continue.js"); 	
    }
    
    if(templateHTML)
    {
    	//console.log("Adding " + templateHTML);
    	$('body').append($(templateHTML));
    }
	
    return getTemplate(templateName, context, 'no');    
}

function downloadSynchronously(url)
{
	console.log(url);
	var urlContent;
	jQuery.ajax({
        url: url,
        dataType: 'html',
        success: function(result) {
                   urlContent = result; 
                 },
        async:   false
   });          
	
	return urlContent;
}


function getPropertyValue(items, name) {
    if (items == undefined) return;

    for (var i = 0, l = items.length; i < l; i++) {
        if (items[i].name == name) return items[i].value;
    }
}

$(function() {


    // Gravatar
    Handlebars.registerHelper('getPropertyValue', function (items, name) {

        //console.log(name);
        return getPropertyValue(items, name);
    });
    
    // Gravatar
    Handlebars.registerHelper('urlEncode', function (url, key, data) {
    	
    	var startChar = "&";
    	if(url.indexOf("?") != -1)
    	 startChar = "&";
    	
    	var encodedUrl = url + startChar + key + "=" + escape(JSON.stringify(data));
    	// console.log(encodedUrl.length + " " + encodedUrl);
    	return encodedUrl;
    });

    // Gravatar
    Handlebars.registerHelper('gravatarurl', function (items, width) {
    	
    	  if (items == undefined) 
    		  return;

    	  
    	  
          // Check if properties already has an image
          var agent_image  = getPropertyValue(items, "image");
          if(agent_image)
        	  return agent_image;
         
          // Default images
    	  // var img = "https://d1uqbqkiqv27mb.cloudfront.net/panel/img/default-avatar.png";
          var img = "https://contactuswidget.appspot.com/images/pic.png";
         
          
          var email = getPropertyValue(items, "email");
          if(email)
           {	  
        	  return 'https://secure.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
           }
          
          return img;
    });


    // Icons
    Handlebars.registerHelper('icons', function (item) {
        if (item == "email") return "icon-envelope";
        if (item == "phone") return "icon-headphones";
        if (item == "url") return "icon-home";

    });

    Handlebars.registerHelper('eachkeys', function (context, options) {
        var fn = options.fn,
            inverse = options.inverse;
        var ret = "";

        var empty = true;
        for (key in context) {
            empty = false;
            break;
        }

        if (!empty) {
            for (key in context) {
                ret = ret + fn({
                    'key': key,
                    'value': context[key]
                });
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    });



    Handlebars.registerHelper('ucfirst', function (value) {
        return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';
    });


    //Tip on using Gravar with JS: http://www.deluxeblogtips.com/2010/04/get-gravatar-using-only-javascript.html
    Handlebars.registerHelper('tagslist', function (tags) {


        var json = {};

        for (var i = 0, l = tags.length; i < l; i++) {

            var tag = tags[i].tag;
            //console.log(tag);
            var start = tag.charAt(0);

            var array = new Array();
            // see if it is already present
            if (json[start] != undefined) {
                array = json[start];
            }

            array.push(tag);
            json[start] = array;

        }

        //console.log(json);


        // Sort it based on characters and then draw it
        //var html = "<ul style='list-style:none'>";
        var html  = "";
        for (var key in json) {

            var array = json[key];
            html += "<div class='tag-element'><div class='tag-key'>" + key.toUpperCase() + "</div> ";

            html += "<div class='tag-values'>";
            
            for (var i = 0, l = array.length; i < l; i++)
            {
            	var hrefTag = "#tags/" + array[i];
            	html += ("<a href=" + hrefTag + " >" + array[i] + "</a> ");
            }
            html += "</div></div>";

        }

        //html += "</ul>";

        return html;
    });
    
    // Get date string from epoch time
	Handlebars.registerHelper('epochToHumanDate', function(format, date) {
		var d = new Date(parseInt(date) * 1000);
		return d.toLocaleDateString();

		//return $.datepicker.formatDate(format , new Date( parseInt(date) * 1000));
	});
	
	// Get task date (MM dd) from epoch time
	Handlebars.registerHelper('epochToTaskDate', function(date) {
		
		var intMonth = new Date( parseInt(date) * 1000).getMonth();
		var intDay = new Date( parseInt(date) * 1000).getDate();
		var monthArray = ["", "Jan", "Feb", "March", "April", "May", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        
		return (monthArray[intMonth] + " " + intDay);
	});
	
	// Calculate pipeline (value * probability)
	Handlebars.registerHelper('calculatePipeline', function(value, probability) {
	
		var pipeline = parseInt(value)*parseInt(probability)/100;
		return pipeline;	
	});
    
});$(function(){
	
	 $('#import-contacts').die().live('click', function (e) {
		 
		 	var models = [];
		 
		 	// Hide the alerts
		 	$(".fname-not-found-error").hide();
		 	$(".lname-not-found-error").hide();
		 	$(".fname-duplicate-error").hide();
		 	$(".lname-duplicate-error").hide();
		 
		 	// Headings validation Rammohan: 10-09-12
		 	var firstNameCount = $(".import-select").filter(function() {
				 return $(this).val() == "first_name";
			 });
	
		 	var lastNameCount = $(".import-select").filter(function() {
				 return $(this).val() == "last_name";
			 });
 
		 	if(firstNameCount.length == 0){ 
		 		$(".fname-not-found-error").show();
		 		return false;
		 	}
		 	else if(lastNameCount.length == 0){
		 		$(".lname-not-found-error").show();
		 		return false;
		 	}
		 	else if(firstNameCount.length > 1){
		 		$(".fname-duplicate-error").show();
		 		return false;
		 	}
		 	else if(lastNameCount.length > 1){
		 		$(".lname-duplicate-error").show();
		 		return false;
		 	}
		   
	        // Iterate through all tbody tr
	        $('#import-tbody tr').each(function () {
	            var properties = [];
	            

	            $(this).find("td").each(function (i) {

	                var property = {};
	                var name = $(this).parents('table').find('th').eq(i).find('select').val();
	                console.log($(this));
	                console.log("Name is " + name);


	                if (name.indexOf("-") != -1) {
	                    var splits = name.split("-");
	                    name = splits[1];
	                    var type = splits[0];
	                    property["sub_type"] = type;
	                }

	                var value = $(this).html();
	                //console.log("Column value is " + value);

	                property["value"] = value;
	                property["name"] = name;

	                properties.push(property);

	            });

	            //console.log(properties);

	            var model = {};
	            model.properties = properties;
	            model.type = "PERSON";
	            model.first_name = "uploaded";
	            model.last_name = "uploaded";

	            // Add Tags
	            var tags = getTags('tags-import');
	            if (tags != undefined) model.tags = tags;

	            models.push(model);

	        });

	        //console.log(models);

	        var contact = {};
	        contact.contact = models;

	        $.ajax({
	            type: 'POST',
	            url: '/core/api/contacts/upload',
	            data: JSON.stringify(contact),
	            contentType: "application/json; charset=utf-8",
	            success: function (data) {
	                //console.log("Uploaded successfully");
	                //console.log(data);
	            	App_Deals_contacts.contactsListView.collection.add(data.contact);
	            },
	            dataType: 'json'
	        });

	    });
});

function fileUploadInit() {
	var uploader = new qq.FileUploader({
        element: document.getElementById('file-upload-div'),
        action: '/core/api/upload',
        debug: true,
        onComplete: function (id, fileName, data) {

            console.log(data);
            $('#content').html(getTemplate("import-contacts-2", data));
           
            setupTagsTypeAhead(); // ??
        }
    });

}var MD5 = function (string) {

        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    }

$(function(){
	   
		// Person Form
	    $('#person_validate').live('click', function (e) {
	    	serializeAndSaveContinueContact(e, 'personForm');	        
	    });
	    
	    $('#import-link').live('click', function (e) {
	    	Backbone.history.navigate("import",{trigger: true});	        
	    });
});

var notification_prefs;
var socket;

// Download and Register
function downloadAndRegisterForNotifications()
{
	// Download Notification Prefs
	var notification_model = Backbone.Model.extend({
		  url: 'core/api/notifications'
		});
	
	var model = new notification_model();
	model.fetch({ success: function(data) { 
		
		// Register For Notifications
		notification_prefs = data.toJSON();	
		console.log(notification_prefs);
		registerForNotifications(notification_prefs)
	}});	
}

// Register for notifications
function registerForNotifications(prefs)
{
	// Check if at least one key is not present. In backend, we do not store if the value is default
	if(!prefs.contact_any_browsing || !prefs.contact_assigned_browsing || !prefs.contact_assigned_starred_browsing)
	{
		// Register for sockets
		
	}
	
	registerForSockets();
}


// Gets API Key and Sets up Socket 
function registerForSockets()
{

	// Put http or https
	//var protocol = document.location.protocol;
	var protocol = 'https';
	head.js(protocol + '://stats.agilecrm.com:443/socket.io/socket.io.js', function()
	{
		
		// Get API Key
		var api_key_model = Backbone.Model.extend({
			  url: 'core/api/api-key'
			});		
		
		var model = new api_key_model();
		model.fetch({ success: function(data) { 
			
			var api_key = data.get('api_key');
			_setupSockets(api_key);
			
		}});
		
	});
}

// Setup sockets
function _setupSockets(api_key)
{	
	console.log("Connecting " + api_key);
	
	var agile = api_key;
	socket = io.connect('https://stats.agilecrm.com:443');
	socket.on('connect', function () {
		    console.log('socket connected');
		    socket.emit('subscribe', { agile_id: agile });
		  });
	  
	socket.on('browsing', function (data) {
		console.log('browsing');
	    console.log(data);
	    
	    // Get his email address
	    var email = 'manohar@invox.com';
	    
	   
	  
	});	
}

function fetchContactAndNotify(email)
{
	
	 // Get Contact by email address
	var contact_model = Backbone.Model.extend({
		  url: function() {
		    return '/core/api/contacts/search/email/' + encodeURIComponent(email);
		  }
		});
	
	var model = new contact_model();
	model.fetch({ success: function(data) 
		{
			console.log(data);
			console.log(data.toJSON());
			
			var id = data.id;
			if(!id)
				return;
			
		
		
		var html = getTemplate('notify-html', data.toJSON());
		
		  // Show picture, name, title, company
		//JSON.stringify(data.toJSON())
	    notify('success', html, 'bottom-right', true);	
	}});
	
}

function _cancelSockets()
{
	socket.disconnect();
}

function notify(type, message, position, closable)
{	
	head.js('lib/bootstrap-notifications-min.js', function(){
		 $('.' + position).notify({
				type: type,
				message: {html: message},
				closable: closable,
				fadeOut: { enabled: true, delay: 10000000 },
				transition: 'fade'
			}).show();
	});
}

$(function(){
//	setTimeout(downloadAndRegisterForNotifications, 7000);
	
	fetchContactAndNotify('manohar@invox.com');
	
});// On click on row in Opportunities triggers the details of particular opportunity
$(function () {
    $('#opportunities-model-list > tr').live('click', function (e) {
        e.preventDefault();
        var data = $(this).find('.leads').attr('leads');

        if (data) {
            Backbone.history.navigate("deals/" + data, {
                trigger: true
            });
        }
    });
});


//Populate users in options of owner input field dropdown
function populateUsers(id, el) {
	// Users
	 var users = new Base_Collection_View({
         url: '/core/api/deal-owners',
         restKey: 'userPrefs',
         templateKey: 'owners',
         individual_tag_name: 'option'
     });
	users.collection.fetch();
     $('#owner',el).html(users.el);
     
     // Fill milestones select options
     var milestone_model = Backbone.Model.extend({
    	 url: '/core/api/milestone'
 		});
     
     var model = new milestone_model();
     model.fetch({ 
    			 success: function(data) 
    			 { 
 						var jsonModel = data.toJSON();
 						var milestones = jsonModel.milestones;
 						
 						// Split , and trim
 						var array = [];
 						$.each(milestones.split(","), function(){
 							array.push($.trim(this));
 						});
 						
 						fillTokenizedSelect('milestone', array)
     			   }
     });
     return el;
}

// To edit and update the opportunity
$("#editOpportunity").live("click", function (e) {

    e.preventDefault();
    
    var view = new Base_Model_View({
        url: 'core/api/opportunity',
        model: App_Deals.opportunityCollectionView.currentDeal,
        template: "opportunity-add",
        window: 'deals',
        postRenderCallback: function(el){
            	populateUsers("owner", el);
            	
            	// Call setupTypeAhead to get tags
            	agile_type_ahead("relates_to", el, contacts_typeahead);         	
            },
    	});
    
    	var view = view.render();
    	$("#content").html(view.el);   
});

// 	To change the progress of the deals
$('#move li a').live('click', function (e) {

    e.preventDefault();
    var opportunity = App_Deals.opportunityCollectionView.currentDeal;
    opportunity.set('milestone',this.id);
    
    //opportunity.milestone = this.id;
    opportunity.url = 'core/api/opportunity';
    opportunity.save();
    App_Deals.opportunityCollectionView.collection.add(opportunity);
});
$(function(){
	
    $('#searchForm').keyup(function () {
    	   	
    	console.log('Searching');
    	
        // Get Value
        var keyword = $('#searchText').val();
        if (isNotValid(keyword) || keyword.length <= 2) {
            $('#searchForm').removeClass("open");
            return;
        }

    	console.log('Keyword ' + keyword);
        
        var view = new Base_Collection_View({
            url: '/core/api/contacts/search/' + keyword,
            restKey: "contact",
            templateKey: "search",
            individual_tag_name: 'li'
        });

        view.collection.fetch({
        	success: function()
        	{
        		 $('#searchForm').find('ul').remove();
        	     $('#searchForm').append(view.render().el);
        	     $('#searchForm').addClass("open");
        	}
        });
       
    });


    $('#search-menu').click(function () {
        $('#searchForm').removeClass("open");
        $('#searchText').val('');
    });	
});/*------------- Social Search Collection --------------*/
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
/*------------- End of Social Search View --------------*/function setupTagsTypeAhead(models) {
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

}  // Tasks
$(function () { 
	$('.tasks-select').live('change', function(){
        if($(this).is(':checked')){
            
        	// Complete
        	var taskId = $(this).attr('data');
        	completeTask(taskId, $(this))
        }
    });
});

function getDue(due) {
    // Get Todays Date
    var date = new Date();
    date.setHours(0, 0, 0, 0);

    date = date.getTime() / 1000;
    //console.log("Today " + date + " Due " + due);
    return Math.floor((due - date) / (24 * 3600));
}


function appendTasks(base_model) {

	//console.log(base_model);
	
	var itemView = new Base_List_View({
        model: base_model,
        "view": "inline",
        template: 'tasks-model',
       });

    // add to the right box - overdue, xxx
    var due = getDue(base_model.get('due'));
    //console.log(due);
    if (due < 0) {
        $('#overdue', this.el).append(itemView.render().el);
        $('#overdue', this.el).show();
    }

    // Today
    if (due == 0) {
        $('#today', this.el).append(itemView.render().el);
        $('#today', this.el).show();
    }

    // Tomorrow
    if (due == 1) {
        $('#tomorrow', this.el).append(itemView.render().el);
        $('#tomorrow', this.el).show();
    }

    // Next Week
    if (due > 1) {
        $('#next-week', this.el).append(itemView.render().el);
        $('#next-week', this.el).show();
    }


    //  $('#' + this.options.collection_key, this.el).append(itemView.render().el);
}

function completeTask(taskId, ui)
{
	console.log("Deleting Task " + taskId);
	var collection = App_Calendar.tasksListView.collection;
	var model = collection.get(taskId);
	
	// Set is complete flag to be true
	model.set('is_complete', true);
	model.url = '/core/api/tasks';
	
	// Destroy and hide the task
	model.save({success: function(model, response) {
		ui.closest('.task-individual').slideUp('slow');
	}}
	);
	
}$(function(){ 

	$(".upload_s3").live('click', function(e){
		e.preventDefault();
		uploadImage("account_prefs");
	});
	
});	

function uploadImage(id)
{
	var newwindow = window.open("upload.jsp?id=" + id,'name','height=310,width=500');
	if (window.focus)
	{
		newwindow.focus();
	}
	return false;
}

function setImageURL(url)
{
	var id = "account_prefs";
	// Set the media stream
	$('#' + id).find('.imgholder').html('');
	$('#' + id).find('.imgholder').html('<img src="' + url + '" height="100" width="100"/>');

	// Set the value of selector for Post
	$('#' + id + '_url').attr('value', url);
		
	
	}


// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}


function fillSelect(selectId, url, parseKey, callback, template)
{
	// Fetch Collection from URL
	var collection_def = Backbone.Collection.extend({
	       url: url,
	       parse: function (response) {
	    	   
	    	   if (response && response[parseKey]) 
	           	return response[parseKey];
	           
	           return response;
	    	    }
	   });
	
	 var collection = new collection_def();
	 collection.fetch({
	       success: function () {
	    	   console.log(collection.models);
	    	   console.log(collection.toJSON());
	       	
	       	  // Delete prev options if any
	       	  $("#" + selectId).empty().append('<option>Select...</option>');
	       		
	       	  $.each(collection.toJSON(), function(index, model){
	       		
	       			// Convert template into HTML
	       			var modelTemplate = Handlebars.compile(template);
	       			var optionsHTML = modelTemplate(model);
	       			$("#"  + selectId).append(optionsHTML);
	       			
	       			 if (callback && typeof(callback) === "function") {
	       	        	// execute the callback, passing parameters as necessary
	       	        	callback();
	       	        }	
	       		});
	       	 }
	   	
	   });
}

//Fill selects with tokenized data
function fillTokenizedSelect(selectId, array){
	$("#" + selectId).empty().append('<option>Select...</option>');
		$.each(array,function(index, element){
			$("#" + selectId).append('<option value=' + '"' + element +'">' + element + '</option>');
		});
}

function btnDropDown(contact_id, workflow_id){

}



 var Catalog_Widgets_View = null;

// Show when Add widget is selected by user in contact view
function pickWidget() {
    if (Catalog_Widgets_View == null) {
        Catalog_Widgets_View = new Base_Collection_View({
            url: '/core/api/widgets/default',
            restKey: "widget",
            templateKey: "widgets-add",
            individual_tag_name: 'div'
        });

        Catalog_Widgets_View.collection.fetch();
    }
    $('#content').html(Catalog_Widgets_View.el);
}

// Load Widgets
function loadWidgets(el, contact, user) {
	
	// Create Data JSON
	var data = {contact: contact, user: user};
	
	// console.log("Contact length" + escape(contact).length)
	
    var view = new Base_Collection_View({
        url: '/core/api/widgets',
        restKey: "widget",
        templateKey: "widgets",
        individual_tag_name: 'li',
        sortKey: 'position',
        modelData: data
    });

    view.collection.fetch({
        success: function () {
        	
        	
        	// Fetch all Widgets URL and run them through handlebars to convert {{xx} to actual values
        	  _(view.collection.models).each(function (model) { // in case collection is not empty
						var id = model.get("id");
						var url = model.get("url");
						$.get(url, "script");
						
						// Set the data element in the div
						// We can retrieve this in get plugin prefs
						
						$('#' + model.get('name')).data('model', model);						
				}, this);
        	
            // Make widgets sortable
            $(".widget-sortable", newEl).sortable({
                update: function (event, ui) {                	
                	var models = [];

                    // Store the save
                    $('.widget-sortable li').each(function (index) {

                    	var model_name = $(this).find('.widget').attr('id');
                        
                        // Get Model
                        var model = $('#' + model_name).data('model');
                        
                        // console.log(modelId);
                        models.push({id: model.get("id"), position: index});
                    });
                    
                    // Store the positions at server
                    $.ajax({
                        type: 'POST',
                        url: '/core/api/widgets/positions',
                        data: JSON.stringify(models),
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                           // console.log("Positions Saved Successfully");
                        },
                        dataType: 'json'
                    });
                }
            });
            $(".widget-sortable", newEl).disableSelection();
        }
    });
    
    
    
    var newEl = view.render().el;

    $('#widgets', el).html(newEl);
}

$(function () {

    $('.add-widget').live('click', function (e) {

        var widgetName = $(this).attr('widget-name');
        if (Catalog_Widgets_View == null) {
            alert("widgets are not loaded yet");
            return;
        }

        alert("saving " + widgetName);

        // Get Widget Model
        var models = Catalog_Widgets_View.collection.where({
            name: widgetName
        });
        if (models.length == 0) {
            alert("Not found");
        }
        var widgetModel = models[0];
        var newWidgetModel = widgetModel.clone();
        newWidgetModel.url = '/core/api/widgets';
        newWidgetModel.save();
        
        // Navigate back to the contact id form
        Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, { trigger: true });
        
    })
});


function addSocial(socialEl) {

    // Add Social Search
    var socialServices = ["TWITTER", "LINKEDIN"];

    $.each(socialServices, function (index, value) {
        var url = "/core/api/social/" + value + "/" + App_Contacts.contactDetailView.model.id
      
        var socialResults = new SocialSearchesListView();
        socialResults.collection.url = url;

        // Check if the results are present in local Storage 
        var key = value + '-' + App_Contacts.contactDetailView.model.id;

        // Store the key for list to retrieve
        socialResults.key = key;
        var cache = localStorage.getItem(key);

        if (localStorage && cache != null && JSON.parse(cache).length != 0) {
            socialResults.collection = new SocialSearchCollection(JSON.parse(cache));
            socialResults.render();
        } else socialResults.collection.fetch();


        	$('#social', socialEl).append(socialResults.el);
    });
}


/*
 * THIRD PARTY SCRIPTS - PLUGINS - INTEGRATION POINTS
 */

//Updates the current contact
function agile_crm_update_contact(propertyName, value)
{
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	var properties = contact_model.toJSON()['properties'];

	properties.push({"name":propertyName,"value":value});
	

	// Update the property
	
	contact_model.set("properties", properties);
	
	// Set URL - is this required?
	contact_model.url = 'core/api/contacts'
	// Save model
	contact_model.save();
}

function agile_crm_add_note(sub, description)
{
	// Add Note to Notes Collection
	
	// Get Current Contact Model
	var contact_model =  this.contactDetailView.model;
	
	// Get ID
	
	// Create Model and Save
	
}

function agile_crm_get_contact ()
{
	return App_Contacts.contactDetailView.model.toJSON();
		
}

// Finds whether property name exists 
function agile_crm_get_contact_property(propertyName) {
	
	var contact_model =  App_Contacts.contactDetailView.model;
	
	var properties = contact_model.get('properties');
	var property;
	
	$.each(properties,function(key,value){
		if(value.name == propertyName){
			property = value;
		}
	});
	
	if(!property) {
		var object = agile_crm_get_widget_property("Twitter");
		//$.getJSON("/core/api/widget/contact/TWITTER/" + object.Twitter +"/" + plugin_id, function (data) {
	}
		
	return property;

}

// Get Plugin Id
function agile_crm_get_plugin_id(pluginName)
{
	var model_data = $('#' + pluginName).data('model');
	return model_data.get('id');
}
	
// Get Plugin Prefs
function agile_crm_get_plugin_prefs(pluginName)
{
	
	return $('#' + pluginName).data('model').toJSON().prefs;
}


 // Save widget Property 
function agile_crm_save_widget_property(propertyName, value) {
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');
		
	// If widget_properties are null
	if(!widget_properties)
		widget_properties = {};
	
	else
		widget_properties = JSON.parse(widget_properties);

	widget_properties[propertyName] = value;
	
	contact_model.set({"widget_properties" : JSON.stringify(widget_properties)},{silent: true});
	
	contact_model.url = 'core/api/contacts'
		
	// Save model
		contact_model.save()
	
}

// Get widget by property name
function agile_crm_get_widget_property(propertyName) {
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');
	
	// If widget-properties are null return 
	if(!widget_properties)
		return;
	
	// Convert JSON string to JSON Object
	widget_properties = JSON.parse(widget_properties);
	
	
	
	
	return widget_properties[propertyName];
}

// Delete widget property
function agile_crm_delete_widget_property(propertyName) {
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');
	
	// If widget-properties are null return 
	if(!widget_properties)
		return;

	widget_properties = JSON.parse(widget_properties);
	
	delete  widget_properties[propertyName];
	
	contact_model.set({"widget_properties" : JSON.stringify(widget_properties)},{silent: true});
	
	contact_model.url = 'core/api/contacts';
	
	// Save model
	contact_model.save()
}$(function(){
	
	 // Save Workflow
    $('#saveWorkflow').live('click', function () {

    	// Check if the form is valid
    	if (!isValidForm('#workflowform')) {
    		$('#workflowform').find("input").focus();
    		return false;
    	}
    	
        // Get Designer JSON
        var designerJSON = window.frames.designer.serializePhoneSystem();

        var name = $('#workflow-name').val();
        if (isNotValid(name)) {
            alert("Name not validd");
            return;
        }

        var workflowJSON = {};

        if (App_Workflows.workflow_model != undefined) {
            workflowJSON = App_Workflows.workflow_model;
            App_Workflows.workflow_model.set("name", name);
            App_Workflows.workflow_model.set("rules", designerJSON);
            App_Workflows.workflow_model.save();
        } else {

            workflowJSON.name = name;
            workflowJSON.rules = designerJSON;

            var workflow = new Backbone.Model(workflowJSON);
            App_Workflows.workflowsListView.collection.create(workflow);
        }

        Backbone.history.navigate("workflows", {
            trigger: true
        });
    });


	
});function setupHTMLEditor(selector)
{
	head.js('lib/wysihtml5-0.3.0-min.js', 'lib/bootstrap-wysihtml5-min.js', function(){
		console.log('setting up text');
		console.log(selector.html());
		
		 selector.wysihtml5();
	});
}

$(function () {
	   
    // Code for Merge fields in Email Template
    $("#field").die().live('click', function(e){  
    	
    	
    	e.preventDefault();
    	
    	// Get Selected Value
    	var fieldContent = $(this).attr("name");
    	
    	// Get Current HTML
    	var val = $('#email-template-html').val();
    	
    	// Set New HTML
    	var wysihtml5 = $('#email-template-html').data('wysihtml5');
    	if(wysihtml5)
    	{
    		//wysihtml5.editor.setValue(fieldcontent + " " + val, true);
    		wysihtml5.editor.composer.commands.exec("insertHTML", fieldContent);
    	} 	
    });
    
});

var AdminSettingsRouter = Backbone.Router.extend({

    routes: {        
        /* Settings */
    	"account-prefs": "accountPrefs",
        "users": "users",
        "users-add": "usersAdd",
        "custom-fields": "customFields",
        "analytics-code": "analyticsCode",
        "api": "api",
        "admin": "adminSettings", // Yaswanth - 08/03/12,
        "milestones": "milestones"
    },
    
    adminSettings: function()
    {
    	console.log("Admin Settings");
    	
    	// Show admin - checks internally if the user has admin access
    	this.adminView = new Base_Model_View({
    		url: "/core/api/current-user",
    		template: "admin-settings"
    	}); 
    	
    	 this.adminView.model.fetch();
    	$('#content').html(this.adminView.render().el);
    	
    },
    accountPrefs: function () {
        var view = new Base_Model_View({
            url: '/core/api/account-prefs',
            template: "admin-settings-account-prefs"
        });

        $('#content').html(view.render().el);
    },
    users: function () {
    	
    	// Send edit
    	// var data = {'edit_template': 'user-add'};
    	
        this.usersListView = new Base_Collection_View({
            url: '/core/api/users',
            restKey: "domainUser",
            templateKey: "admin-settings-users",
            individual_tag_name: 'tr'
        });

        this.usersListView.collection.fetch();
        $('#content').html(this.usersListView.el);
    },
    usersAdd: function () {
    	
    	var view = new Base_Model_View({
            url: 'core/api/users',
            template: "admin-settings-user-add",
            isNew: true,
            window: 'users'
        });

        $('#content').html(view.render().el);
    	
    },
    customFields: function () {
    	
    	this.customFieldsListView = new Base_Collection_View({
            url: '/core/api/custom-fields',
            restKey: "customFieldDefs",
            templateKey: "admin-settings-customfields",
            individual_tag_name: 'tr'
        });

    	this.customFieldsListView.collection.fetch();
        $('#content').html(this.customFieldsListView.el);
    },
    analyticsCode: function () {
    	
    	  head.js('lib/prettify-min.js', function()
    	  {
            var view = new Base_Model_View({
             url: '/core/api/api-key',
                   template: "admin-settings-api-key-model",
                   postRenderCallback: function(el){
                    prettyPrint();
                     }
                }); 
            $('#content').html(view.el);
    	  });
          
    },
    api: function (){
    	head.js('lib/prettify-min.js', function()
    	    	  {
    	             var view = new Base_Model_View({
    	             url: '/core/api/api-key',
    	             template: "admin-settings-api-model",
    	             postRenderCallback: function(el){
    	                    prettyPrint();
    	                     }
    	                }); 
    	            $('#content').html(view.el);
    	    	  });
    },
    milestones: function () {
        var view = new Base_Model_View({
        	url: '/core/api/milestone',
        	template: "admin-settings-milestones",
        	reload: true
        });
        
        $('#content').html(view.render().el);
        },
});
// All Routers are global
var App_Contacts, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings;

$(function () 
{
	App_Contacts = new ContactsRouter();
	App_Workflows = new WorkflowsRouter();
	App_Deals = new DealsRouter();
	App_Admin_Settings = new AdminSettingsRouter();
	App_Calendar = new SettingsRouter();
	App_Settings = new CalendarRouter();
    
	// For infinite page scrolling
	App_Contacts.bind("all", currentRoute);
	App_Workflows.bind("all", currentRoute);
	App_Deals.bind("all", currentRoute);
	App_Admin_Settings.bind("all", currentRoute);
	App_Calendar.bind("all", currentRoute);
	App_Settings.bind("all", currentRoute);
    
    Backbone.history.start();
});


var Current_Route;
function currentRoute(route)
{
	Current_Route = (route.split(":")[1]);
}var CalendarRouter = Backbone.Router.extend({

    routes: {
        "calendar": "calendar"
    },
    calendar: function () {

        $(".active").removeClass("active");
        $("#calendarmenu").addClass("active");

        $('#content').html(getTemplate("calendar", {}));
        
        // Typahead also uses jqueryui - if you are changing the version here, change it there too
        head.js('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js', 'lib/fullcalendar.min.js',
        		function(){showCalendar()});


        this.tasksListView = new Base_Collection_View({
            url: '/core/api/tasks',
            restKey: "task",
            templateKey: "tasks",
            individual_tag_name: 'tr'
        });

        this.tasksListView.appendItem = appendTasks;
        this.tasksListView.collection.fetch();

        $('#tasks').html(this.tasksListView.el);

    }
});
    
var ContactsRouter = Backbone.Router.extend({

    routes: {
        "": "dashboard",

        /* Contacts */
        "contacts": "contacts",
        "contact/:id": "contactDetails",
        "import": "importContacts",
        "add-widget": "addWidget",
        "contact-edit":"editContact",
        "contact-duplicate":"duplicateContact",
        "tags/:tag": "contacts",
        "contacts-filter": "filterContacts",
        "send-email": "sendEmail",

         
        /* Views */
        "contact-view-add": "contactViewAdd",
        "contact-views": "contactViews",
          
        /* New Contact/Company - Full mode */
        "continue-contact": "continueContact",
        "continue-company": "continueCompany",

        /* Return back from Scribe after oauth authorization */
        "gmail": "email",
        "twitter": "socialPrefs",
        "linkedin": "socialPrefs"
    },
    initialize: function () {

    	 
    	    
    },

    dashboard: function () {

    },
    contacts: function (tag_id) {
    		
    	var max_contacts_count = 20;
    	 
    	// Tags, Search & default browse comes to the same function
    	var url = '/core/api/contacts/cursor/' + max_contacts_count;
    	var restKey = 'contacts';
    	if(tag_id)
    	{
    		url = '/core/api/tags/' + tag_id;
    		restKey = 'contact';
    	}
    	 
    	console.log("Fetching from " + url);
    	
          this.contactsListView = new Base_Collection_View({
              url: url,
              restKey: restKey,
              templateKey: "contacts",
              individual_tag_name: 'tr',
              cursor: true
          });

          // Contacts are fetched when the app loads in the initialize
          var cel = this.contactsListView.el;
          var collection = this.contactsListView.collection;
          this.contactsListView.collection.fetch({
              success: function (collection, response) {
                  setupTags(cel);
                  setupViews(cel);
                		  
                  // Set the cursor
                  //console.log("Cursor " + response.cursor);
                  collection.cursor = response.cursor;
              }
          });

          // Show the views collection on the actions dropdown 	
          var customView = new Base_Collection_View({
              url: 'core/api/contact-view',
              restKey: "contactView",
              templateKey: "contact-view",
              individual_tag_name: 'li',
          });


          $('#content').html(this.contactsListView.render().el);
         
    },

    contactDetails: function (id, contact) {

    	// If hte user refreshes the contacts list view page directly - we should load from the model
        if(!contact)
    	if (!this.contactsListView || this.contactsListView.collection.length == 0 || this.contactsListView.collection.get(id) == null) {
        	
    		
    		console.log("Downloading contact");
    		
        	// Download 
        	var contact_details_model = Backbone.Model.extend({
        		  url: function() {
        		    return '/core/api/contacts/'+this.id;
        		  }
        		});
        	
        	var model = new contact_details_model();
        	model.id = id;
        	model.fetch({ success: function(data) { 
        		
        			// Call Contact Details again
        			App_Contacts.contactDetails(id, model);
        			
        	}});
        	
        	
        	return;
        }

        // If not downloaded fresh during refresh - read from collection
        if(!contact)
        	contact = this.contactsListView.collection.get(id);
        
        this.contactDetailView = new Base_Model_View({
            model: contact,
            template: "contact-detail",
            postRenderCallback: function(el) {
                loadWidgets(el, contact.toJSON());
               }
        });
        
       
        var el = this.contactDetailView.render().el;
      
        $('#content').html(el);
       
    },
    editContact: function () {
    	
    	 // Takes back to contacts if contacts list view is not defined
   	 if (!this.contactDetailView || !this.contactDetailView.model.id || !this.contactsListView || this.contactsListView.collection.length == 0) {
            this.navigate("contacts", {
                trigger: true
            });
            return;
        }
   	 	
    	// Contact Edit - take him to continue-contact form
    	var contact = this.contactsListView.collection.get(this.contactDetailView.model.id);
     	//$('#content').html(getTemplate('continue-contact', contact.toJSON()));
     	deserializeContact(contact.toJSON())
     	
    },
    
    duplicateContact: function () {
    	
      	 // Takes back to contacts if contacts list view is not defined
     	 if (!this.contactDetailView || !this.contactDetailView.model.id || !this.contactsListView || this.contactsListView.collection.length == 0) {
              this.navigate("contacts", {
                  trigger: true
              });
              return;
         }
     	 	
      	// Contact Duplicate
      	var contact = this.contactsListView.collection.get(this.contactDetailView.model.id);
      	contact = contact.clone();
      	
      	// Delete email as well as it has to be unique
      	delete_contact_property(contact, 'email');
      	
      	
      	var json = contact.toJSON();
      	delete json.id;
      	
      	
        var contactDuplicate = new Backbone.Model();
        contactDuplicate.url = 'core/api/contacts';
        contactDuplicate.save(json,{
        	success: function(data)
        	{
        	}
        });
    },
    continueContact: function () {
        $('#content').html(getTemplate('continue-contact', {}));
    },

    continueCompany: function () {
        $('#content').html(getTemplate('continue-company', {}));
    },
    importContacts: function () {
        $('#content').html(getTemplate("import-contacts", {}));
        head.js('lib/fileuploader-min.js', function(){
        	fileUploadInit();
        });
    },
   
    addWidget: function () {

        pickWidget();

    },
    
    contactViewAdd: function(){
    	var view = new Base_Model_View({
    		url: 'core/api/contact-view',
    		isNew: true,
    		window: "contact-views",
    		 template: "contact-view",
    	});
    	$('#content').html(view.render().el);
    },
    contactViews: function() {
    	   var contactViewListView = new Base_Collection_View({
               url: '/core/api/contact-view',
               restKey: "contactView",
               templateKey: "contact-list-view",
               individual_tag_name: 'tr'
           });
    	   contactViewListView.collection.fetch();
    	   console.log(contactViewListView.el);
    	   $('#content').html(contactViewListView.el);
    },
    sendEmail: function(){
    	
    	// Show the email form with the email prefilled from the curtrent contact
    	var model =  this.contactDetailView.model;
    	var sendEmailView = new Base_Model_View({
            model: model,
            template: "send-email"
        });
    	$("#content").html(sendEmailView.render().el);
    	
    	 // Add From address to the form (FROM - current user email)
		 var CurrentuserModel = Backbone.Model.extend({
		     url: '/core/api/current-user',
		     restKey: "domainUser"
		});
		 
		var currentuserModel = new CurrentuserModel();
		currentuserModel.fetch({success: function(data){
				var model = data.toJSON();
				$("#emailForm").find( 'input[name="from"]' ).val(model.email);
		}});
		
		// Prefill the templates
		var optionsTemplate = "<option value='{{id}}'> {{subject}}</option>";
		fillSelect('sendEmailSelect', '/core/api/email/templates', 'emailTemplates', undefined , optionsTemplate);
    },  
    
    filterContacts: function()
    {
    	head.js('lib/jquery.chained.min.js', function()
    	{
    		$('#content').html(getTemplate('filter-contacts', {}));
    		$("#secondSelect").chained("#firstSelect"); 
    		$("#thirdSelect").chained("#secondSelect");
    		$("#fourthSelect").remoteChained("#secondSelect","/core/api/tags/filter-tags");
    	})
    },
    
});


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

}var DealsRouter = Backbone.Router.extend({

    routes: {
    	
    	 /* Deals/Opportunity */
        "deals": "deals",
        "deals-add": "dealsAdd",
        "deals/:id": "dealsDetails"
    },
    deals: function () {
    	this.opportunityCollectionView = new Base_Collection_View({
            url: 'core/api/opportunity',
            restKey: "opportunity",
            templateKey: "opportunities",
            individual_tag_name: 'tr'
        });

        this.opportunityCollectionView.collection.fetch(
        		{
        			success:function(){ 
        				// Show Milestones Pie
        				pieMilestones();
        				pieDetails();
        				}
        		});
        
        $('#content').html(this.opportunityCollectionView.render().el);

        $(".active").removeClass("active");
        $("#dealsmenu").addClass("active");        
        	
    },
    dealsAdd: function () {
        
    	this.opportunityModelview = new Base_Model_View({
            url: 'core/api/opportunity',
            template: "opportunity-add",
            isNew: true,
            window: 'deals',
            postRenderCallback: function(el){
            	populateUsers("owner", el);

            	agile_type_ahead("relates_to", el, contacts_typeahead);
            	
            	// Enable the datepicker
                $('#close_date', el).datepicker({
                    format: 'mm-dd-yyyy'
                });
            }
        });

    	var view = this.opportunityModelview.render();
     	
        $('#content').html(view.el);
    },
    dealsDetails: function (id) {
        
    	// Send to deals if the user refreshes it directly
    	if (!this.opportunityCollectionView || this.opportunityCollectionView.collection.length == 0) {
            this.navigate("deals", {
                trigger: true
            });
            return;
        }
        this.opportunityCollectionView.collection.fetch();
        this.opportunityCollectionView.currentDeal = this.opportunityCollectionView.collection.get(id);

        this.dealsDetailView = new Base_Model_View({
            model: this.opportunityCollectionView.currentDeal,
            template: "opportunity-detail"    
        });	
        
        var el = this.dealsDetailView.render().el;
        $('#content').html(el);
    }
});
    var SettingsRouter = Backbone.Router.extend({

    routes: {        
        /* Settings */
    	"settings": "settings", 
        "user-prefs": "userPrefs",
        "social-prefs": "socialPrefs",
        "email-templates": "emailTemplates",
        "email-template-add": "emailTemplateAdd",
        "email": "email",
        "notification-prefs":"notificationPrefs",
    },
    
    settings: function () {
        var html = getTemplate("settings", {});
        $('#content').html(html);

        // Update Menu
        $(".active").removeClass("active");
        $("#settingsmenu").addClass("active");
    },
       
    userPrefs: function () {
        var view = new Base_Model_View({
            url: '/core/api/user-prefs',
            template: "settings-user-prefs",
            reload: true,
            postRenderCallback: function(el){
            	 // Setup HTML Editor
                setupHTMLEditor($('#WYSItextarea'));
            }
        });

        $('#content').html(view.render().el);
        
       
    },
    socialPrefs: function () {
        var data = {
            "service": "linkedin"
        };
        var itemView = new Base_Model_View({
            url: '/core/api/social-prefs/LINKEDIN',
            template: "settings-social-prefs",
            data: data
        });

        $('#content').html(itemView.render().el);

        data = {
            "service": "twitter"
        };
        var itemView2 = new Base_Model_View({
            url: '/core/api/social-prefs/TWITTER',
            template: "settings-social-prefs",
            data: data
        });

        $('#content').append(itemView2.render().el);

    },
    
    email: function () {
        // Get Social Prefs (Same as Linkedin/Twitter) for Gmail
        var data = {
            "service": "gmail"
        };
        var itemView = new Base_Model_View({
            url: '/core/api/social-prefs/GMAIL',
            template: "settings-social-prefs",
            data: data
        });
        
        console.log(itemView.model.toJSON());

        // Add Gmail Prefs
        $('#content').html(itemView.render().el);

        // Get IMAP Prefs
        var itemView2 = new Base_Model_View({
            url: '/core/api/imap',
            template: "settings-imap-prefs"
        });

        // Add IMAP
        $('#content').append(itemView2.render().el);

    },
    emailTemplates: function () {
        var view = new Base_Collection_View({
            url: '/core/api/email/templates',
            restKey: "emailTemplates",
            templateKey: "settings-email-templates",
            individual_tag_name: 'tr'
        });

        view.collection.fetch();
        $('#content').html(view.el);
     
    },
    emailTemplateAdd: function () {
    	var view = new Base_Model_View({
            url: '/core/api/email/templates',
            template: "settings-email-template-add", 
            window: 'settings',
            postRenderCallback: function(el){
           	 // Setup HTML Editor
               setupHTMLEditor($('#email-template-html'));
           }
         });
        $('#content').html(view.render().el);       
    },
    
    notificationPrefs: function(){
    	
    	var view = new Base_Model_View({
    		url: 'core/api/notifications',
    		template: 'settings-notification-prefs',
    	});
    	
    	$('#content').html(view.render().el);
    }
    
});
var WorkflowsRouter = Backbone.Router.extend({

    routes: {
    	
        /* Workflows/Campaigns */
        "workflows": "workflows",
        "workflow-add": "workflowAdd",
        "workflow/:id": "workflowEdit",
          },
            
      workflows: function () {
            this.workflowsListView = new Base_Collection_View({
                url: '/core/api/workflows',
                restKey: "workflow",
                templateKey: "workflows",
                individual_tag_name: 'tr'
            });
            
          
            this.workflowsListView.collection.fetch();
            $('#content').html(this.workflowsListView.el);  
            
            $(".active").removeClass("active");
            $("#workflowsmenu").addClass("active");
        },
        workflowAdd: function () {
            if (!this.workflowsListView || !this.workflowsListView.collection) {
                this.navigate("workflows", {
                    trigger: true
                });
                return;
            }

            /* Reset the designer JSON */
            this.workflow_json = undefined;
            this.workflow_model = undefined;
            
            $('#content').html(getTemplate('workflow-add', {}));
        },
        workflowEdit: function (id) {
            if (!this.workflowsListView || this.workflowsListView.collection.length == 0) {
                this.navigate("workflows", {
                    trigger: true
                });
                return;
            }

            /* Set the designer JSON. This will be deserialized*/
            this.workflow_model = this.workflowsListView.collection.get(id);
            this.workflow_json = this.workflow_model.get("rules");

            $('#content').html(getTemplate('workflow-add', {}));
            
            // Set the name
            $('#workflow-name').val(this.workflow_model.get("name")); 
        }
});function isNotValid(value) {
    if (value == undefined) return true;
    if (value.length == 0) return true;
    return false;
}


function isValidField(id) {
    var value = $('#' + id).val();
    return !isNotValid(value);
}

function propertyJSON(name, id, type) {
    var json = {};

    if (type == undefined) json.type = "SYSTEM";
    else json.type = type;

    json.name = name;
    json.value = $('#' + id).val();
    return json;
}


$('#ajax').hide() // hide it initially
.ajaxStart(function () {
    $(this).show();
}).ajaxStop(function () {
    $(this).hide();
}).ajaxError(function () {
    $(this).hide();
});
