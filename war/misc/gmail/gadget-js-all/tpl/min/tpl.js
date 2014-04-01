(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['gadget-add-contact'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n	   				<input name=\"first_name\" id=\"fname\" placeholder=\"First name\" value=\"";
  if (helper = helpers.fname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text\" class=\"required\" />\n				";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n					<input name=\"first_name\" id=\"fname\" placeholder=\"First name\" type=\"text\" class=\"required\" />\n				";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		    			<input name=\"last_name\" id=\"lname\" placeholder=\"Last name\" value=\"";
  if (helper = helpers.lname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"required\" type=\"text\" />\n					";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "\n						<input name=\"last_name\" id=\"lname\" placeholder=\"Last name\" class=\"required\" type=\"text\" />\n					";
  }

  buffer += "<form class=\"gadget-contact-form form-horizontal\" name=\"gadget_contact_form\" method=\"post\" style=\"margin:0px;\">\n	<fieldset>\n		<div class=\"control-group\" style=\"margin:0px; padding-top:10px; border-top:1px solid #e5e5e5;\">\n			<label class=\"control-label\" for=\"fname\"><b>First Name</b><span class=\"field_req\">*</span></label>\n  			<div class=\"controls\">\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.fname), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		</div>\n		\n		<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n    		<label class=\"control-label\" for=\"lname\"><b>Last Name</b><span class=\"field_req\">*</span></label>\n			<div class=\"controls\">\n	    			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.lname), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "	\n			</div>\n		</div>\n\n		<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n			<label class=\"control-label\" for=\"email\"><b>Email</b></label>\n			<div class=\"controls\">\n				 <input name=\"email\" id=\"email\" placeholder=\"Email\" value=\"";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text\" />\n			</div>\n		</div>\n  		\n		<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n       		<label class=\"control-label\" for=\"tags\"><b>Tags</b></label>\n			<div class=\"controls\">\n				 <input name=\"tags\" id=\"tags\" placeholder=\"Tags\" type=\"text\" />\n			</div>\n    	</div>\n	\n		<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n			<label class=\"control-label\" for=\"company\"><b>Company</b></label>\n			<div class=\"controls\">\n				<input name=\"company\" id=\"company\" placeholder=\"Company\" type=\"text\" />\n			</div>\n  		</div>\n\n		<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n       		<label class=\"control-label\" for=\"title\"><b>Job Description</b></label>\n			<div class=\"controls\">\n				<input name=\"title\" id=\"title\" placeholder=\"Job title\" type=\"text\" />\n			</div>\n	  	</div>\n	</div>\n	<div class=\"form-actions\" style=\"padding-top:10px padding-bottom:10px; margin:10px 0px 0px 0px;\">\n		<a type=\"submit\" class=\"btn btn-primary gadget-contact-validate\" style=\"padding:2px 6px 2px;\">Add Contact</a>\n		<a class=\"cancel btn\" style=\"padding:2px 6px 2px; margin-left:5px;\">Cancel</a>\n		<img class=\"contact-add-waiting\" style=\"display:none;width:16px; margin-left:10px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n		<i class=\"contact-add-status\" style=\"color:indianred; margin-left:10px; display:none;\">Contact not found.</i>\n	</div>\n</fieldset>\n</form>	";
  return buffer;
  });
templates['gadget-campaign'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n								";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n							";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n									<option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n								";
  return buffer;
  }

  buffer += "<!--  Add to Campaign Form -->\n	<div class=\"gadget-campaign\" row-fluid\">\n        <form class=\"gadget-campaign-form form-horizontal\" name=\"gadget_campaign_form\" method=\"post\" style=\"margin:0px;\">\n            <fieldset style=\"margin:0px;\">\n				<input type=\"hidden\" name=\"email\" value='";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' />\n                \n				<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">       \n                    <label class=\"control-label\" for=\"campaign-select\">Select campaign<span class=\"field_req\">*</span></label>\n                    <div class=\"controls\">\n                        <select name=\"id\" id=\"campaign-select\" class=\"required\" style=\"width:210px;\">\n							<option value=\"\">Select..</option>\n							";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.length), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                        </select>\n                    </div>\n                </div>\n\n                <div class=\"form-actions\" style=\"padding-top:10px padding-bottom:10px; margin:10px 0px 0px 0px;\">         \n                    <a type=\"submit\" class=\"btn btn-primary gadget-campaign-validate\" style=\"padding:2px 6px 2px;\">Add to Campaign</a> \n                    <a class=\"cancel btn \" data-tab-identity=\"campaigns\" style=\"padding:2px 6px 2px; margin-left:5px;\">Cancel</a>\n					<img class=\"campaign-add-waiting\" style=\"display:none;width:16px; margin-left:10px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n                </div>\n            </fieldset>\n        </form>\n    </div>";
  return buffer;
  });
templates['gadget-campaigns-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.response), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n			";
  stack1 = (helper = helpers.stringToJSON || (depth0 && depth0.stringToJSON),options={hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth1),data:data},helper ? helper.call(depth0, depth0, "", options) : helperMissing.call(depth0, "stringToJSON", depth0, "", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program3(depth0,data,depth2) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n<li>\n	<div style=\"display:block;\">\n		<div id=\"campaigns\" class=\"activity-text-block\">\n			<span class=\"activity-block-owner pull-right\">\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.log_type), {hash:{},inverse:self.program(6, program6, data),fn:self.programWithDepth(4, program4, data, depth2),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</span>\n			\n			";
  stack1 = (helper = helpers.if_email_sent || (depth0 && depth0.if_email_sent),options={hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, depth0, "log_type", options) : helperMissing.call(depth0, "if_email_sent", depth0, "log_type", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n			<small class=\"edit-hover\" style=\"margin-right:10px; color:#b2b0b1;\">\n				<time class=\"log-created-time\" datetime=\""
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "", (depth0 && depth0.time), options) : helperMissing.call(depth0, "epochToHumanDate", "", (depth0 && depth0.time), options)))
    + "\" style=\"border-bottom:dotted 1px #999\">"
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.time), options) : helperMissing.call(depth0, "epochToHumanDate", "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.time), options)))
    + "</time>\n	        	<a target=\"_blank\" class=\"pull-right\" href=\""
    + escapeExpression(((stack1 = (depth2 && depth2.ac_path)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "#workflow/";
  if (helper = helpers.campaign_id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.campaign_id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"Show Workflow in Agile\"> ";
  if (helper = helpers.campaign_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.campaign_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n				<p class=\"pull-right\">Campaign - </p>\n			</small>	\n		</div>\n	</div>\n</li>\n			";
  return buffer;
  }
function program4(depth0,data,depth3) {
  
  var buffer = "", stack1, helper;
  buffer += "\n					<img class=\"user-img\" width=\"40\" height=\"40\" alt=\"\" src=\""
    + escapeExpression(((stack1 = (depth3 && depth3.lib_path)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "img/campaigns/";
  if (helper = helpers.log_type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.log_type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ".png\">\n				";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "\n					<img class=\"user-img\" width=\"40\" height=\"40\" src=\"https://d13pkp0ru5xuwf.cloudfront.net/css/images/pic.png\">\n				";
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n	\n				<h4><a style=\"text-decoration: none\"><b>";
  if (helper = helpers.Subject) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.Subject); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b></a></h4></br>\n				<div class=\"in collapse\">\n					<ul style=\"list-style-type:none; border-bottom:1px solid #ddd; padding-bottom:12px; margin:0px;\">\n    		    		<li><strong>From:</strong> ";
  if (helper = helpers.From) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.From); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li> \n						<li><strong>To:</strong> ";
  if (helper = helpers.To) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.To); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n					</ul>\n       				<p style=\"margin-top:10px\">";
  if (helper = helpers.Body) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.Body); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n	    		</div>\n				     \n			";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "			\n\n				<h4><a style=\"text-decoration: none\"><b>"
    + escapeExpression((helper = helpers.titleFromEnums || (depth0 && depth0.titleFromEnums),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.log_type), options) : helperMissing.call(depth0, "titleFromEnums", (depth0 && depth0.log_type), options)))
    + "</b></a></h4></br>\n				<p>";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n			\n			";
  return buffer;
  }

function program12(depth0,data) {
  
  
  return "\n		<li>\n			<div style=\"display:block;\" class=\"activity\">\n				<div id=\"notes\" class=\"activity-text-block\">\n					<h4 style=\"display:inline; margin-right:10px;\">You have no campaigns for this contact.</h4>\n					<a class=\"action-add-campaign\" style=\"display:inline-block; cursor:pointer; margin-left:-3px; text-decoration:underline; line-height:25px;\"><i class=\"icon-plus\" style=\"text-decoration:none; margin-right:2px;\"></i><span>Add to Campaign</span></a>\n				</div>\n			</div>\n		</li>\n	";
  }

  buffer += "<!-- Campaign logs tab -->\n<ul style=\"list-style-type:none; margin-right:25px;\"> \n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.response)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.program(12, program12, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>";
  return buffer;
  });
templates['gadget-contact-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n<!-- conteact exist -->			\n		<div class=\"contact-minified row-fluid\">\n			<div style=\"max-width:95%; display:inline-block;\">\n				<div style=\"text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\">\n					<a class=\"gadget-show-contact display-toggle\" style=\"cursor:pointer; margin:0px 10px 0px 0px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-expand-alt\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Show</span></a><span title=\""
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "first_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "first_name", options)))
    + " "
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "last_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "last_name", options)))
    + " (";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")\" style=\"cursor:default;\"> "
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "first_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "first_name", options)))
    + " "
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "last_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "last_name", options)))
    + " (";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ") </span>\n				</div>\n			</div>\n		</div>\n\n		<div class=\"row-fluid show-contact-summary\" style=\"display:none; margin-top:10px;\"> \n  			\n		</div>\n\n   		<div class=\"option-tabs row-fluid\" style=\"display:none;\">\n\n		</div>\n	";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<!--contact not exist, add contact -->\n		<div class=\"agile-no-contact row-fluid\">	\n			<div class=\"contact-list-width\" style=\"max-width:75%; display:inline-block;\">\n				<div style=\"text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\">\n					";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.fname), {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				</div>\n			</div>\n			<i class=\"contact-search-status\" style=\"color:indianred; margin-left:20px; position:absolute;\">Contact not found</i>\n		</div>\n      	<div class=\"show-add-contact-form row-fluid\" style=\"display:none;\">\n			\n		</div>\n	";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n						<a class=\"gadget-add-contact\" style=\"cursor:pointer; margin:0px 10px 0px 0px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-plus\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Add</span></a><span title=\"";
  if (helper = helpers.fname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.lname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " (";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")\" style=\"cursor:default;\"> ";
  if (helper = helpers.fname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.lname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " (";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")</span> <span style=\"margin-left:10px;\">in Agile Contacts</span></span>\n					";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n						<a class=\"gadget-add-contact\" style=\"cursor:pointer; margin:0px 10px 0px 0px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-plus\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Add</span></a><span title=\"";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" style=\"cursor:default;\"> ";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " <span style=\"margin-left:10px;\">in Agile Contacts</span></span>\n					";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['gadget-contact-summary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n						";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n					";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  return buffer;
  }

function program5(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n													<div class=\"score-value\" style=\"display:inline-block; font-size:15px; margin-right:2px; vertical-align:middle; cursor:default; min-width:16px; width:16px; text-align:center;\">\n														";
  if (helper = helpers.lead_score) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lead_score); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n													</div>\n												";
  return buffer;
  }

function program9(depth0,data) {
  
  
  return "\n													<div class=\"score-value\" style=\"display:inline-block; font-size:15px; margin-right:2px; vertical-align:middle; cursor:default; min-width:16px; width:16px; text-align:center;\">\n														0\n													</div>\n												";
  }

  buffer += "		\n<!-- 1st coloum (conatct image) -->\n				<div class=\"span1\" style=\"min-width:65px;\">\n					<div class=\"thumbnails\">\n	   					<div class=\"span12\">\n    						<img  class='thumbnail' src=\""
    + escapeExpression((helper = helpers.gravatarurl || (depth0 && depth0.gravatarurl),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), 50, options) : helperMissing.call(depth0, "gravatarurl", (depth0 && depth0.properties), 50, options)))
    + "\" width=\"50\" height=\"50\" />\n		   				</div>\n					</div>\n    			</div>\n\n<!-- 2nd coloum (conatct details) -->\n				<div class=\"span8\" style=\"margin-left:0;\">\n<!-- First row (Name) - Starts -->\n					<div class=\"row-fluid\">\n						<div style=\"display:inline-block; max-width: 16em; vertical-align:middle;\">\n							<div style=\"height: 20px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\">\n								<b>\n									<font size=\"4\" title=\""
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "first_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "first_name", options)))
    + " "
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "last_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "last_name", options)))
    + "\">"
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "first_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "first_name", options)))
    + " "
    + escapeExpression((helper = helpers.getPropertyValue || (depth0 && depth0.getPropertyValue),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.properties), "last_name", options) : helperMissing.call(depth0, "getPropertyValue", (depth0 && depth0.properties), "last_name", options)))
    + "</font>\n								</b>\n							</div>\n						</div>\n						<a target=\"_blank\" href=\"";
  if (helper = helpers.ac_path) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ac_path); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "#contact/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" style=\"margin-left:6px; text-decoration:none; vertical-align:middle;\"><i class=\"icon-external-link\" title=\"Show contact in Agile\"></i></a><br/>\n					</div>\n<!-- First row (Name) - Ends -->\n\n<!-- Second row (Title, Company) - Starts -->					\n					<div class=\"row-fluid\">\n					";
  stack1 = (helper = helpers.if_propertyName || (depth0 && depth0.if_propertyName),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, "title", options) : helperMissing.call(depth0, "if_propertyName", "title", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					";
  stack1 = (helper = helpers.comma_in_between_property || (depth0 && depth0.comma_in_between_property),options={hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data},helper ? helper.call(depth0, "title", "company", (depth0 && depth0.properties), options) : helperMissing.call(depth0, "comma_in_between_property", "title", "company", (depth0 && depth0.properties), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					";
  stack1 = (helper = helpers.if_propertyName || (depth0 && depth0.if_propertyName),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, "company", options) : helperMissing.call(depth0, "if_propertyName", "company", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</div>\n<!-- Second row (Title, Company) - Ends -->\n\n<!-- Third row (tags) - Starts -->					\n					<div class=\"row-fluid\">\n						<div class=\"span11\">	 		\n						<div class=\"add-tag\">\n							<div style=\"padding-top:4px;\">\n								<ul id=\"added_tags_ul\" class=\"tagsinput\">\n									<li class=\"tag\" style=\"display: none; padding:1px 4px;\">\n											<span>\n											<span class=\"anchor tag-name\" style=\"float:left; cursor:default;\">lead</span>\n											<a class=\"close remove-tag remove-tag-icon\" style=\"float:left; line-height:16px;\" title=\"Remove Tag\">&times;</a>\n										</span>\n									</li> \n								</ul>\n								<div style=\"display: inline-block; vertical-align:top;\" >\n										<form id=\"add_tags_form\" name=\"add_tags_form\" method=\"post\" style=\"display: none; margin-bottom: 0px; margin-top:1px;\">\n										<div style=\"margin-bottom:0px;\">\n											<input type=\"hidden\" name=\"email\" value='";
  stack1 = (helper = helpers.if_propertyName || (depth0 && depth0.if_propertyName),options={hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "if_propertyName", "email", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'/>\n											<input class=\"tags-typeahead ignore-comma-keydown input-small\" name=\"tags\" type=\"text\" id=\"tags\" style=\"margin: 0px;\" placeholder=\"Enter tag\" autocomplete=\"off\">\n											<a type=\"submit\" class=\"btn\" id=\"contact_add_tags\" style=\"margin-left: 10px; padding: 1px 10px;\">Add</a>\n										</div>\n									</form>\n									<img class=\"tag-waiting\" style=\"display:none; width:16px; margin-top:6px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n									<i id=\"add_tags\" class=\"icon-plus toggle-tag\" style=\"cursor:pointer; margin-top:4px; display:block;\" title=\"Add Tag\"></i>\n								</div>\n							</div>\n						</div>\n						</div>\n					</div>\n<!-- Third row (Tags) - End -->\n				</div>\n\n<!-- 3rd coloum -->				\n				<div class=\"span3 contact-col-3\" style=\"margin-left:0; position:absolute; right:28;\">\n					\n					<div class=\"row-fluid\">\n								<div class=\"btn-group row-fluid\" style=\"display:inline-block; min-width:72px; margin-bottom:10px;\">\n									<div class=\"pull-right\">\n										<a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" style=\"width:70px;\"><b>+</b> Add<span class=\"caret\" style=\"margin-left:5px;\"></span></a>\n  										<ul class=\"dropdown-menu pull-right\">\n   											<!-- dropdown menu links -->\n											<li class=\"action-add-note\"><a style=\"cursor:default;\">Add Note</a></li>\n											<li class=\"action-add-task\"><a style=\"cursor:default;\">Add Task</a></li>\n											<li class=\"action-add-deal\"><a style=\"cursor:default;\">Add Deal</a></li>\n											<li class=\"action-add-campaign\"><a style=\"cursor:default;\">Add to Campaign</a></li>\n										</ul>\n									</div>\n								</div>\n							</div>\n					\n					\n					<div class=\"row-fluid\">\n						<div class=\"span12\" style=\"min-width:95px;\">\n\n							<div class=\"row-fluid unselectable score-scope\" unselectable=\"on\" onselectstart=\"return false\">\n								<div class=\"pull-right\">\n									<ul style=\"margin:0 2px 10px 0; min-width:90px; list-style-type:none; width:auto; height:26px; display:table; border:1px solid rgba(0, 0, 0, 0.15); box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05); border-radius:3px;\">\n										<li style=\"line-height:26px;\">\n											<div style=\"display:inline; padding-right:2px; margin-right: 4px; margin-left: 5px; border-right: 1px dotted rgba(0, 0, 0, 0.20);\">\n												<span style=\"font-weight:bold; font-size:13px; cursor:default;\">Score</span>\n											</div>\n											<div style=\"display:inline;\">\n												";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.lead_score), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n												<ul style=\"margin:0; list-style-type:none; display:inline-block; vertical-align:middle;\">\n													<input type=\"hidden\" name=\"email\" value='";
  stack1 = (helper = helpers.if_propertyName || (depth0 && depth0.if_propertyName),options={hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "if_propertyName", "email", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'/>\n													<li style=\"line-height:5px;\"><i class=\"icon-sort-up add-score\" style=\"font-size:12px; cursor:pointer;\" title=\"Add Score\"></i></li>\n													<li style=\"line-height:4px;\"><i class=\"icon-sort-down subtract-score\" style=\"font-size:12px; cursor:pointer;\" title=\"Subtract Score\"></i></li>\n												</ul>\n											</div>\n										</li>\n									</ul>\n								</div>\n							</div>\n\n							\n						</div>\n					</div>\n				</div>\n<!-- end of contact info-->";
  return buffer;
  });
templates['gadget-deal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n									";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.milestones), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n								";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "";
  buffer += "\n										<option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n									";
  return buffer;
  }

  buffer += "<!--  Add Deal Form -->\n  	   	<div class=\"gadget-deal row-fluid\">\n			<form class=\"gadget-deal-form form-horizontal\" name=\"gadget_deal_form\" method=\"post\" style=\"margin:0px;\">\n				<fieldset style=\"margin:0px;\">\n                   	<input type=\"hidden\" name=\"email\" value='";
  stack1 = (helper = helpers.if_propertyName || (depth0 && depth0.if_propertyName),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "if_propertyName", "email", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' />\n					\n					<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n						<label class=\"control-label\" for=\"name\"><b>Name</b> <span class=\"field_req\">*</span></label>\n						<div class=\"controls\">\n							<input name=\"name\" id=\"name\" placeholder=\"Name of deal\" class=\" required\" type=\"text\" />\n		  				</div>\n					</div>\n					\n                   	<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n						<label class=\"control-label\" for=\"expected_value\"><b>Value</b> <span class=\"field_req\">*</span></label>\n               			<div class=\"controls\"> \n							<input name=\"expected_value\" id=\"expected_value\" max=\"1000000000000\" placeholder=\"Value of deal\" class=\"required  digits\" type=\"text\" />\n						</div>\n					</div>\n					\n					<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">		\n						<label class=\"control-label\" for=\"milestone\"><b>Milestone</b> <span class=\"field_req\">*</span></label>\n						<div class=\"controls\">\n							<select name=\"milestone\" id=\"milestone\" class=\"required\" style=\"width:210px;\">\n								<option value=\"\">Select</option>\n								";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.milestones)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                            </select>	\n		  				</div>\n					</div>\n					\n              		<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n						<label class=\"control-label\" for=\"probability\"><b>Probability (%)</b> <span class=\"field_req\">*</span></label>\n						<div class=\"controls\">\n							<input name=\"probability\" id=\"probability\" max=\"100\" placeholder=\"Probability %\" class=\"required digits\" type=\"text\" />				\n		  				</div>\n					</div>\n\n					<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n						<label class=\"control-label\" for=\"probability\"><b>Close Date</b> <span class=\"field_req\">*</span></label>\n						<div class=\"controls\">\n							<input name=\"close_date\" id=\"close_date\" class=\"required deal-calender\" placeholder=\"MM/DD/YYYY\" type=\"text\"/>				\n						</div>\n					</div>\n					\n               		<div class=\"form-actions\" style=\"padding-top:10px padding-bottom:10px; margin:10px 0px 0px 0px;\">\n               			<a type=\"submit\" class=\"btn btn-primary gadget-deal-validate\" style=\"padding:2px 6px 2px;\">Add Deal</a> \n			   			<a class=\"cancel btn\" data-tab-identity=\"deals\" style=\"padding:2px 6px 2px; margin-left:5px;\">Cancel</a>\n						<img class=\"deal-add-waiting\" style=\"display:none;width:16px; margin-left:10px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n                   	</div>\n		  		</fieldset>\n			</form>\n		</div>";
  return buffer;
  });
templates['gadget-deals-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n			";
  stack1 = (helper = helpers.stringToJSON || (depth0 && depth0.stringToJSON),options={hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data},helper ? helper.call(depth0, depth0, "", options) : helperMissing.call(depth0, "stringToJSON", depth0, "", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n<li>\n	<div style=\"display:block;\" class=\"activity\">\n		<div id=\"notes\" class=\"activity-text-block\">\n			<h4 style=\"margin-bottom: 9px;\"><a style=\"text-decoration: none\"><b>"
    + escapeExpression((helper = helpers.ucfirst || (depth0 && depth0.ucfirst),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.name), options) : helperMissing.call(depth0, "ucfirst", (depth0 && depth0.name), options)))
    + "</b></a><span style=\"margin-left:20px;\">";
  if (helper = helpers.milestone) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.milestone); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " (";
  if (helper = helpers.probability) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.probability); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " %)</span></h4>\n			<p><span style=\"margin-right: 10px;\">Value : </span>\n				";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.prefs)),stack1 == null || stack1 === false ? stack1 : stack1.currency), {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += escapeExpression((helper = helpers.numberWithCommas || (depth0 && depth0.numberWithCommas),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.expected_value), options) : helperMissing.call(depth0, "numberWithCommas", (depth0 && depth0.expected_value), options)))
    + "\n			</p>\n			<div class=\"clear\">\n				<small class=\"edit-hover\" style=\"margin-right:10px; color:#b2b0b1;\">\n					<time class=\"deal-created-time\" datetime=\""
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "", (depth0 && depth0.created_time), options) : helperMissing.call(depth0, "epochToHumanDate", "", (depth0 && depth0.created_time), options)))
    + "\" style=\"border-bottom:dotted 1px #999\">"
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.created_time), options) : helperMissing.call(depth0, "epochToHumanDate", "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.created_time), options)))
    + "</time>\n				</small>\n			</div>\n		</div>\n	</div>\n</li>\n			";
  return buffer;
  }
function program4(depth0,data) {
  
  var stack1, helper, options;
  return escapeExpression((helper = helpers.currencySymbol || (depth0 && depth0.currencySymbol),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.prefs)),stack1 == null || stack1 === false ? stack1 : stack1.currency), options) : helperMissing.call(depth0, "currencySymbol", ((stack1 = (depth0 && depth0.prefs)),stack1 == null || stack1 === false ? stack1 : stack1.currency), options)));
  }

function program6(depth0,data) {
  
  
  return "<span>$</span>";
  }

function program8(depth0,data) {
  
  
  return "\n		<li>\n			<div style=\"display:block;\" class=\"activity\">\n				<div id=\"notes\" class=\"activity-text-block\">\n					<h4 style=\"display:inline; margin-right:10px;\">You have no deals for this contact.</h4>\n					<a class=\"action-add-deal\" style=\"display:inline-block; cursor:pointer; margin-left:-3px; text-decoration:underline; line-height:25px;\"><i class=\"icon-plus\" style=\"text-decoration:none; margin-right:2px;\"></i><span>Add Deal</span></a>\n				</div>\n			</div>\n		</li>\n	";
  }

  buffer += "<!-- Deals list tab -->\n<ul style=\"list-style-type:none; margin-right:25px;\"> \n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.length), {hash:{},inverse:self.program(8, program8, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>";
  return buffer;
  });
templates['gadget-note'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

  buffer += "<!--  Add Note Form -->\n	<div class=\"gadget-note row-fluid\">\n		<form class='gadget-note-form form-horizontal' name=\"gadget_note_form\" method=\"post\" style=\"margin:0px;\">\n			<fieldset style=\"margin:0px;\">\n                <input type=\"hidden\" name=\"email\" value='";
  stack1 = (helper = helpers.if_propertyName || (depth0 && depth0.if_propertyName),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "if_propertyName", "email", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' />\n\n				<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n					<label class=\"control-label\" for=\"subject\"><b>Subject</b><span class=\"field_req\">*</span></label>\n					<div class=\"controls\">\n						<input name=\"subject\" id=\"subject\" placeholder=\"About\" class=\"required\" type=\"text\" />\n					</div>\n				</div>\n				\n				<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n					<label class=\"control-label\" for=\"description\"><b>Description</b><span class=\"field_req\">*</span></label>\n					<div class=\"controls\">\n						<textarea name=\"description\" id=\"description\" rows=\"3\" placeholder=\"Detailed Note...\" class=\"required\"></textarea> \n					</div>\n				</div>\n\n                <div class=\"form-actions\" style=\"padding-top:10px padding-bottom:10px; margin:10px 0px 0px 0px;\">\n                   	<a type=\"submit\" class=\"btn btn-primary gadget-note-validate\" style=\"padding:2px 6px 2px;\">Add Note</a>\n	             	<a class=\"cancel btn\" data-tab-identity=\"notes\" style=\"padding:2px 6px 2px; margin-left:5px;\">Cancel</a>\n                   	<img class=\"note-add-waiting\" style=\"display:none;width:16px; margin-left:10px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n				</div>\n			</fieldset>\n		</form>\n	</div>";
  return buffer;
  });
templates['gadget-notes-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n			";
  stack1 = (helper = helpers.stringToJSON || (depth0 && depth0.stringToJSON),options={hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data},helper ? helper.call(depth0, depth0, "", options) : helperMissing.call(depth0, "stringToJSON", depth0, "", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n				<li>\n					<div style=\"display:block;\" class=\"activity\">\n						<div id=\"notes\" class=\"activity-text-block\">\n							<h4><a style=\"text-decoration: none\"><b>"
    + escapeExpression((helper = helpers.ucfirst || (depth0 && depth0.ucfirst),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.subject), options) : helperMissing.call(depth0, "ucfirst", (depth0 && depth0.subject), options)))
    + "</b></a></h4><br/>\n							<p style=\"margin-right:40px;\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>	\n					 		\n							<small class=\"edit-hover\" style=\"color:#b2b0b1;\"> \n								<time class=\"note-created-time\" datetime=\""
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "", (depth0 && depth0.created_time), options) : helperMissing.call(depth0, "epochToHumanDate", "", (depth0 && depth0.created_time), options)))
    + "\" style=\"border-bottom:dotted 1px #999\">"
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.created_time), options) : helperMissing.call(depth0, "epochToHumanDate", "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.created_time), options)))
    + "</time>\n							</small>\n						</div>\n					</div>\n				</li>\n			";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "\n		<li>\n			<div style=\"display:block;\" class=\"activity\">\n				<div id=\"notes\" class=\"activity-text-block\">\n					<h4 style=\"display:inline; margin-right:10px;\">You have no notes for this contact.</h4>\n					<a class=\"action-add-note\" style=\"display:inline-block; cursor:pointer; margin-left:-3px; text-decoration:underline; line-height:25px;\"><i class=\"icon-plus\" style=\"text-decoration:none; margin-right:2px;\"></i><span>Add Note</span></a>\n				</div>\n			</div>\n		</li>\n	";
  }

  buffer += "<!-- Notes list tab -->\n<ul style=\"list-style-type:none; margin-right:25px;\">\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.length), {hash:{},inverse:self.program(5, program5, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "		\n</ul>";
  return buffer;
  });
templates['gadget-tabs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Gadget Tab -->\n		<ul class=\"nav nav-tabs gadget_tabs\" data-tabs=\"tabs\" style=\"margin-top:15px;\">\n	        <li class=\"active gadget-notes-tab\"><a href=\"#Notes-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\">Notes</a></li>\n	        <li class=\"gadget-tasks-tab\"><a href=\"#Tasks-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\">Tasks</a></li>\n			<li class=\"gadget-deals-tab\"><a href=\"#Deals-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\">Deals</a></li>\n			<li class=\"gadget-campaigns-tab\"><a href=\"#Campaigns-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\">Campaigns</a></li>\n	    </ul>\n	    <div class=\"tab-content\">\n			<img class=\"tab-waiting\" style=\"display:none; width:16px; float:left; margin:5px 0px 0px 8px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n	        <div class=\"tab-pane active\" id=\"Notes-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n	            <div class=\"gadget-notes-tab-list\">\n					\n				</div>\n	        </div>\n	        <div class=\"tab-pane\" id=\"Tasks-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n	            <div class=\"gadget-tasks-tab-list\">\n					\n				</div>\n	        </div>\n			<div class=\"tab-pane\" id=\"Deals-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n	            <div class=\"gadget-deals-tab-list\">\n					\n				</div>\n	        </div>\n			<div class=\"tab-pane\" id=\"Campaigns-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n	            <div class=\"gadget-campaigns-tab-list\">\n					\n				</div>\n	        </div>\n	    </div>";
  return buffer;
  });
templates['gadget-task'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

  buffer += "<!--  Add Task Form -->\n  	<div class=\"gadget-task row-fluid\">\n       	<form class='gadget-task-form form-horizontal' name=\"gadget_task_form\" method=\"post\" style=\"margin:0px;\">\n			<fieldset style=\"margin:0px;\">\n              	<input type=\"hidden\" name=\"email\" value='";
  stack1 = (helper = helpers.if_propertyName || (depth0 && depth0.if_propertyName),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "if_propertyName", "email", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' />\n				\n				<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n					<label class=\"control-label\" for=\"subject\"> <b>Task</b> <span class=\"field_req\">*</span></label>\n					<div class=\"controls\">\n						<input name=\"subject\" id=\"subject\" placeholder=\"Task name\" size=\"40\" class=\"required\" type=\"text\" />\n					</div>\n				</div>\n\n				<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">					\n					<label class=\"control-label\" for=\"type\"><b>Category</b><span class=\"field_req\">*</span></label>\n					<div class=\"controls\">\n						<select name=\"type\" id=\"type\" class=\"required\" style=\"width:210px;\">\n							<option value=\"\">Select</option>\n							<option value=\"CALL\">Call</option>\n							<option value=\"EMAIL\">Email</option>\n							<option value=\"FOLLOW_UP\">Follow-up</option>\n							<option value=\"MEETING\">Meeting</option>\n							<option value=\"MILESTONE\">Milestone</option>\n							<option value=\"SEND\">Send</option>\n							<option value=\"TWEET\">Tweet</option>\n                            <option value=\"OTHER\">Other</option>\n						</select> \n					</div>\n				</div>\n				\n				<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n					<label class=\"control-label\" for=\"due\"><b>Due Date</b><span class=\"field_req\">*</span></label>\n					<div class=\"controls\">\n						<input name=\"due\" id=\"due\" placeholder=\"MM/DD/YYYY\" class=\"required task-calender\" type=\"text\" />\n					</div>\n				</div>\n				\n				<div class=\"control-group\" style=\"margin:0px; padding-top:6px;\">\n					<label class=\"control-label\" for=\"priority_type\"><b>Priority</b></label>\n					<div class=\"controls\"> \n						<select	name=\"priority_type\" id=\"priority_type\" size=\"1\" style=\"width:210px;\">\n							<option value=\"HIGH\">High</option>\n							<option value=\"NORMAL\" selected=\"selected\">Normal</option>\n							<option value=\"LOW\">Low</option>\n						</select> \n					</div>\n				</div>\n				 \n	            <div class=\"form-actions\" style=\"padding-top:10px padding-bottom:10px; margin:10px 0px 0px 0px;\">\n	            	<a type=\"submit\" class=\"btn btn-primary gadget-task-validate\" style=\"padding:2px 6px 2px;\">Add Task</a>\n			    	<a class=\"cancel btn\" data-tab-identity=\"tasks\" style=\"padding:2px 6px 2px; margin-left:5px;\">Cancel</a>\n					<img class=\"task-add-waiting\" style=\"display:none;width:16px; margin-left:10px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n                </div>\n			</fieldset>				\n		</form>	\n   	</div>";
  return buffer;
  });
templates['gadget-tasks-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n			";
  stack1 = (helper = helpers.stringToJSON || (depth0 && depth0.stringToJSON),options={hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data},helper ? helper.call(depth0, depth0, "", options) : helperMissing.call(depth0, "stringToJSON", depth0, "", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n<li>\n	<div class=\"activity\" style=\"display:block;\">\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.is_complete), {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "	\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.is_complete), {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			<div>\n				<p>\n					<i class=\""
    + escapeExpression((helper = helpers.icons || (depth0 && depth0.icons),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.type), options) : helperMissing.call(depth0, "icons", (depth0 && depth0.type), options)))
    + "\"></i>&nbsp;"
    + escapeExpression((helper = helpers.ucfirst || (depth0 && depth0.ucfirst),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.type), options) : helperMissing.call(depth0, "ucfirst", (depth0 && depth0.type), options)))
    + "\n					<span style=\"margin-left:20px;\">Due : <time class=\"task-created-time\" datetime=\""
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "", (depth0 && depth0.due), options) : helperMissing.call(depth0, "epochToHumanDate", "", (depth0 && depth0.due), options)))
    + "\" style=\"border-bottom:dotted 1px #999\">"
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.due), options) : helperMissing.call(depth0, "epochToHumanDate", "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.due), options)))
    + "</span>\n				</p>\n				<div class=\"clear\">\n					<small class=\"edit-hover\" style=\"margin-right:10px; color:#b2b0b1;\"> \n						<time class=\"task-created-time\" datetime=\""
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "", (depth0 && depth0.created_time), options) : helperMissing.call(depth0, "epochToHumanDate", "", (depth0 && depth0.created_time), options)))
    + "\" style=\"border-bottom:dotted 1px #999\">"
    + escapeExpression((helper = helpers.epochToHumanDate || (depth0 && depth0.epochToHumanDate),options={hash:{},data:data},helper ? helper.call(depth0, "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.created_time), options) : helperMissing.call(depth0, "epochToHumanDate", "ddd mmm dd yyyy HH:MM:ss", (depth0 && depth0.created_time), options)))
    + "</time>\n					</small>\n				</div>\n			</div>\n		</div>\n	</div>\n</li>\n			";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "\n			<div id=\"tasks\" class=\"activity-text-block\" style=\"background-color:#FFFAFA\">\n		";
  }

function program6(depth0,data) {
  
  
  return "\n			<div id=\"tasks\" class=\"activity-text-block\">\n		";
  }

function program8(depth0,data) {
  
  var buffer = "", helper, options;
  buffer += "\n				<div style=\"margin-bottom: 10px;\">\n					<h4 class=\"task-subject\" style=\"text-decoration:line-through;display:inline;\">\n						<a style=\"text-decoration: none; margin:0px 20px 0px 0;\"><b>"
    + escapeExpression((helper = helpers.ucfirst || (depth0 && depth0.ucfirst),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.subject), options) : helperMissing.call(depth0, "ucfirst", (depth0 && depth0.subject), options)))
    + "</b></a>\n						<span class=\"label label-"
    + escapeExpression((helper = helpers.task_label_color || (depth0 && depth0.task_label_color),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.priority_type), options) : helperMissing.call(depth0, "task_label_color", (depth0 && depth0.priority_type), options)))
    + "\">"
    + escapeExpression((helper = helpers.ucfirst || (depth0 && depth0.ucfirst),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.priority_type), options) : helperMissing.call(depth0, "ucfirst", (depth0 && depth0.priority_type), options)))
    + "</span>\n					</h4>\n				</div>\n			";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", helper, options;
  buffer += "\n				<div style=\"margin-bottom: 10px;\">\n					<h4 class=\"task-subject\" style=\"display:inline;\">\n						<a style=\"text-decoration: none; margin:0px 20px 0px 0;\"><b>"
    + escapeExpression((helper = helpers.ucfirst || (depth0 && depth0.ucfirst),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.subject), options) : helperMissing.call(depth0, "ucfirst", (depth0 && depth0.subject), options)))
    + "</b></a>\n						<span class=\"label label-"
    + escapeExpression((helper = helpers.task_label_color || (depth0 && depth0.task_label_color),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.priority_type), options) : helperMissing.call(depth0, "task_label_color", (depth0 && depth0.priority_type), options)))
    + "\">"
    + escapeExpression((helper = helpers.ucfirst || (depth0 && depth0.ucfirst),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.priority_type), options) : helperMissing.call(depth0, "ucfirst", (depth0 && depth0.priority_type), options)))
    + "</span>	\n					</h4>\n				</div>\n			";
  return buffer;
  }

function program12(depth0,data) {
  
  
  return "\n		<li>\n			<div style=\"display:block;\" class=\"activity\">\n				<div id=\"notes\" class=\"activity-text-block\">\n					<h4 style=\"display:inline; margin-right:10px;\">You have no tasks for this contact.</h4>\n					<a class=\"action-add-task\" style=\"display:inline-block; cursor:pointer; margin-left:-3px; text-decoration:underline; line-height:25px;\"><i class=\"icon-plus\" style=\"text-decoration:none; margin-right:2px;\"></i><span>Add Task</span></a>\n				</div>\n			</div>\n		</li>\n	";
  }

  buffer += "<!-- Tasks list tab -->\n<ul style=\"list-style-type:none; margin-right:25px;\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.length), {hash:{},inverse:self.program(12, program12, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>	";
  return buffer;
  });
templates['getting-started'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"well well-small agile-one-time-setup\" style=\"margin:0px; border-radius:0px; background-color:white; box-shadow:none; border-bottom:0px; border-left:0px; border-right:0px;\">\n<img src='https://www.agilecrm.com/img/logo-black.png'/>\n <p>We need to associate your Google account with AgileCRM - this is a one time setup</p>\n<P style=\"margin:0px;\"><input type=\"button\" value=\"Associate\" onclick=\"agile_gadget_open_popup(); return false;\" class=\"btn\" style=\"padding:2px 6px 2px;\">\n<span id=\"notify_user\" style=\"display:none; margin-left:20px; color:indianred;\"><i>Please enter your domain.</i></span></P>\n</div> ";
  });
templates['search'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<div class=\"well well-small gadget-contact-details-tab\" style='margin:0px; border-radius:0px; background-color:white; box-shadow:none; border-bottom:0px; border-left:0px; border-right:0px;'>\n			<div class=\"show-form\" data-content=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n<!--email list -->\n				<div class=\"contact-list\">\n					<div class=\"agile-no-contact row-fluid\">\n						<div class=\"contact-list-width\" style=\"max-width:95%; display:inline-block; vertical-align:middle;\">\n							<div style=\"text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\">\n								";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.name), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n							</div>\n						</div>\n						<img class=\"contact-search-waiting\" style=\"margin-left:20px; display:none; width:13px; vertical-align:middle;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n					</div>\n			    </div>\n			</div>\n		</div>\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n									<a class=\"gadget-search-contact\" style=\"cursor:pointer; margin:0px 10px 0px 0px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-search\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Search</span></a><span title=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ")\" style=\"cursor:default;\"> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.fname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.lname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ") <span style=\"margin-left:10px;\">in Agile Contacts</span></span>\n								";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n									<a class=\"gadget-search-contact\" style=\"cursor:pointer; margin:0px 8px 0px 5px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-search\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Search</span></a><span title=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"cursor:default;\"> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <span style=\"margin-left:10px;\">in Agile Contacts</span></span>\n								";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<!--Search email panel -->			\n			<div class=\"well well-small gadget-contact-details-tab\" style=\"margin:0px 0px -1px 0px; box-shadow:none; border-radius:0px; background-color:white;\">\n				<div class=\"show-form\">\n					<div>\n						<div class=\"row-fluid\">\n							\n	<!-- Search mail UI area start-->\n							<div style=\"line-height:22px;\">\n								<div class=\"search-pannel-inner\">\n									\n									<div style=\"display: inline-block;vertical-align: middle;\">\n										<a class=\"gadget-search-contact search-mail-button\" style=\"cursor:pointer; margin:0px 10px 0px 0px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-search\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Search</span></a>\n									</div>\n									<div class=\"btn-group\" style=\"display: inline-block;vertical-align: middle;margin: 0 10px 0 0;\">\n										<select id=\"search_drop_down\" class=\"agile-mail-dropdown\" style=\"width:auto; margin:0px;\">\n											<!-- dropdown menu links -->\n											";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "	\n										</select>\n									</div>\n									<div style=\"display: inline-block;vertical-align: middle;\">\n										<span style=\"display:inline-block;\">in Agile Contacts</span>\n										<img class=\"contact-search-waiting\" style=\"margin-left:20px; display:none; width:13px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n										<i class=\"contact-search-status\" style=\"display:none; color:indianred; margin-left:20px;\">Contact not found</i>\n									</div>\n								</div>\n							</div>\n	<!-- Search mail UI area end-->						\n						</div>\n					</div>\n				</div>\n			</div>\n	";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "											\n												";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.name), {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n											";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n													<option class=\"mail-list\" data-content=\"";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " (";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")</option>\n												";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n													<option class=\"mail-list\" data-content=\"";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n												";
  return buffer;
  }

  stack1 = (helper = helpers.check_json_length || (depth0 && depth0.check_json_length),options={hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, depth0, "1", options) : helperMissing.call(depth0, "check_json_length", depth0, "1", options));
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
})();