/**
 * Deletes the selected row related entities from the database based on the url
 * attribute of the table and fades out the rows from the table
 * 
 * author: Ramesh
 * 
 */

var dup_contacts1_array = [];

$(function()
{
				$('#duplicate-contacts-cancel').die().live('click', function(event)
				{
								event.preventDefault();
								dup_contacts1_array.length = 0;
								var master_record = App_Contacts.contactDetailView.model.toJSON();
								Backbone.history.navigate("contact/" + master_record.id, { trigger : true });
				});

				$('#contact-merge-cancel').die().live('click', function(event)
				{
								event.preventDefault();
								dup_contacts1_array.length = 0;
								var master_record = App_Contacts.contactDetailView.model.toJSON();
								Backbone.history.navigate("duplicate-contacts/" + master_record.id, { trigger : true });
								// Backbone.history.navigate("contacts", {
								// trigger : true
								// });
				});

				/**
				 * Validates the checkbox status of each row in duplicate contacts table and
				 * sends these contacts to merge contacts page
				 * 
				 */
				$('#duplicate-contacts-checked-grid')
												.die()
												.live(
																				'click',
																				function(event)
																				{
																								event.preventDefault();
																								var index_array = [];
																								var data_array = [];
																								var checked = false;
																								var table = $('body').find('.showCheckboxes');
																								$(table).find('.tbody_check').each(function(index, element)
																								{
																												// If element is checked store it's id in an
																												// array
																												if ($(element).is(':checked'))
																												{
																																dup_contacts1_array.push($(element).closest('tr').find('td.data').attr('data'));
																																checked = true;
																												}
																								});
																								if (checked)
																								{
																												if (dup_contacts1_array.length > 2)
																												{
																																alert('You can merge maximum of 2 records at a time with master record.');
																																dup_contacts1_array.length = 0;
																																return;
																												}
																												Backbone.history.navigate("merge-contacts", { trigger : true });
																								}
																								else
																												$('body')
																																				.find(".select-none")
																																				.html(
																																												'<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>You have not selected any records to merge. Please select at least one record to continue.</div>')
																																				.show().delay(3000).hide(1);
																				});

				/**
				 * Merges the selected duplicate contacts properties with the Master contact
				 * object and deletes the duplicate contact objects from the datastore
				 * 
				 */
				$('#merge-contacts-model').die().live('click', function(event)
				{
								event.preventDefault();
								if (dup_contacts1_array.length > 1)
								{
												if (!confirm(" Delete " + dup_contacts1_array.length + " duplicate contacts and merge data to master record?"))
																return;
								}
								else if (!confirm(" Delete 1 duplicate contact and merge data to master record?"))
												return;
								$(this).attr('disabled', 'disabled');
								$('#contact-merge-cancel').attr('disabled', 'disabled');
								$('#contact-merge-cancel').after('<img class="contact-merge-loading" style="padding-right:5px;margin-bottom:15px" src= "img/21-0.gif"></img>');
								var checked = false;
								var selected_fields = [];
								var table = $('body').find('#merge-contacts-table');
								var tbody = $(table).find('tbody');
								var phones = [];
								var emails = [];
								var websites = [];
								var tags = [];
								var custom_fields = [];
								var remove_fields = [];
								var master_record = App_Contacts.contactDetailView.model;
								var master_record_dup = JSON.parse(JSON.stringify(master_record.toJSON()));
								var master_id = master_record.id;
								console.log(master_record.toJSON());

								tbody.children().each(function(index, element)
								{
												$(element).find("[type=radio]:checked").each(function(index, element)
												{
																if ($(element).attr("oid") != master_id)
																{
																				var fieldName = $(element).attr("field");
																				var fieldValue = $(element).attr("data");
																				var fieldType = $(element).attr("fieldtype");
																				if (typeof fieldType !== typeof undefined && fieldType !== false)
																				{
																								if (fieldValue)
																								{
																												custom_field = {};
																												custom_field['name'] = fieldName;
																												custom_field['value'] = fieldValue;
																												custom_field['type'] = 'CUSTOM';
																												custom_fields.push(custom_field);
																								}
																								else
																								{
																												remove_field = {};
																												remove_field['name'] = fieldName;
																												remove_field['type'] = 'CUSTOM';
																												remove_fields.push(remove_field);
																								}
																				}
																				else
																				{
																								if (fieldValue)
																								{
																												selected_field = {};
																												selected_field['name'] = fieldName;
																												selected_field['value'] = fieldValue;
																												selected_fields.push(selected_field);
																												if (fieldName.toLowerCase() == 'company')
																												{
																																var company_id = $(element).attr("company_id");
																																master_record.set({ "contact_company_id" : company_id });
																												}
																								}
																								else
																								{
																												remove_field = {};
																												remove_field['name'] = fieldName;
																												remove_field['type'] = 'SYSTEM';
																												remove_fields.push(remove_field);
																								}
																				}
																}
												});
												$(element).find("[type=checkbox]:checked").each(function(index, element)
												{
																var fieldName = $(element).attr("field");
																var fieldValue = $(element).attr("data");
																var fieldType = $(element).attr("fieldtype");
																if (fieldName === "email")
																{
																				var subtype = $(element).attr("subtype");
																				email = {};
																				email['value'] = fieldValue;
																				if (subtype)
																								email['subtype'] = subtype;
																				emails.push(email);
																}
																else if (fieldName === "website")
																{
																				var subtype = $(element).attr("subtype");
																				website = {};
																				website['value'] = fieldValue;
																				if (subtype)
																								website['subtype'] = subtype;
																				websites.push(website);
																}
																else if (fieldName === "phone")
																{
																				var subtype = $(element).attr("subtype");
																				phone = {};
																				phone['value'] = fieldValue;
																				if (subtype)
																								phone['subtype'] = subtype;
																				phones.push(phone);
																}
																else if (fieldName === "tags")
																{
																				tags.push(fieldValue);
																}
												});
								});
								var properties = master_record_dup.properties;
								master_record.set({ "tags" : tags });
								merge_duplicate_contacts(master_record, properties, selected_fields, custom_fields, remove_fields, websites, emails, phones);
				});
});

function merge_duplicate_contacts(master_record, properties, selected_fields, custom_fields, remove_fields, websites, emails, phones)
{
				for (var i = properties.length - 1; i >= 0; i--)
				{
								if (properties[i].name.toLowerCase() === 'email' || properties[i].name.toLowerCase() === 'website' || properties[i].name.toLowerCase() === 'phone')
								{
												properties.splice(i, 1);
								}
				}
				for (var i = 0; i < remove_fields.length; i++)
				{
								for (var j = 0; j < properties.length; j++)
								{
												var property = properties[j];
												if (property.name.toLowerCase() === remove_fields[i].name.toLowerCase() && property.type.toLowerCase() === remove_fields[i].type.toLowerCase())
												{
																properties.splice(j, 1);
																break;
												}
								}
				}
				for (var j = 0; j < selected_fields.length; j++)
				{
								var element = selected_fields[j];
								for (var k = 0; k < properties.length; k++)
								{
												if (properties[k].name.toLowerCase() === element['name'].toLowerCase())
												{
																properties[k].value = element['value'];
																break;
												}
												else if (k == properties.length - 1)
												{
																var object = {};
																object['name'] = element['name'];
																object['value'] = element['value'];
																object['type'] = 'SYSTEM';
																properties.push(object);
																break;
												}
								}
				}
				if (custom_fields.length > 0)
				{
								for (var i = 0; i < custom_fields.length; i++)
								{
												var element = custom_fields[i];
												for (var j = 0; j < properties.length; j++)
												{
																if (properties[j].name.toLowerCase() === element['name'].toLowerCase() && properties[j].type === 'CUSTOM')
																{
																				properties[j].value = element['value'];
																				break;
																}
																else if (j == properties.length - 1)
																{
																				if (custom_fields[i].value)
																				{
																								var object = {};
																								object['name'] = custom_fields[i].name;
																								object['value'] = custom_fields[i].value;
																								object['type'] = 'CUSTOM';
																								properties.push(object);
																								break;
																				}
																}
												}
								}
				}
				if (emails.length > 0)
				{
								for (var i = 0; i < emails.length; i++)
								{
												var object = {};
												object['name'] = 'email';
												object['value'] = emails[i].value;
												object['type'] = 'SYSTEM';
												if (emails[i].subtype)
																object['subtype'] = emails[i].subtype;
												properties.push(object);
								}
				}
				if (phones.length > 0)
				{
								for (var i = 0; i < phones.length; i++)
								{
												var object = {};
												object['name'] = 'phone';
												object['value'] = phones[i].value;
												object['type'] = 'SYSTEM';
												if (phones[i].subtype)
																object['subtype'] = phones[i].subtype;
												properties.push(object);
								}
				}
				if (websites.length > 0)
				{
								for (var i = 0; i < websites.length; i++)
								{
												var object = {};
												object['name'] = 'website';
												object['value'] = websites[i].value;
												object['type'] = 'SYSTEM';
												if (websites[i].subtype)
																object['subtype'] = websites[i].subtype;
												properties.push(object);
								}
				}
				master_record.set({ "properties" : properties });
				merge_related_entity_in_master_record(master_record,dup_contacts1_array);
}


function merge_related_entity_in_master_record(master_record,duplicate_contacts){
				master_record.save({}, { url : '/core/api/contacts/merge/'+duplicate_contacts.toString(), success : function()
								{
												$(".contact-merge-loading").remove();
												CONTACTS_HARD_RELOAD = true;
												var id = master_record.toJSON().id;
												Backbone.history.navigate("contact/" + id, { trigger : true });
								} });
}
