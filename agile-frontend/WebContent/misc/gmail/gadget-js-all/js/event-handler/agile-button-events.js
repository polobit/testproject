$(function ()
            {

// ------------------------------------------------- agile-button-event.js --------------------------------------------- START --

                /**
                 * Contains button events.
                 * Add contact/note/task/deal/to campaign buttons event.
                 * Cancel button event common for all cancel buttons.
                 * 
                 * @author Dheeraj
                 */


//  ------------------------------------------------- Click event for add contact ----------------------------------------------- 

                $('.gadget-contact-validate').die().live('click', function (e) {
                    //  ------ Prevent default functionality. ------ 
                    e.preventDefault();
                    //  ------ Set context (HTML container where event is triggered). ------ 
                    var el = $(this).closest("div.gadget-contact-details-tab")
                            .find("div.show-form");
                    var That = $(this);
                    var Json = [];
                    var g = {};
                    //  ------ Form serialization and validation. ------ 
                    Json = agile_serialize_form(el.find(".gadget-contact-form"));

                    $.each(Json, function (index, Val) {
                        g[Val.name] = Val.value;
                    });

                    var j = {};
                    var n = [];
                    for (var o in g) {
                        if (g.hasOwnProperty(o) && o != "tags" && o != "lead_score") {
                            n.push(agile_propertyJSON(o, g[o]))
                        }
                    }
                    var m = agile_read_cookie(agile_guid.cookie_original_ref);
                    var a = agile_read_cookie(agile_guid.cookie_tags);
                    var k = agile_read_cookie(agile_guid.cookie_score);
                    var b = agile_read_cookie(agile_guid.cookie_campaigns);
                    var l = agile_getUtmParamsAsProperties();
                    j.properties = n;
                    if (m) {
                        n.push(agile_propertyJSON("original_ref", m))
                    }
                    if (l && l.size != 0) {
                        try {
                            n.push.apply(n, l)
                        } catch (e) {
                            console.debug("Error occured while pushing utm params " + e)
                        }
                    }
                    if (g.tags) {
                        var r = g.tags;
                        var h = r.trim().replace("/ /g", " ");
                        h = h.replace("/, /g", ",");
                        j.tags = h.split(",");
                        for (var f = 0; f < j.tags.length; f++) {
                            j.tags[f] = j.tags[f].trim()
                        }
                    }
                    if (a) {
                        agile_delete_cookie(agile_guid.cookie_tags);
                        var h = a.trim().replace("/ /g", " ");
                        h = h.replace("/, /g", ",");
                        var d = h.split(",");
                        if (j.tags) {
                            for (var f = 0; f < d.length; f++) {
                                j.tags.push(d[f].trim())
                            }
                        } else {
                            j.tags = [];
                            for (var f = 0; f < d.length; f++) {
                                j.tags.push(d[f].trim())
                            }
                        }
                    }
                    if (g.lead_score) {
                        j.lead_score = parseInt(g.lead_score)
                    }
                    if (k) {
                        agile_delete_cookie(agile_guid.cookie_score);
                        if (j.lead_score) {
                            j.lead_score = j.lead_score + parseInt(k)
                        } else {
                            j.lead_score = parseInt(k)
                        }
                    }
                    var c = "contact={0}".format(encodeURIComponent(JSON.stringify(j)));
                    if (b) {
                        agile_delete_cookie(agile_guid.cookie_campaigns);
                        c = c + "&campaigns={0}".format(encodeURIComponent(b))
                    }
                    //  ------ Show saving image. ------ 
                    $('.contact-add-waiting', el).show();
                    //  ------ Add contact ------ 

                    var str = agile_id.getURL();
                    var phpurl = str.split("/core/js/api");
                    var agile_url = phpurl[0] + "/core/php/api/contacts/gadget?callback=?&id=" + agile_id.get() + "&" + c;
                    agile_json(agile_url, function (Response) {

                        if (Response != null && Response.id != null) {
                            //  ------ Hide saving image. ------ 
                            $('.contact-add-waiting', el).hide(1);
                            //  ------ Generate UI. ------ 
                            agile_create_contact_ui(el, That, g.email, Response);
                        } else {
                            $('.contact-add-waiting', el).hide(1);
                            //  ------ Show duplicate contact message. ------ 
                            $('.contact-add-status', el).text(Response.error).show().delay(5000).hide(1);
                        }
                    });



                    /*_agile.create_contact(Data, 
                     {success: function(Response){
                     //  ------ Hide saving image. ------ 
                     $('.contact-add-waiting', el).hide(1);
                     //  ------ Generate UI. ------ 
                     agile_create_contact_ui(el, That, Data.email, Response);
                     
                     }, error: function(Response){
                     
                     $('.contact-add-waiting', el).hide(1);
                     //  ------ Show duplicate contact message. ------ 
                     $('.contact-add-status', el).text(Response.error).show().delay(5000).hide(1);
                     }});*/
                });


//  ------------------------------------------------- Click event for add Note ------------------------------------------------- 

                $('.gadget-note-validate').die().live('click', function (e) {
                    //  ------ Prevent default functionality. ------ 
                    e.preventDefault();
                    //  ------ Set context (HTML container where event is triggered). ------ 
                    var el = $(this).closest("div.gadget-contact-details-tab")
                            .find("div.show-form");
                    var Json = [];
                    var Data = {};
                    var Email = {};
                    //  ------ Form serialization and validation. ------ 
                    Json = agile_serialize_form($(el).find(".gadget-note-form"));
                    $.each(Json, function (Index, Val) {
                        if (Val.name == "email")
                            Email[Val.name] = Val.value;
                        else
                            Data[Val.name] = Val.value;
                    });

                    $('.note-add-waiting', el).show();
                    //  ------ Add Note ------ 
                    _agile.add_note(Data,
                            {success: function (Response) {
                                    $('.note-add-waiting', el).hide(1);
                                    //  ------ Show notes list, after adding note. ------ 
                                    $('.gadget-notes-tab', el).trigger('click');

                                }, error: function (Response) {


                                }}, Email.email);
                });


//  ------------------------------------------------- Click event for add Task ------------------------------------------------- 

                $('.gadget-task-validate').die().live('click', function (e) {
                    //  ------ Prevent default functionality. ------ 
                    e.preventDefault();
                    //  ------ Set context (HTML container where event is triggered). ------ 
                    var el = $(this).closest("div.gadget-contact-details-tab")
                            .find("div.show-form");
                    var Json = [];
                    var Data = {};
                    var Email = {};
                    //  ------ Form serialization and validation. ------ 
                    Json = agile_serialize_form($(el).find(".gadget-task-form"));
                    $.each(Json, function (Index, Val) {
                        if (Val.name == "email")
                            Email[Val.name] = Val.value;
                        else
                            Data[Val.name] = Val.value;
                    });
                    //  ------ Format date. ------ 
                    Data.due = new Date(Data.due).getTime() / 1000.0;

                    $('.task-add-waiting', el).show();
                    //  ------ Add Task ------ 
                    _agile.add_task(Data,
                            {success: function (Response) {
                                    $('.task-add-waiting', el).hide(1);
                                    //  ------ Show tasks list, after adding task. ------ 
                                    $('.gadget-tasks-tab', el).trigger('click');

                                }, error: function (Response) {


                                }}, Email.email);
                });


//  ------------------------------------------------- Click event for add Deal ------------------------------------------------- 

                $('.gadget-deal-validate').die().live('click', function (e) {
                    //  ------ Prevent default functionality. ------ 
                    e.preventDefault();
                    //  ------ Set context (HTML container where event is triggered). ------ 
                    var el = $(this).closest("div.gadget-contact-details-tab")
                            .find("div.show-form");
                    var Json = [];
                    var Data = {};
                    var Email = {};
                    //  ------ Form serialization and validation. ------ 
                    Json = agile_serialize_form($(el).find(".gadget-deal-form"));
                    $.each(Json, function (Index, Val) {
                        if (Val.name == "email")
                            Email[Val.name] = Val.value;
                        else
                            Data[Val.name] = Val.value;
                    });
                    //  ------ Format date. ------ 
                    Data.close_date = new Date(Data.close_date).getTime() / 1000.0;

                    $('.deal-add-waiting', el).show();
                    //  ------ Add Deal ------ 
                    _agile.add_deal(Data,
                            {success: function (Response) {
                                    $('.deal-add-waiting', el).hide(1);
                                    //  ------ Show deals list, after adding deal. ------ 
                                    $('.gadget-deals-tab', el).trigger('click');

                                }, error: function (Response) {


                                }}, Email.email);
                });


//  ------------------------------------------------- Click event for add to Campaign ------------------------------------------ 

                $('.gadget-campaign-validate').die().live('click', function (e) {
                    //  ------ Prevent default functionality. ------ 
                    e.preventDefault();
                    //  ------ Set context (HTML container where event is triggered). ------ 
                    var el = $(this).closest("div.gadget-contact-details-tab")
                            .find("div.show-form");
                    var Json = [];
                    var Data = {};
                    var Email = $(el).data("content");
                    //  ------ Form serialization and validation. ------ 
                    Json = agile_serialize_form($(el).find(".gadget-campaign-form"));
                    $.each(Json, function (Index, Val) {
                        if (Val.name == "email")
                            Email[Val.name] = Val.value;
                        else
                            Data[Val.name] = Val.value;
                    });

                    $('.campaign-add-waiting', el).show();
                    //  ------ Add Campaign ------ 
                    _agile.add_campaign(Data,
                            {success: function (Response) {
                                    $('.campaign-add-waiting', el).hide(1);
                                    //  ------ Show deals list, after adding deal. ------ 
                                    $('.gadget-campaigns-tab', el).trigger('click');

                                }, error: function (Response) {


                                }}, Email);
                });


//  ------------------------------------------------- Click event for cancel button -------------------------------------------- 

                $(".cancel").die().live('click', function (e) {
                    //  ------ Prevent default functionality. ------ 
                    e.preventDefault();

                    var That = $(this).data('tab-identity');
                    //  ------ Show tabs default list. ------ 
                    $('.gadget-' + That + '-tab').trigger('click');
                    //  ------ Set context (HTML container where event is triggered). ------ 
                    var el = $(this).closest("div.gadget-contact-details-tab");
                    //  ------ Toggle add contact UI. ------ 
                    $(".show-add-contact-form", el).toggle();
                    agile_gadget_adjust_height();
                });



// ------------------------------------------------- agile-button-event.js --------------------------------------------- END --


 });