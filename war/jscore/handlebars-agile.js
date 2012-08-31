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
	
	// Get required log from logs
	Handlebars.registerHelper('getRequiredLog', function(logArrayString, name) {
		var logArray = JSON.parse(logArrayString);
		if(name == "t")
		{
			var readableTime = new Date(logArray[0][name]);
			return readableTime;
		}
		return logArray[0][name];
	});
    
});