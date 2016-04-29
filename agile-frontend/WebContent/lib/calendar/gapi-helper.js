


function gapi_helper_prototype()
{
  var gapi_helper = {
    start: new Date(),
    listeners: {},
    status: {}
    };

// for logging elapsed times to console
gapi_helper.time = function() {
    return new Date() - gapi_helper.start;
};

// config must contain clientId, apiKey, scopes, and services to load, eg
// { clientId: "<id>", apiKey: "<key>", scopes: "https://www.googleapis.com/auth/calendar", 
//   services: { calendar: 'v3' } }
gapi_helper.configure = function(config) {
    console.log(config);
    console.log("gapi configured %s", gapi_helper.time());
    // TODO: confirm valid config
    gapi_helper.config = config;
    if (gapi_helper.status['scriptLoaded']) gapi_helper.init();
};

gapi_helper.onScriptLoad = function() {
    console.log("gapi script loaded %s", gapi_helper.time());
    gapi_helper.status['scriptLoaded'] = true;
    if (gapi_helper.config) gapi_helper.init();
};
// this synonym is needed by the '?onload=' construction, which seems to choke on object notatation
// use «script src="https://apis.google.com/js/client.js?onload=gapi_helper_onScriptLoad»
//gapi_helper_onScriptLoad = gapi_helper.onScriptLoad;

gapi_helper.init = function() {
    console.log("gapi_helper.init %s", gapi_helper.time());
    console.log(gapi_helper.config.apiKey);
    gapi.client.setApiKey(gapi_helper.config.apiKey);
    window.setTimeout(function(){
        gapi_helper.handleAuthResult({});   
    }, 1);
};

gapi_helper.checkAuth = function() {
    console.log("gapi_helper.checkAuth %s", gapi_helper.time());
    console.log(gapi_helper.config.clientId);
    console.log(gapi_helper.config.scopes);
    gapi.auth.authorize({
        client_id: gapi_helper.config.clientId,
        scope: gapi_helper.config.scopes,
        immediate: false
    }, gapi_helper.handleAuthResult);
};

gapi_helper.handleAuthResult = function(authResult) {
    console.log(authResult);
    
    console.log("gapi_helper.handleAuthResult %s", gapi_helper.time());
    if (authResult && !authResult.error) {
        gapi_helper.fireEvent('authorized');
        gapi_helper.loadServices();
    } else {
        gapi_helper.fireEvent('authFailed');
    }
};

gapi_helper.requestAuth = function() {
    console.log("gapi_helper.requestAuth %s", gapi_helper.time());
    console.log(gapi_helper.config);
    gapi.auth.authorize({
        client_id: gapi_helper.config.clientId,
        scope: gapi_helper.config.scopes,
        origin: gapi_helper.config.origin,
        immediate: true
    }, gapi_helper.handleAuthResult);
    return false; // so you can use this as an onclick handler
};

gapi_helper.loadServices = function() {
    console.log("gapi_helper.loadServices %s", gapi_helper.time());
    for (var name in gapi_helper.config.services) {
        var version = gapi_helper.config.services[name];
        gapi.client.load(name, version, function() {
            // TODO: deal with failure
            console.log("%s %s loaded %s", name, version, gapi_helper.time());
            gapi_helper.fireEvent(name + 'Loaded');
            
           
        });
        
      
    }
  
};

// TODO add gapi_helper.logout

gapi_helper.when = function(eventName, callback) {
    // if event has already happened, trigger the callback immediately
    if (gapi_helper.status[eventName]) callback();
    // in any case, add the callback to the listeners array
    if (!gapi_helper.listeners[eventName]) gapi_helper.listeners[eventName] = [];
    gapi_helper.listeners[eventName].push(callback);
    console.log('gapi_helper: registered listener for %s', eventName);
};

gapi_helper.fireEvent = function(eventName) {
    console.log("firing %s", eventName);
    // register event
    gapi_helper.status[eventName] = true;
    console.log(gapi_helper.listeners[eventName]);
    // trigger listeners
    var listeners = gapi_helper.listeners[eventName] || [];
    for (var i = 0; i < listeners.length; i++) {
        console.log(listeners[i]);
        listeners[i]();
    }
};

var _that = this;


gapi_helper_prototype.prototype.when = gapi_helper.when;
gapi_helper_prototype.prototype.configure = gapi_helper.configure;
this.watcher = setInterval(function() {

    var loaded = typeof gapi !== "undefined" && gapi.client;
    console.log("%s %s", loaded ? "gapi loaded" : "waiting", gapi_helper.time());
    if (loaded) {
        clearInterval(_that.watcher);
        gapi_helper.onScriptLoad();
    }
}, 500);
}
