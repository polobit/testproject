// Global variables
var _agile_contact; // Agile contact object
var _agile_webrules; // Array of agile web rule objects
var _agile_email // Agile email object

// Rules object with methods, to verify the conditions
var rules = {

  // To check if tags are equal
  tags_in: function(webrules, _agile_contact) {
    if (webrules.tags_in && _agile_contact) {
      var flag = 0;
      var i = webrules.tags_in.length;
      var j = _agile_contact.tags.length;
      if (i <= j) {
        for (var k = 0; k < i; k++) {
          for (var l = 0; l < j; l++) {

            // Check if tags from webrules match with contact tags
            if (webrules.tags_in[k] === _agile_contact.tags[l]) {
              flag++;
            }
          }
        }
      }
      if (flag == i && flag !== 0 && i !== 0) return true;
    }
  },

  // To check if tags are not equal
  tags_out: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.tags_out) {
      var count = 0;
      var i = webrules.tags_out.length;
      var j = _agile_contact.tags.length;
      for (var k = 0; k < i; k++) {
        for (var l = 0; l < j; l++) {

          // Check if tags from webrules match contact tags
          if (_agile_contact.tags[l] !== webrules.tags_out[k]) {
            count++;
          }
        }
      }
      if (count == i * j && count !== 0 && i !== 0 && j !== 0) return true;
    }
  },

  // To check if tags match and verify time conditions like tags created after, before, in the last specified days
  tags_time: function(webrules, _agile_contact) {
    if (webrules.tags_time && _agile_contact) {
      var f = 0;
      var i = webrules.tags_time.tags.length;
      var j = _agile_contact.tagsWithTime.length;
      var current_time = new Date().getTime();
      if (i <= j) {
        for (var d = 0; d < i; d++) {
          for (var h = 0; h < j; h++) {
            if (webrules.tags_time.tags[d] == _agile_contact.tagsWithTime[h].tag) {
              var current_time = new Date().getTime();
              var created_time = (_agile_contact.tagsWithTime[h].createdTime);
              var dif = (current_time - created_time);
              if ((webrules.tags_time.condition == "LAST" && (0 <= dif && dif <= (webrules.tags_time.time * 86400000))) || (webrules.tags_time.condition == "AFTER" && (webrules.tags_time.time <= created_time) && ((created_time - webrules.tags_time.time) >= 86400000)) || (webrules.tags_time.condition == "BEFORE" && (webrules.tags_time.time >= created_time)) || (webrules.tags_time.condition == "EQUALS" && (0 <= (created_time - webrules.tags_time.time) && (created_time - webrules.tags_time.time) <= 86400000)) || (webrules.tags_time.condition == "BETWEEN" && (webrules.tags_time.time_min <= created_time && created_time <= webrules.tags_time.time_max))) {
                f++;
              }
            }
          }
        }
      }
      if (f == i && f !== 0 && i !== 0) return true;
    }
  },

  // To check if score greater than min_score
  min_score: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.min_score && _agile_contact.lead_score > webrules.min_score) return true;
  },

  // To check if score less than max_score
  max_score: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.max_score && _agile_contact.lead_score < webrules.max_score) return true;
  },

  // To check if score is equal to score
  score: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.score && _agile_contact.lead_score == webrules.score) return true;
  },

  // To check if referrer url matches with url in webrules
  referrer_is: function(anon_webrules) {
    if (anon_webrules.referrer_is === document.referrer) return true;
  },

  // To check if referrer url matches with specified string in webrules
  referrer_matches: function(anon_webrules) {
    var url = document.referrer;
    if (url.indexOf(anon_webrules.referrer_matches) !== -1) return true;
  },

  // To check if referrer url does not matches with specified string in webrules
  referrer_notmatches: function(anon_webrules) {
    var url = document.referrer;
    if (url.indexOf(anon_webrules.referrer_notmatches) == -1) return true;
  },

  // To check if referrer url doesnot match with url in webrules
  referrer_isnot: function(anon_webrules) {
    if (anon_webrules.referrer_isnot !== document.referrer) return true;
  },

  // To check current page matches with given url in webrules
  page_view_is: function(anon_webrules) {
    if (anon_webrules.page_view_is === document.location.href) return true;
  },

  // To check if referrer url doesnot match with url in webrules
  page_view_isnot: function(anon_webrules) {
    if (anon_webrules.page_view_isnot !== document.location.href) return true;
  },

  // To check if page url does not matches with specified string in webrules
  page_view_notmatches: function(anon_webrules) {
    var url = document.location.href;
    if (url.indexOf(anon_webrules.page_view_notmatches) == -1) return true;
  },

  // To check if current page url matches with given string in webrules
  page_view_matches: function(anon_webrules) {
    var url = document.location.href;
    if (url.indexOf(anon_webrules.page_view_matches) !== -1) return true;
  },

  // To check if session is new or ongoing
  session_type: function(anon_webrules) {
    if (anon_webrules.session_type === "first") return agile_session.new_session;
    if (anon_webrules.session_type === "ongoing") return !agile_session.new_session;
  },

  // To check if visit is first visit or repeat
  visit_type: function(anon_webrules) {
    if (anon_webrules.visit_type === "repeat") return !agile_guid.new_guid;
    if (anon_webrules.visit_type === "first") return agile_guid.new_guid;
  },

  // To check if contact properties match or not
  contact_properties_in: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.contact_properties_in) {
      var flag = 0;
      var l = webrules.contact_properties_in.length;
      var k = _agile_contact.properties.length;
      for (var r = 0; r < l; r++) {
        for (var s = 0; s < k; s++) {

          // Check if contact properties from webrules match with contact properties
          if (webrules.contact_properties_in[r].name === _agile_contact.properties[s].name && webrules.contact_properties_in[r].value === _agile_contact.properties[s].value) {
            flag++;
          }
        }
      }
      if (flag == l && flag !== 0 && l !== 0) return true;
    }
  },

  // To check if contact properties do not match
  contact_properties_out: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.contact_properties_out) {
      var count = 0;
      var l = webrules.contact_properties_out.length;
      var k = _agile_contact.properties.length;
      for (var g = 0; g < l; g++) {
        for (var h = 0; h < k; h++) {

          // Check if contact properties from webrules match with contact properties
          if (webrules.contact_properties_out[g].name === _agile_contact.properties[h].name && webrules.contact_properties_out[g].value !== _agile_contact.properties[h].value) {
            count++;
          }
        }
      }
      if (count == l && count !== 0 && l !== 0 && k !== 0) return true;
    }
  },

  // To check contact created time is after, before or in the last few days
  contact_time: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.contact_time) {
      var current_time = new Date().getTime();
      var created_time = (_agile_contact.created_time * 1000);
      var dif = (current_time - created_time);
      if ((webrules.contact_time.condition == "LAST" && (0 <= dif && dif <= (webrules.contact_time.time * 86400000))) || (webrules.contact_time.condition == "AFTER" && (webrules.contact_time.time <= created_time) && ((created_time - webrules.contact_time.time) >= 86400000)) || (webrules.contact_time.condition == "BEFORE" && (webrules.contact_time.time >= created_time)) || (webrules.contact_time.condition == "ON" && (0 <= (created_time - webrules.contact_time.time) && (created_time - webrules.contact_time.time) <= 86400000)) || (webrules.contact_time.condition == "BETWEEN" && (webrules.contact_time.time_min <= created_time && created_time <= webrules.contact_time.time_max))) return true;
    }
  },

  // To check custom date condition is after, before or in the last few days
  custom_time: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.custom_time) {
      var l = _agile_contact.properties.length;
      var k = webrules.custom_time.length;
      var s = 0;
      for (var g = 0; g < l; g++) {
        for (var m = 0; m < k; m++) {
          if (webrules.custom_time[m].label == (_agile_contact.properties[g].name + "_time")) {
            var current_time = new Date().getTime();
            var property_time = _agile_contact.properties[g].value * 1000;
            var dif = (current_time - property_time);
            if ((webrules.custom_time[m].condition == "LAST" && (0 <= dif && dif <= (webrules.custom_time[m].time * 86400000))) || (webrules.custom_time[m].condition == "AFTER" && (webrules.custom_time[m].time <= property_time) && ((property_time - webrules.custom_time[m].time) >= 86400000)) || (webrules.custom_time[m].condition == "BEFORE" && (webrules.custom_time[m].time >= property_time)) || (webrules.custom_time[m].condition == "ON" && (0 <= (property_time - webrules.custom_time[m].time) && (property_time - webrules.custom_time[m].time) <= 86400000)) || (webrules.custom_time[m].condition == "BETWEEN" && (webrules.custom_time[m].time_min <= property_time && property_time <= webrules.custom_time[m].time_max))) s++;
          }
        }
      }
      if (s == m && s != 0 && m != 0 && k !== 0) return true;
    }
  },

  // To check owner equals
  owner_is: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.owner_is && _agile_contact.owner.id.toString() === webrules.owner_is) return true;
  },

  // To check if owner is not equal
  owner_isnot: function(webrules, _agile_contact) {
    if (_agile_contact && webrules.owner_isnot && _agile_contact.owner.id.toString() !== webrules.owner_isnot) return true;
  }
};

// Function to convert contact JSON to handle bar JSON

function convert_json(contact_json) {
  if (contact_json !== undefined && contact_json.hasOwnProperty("properties")) {
    var result_json = {};
    for (var g = 0; g < contact_json.properties.length; g++) {
      var property = contact_json.properties[g];
      if (property.name == "first_name" || property.name == "last_name" || property.name == "email" || property.name == "company" || property.name == "website") {
        result_json[property.name] = property.value;
      }
    }
    return result_json;
  }
}

// Modal API function to show modal

function show_modal(modal_data, modal_options, modal_callback, contact_json) {

  if (typeof MooTools == 'undefined') head.load(["https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/mootools-core-1.3.1.js", "https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/mootools-more-1.3.1.1.js"], function() {
    console.log("loading mootools dyn");
  });
  else if (window.MooTools.version < "1.3.1") head.load(["https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/mootools-core-1.3.1.js", "https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/mootools-more-1.3.1.1.js"], function() {
    console.log("loading mootools dyn");
  });

  if (modal_options.custom_html) head.load("css/custommodal.css", function() {
    console.log("custom modal css loaded");
  });
  else head.load("css/simplemodal.css", function() {
    console.log("simple modal css loaded");
  });

  if (typeof handlebars == 'undefined') head.load("https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/handlebars-v1.3.0.js", function() {
    console.log("handlebars-v1.3.0 loaded")
  });

  head.load("lib/web-rule/simple-modal.js", function() {
    var SM = new SimpleModal(modal_options);
    if (modal_options.show_btn_ok) {
      SM.addButton("Ok", "simple_modal_btn primary", function() {

        modal_callback();
        /*      // Callback for confirm action of modal
      if (modal_options.form_id && (document.id(modal_options.form_id))) {
        var contact = {};
        var collection = document.id('modal-form');
        for (var i = 0; i < collection.length; i++) {
          if (collection[i].name.toLowerCase() == "firstname" || collection[i].name.toLowerCase() == "first_name" || collection[i].name.toLowerCase() == "first name" || collection[i].name.toLowerCase() == "name" || collection[i].name.toLowerCase() == "first") {
            contact.first_name = collection[i].value;
          }
          if (collection[i].name.toLowerCase() == "lastname" || collection[i].name.toLowerCase() == "last_name" || collection[i].name.toLowerCase() == "last name" || collection[i].name.toLowerCase() == "last") {
            contact.last_name = collection[i].value;
          }
          if (collection[i].name.toLowerCase().indexOf("email") != -1) {
            contact.email = collection[i].value;
          }
        }
        _agile.create_contact(contact, {
          success: function(data) {
            _agile.set_email(contact.email);
            _agile.add_tag('signup', {
              success: function() {
                console.log("tag added")
              },
              error: function() {
                console.log("error");
              }
            });
            console.log("success");
          },
          error: function(data) {
            console.log("error");
          }
        });
      }*/
        this.hide();
      });
    }

    // If modal is type confirmation adding cancel button
    if (modal_options.show_btn_cancel) {
      SM.addButton("Cancel", "simple_modal_btn", function() {
        modal_callback();
        this.hide();
      });
    }

    // Assign modal type, title, contents, callback
    SM.show({
      "model": "modal",
      "title": function() {
        if (modal_data.title) {
          var template = Handlebars.compile(modal_data.title);
          return template(contact_json);
        }
      },
      "contents": function() {
        if (modal_options.form_id && (document.id(modal_options.form_id))) return '<form id=modal-form>' + document.id(modal_options.form_id).innerHTML + '</form>';
        else {
          var template = Handlebars.compile(modal_data.contents);
          return template(contact_json);
        }
      }
    });
  });
}

// Noty API function to show noty

function show_noty(noty_data, noty_options, noty_callback, contact_json) {

  if (typeof jQuery == 'undefined') head.load("https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/jquery-1.7.2.min.js", function() {
    console.log("loading jquery dyn");
  });
  else if (jQuery.fn.jquery < "1.7.2") head.load("https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/jquery-1.7.2.min.js", function() {
    console.log("loading jquery dyn");
  });

  if (typeof handlebars == 'undefined') head.load("https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/handlebars-v1.3.0.js", function() {
    console.log("handlebars-v1.3.0.js loaded");
  });

  head.load(["https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/noty/jquery.noty.js", "https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/noty/default.js", "https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/noty/" + noty_options.position + ".js"], function() {

    // Format noty_callback to noty API
    var call_back = {};
    if (noty_callback && typeof(noty_callback) === "function") call_back.onClose = noty_callback;

    // Assign noty text, type, theme, callback etc
    var n = noty({
      text: function() {
        var template = Handlebars.compile(noty_data);
        return template(contact_json);
      },
      type: noty_options.type,
      dismissQueue: noty_options.dismiss_queue,
      layout: noty_options.position,
      theme: noty_options.theme,
      callback: call_back
    });
  });
}

function execute_action(modal_data, modal_options, modal_callback, noty_data, noty_options, noty_callback, add_campaign_id, rm_campaign_id, add_score, rm_score, add_tags, rm_tags, custom_script, _agile_email, contact_json) {
  if (!head.load) {
    console.log("please update headjs");
    return;
  }

  // If webrule action is modal
  if (modal_options.overlayOpacity) {
    if (modal_options.delay == "IMMEDIATE") show_modal(modal_data, modal_options, modal_callback, contact_json);
    if (modal_options.delay == "AFTER_SECS") setTimeout(function() {
      show_modal(modal_data, modal_options, modal_callback, contact_json);
    }, modal_options.timer * 1000);
    if (modal_options.delay == "FIRST_SCROLL") window.onscroll = function() {
      show_modal(modal_data, modal_options, modal_callback, contact_json);
      window.onscroll = null;
    }
    if (modal_options.delay == "END_OF_PAGE") {
      window.onscroll = function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          show_modal(modal_data, modal_options, modal_callback, contact_json);
          window.onscroll = null;
        }
      }
    }
  }

  // If webrule action is noty
  if (noty_options.type) {
    if (noty_options.delay == "IMMEDIATE") show_noty(noty_data, noty_options, noty_callback, contact_json);
    if (noty_options.delay == "AFTER_SECS") setTimeout(function() {
      show_noty(noty_data, noty_options, noty_callback, contact_json);
    }, noty_options.timer * 1000);
    if (noty_options.delay == "FIRST_SCROLL") window.onscroll = function() {
      show_noty(noty_data, noty_options, noty_callback, contact_json);
      window.onscroll = null;
    }
    if (noty_options.delay == "END_OF_PAGE") window.onscroll = function() {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        show_noty(noty_data, noty_options, noty_callback, contact_json);
        window.onscroll = null;
      }
    }
  }

  // If webrule action is add campaign
  if (add_campaign_id.length !== 0 && _agile_email) {
    for (var u = 0; u < add_campaign_id.length; u++) {
      _agile.add_campaign({
        "id": add_campaign_id[u]
      }, {
        success: function() {
          console.log("campaign assigned");
        },
        error: function() {
          console.log("error in assigning campaign");
        }
      }, _agile_email);
    }
  }

  // If webrule is to add tag
  if (add_tags.length !== 0 && _agile_email) _agile.add_tag(add_tags.toString(), {
    success: function() {
      console.log("tags added");
    },
    error: function() {
      console.log("failed to add tags");
    }
  }, _agile_email);

  // If webrule is to add score
  if (add_score && _agile_email) _agile.add_score(add_score, {
    success: function() {
      console.log("score added");
    },
    error: function() {
      console.log("failed to add score");
    }
  }, _agile_email);

  // If webrule action is unsubscribe campaign
  if (rm_campaign_id.length !== 0 && _agile_email) {
    for (var v = 0; v < rm_campaign_id.length; v++) {
      _agile.unsubscribe_campaign({
        "id": rm_campaign_id[v]
      }, {
        success: function() {
          console.log("unsubscribed");
        },
        error: function() {
          console.log("error in unsubscribing");
        }
      }, _agile_email);
    }
  }

  // If webrule is to remove score
  if (rm_score && _agile_email) _agile.add_score(rm_score, {
    success: function() {
      console.log("score");
    },
    error: function() {
      console.log("failed to subtract score");
    }
  }, _agile_email);

  // If webrule is to remove tags
  if (rm_tags.length !== 0 && _agile_email) _agile.remove_tag(rm_tags.toString(), {
    success: function() {
      console.log("tags removed");
    },
    error: function() {
      console.log("failed to remove tags");
    }
  }, _agile_email);

  // If webrule is to custom script
  if (custom_script.length !== 0) for (var x = 0; x < custom_script.length; x++) {
    eval(custom_script[x]);
  }
}

// Function to check if all conditions in a single webrule object are true,
// if yes call API (modal and/or noty and/or add-campaign)

function perform_action(_agile_contact, _agile_email, anon_webrules, webrules, modal_data, modal_options, modal_callback, noty_data, noty_options, noty_callback, add_campaign_id, rm_campaign_id, add_score, rm_score, add_tags, rm_tags, custom_script) {
  var len = 0; // Length of anon_webrules
  var _counter = 0; // Counter for satisfied anon_webrules
  var t = 0; // Webrules length

  // Get number of webrules
  for (var j in webrules) {
    if (webrules.hasOwnProperty(j)) t++;
  }

  // Check if all anonymous conditions are true
  for (var anon_rule in anon_webrules) {
    len++;
    if (anon_webrules.hasOwnProperty(anon_rule) && rules[anon_rule](anon_webrules)) {
      _counter++;
    }
  }

  if (_agile_contact) {
    var counter = 0;
    for (var rule in webrules) {
      if (webrules.hasOwnProperty(rule) && rules[rules](webrules, _agile_contact)) {
        counter++;
      }
    }
    var contact_json = convert_json(_agile_contact);
    if ((t == 0 && len !== 0 && len == _counter) || (t !== 0 && t == counter && len == 0) || (t != 0 && t == counter && len == _counter && len !== 0)) {
      execute_action(modal_data, modal_options, modal_callback, noty_data, noty_options, noty_callback, add_campaign_id, rm_campaign_id, add_score, rm_score, add_tags, rm_tags, custom_script, _agile_email, contact_json);
    }
  } else if (t == 0 && len !== 0 && len == _counter && _counter !== 0) {
    execute_action(modal_data, modal_options, modal_callback, noty_data, noty_options, noty_callback, add_campaign_id, rm_campaign_id, add_score, rm_score, add_tags, rm_tags, custom_script);
  }
}

// Webrule API to get array of webrule objects (if multiple webrules defined) from agile,
// iterate, and build webrule actions, condition

function _agile_execute_webrules() {
  if (_agile_webrules) {
    webrules_execute(_agile_webrules);
    return;
  }

  _agile.web_rules({
    success: function(data) {
      console.log("fetching webrules");
      _agile_webrules = data;

      agile_getEmail({
        success: function(data) {
          _agile_email = data.email;
          if (_agile_email == 'null' || undefined) webrules_execute(_agile_webrules);
          else if (_agile_email) {
            _agile.get_contact(_agile_email, {
              success: function(data) {
                _agile_contact = data;
                webrules_execute(_agile_webrules, _agile_contact, _agile_email);
              },
              error: function() {
                webrules_execute(_agile_webrules);
              }
            })
          }
        },
        error: function() {
          webrules_execute(_agile_webrules);
        }
      });

    },
    error: function() {
      console.log("error");
    }
  });
}

function webrules_execute(_agile_webrules, _agile_contact, _agile_email) {

  // Agile API to get array of webrule objects from datastore
  console.log(_agile_webrules);
  var l = _agile_webrules.length;

  // Iterate array of webrule objects and build rules, options, modal/noty content etc
  // Each webrule object has three main parts webrule conditions, webrule actions, data (title / content)
  for (var i = 0; i < l; i++) {

    var webrules = {}; // Webrule object
    var anon_webrules = {}; // Webrules object for anonymous visitor
    var modal_data = {}; // Modal data
    var modal_options = {}; // Modal options
    var modal_callback; // Modal callback
    var noty_callback; // Noty callback
    var noty_data = {}; // Noty data
    var noty_options = {}; // Noty options
    var add_campaign_id = []; // Workflow id
    var rm_campaign_id = []; // Workflow id
    var add_tags = []; // Tags array to add
    var rm_tags = []; // Tags array to remove
    var add_score; // Score to add
    var rm_score; // Score to remove
    var custom_script = []; // Script
    var webrule_name = _agile_webrules[i].name; // Webrule name

    // Build webrules
    var r = _agile_webrules[i].rules.length;
    for (var s = 0; s < r; s++) {

      if (_agile_webrules[i].rules[s].LHS == "tags") {
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") webrules.tags_in = _agile_webrules[i].rules[s].RHS.replace(', ', ',').split(',');
        if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") webrules.tags_out = _agile_webrules[i].rules[s].RHS.replace(', ', ',').split(',');
      } else if (_agile_webrules[i].rules[s].LHS == "page") {
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") anon_webrules.page_view_is = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "MATCHES") anon_webrules.page_view_matches = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") anon_webrules.page_view_isnot = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "NOT_CONTAINS") anon_webrules.page_view_notmatches = _agile_webrules[i].rules[s].RHS;
      } else if (_agile_webrules[i].rules[s].LHS == "visit") {
        if (_agile_webrules[i].rules[s].CONDITION == "FIRST_TIME") anon_webrules.visit_type = "first";
        if (_agile_webrules[i].rules[s].CONDITION == "REPEAT") anon_webrules.visit_type = "repeat";
      } else if (_agile_webrules[i].rules[s].LHS == "referrer") {
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") anon_webrules.referrer_is = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "MATCHES") anon_webrules.referrer_matches = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") anon_webrules.referrer_isnot = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "NOT_CONTAINS") anon_webrules.referrer_notmatches = _agile_webrules[i].rules[s].RHS;
      } else if (_agile_webrules[i].rules[s].LHS == "tags_time" && _agile_webrules[i].rules[s].CONDITION == "EQUALS") {
        webrules.tags_time = {};
        if (_agile_webrules[i].rules[s].nested_condition == "BETWEEN") {
          webrules.tags_time["tags"] = _agile_webrules[i].rules[s].RHS.replace(', ', ',').split(',');
          webrules.tags_time["time_min"] = _agile_webrules[i].rules[s].nested_lhs;
          webrules.tags_time["time_max"] = _agile_webrules[i].rules[s].nested_rhs;
          webrules.tags_time["condition"] = _agile_webrules[i].rules[s].nested_condition;
        }
        if (_agile_webrules[i].rules[s].nested_condition == "BEFORE" || _agile_webrules[i].rules[s].nested_condition == "AFTER" || _agile_webrules[i].rules[s].nested_condition == "EQUALS" || _agile_webrules[i].rules[s].nested_condition == "NEXT" || _agile_webrules[i].rules[s].nested_condition == "LAST") {
          webrules.tags_time["tags"] = _agile_webrules[i].rules[s].RHS.replace(', ', ',').split(',');
          webrules.tags_time["time"] = _agile_webrules[i].rules[s].nested_lhs;
          webrules.tags_time["condition"] = _agile_webrules[i].rules[s].nested_condition;
        }
      } else if (_agile_webrules[i].rules[s].LHS == "created_time") {
        webrules.contact_time = {};
        if (_agile_webrules[i].rules[s].CONDITION == "BEFORE" || _agile_webrules[i].rules[s].CONDITION == "AFTER" || _agile_webrules[i].rules[s].CONDITION == "ON" || _agile_webrules[i].rules[s].CONDITION == "LAST" || _agile_webrules[i].rules[s].CONDITION == "NEXT") {
          webrules.contact_time["time"] = _agile_webrules[i].rules[s].RHS;
          webrules.contact_time["condition"] = _agile_webrules[i].rules[s].CONDITION;
        }
        if (_agile_webrules[i].rules[s].CONDITION == "BETWEEN") {
          webrules.contact_time["time_max"] = _agile_webrules[i].rules[s].RHS_NEW;
          webrules.contact_time["time_min"] = _agile_webrules[i].rules[s].RHS;
          webrules.contact_time["condition"] = _agile_webrules[i].rules[s].CONDITION;
        }
      } else if (_agile_webrules[i].rules[s].LHS == "title" || _agile_webrules[i].rules[s].LHS == "company") {
        var property_json = {};
        property_json.name = _agile_webrules[i].rules[s].LHS;
        property_json.value = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") {
          if (!webrules.contact_properties_in) webrules.contact_properties_in = [];
          webrules.contact_properties_in.push(property_json);
        }
        if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") {
          if (!webrules.contact_properties_out) webrules.contact_properties_out = [];
          webrules.contact_properties_out.push(property_json);
        }
      } else if (_agile_webrules[i].rules[s].LHS == "lead_score") {
        if (_agile_webrules[i].rules[s].CONDITION == "IS_LESS_THAN") webrules.max_score = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "IS_GREATER_THAN") webrules.min_score = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") webrules.score = _agile_webrules[i].rules[s].RHS;
      } else if (_agile_webrules[i].rules[s].LHS == "owner_id") {
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") webrules.owner_is = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") webrules.owner_isnot = _agile_webrules[i].rules[s].RHS;
      } else if (_agile_webrules[i].rules[s].CONDITION == "EQUALS" || _agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") {
        var property_json = {};
        property_json.name = _agile_webrules[i].rules[s].LHS;
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS" || _agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") property_json.value = _agile_webrules[i].rules[s].RHS;
        if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") {
          if (!webrules.contact_properties_in) webrules.contact_properties_in = [];
          webrules.contact_properties_in.push(property_json);
        }
        if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") {
          if (!webrules.contact_properties_out) webrules.contact_properties_out = [];
          webrules.contact_properties_out.push(property_json);
        }
      } else {
        var custom_field = {};

        if (_agile_webrules[i].rules[s].CONDITION == "BEFORE" || _agile_webrules[i].rules[s].CONDITION == "AFTER" || _agile_webrules[i].rules[s].CONDITION == "ON" || _agile_webrules[i].rules[s].CONDITION == "LAST" || _agile_webrules[i].rules[s].CONDITION == "NEXT") {
          custom_field["label"] = _agile_webrules[i].rules[s].LHS;
          custom_field["time"] = _agile_webrules[i].rules[s].RHS;
          custom_field["condition"] = _agile_webrules[i].rules[s].CONDITION;
          if (!webrules.custom_time) webrules.custom_time = [];
          webrules.custom_time.push(custom_field);
        }
        if (_agile_webrules[i].rules[s].CONDITION == "BETWEEN") {
          custom_field["label"] = _agile_webrules[i].rules[s].LHS;
          custom_field["time_max"] = _agile_webrules[i].rules[s].RHS_NEW;
          custom_field["time_min"] = _agile_webrules[i].rules[s].RHS;
          custom_field["condition"] = _agile_webrules[i].rules[s].CONDITION;
          if (!webrules.custom_time) webrules.custom_time = [];
          webrules.custom_time.push(custom_field);
        }
      }
    }

    // Build webrule actions
    var u = _agile_webrules[i].actions.length;
    for (var t = 0; t < u; t++) {

      // If webrule action is modal
      if (_agile_webrules[i].actions[t].action == "MODAL_POPUP" || _agile_webrules[i].actions[t].action == "FORM") {

        // If modal is of type confirmation
        if (_agile_webrules[i].actions[t].popup_pattern == "confirmation") {
          modal_options.show_btn_cancel = true;
          modal_options.show_btn_ok = true;
          modal_data.title = _agile_webrules[i].actions[t].title;
          modal_data.contents = _agile_webrules[i].actions[t].popup_text.value;
        }

        // If modal is of type information
        else if (_agile_webrules[i].actions[t].popup_pattern == "information") {
          modal_options.show_btn_cancel = false;
          modal_options.show_btn_ok = true;
          modal_data.title = _agile_webrules[i].actions[t].title;
          modal_data.contents = _agile_webrules[i].actions[t].popup_text.value;
          modal_options.hideHeader = false;
        }

        // If modal is of type custom_html
        else if (_agile_webrules[i].actions[t].popup_pattern == "custom_html") {
          var e = document.createElement('div');
          e.innerHTML = _agile_webrules[i].actions[t].popup_text.value;
          var data = e.childNodes[0].nodeValue;
          if (data) modal_data.contents = data;
          else modal_data.contents = e.innerHTML;
          modal_options.hideHeader = true;
          modal_options.hideFooter = true;
          modal_options.custom_html = true;
          modal_options.closeButton = false;
        }

        // If modal is of type form
        else {
          modal_options.form_id = _agile_webrules[i].actions[t].popup_pattern;
          modal_options.hideHeader = true;
          modal_options.hideFooter = true;
        }

        // Build options for webrule action (modal) right now hardcoded as no option from UI
        modal_options.timer = _agile_webrules[i].actions[t].timer;
        modal_options.delay = _agile_webrules[i].actions[t].delay;
        modal_options.btn_ok = 'Subscribe';
        modal_options.btn_cancel = 'Cancel';
        modal_options.overlayOpacity = 0.5;
        modal_options.onAppend = function() {
          document.id('simple-modal').fade('hide');
          setTimeout((function() {
            document.id('simple-modal').fade('show')
          }), 200);
          var tw = new Fx.Tween(document.id('simple-modal'), {
            duration: 450,
            transition: 'linear',
            link: 'cancel',
            property: 'top'
          }).start(-400, 150)
        };
        modal_callback = function() {
          test('this_is_modal_callback');
          var modal_event = new CustomEvent("modal_event", {
            'detail': {
              message: webrule_name
            },
            bubbles: true,
            cancelable: true
          });
          // document.addEventListener("modal_event", modal_event_handler, false);
          document.dispatchEvent(modal_event);
        }
      }

      // If webrule action is noty and type is custom_html
      if (_agile_webrules[i].actions[t].action == "CORNER_NOTY" && _agile_webrules[i].actions[t].popup_pattern == "information") {

        if (_agile_webrules[i].actions[t].position == "RIGHT_BOTTOM") noty_options.position = "bottomRight";
        if (_agile_webrules[i].actions[t].position == "RIGHT_TOP") noty_options.position = "topRight";
        if (_agile_webrules[i].actions[t].position == "LEFT_BOTTOM") noty_options.position = "bottomLeft";
        if (_agile_webrules[i].actions[t].position == "LEFT_TOP") noty_options.position = "topLeft";
        if (_agile_webrules[i].actions[t].position == "TOP") noty_options.position = "top";
        if (_agile_webrules[i].actions[t].position == "BOTTOM") noty_options.position = "bottom";

        noty_data = _agile_webrules[i].actions[t].popup_text.value;
        noty_options.type = 'alert';
        noty_options.theme = 'defaultTheme';
        noty_options.dismiss_queue = 'true';
        noty_options.delay = _agile_webrules[i].actions[t].delay;
        noty_options.timer = _agile_webrules[i].actions[t].timer;
        noty_callback = function() {
          test('this_is_noty_callback');
          var noty_event = new CustomEvent("noty_event", {
            'detail': {
              message: webrule_name
            },
            bubbles: true,
            cancelable: true
          });
          //document.addEventListener("noty_event", noty_event_handler, false);
          document.dispatchEvent(noty_event);
        }
      }

      // If webrule action is campaign
      if (_agile_webrules[i].actions[t].action == "ASSIGN_CAMPAIGN") add_campaign_id.push(_agile_webrules[i].actions[t].RHS);
      if (_agile_webrules[i].actions[t].action == "UNSUBSCRIBE_CAMPAIGN") rm_campaign_id.push(_agile_webrules[i].actions[t].RHS);

      // If webrule action is tag
      if (_agile_webrules[i].actions[t].action == "ADD_TAG") add_tags.push(_agile_webrules[i].actions[t].RHS);
      if (_agile_webrules[i].actions[t].action == "REMOVE_TAG") rm_tags.push(_agile_webrules[i].actions[t].RHS);

      // If webrule action is javascript
      if (_agile_webrules[i].actions[t].action == "JAVA_SCRIPT") {
        custom_script.push(_agile_webrules[i].actions[t].RHS);
      }

      // If webrule action is score
      if (_agile_webrules[i].actions[t].action == "ADD_SCORE") add_score = _agile_webrules[i].actions[t].RHS;
      if (_agile_webrules[i].actions[t].action == "SUBTRACT_SCORE") if (_agile_webrules[i].actions[t].RHS < 0) rm_score = _agile_webrules[i].actions[t].RHS;
      else rm_score = -_agile_webrules[i].actions[t].RHS;
    }

    // Call to method to check all conditions in a webrule are true and perform action
    perform_action(_agile_contact, _agile_email, anon_webrules, webrules, modal_data, modal_options, modal_callback, noty_data, noty_options, noty_callback, add_campaign_id, rm_campaign_id, add_score, rm_score, add_tags, rm_tags, custom_script);
  }
}

// Test callback

function test(k) {
  console.log(k);
}
