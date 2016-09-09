/*! Backbone.js 0.9.2 */

(function(){var l=this,y=l.Backbone,z=Array.prototype.slice,A=Array.prototype.splice,g;g="undefined"!==typeof exports?exports:l.Backbone={};g.VERSION="0.9.2";var f=l._;!f&&"undefined"!==typeof require&&(f=require("underscore"));var i=l.jQuery||l.Zepto||l.ender;g.setDomLibrary=function(a){i=a};g.noConflict=function(){l.Backbone=y;return this};g.emulateHTTP=!1;g.emulateJSON=!1;var p=/\s+/,k=g.Events={on:function(a,b,c){var d,e,f,g,j;if(!b)return this;a=a.split(p);for(d=this._callbacks||(this._callbacks=
{});e=a.shift();)f=(j=d[e])?j.tail:{},f.next=g={},f.context=c,f.callback=b,d[e]={tail:g,next:j?j.next:f};return this},off:function(a,b,c){var d,e,h,g,j,q;if(e=this._callbacks){if(!a&&!b&&!c)return delete this._callbacks,this;for(a=a?a.split(p):f.keys(e);d=a.shift();)if(h=e[d],delete e[d],h&&(b||c))for(g=h.tail;(h=h.next)!==g;)if(j=h.callback,q=h.context,b&&j!==b||c&&q!==c)this.on(d,j,q);return this}},trigger:function(a){var b,c,d,e,f,g;if(!(d=this._callbacks))return this;f=d.all;a=a.split(p);for(g=
z.call(arguments,1);b=a.shift();){if(c=d[b])for(e=c.tail;(c=c.next)!==e;)c.callback.apply(c.context||this,g);if(c=f){e=c.tail;for(b=[b].concat(g);(c=c.next)!==e;)c.callback.apply(c.context||this,b)}}return this}};k.bind=k.on;k.unbind=k.off;var o=g.Model=function(a,b){var c;a||(a={});b&&b.parse&&(a=this.parse(a));if(c=n(this,"defaults"))a=f.extend({},c,a);b&&b.collection&&(this.collection=b.collection);this.attributes={};this._escapedAttributes={};this.cid=f.uniqueId("c");this.changed={};this._silent=
{};this._pending={};this.set(a,{silent:!0});this.changed={};this._silent={};this._pending={};this._previousAttributes=f.clone(this.attributes);this.initialize.apply(this,arguments)};f.extend(o.prototype,k,{changed:null,_silent:null,_pending:null,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},get:function(a){return this.attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;b=this.get(a);return this._escapedAttributes[a]=f.escape(null==
b?"":""+b)},has:function(a){return null!=this.get(a)},set:function(a,b,c){var d,e;f.isObject(a)||null==a?(d=a,c=b):(d={},d[a]=b);c||(c={});if(!d)return this;d instanceof o&&(d=d.attributes);if(c.unset)for(e in d)d[e]=void 0;if(!this._validate(d,c))return!1;this.idAttribute in d&&(this.id=d[this.idAttribute]);var b=c.changes={},h=this.attributes,g=this._escapedAttributes,j=this._previousAttributes||{};for(e in d){a=d[e];if(!f.isEqual(h[e],a)||c.unset&&f.has(h,e))delete g[e],(c.silent?this._silent:
b)[e]=!0;c.unset?delete h[e]:h[e]=a;!f.isEqual(j[e],a)||f.has(h,e)!=f.has(j,e)?(this.changed[e]=a,c.silent||(this._pending[e]=!0)):(delete this.changed[e],delete this._pending[e])}c.silent||this.change(c);return this},unset:function(a,b){(b||(b={})).unset=!0;return this.set(a,null,b)},clear:function(a){(a||(a={})).unset=!0;return this.set(f.clone(this.attributes),a)},fetch:function(a){var a=a?f.clone(a):{},b=this,c=a.success;a.success=function(d,e,f){if(!b.set(b.parse(d,f),a))return!1;c&&c(b,d)};
a.error=g.wrapError(a.error,b,a);return(this.sync||g.sync).call(this,"read",this,a)},save:function(a,b,c){var d,e;f.isObject(a)||null==a?(d=a,c=b):(d={},d[a]=b);c=c?f.clone(c):{};if(c.wait){if(!this._validate(d,c))return!1;e=f.clone(this.attributes)}a=f.extend({},c,{silent:!0});if(d&&!this.set(d,c.wait?a:c))return!1;var h=this,i=c.success;c.success=function(a,b,e){b=h.parse(a,e);if(c.wait){delete c.wait;b=f.extend(d||{},b)}if(!h.set(b,c))return false;i?i(h,a):h.trigger("sync",h,a,c)};c.error=g.wrapError(c.error,
h,c);b=this.isNew()?"create":"update";b=(this.sync||g.sync).call(this,b,this,c);c.wait&&this.set(e,a);return b},destroy:function(a){var a=a?f.clone(a):{},b=this,c=a.success,d=function(){b.trigger("destroy",b,b.collection,a)};if(this.isNew())return d(),!1;a.success=function(e){a.wait&&d();c?c(b,e):b.trigger("sync",b,e,a)};a.error=g.wrapError(a.error,b,a);var e=(this.sync||g.sync).call(this,"delete",this,a);a.wait||d();return e},url:function(){var a=n(this,"urlRoot")||n(this.collection,"url")||t();
return this.isNew()?a:a+("/"==a.charAt(a.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},change:function(a){a||(a={});var b=this._changing;this._changing=!0;for(var c in this._silent)this._pending[c]=!0;var d=f.extend({},a.changes,this._silent);this._silent={};for(c in d)this.trigger("change:"+c,this,this.get(c),a);if(b)return this;for(;!f.isEmpty(this._pending);){this._pending=
{};this.trigger("change",this,a);for(c in this.changed)!this._pending[c]&&!this._silent[c]&&delete this.changed[c];this._previousAttributes=f.clone(this.attributes)}this._changing=!1;return this},hasChanged:function(a){return!arguments.length?!f.isEmpty(this.changed):f.has(this.changed,a)},changedAttributes:function(a){if(!a)return this.hasChanged()?f.clone(this.changed):!1;var b,c=!1,d=this._previousAttributes,e;for(e in a)if(!f.isEqual(d[e],b=a[e]))(c||(c={}))[e]=b;return c},previous:function(a){return!arguments.length||
!this._previousAttributes?null:this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},isValid:function(){return!this.validate(this.attributes)},_validate:function(a,b){if(b.silent||!this.validate)return!0;var a=f.extend({},this.attributes,a),c=this.validate(a,b);if(!c)return!0;b&&b.error?b.error(this,c,b):this.trigger("error",this,c,b);return!1}});var r=g.Collection=function(a,b){b||(b={});b.model&&(this.model=b.model);b.comparator&&(this.comparator=b.comparator);
this._reset();this.initialize.apply(this,arguments);a&&this.reset(a,{silent:!0,parse:b.parse})};f.extend(r.prototype,k,{model:o,initialize:function(){},toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},add:function(a,b){var c,d,e,g,i,j={},k={},l=[];b||(b={});a=f.isArray(a)?a.slice():[a];c=0;for(d=a.length;c<d;c++){if(!(e=a[c]=this._prepareModel(a[c],b)))throw Error("Can't add an invalid model to a collection");g=e.cid;i=e.id;j[g]||this._byCid[g]||null!=i&&(k[i]||this._byId[i])?
l.push(c):j[g]=k[i]=e}for(c=l.length;c--;)a.splice(l[c],1);c=0;for(d=a.length;c<d;c++)(e=a[c]).on("all",this._onModelEvent,this),this._byCid[e.cid]=e,null!=e.id&&(this._byId[e.id]=e);this.length+=d;A.apply(this.models,[null!=b.at?b.at:this.models.length,0].concat(a));this.comparator&&this.sort({silent:!0});if(b.silent)return this;c=0;for(d=this.models.length;c<d;c++)if(j[(e=this.models[c]).cid])b.index=c,e.trigger("add",e,this,b);return this},remove:function(a,b){var c,d,e,g;b||(b={});a=f.isArray(a)?
a.slice():[a];c=0;for(d=a.length;c<d;c++)if(g=this.getByCid(a[c])||this.get(a[c]))delete this._byId[g.id],delete this._byCid[g.cid],e=this.indexOf(g),this.models.splice(e,1),this.length--,b.silent||(b.index=e,g.trigger("remove",g,this,b)),this._removeReference(g);return this},push:function(a,b){a=this._prepareModel(a,b);this.add(a,b);return a},pop:function(a){var b=this.at(this.length-1);this.remove(b,a);return b},unshift:function(a,b){a=this._prepareModel(a,b);this.add(a,f.extend({at:0},b));return a},
shift:function(a){var b=this.at(0);this.remove(b,a);return b},get:function(a){return null==a?void 0:this._byId[null!=a.id?a.id:a]},getByCid:function(a){return a&&this._byCid[a.cid||a]},at:function(a){return this.models[a]},where:function(a){return f.isEmpty(a)?[]:this.filter(function(b){for(var c in a)if(a[c]!==b.get(c))return!1;return!0})},sort:function(a){a||(a={});if(!this.comparator)throw Error("Cannot sort a set without a comparator");var b=f.bind(this.comparator,this);1==this.comparator.length?
this.models=this.sortBy(b):this.models.sort(b);a.silent||this.trigger("reset",this,a);return this},pluck:function(a){return f.map(this.models,function(b){return b.get(a)})},reset:function(a,b){a||(a=[]);b||(b={});for(var c=0,d=this.models.length;c<d;c++)this._removeReference(this.models[c]);this._reset();this.add(a,f.extend({silent:!0},b));b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a=a?f.clone(a):{};void 0===a.parse&&(a.parse=!0);var b=this,c=a.success;a.success=function(d,
e,f){b[a.add?"add":"reset"](b.parse(d,f),a);c&&c(b,d)};a.error=g.wrapError(a.error,b,a);return(this.sync||g.sync).call(this,"read",this,a)},create:function(a,b){var c=this,b=b?f.clone(b):{},a=this._prepareModel(a,b);if(!a)return!1;b.wait||c.add(a,b);var d=b.success;b.success=function(e,f){b.wait&&c.add(e,b);d?d(e,f):e.trigger("sync",a,f,b)};a.save(null,b);return a},parse:function(a){return a},chain:function(){return f(this.models).chain()},_reset:function(){this.length=0;this.models=[];this._byId=
{};this._byCid={}},_prepareModel:function(a,b){b||(b={});a instanceof o?a.collection||(a.collection=this):(b.collection=this,a=new this.model(a,b),a._validate(a.attributes,b)||(a=!1));return a},_removeReference:function(a){this==a.collection&&delete a.collection;a.off("all",this._onModelEvent,this)},_onModelEvent:function(a,b,c,d){("add"==a||"remove"==a)&&c!=this||("destroy"==a&&this.remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],this._byId[b.id]=b),this.trigger.apply(this,
arguments))}});f.each("forEach,each,map,reduce,reduceRight,find,detect,filter,select,reject,every,all,some,any,include,contains,invoke,max,min,sortBy,sortedIndex,toArray,size,first,initial,rest,last,without,indexOf,shuffle,lastIndexOf,isEmpty,groupBy".split(","),function(a){r.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)))}});var u=g.Router=function(a){a||(a={});a.routes&&(this.routes=a.routes);this._bindRoutes();this.initialize.apply(this,arguments)},B=/:\w+/g,
C=/\*\w+/g,D=/[-[\]{}()+?.,\\^$|#\s]/g;f.extend(u.prototype,k,{initialize:function(){},route:function(a,b,c){g.history||(g.history=new m);f.isRegExp(a)||(a=this._routeToRegExp(a));c||(c=this[b]);g.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c&&c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d));g.history.trigger("route",this,b,d)},this));return this},navigate:function(a,b){g.history.navigate(a,b)},_bindRoutes:function(){if(this.routes){var a=[],b;for(b in this.routes)a.unshift([b,
this.routes[b]]);b=0;for(var c=a.length;b<c;b++)this.route(a[b][0],a[b][1],this[a[b][1]])}},_routeToRegExp:function(a){a=a.replace(D,"\\$&").replace(B,"([^/]+)").replace(C,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});var m=g.History=function(){this.handlers=[];f.bindAll(this,"checkUrl")},s=/^[#\/]/,E=/msie [\w.]+/;m.started=!1;f.extend(m.prototype,k,{interval:50,getHash:function(a){return(a=(a?a.location:window.location).href.match(/#(.*)$/))?a[1]:
""},getFragment:function(a,b){if(null==a)if(this._hasPushState||b){var a=window.location.pathname,c=window.location.search;c&&(a+=c)}else a=this.getHash();a.indexOf(this.options.root)||(a=a.substr(this.options.root.length));return a.replace(s,"")},start:function(a){if(m.started)throw Error("Backbone.history has already been started");m.started=!0;this.options=f.extend({},{root:"/"},this.options,a);this._wantsHashChange=!1!==this.options.hashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=
!(!this.options.pushState||!window.history||!window.history.pushState);var a=this.getFragment(),b=document.documentMode;if(b=E.exec(navigator.userAgent.toLowerCase())&&(!b||7>=b))this.iframe=i('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a);this._hasPushState?i(window).bind("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!b?i(window).bind("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,
this.interval));this.fragment=a;a=window.location;b=a.pathname==this.options.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!b)return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0;this._wantsPushState&&this._hasPushState&&b&&a.hash&&(this.fragment=this.getHash().replace(s,""),window.history.replaceState({},document.title,a.protocol+"//"+a.host+this.options.root+this.fragment));if(!this.options.silent)return this.loadUrl()},
stop:function(){i(window).unbind("popstate",this.checkUrl).unbind("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);m.started=!1},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a==this.fragment&&this.iframe&&(a=this.getFragment(this.getHash(this.iframe)));if(a==this.fragment)return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(this.getHash())},loadUrl:function(a){var b=this.fragment=this.getFragment(a);return f.any(this.handlers,
function(a){if(a.route.test(b))return a.callback(b),!0})},navigate:function(a,b){if(!m.started)return!1;if(!b||!0===b)b={trigger:b};var c=(a||"").replace(s,"");this.fragment!=c&&(this._hasPushState?(0!=c.indexOf(this.options.root)&&(c=this.options.root+c),this.fragment=c,window.history[b.replace?"replaceState":"pushState"]({},document.title,c)):this._wantsHashChange?(this.fragment=c,this._updateHash(window.location,c,b.replace),this.iframe&&c!=this.getFragment(this.getHash(this.iframe))&&(b.replace||
this.iframe.document.open().close(),this._updateHash(this.iframe.location,c,b.replace))):window.location.assign(this.options.root+a),b.trigger&&this.loadUrl(a))},_updateHash:function(a,b,c){c?a.replace(a.toString().replace(/(javascript:|#).*$/,"")+"#"+b):a.hash=b}});var v=g.View=function(a){this.cid=f.uniqueId("view");this._configure(a||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()},F=/^(\S+)\s*(.*)$/,w="model,collection,el,id,attributes,className,tagName".split(",");
f.extend(v.prototype,k,{tagName:"div",$:function(a){return this.$el.find(a)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();return this},make:function(a,b,c){a=document.createElement(a);b&&i(a).attr(b);c&&i(a).html(c);return a},setElement:function(a,b){this.$el&&this.undelegateEvents();this.$el=a instanceof i?a:i(a);this.el=this.$el[0];!1!==b&&this.delegateEvents();return this},delegateEvents:function(a){if(a||(a=n(this,"events"))){this.undelegateEvents();
for(var b in a){var c=a[b];f.isFunction(c)||(c=this[a[b]]);if(!c)throw Error('Method "'+a[b]+'" does not exist');var d=b.match(F),e=d[1],d=d[2],c=f.bind(c,this),e=e+(".delegateEvents"+this.cid);""===d?this.$el.bind(e,c):this.$el.delegate(d,e,c)}}},undelegateEvents:function(){this.$el.unbind(".delegateEvents"+this.cid)},_configure:function(a){this.options&&(a=f.extend({},this.options,a));for(var b=0,c=w.length;b<c;b++){var d=w[b];a[d]&&(this[d]=a[d])}this.options=a},_ensureElement:function(){if(this.el)this.setElement(this.el,
!1);else{var a=n(this,"attributes")||{};this.id&&(a.id=this.id);this.className&&(a["class"]=this.className);this.setElement(this.make(this.tagName,a),!1)}}});o.extend=r.extend=u.extend=v.extend=function(a,b){var c=G(this,a,b);c.extend=this.extend;return c};var H={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};g.sync=function(a,b,c){var d=H[a];c||(c={});var e={type:d,dataType:"json"};c.url||(e.url=n(b,"url")||t());if(!c.data&&b&&("create"==a||"update"==a))e.contentType="application/json",
e.data=JSON.stringify(b.toJSON());g.emulateJSON&&(e.contentType="application/x-www-form-urlencoded",e.data=e.data?{model:e.data}:{});if(g.emulateHTTP&&("PUT"===d||"DELETE"===d))g.emulateJSON&&(e.data._method=d),e.type="POST",e.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d)};"GET"!==e.type&&!g.emulateJSON&&(e.processData=!1);return i.ajax(f.extend(e,c))};g.wrapError=function(a,b,c){return function(d,e){e=d===b?e:d;a?a(b,e,c):b.trigger("error",b,e,c)}};var x=function(){},G=function(a,
b,c){var d;d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){a.apply(this,arguments)};f.extend(d,a);x.prototype=a.prototype;d.prototype=new x;b&&f.extend(d.prototype,b);c&&f.extend(d,c);d.prototype.constructor=d;d.__super__=a.prototype;return d},n=function(a,b){return!a||!a[b]?null:f.isFunction(a[b])?a[b]():a[b]},t=function(){throw Error('A "url" property or function must be specified');}}).call(this);
Backbone.View.prototype.close = function()
{
	this.remove();
	this.unbind();
	if (this.onClose)
	{
		this.onClose();
	}
}

var BaseModel = Backbone.Model.extend({});

/**
 * Defines a backbone collection, which sorts the collection based on the
 * sortkey and parses based on the restKey
 */
var BaseCollection = Backbone.Collection.extend({ model : BaseModel,
/*
 * Initializes the collection sets restKey and sortKey
 */
initialize : function(models, options)
{
	this.restKey = options.restKey;
	if (options.sortKey)
		this.sortKey = options.sortKey;
	if (options.descending)
		this.descending = options.descending;

	// Set false if sorting is not required. Used when order returned
	// from server is to be preserved.
	this.sort_collection = options.sort_collection;
	if (this.sort_collection == false)
		this.comparator = false;
},
/*
 * Sorts the order of the collection based on the sortKey. When models are
 * fetched then comparator gets the value of the softKey in the model and sorts
 * according to it
 */
comparator : function(item)
{
	if (this.sortKey)
	{
		if (this.descending == true)
			return -item.get(this.sortKey);
		// console.log("Sorting on " + this.sortKey);
		return item.get(this.sortKey);
	}
	return item.get('id');
},
/*
 * Gets the corresponding objects based on the key from the response object
 */
parse : function(response)
{
	// console.log("parsing " + this.restKey + " " +
	// response[this.restKey]);

	if (response && response[this.restKey])
		return response[this.restKey];

	return response;
} });

/*
 * Creates an view object on the model, with events click on .delete, .edit,
 * .agile_delete and respective funtionalities are defined and binds to current
 * view.
 */
var Base_List_View = Backbone.View.extend({ events : { "click .delete" : "deleteItem", "click .edit" : "edit", "delete-checked .agile_delete" : "deleteItem",
	"click .delete-model" : "deleteModel"

},
/*
 * Binds events on the model
 */
initialize : function()
{
	_.bindAll(this, 'render', 'deleteItem', 'edit', 'deleteModel'); // every function
	// that uses 'this'
	// as the current
	// object should be
	// in here
	this.model.bind("destroy", this.close, this);

	this.model.bind("change", this.render, this);
},
/*
 * On click on ".delete" model representing the view is deleted, and removed
 * from the collection
 */
deleteItem : function(e)
{
	
	e.preventDefault();
	this.model.destroy();
	this.remove();
}, 
deleteModel : function(e)
{
	e.preventDefault();
	if(!confirm("Are you sure you want to delete?"))
		return false;
	$.ajax({ type: 'DELETE', url: this.model.url(),success : function() {
		location.reload(true);
	}
        });
},
edit : function(e)
{
	/*
	 * console.log(this.model); console.log("Editing " +
	 * this.model.get("edit_template")); // Edit
	 * if(this.model.get("edit_template")) { console.log("Moving to edit"); var
	 * editView = new Base_Model_View({ model: this.model, isNew: true,
	 * template: this.model.get("edit_template") }); var el =
	 * editView.render().el; $('#content').html(el); }
	 */
}, render : function(callback)
{
	var async = false;
	// if(callback && typeof (callback) == "function")
	// async = true;
	if (async)
	{
		var that = this
		// console.log(this.model.toJSON());
		getTemplate(that.options.template, that.model.toJSON(), undefined, function(el)
		{
			$(that.el).html(el);
			$(that.el).data(that.model);
			console.log($(that.el));
			callback(that.el);
		});
		return this;
	}

	$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
	$(this.el).data(this.model);
	// Add model as data to it's corresponding row

	return this;
} });

/**
 * Base_Collection_view class defines a Backbone view, which binds the list of
 * models (Collections, backbone collection) i.e, defines view for the
 * collection.
 * <p>
 * Adds view to collection and binds sync (calls every time it attempts to read
 * or save a model to the server),
 * <p>
 * Whenever whenever save model operation is done, appendItem method in the
 * Base_Collection_view class is called on current view, since then sync is
 * binded with appendItem method. It appends the new model created to collection
 * and adds in the view
 * <p>
 * In View initialize function, new collection is created based on the options
 * (url, restkey, sortkey), passed while creating a new view. The collection
 * created in initialize is based on the BaseCollection (in base-colleciton.js),
 * which define the comparator and parse based on the restKey (to parse the
 * response) and sortKey (to sort the collection) passed to Base_Collection_View
 * <p>
 * Options to Base_collection_View are :
 * 
 * <pre>
 * 		resetKey :  Used to parse the response.
 * 		sortKey  : 	Used to sort the collection based in the sortkey value
 * 		url		 :	To fetch the collection and to perform CRUD operations on models 
 * 		cursor 	 :  To initialize the infiniscroll
 * </pre>
 */
var Base_Collection_View = Backbone.View
		.extend({

			/*
			 * Events defined on the view and related function(defines action to
			 * be performed on event). ".save" and ".delete" represents html
			 * elements in current view
			 */
			events : {
				"click .temp_collection_event" : "tempEvent"
			},

			/**
			 * Initializes the view, creates an empty BaseCollection and options
			 * restKey, sortKey, url and binds sync, reset, error to collection.
			 * Also checks if the collection in this view needs infiniscroll
			 * (checks for cursor option).
			 */
			initialize : function()
			{
				// Do not show transition bar 
				//if(!this.options.no_transition_bar)
				   // showTransitionBar();

				// Binds functions to view
				_.bindAll(this, 'render', 'appendItem', 'appendItemOnAddEvent', 'buildCollectionUI');

				if (this.options.data)
				{
					// Initializes the collection with restKey and sortkey
					this.collection = new BaseCollection(this.options.data, { restKey : this.options.restKey, sortKey : this.options.sortKey,
						descending : this.options.descending, sort_collection : this.options.sort_collection });
				}
				else
				{
					// Initializes the collection with restKey and sortkey
					this.collection = new BaseCollection([], { restKey : this.options.restKey, sortKey : this.options.sortKey,
						descending : this.options.descending, sort_collection : this.options.sort_collection });
				}

				/*
				 * Sets url to the collection to perform CRUD operations on the
				 * collection
				 */
				this.collection.url = this.options.url;

				this.model_list_template = $('<div class="model-list"></div>');

				/*
				 * Binds appendItem function to sync event of the collection
				 * i.e., Gets called every time it attempts to read or save a
				 * model to the server
				 */
				this.collection.bind('sync', this.appendItem);
				this.collection.bind('add', this.appendItemOnAddEvent);

				var that = this;

				/*
				 * Calls render when collection is reset
				 */
				this.collection.bind('reset', function()
				{
					that.render(true)
				});

				/*
				 * Binds error event to collection, so when error occurs the
				 * render is called with parameters force render and error
				 * response text to show in the template
				 */
				this.collection.bind('error', function(collection, response)
				{
					if (response.status == 401)
					{
						var hash = window.location.hash;

						// Unregister all streams on server.
						unregisterAll();

						// Unregister on SIP server.
						sipUnRegister();

						// Firefox do not support window.location.origin, so
						// protocol is explicitly added to host
						window.location.href = window.location.protocol + "//" + window.location.host + "/login" + hash;
						return;
					}
					that.render(true, response.responseText);
				});

				// Commented as it was creating a ripple effect
				// this.collection.bind('add', function(){that.render(true)});

				/*
				 * Calls render before fetching the collection to show loading
				 * image while collection is being fetched.
				 */
				this.render();

				/*
				 * If cursor options are passed when creating a view then
				 * inifiscroll (infiniscroll.js plug in) is initialized on the
				 * collection
				 */
				if (this.options.cursor)
				{
					/*
					 * If page size is not defined then sets page size to 20.
					 */
					this.page_size = this.options.page_size;
					this.global_sort_key = this.options.global_sort_key;
					this.request_method = this.options.request_method;
					this.post_data = this.options.post_data;
					if (!this.page_size)
						this.page_size = 20;

					/*
					 * stores current view object in temp variable, can be used
					 * to call render in infiniscroll, on successful fetch on
					 * scrolling
					 */
					var that = this;

					/**
					 * Initiazlizes the infi$target : this.options.scroll_target ? tarniscroll on the collection created
					 * in the view,
					 */
					this.infiniScroll = new Backbone.InfiniScroll(this.collection, { success : function()
					{
						/*
						 * If fetch is success then render is called, so
						 * addition models fetched in collection are show in the
						 * view
						 */
						$(".scroll-loading", that.el).remove();
					}, untilAttr : 'cursor', param : 'cursor', strict : true, pageSize : this.page_size, target : this.options.scroll_target ? this.options.scroll_target: $(window),

					/*
					 * Shows loading on fetch, at the bottom of the table
					 */
					onFetch : function()
					{
						
						var element="table"; 
						if (that.options.scroll_symbol)
							element="section";
						if(that.options.custom_scrollable_element)
							element=that.options.custom_scrollable_element;
						$(element, that.el).after('<div class="scroll-loading" style="margin-left:50%">' + LOADING_ON_CURSOR + '</div>');
					} });

					/*
					 * Adds infiniscroll objects in to a map with current route
					 * as key, to manage the infiniscroll if view changes i.e.,
					 * to disable infiniscroll on different view if not
					 * necessary.
					 */
					addInfiniScrollToRoute(this.infiniScroll);

					// disposePreviousView(this.options.templateKey +
					// '-collection', this);

					// Store in a variable for us to access in the custom fetch
					// as this is different
					var page_size = this.page_size;
					var global_sort_key = this.global_sort_key;
					var request_method = this.request_method;
					var post_data = this.post_data;

					// Set the URL
					this.collection.fetch = function(options)
					{
						options || (options = {})
						options.data || (options.data = {});
						options.data['page_size'] = page_size;
						if(global_sort_key && global_sort_key != null)
							options.data['global_sort_key'] = global_sort_key;
						if(request_method && request_method != null) {
							options.type = request_method;
							if(request_method.toLowerCase()=='post' && post_data && post_data != null) {
								$.each(post_data, function(key, value) {
									options.data[key] = value;
								});
							}
						}
						return Backbone.Collection.prototype.fetch.call(this, options);
					};

					// this.collection.url = this.collection.url + "?page_size="
					// + this.page_size;
				}

			},

			tempEvent: function(){
				console.log("tempEvent");
			},

			/**
			 * Takes each model and creates a view for each model using model
			 * template and appends it to model-list, This method is called
			 * whenever a model is added or deleted from the collection, since
			 * this method is binded with sync event of collection
			 * 
			 * @param base_model
			 *            backbone model object
			 */
			appendItem : function(base_model, append)
			{

				// This is required when add event is raised, in that case
				// updating document fragment does not update view. And on the
				// other hand, append item should definitely be called from
				// appendItemOnAddEvent because there are many places where
				// appenditem is overridden and that needs to be called on newly
				// added model
				if (append)
				{
					$(this.model_list_element).append(this.createListView(base_model).render().el);
					return;
				}

				this.model_list_element_fragment.appendChild(this.createListView(base_model).render().el);
			},
			createListView : function(base_model)
			{
				// If modelData is set in options of the view then custom data
				// is added to model.
				if (this.options.modelData)
				{
					// console.log("Adding custom data");
					base_model.set(this.options.modelData);
				}

				/*
				 * Creates Base_List_View i.e., view is created for the model in
				 * the collection.
				 */
				var itemView = new Base_List_View({ model : base_model, template : (this.options.templateKey + '-model'),
					tagName : this.options.individual_tag_name });

				return itemView
			}, appendItemOnAddEvent : function(base_model)
			{
				this.appendItem(base_model, true);
				/*
				 * if(this.collection && this.collection.length) {
				 * if(this.collection.at(0).attributes.count)
				 * this.collection.at(0).attributes.count+=1; }
				 */

				// callback for newly added models
				var appendItemCallback = this.options.appendItemCallback;

				if (appendItemCallback && typeof (appendItemCallback) === "function")
					appendItemCallback($(this.el));

				if ($('table', this.el).hasClass('onlySorting'))
					return;

				append_checkboxes(this.model_list_element);

			},
			/**
			 * Renders the collection to a template specified in options, uses
			 * handlebars to populate collection data in to vew
			 * <p>
			 * To use this render, naming of the handlebars template script tags
			 * should be followed
			 * <p>
			 * 
			 * <pre>
			 * 	template-name + model-list :  To append all the models in to list
			 *  template-name + collection :	appends populated model-list to this template
			 *  template-name + model 	 :  Represent each model which is appended to model-list 
			 * </pre>
			 * 
			 * @param force_render
			 *            boolean forces the render to execute, unless it is
			 *            true view is not show and loading image is shown
			 *            instead
			 */
			render : function(force_render, error_message)
			{

				// If collection in not reset then show loading in the content,
				// once collection is fetched, loading is removed by render and
				// view gets populated with fetched collection.
				if (force_render == undefined)
				{
					$(this.el).html("");
					return this;
				}

				// Remove loading
				if ($(this.el).html() == getRandomLoadingImg())
					$(this.el).empty();

				// If error message is defined the append error message to el
				// and return
				if (error_message)
				{
					$(this.el).html('<div style="padding:10px;font-size:14px"><b>' + error_message + '<b></div>');
					return;
				}

				var _this = this;
				var ui_function = this.buildCollectionUI;
				// Populate template with collection and view element is created
				// with content, is used to fill heading of the table
				getTemplate((this.options.templateKey + '-collection'), this.collection.toJSON(), "yes", ui_function);

				if (this.page_size && (this.collection.length < this.page_size))
				{
					console.log("Disabling infini scroll");
					this.infiniScroll.destroy();
				}

				this.delegateEvents();
				return this;
			}, buildCollectionUI : function(result)
			{
				$(this.el).html(result);
				// If collection is Empty show some help slate
				if (this.collection.models.length == 0)
				{
					// Add element slate element in collection template send
					// collection template to show slate pad
					//ill_slate("slate", this.el, this.options.slateKey);
				}

				// Add row-fluid if user prefs are set to fluid (deprecated in BS3 Version its been commented)
				/*if (IS_FLUID)
				{
					$(this.el).find('div.row').removeClass('row').addClass('row');
				}*/

				// Used to store all elements as document fragment
				this.model_list_element_fragment = document.createDocumentFragment();

				this.model_list_element = $('#' + this.options.templateKey + '-model-list', $(this.el));

				var fragment = document.createDocumentFragment();

				/*
				 * Iterates through each model in the collection and creates a
				 * view for each model and adds it to model-list
				 */
				_(this.collection.models).each(function(item)
				{ // in case collection is not empty

					this.appendItem(item);
				}, this);

				$(this.model_list_element).append(this.model_list_element_fragment);

				/*
				 * Few operations on the view after rendering the view,
				 * operations like adding some alerts, graphs etc after the view
				 * is rendered, so to perform these operations callback is
				 * provided as option when creating an model.
				 */
				var callback = this.options.postRenderCallback;

				/*
				 * If callback is available for the view, callback functions is
				 * called by sending el(current view html element) as parameters
				 */
				if (callback && typeof (callback) === "function")
				{
					
					// execute the callback, passing parameters as necessary
					callback($(this.el), this.collection);
				}
				
				//hideTransitionBar();

				// Add checkboxes to specified tables by triggering view event
				$('body').trigger('agile_collection_loaded', [
					this.el
				]);

				// $(this.el).trigger('agile_collection_loaded', [this.el]);

				// For the first time fetch, disable Scroll bar if results are
				// lesser

				return this;
			}, });
/**
*  Extended View of Base_Collection. It combines parent events to extended view events.
*/
Base_Collection_View.extend = function(child) {
	var view = Backbone.View.extend.apply(this, arguments);
	view.prototype.events = _.extend({}, this.prototype.events, child.events);
	return view;
};
/* !JSCore */
/**
 * Base_Model_View represents view specified by backbone js
 * (http://backbonejs.org/#View), It is view backed by a models, Base_Model_View
 * binds events(click on ".save" and ".delete" html elements) which represents
 * view with logical actions i.e., actions can defined to perform on an event.
 * This binds a view backbone model to view's render function on change event of
 * model, model data is show in the view (used handlebars js to fill model data
 * to template), whenever there is a change in model data, view is updated with
 * new data, since change on model is binded to render function of the view.
 * <p>
 * While creating new Base_Model_View options can be passed, so view is
 * initialized based on the options. Options processed are
 * <p>
 * data : Data should be sent in JSON format (backbone model is created based on
 * data sent).
 * <p>
 * <p>
 * model : Backbone model should be sent.
 * <p>
 * <p>
 * url : Represents url property of the model.
 * <p>
 * <p>
 * isNew : To specify model model needs to be downloaded or not.
 * <p>
 * <p>
 * Window : Specifies which window to navigate after saving the form
 * <p>
 * <p>
 * reload : Boolean value, to specify whether to reload the page after save
 * <p>
 * $el represents the html element of view
 * </p>
 */
var Base_Model_View = Backbone.View
		.extend({

			/*
			 * Events defined on the view and related function(defines action to
			 * be performed on event). ".save" and ".delete" represents html
			 * elements in current view
			 */
			events : {
				"click .save" : "save",
				"click .saveAuthConform" : "save",
				"click .delete" : "deleteItem"
			},

			/**
			 * Sets options to view object(this.options), these options are
			 * passed when creating a view, in initialize function options are
			 * set to current view object. Also binds functions and model data
			 * to views.
			 */
			initialize : function() {
				// showTransitionBar();
				/*
				 * Binds functions to current view object, every function that
				 * uses current view "this" should be bind to view
				 * object("this").
				 */
				_.bindAll(this, 'render', 'save', 'deleteItem', 'buildModelViewUI');

				/*
				 * If data is passed as an option to create a view, then
				 * backbone model object is created with data sent, data is
				 * represented as backbone model and bind to view.
				 */
				if (this.options.data != undefined)
					this.model = new Backbone.Model(this.options.data);
				/*
				 * If backbone model is passed as option the model is set to
				 * view
				 */
				else if (this.options.model)
					this.model = this.options.model;
				else
					this.model = new Backbone.Model({});

				/*
				 * Binds render function to change event on the view object
				 * which includes model object, whenever model is changed render
				 * is called to update the view.
				 */
				this.model.bind("change", this.onChange, this);
				
			     this.model.bind('error', function(model, response){

					if(response.status == 401)
					{
						var hash = window.location.hash;

						// Unregister all streams on server.
						// unregisterAll();
						
						// Unregister on SIP server.
						// sipUnRegister();
						
						// Firefox do not support window.location.origin, so protocol is explicitly added to host
						// window.location.href = window.location.protocol + "//" + window.location.host+"/login"+hash;
						return;
					}
				});

				/*
				 * Sets URL to backbone model, if url is passed when creating a
				 * view. URL specified is used to fetch, save the model
				 */
				if (this.options.url) {
					this.model.url = this.options.url;
				}

				/*
				 * If "isNew" in options is true, model is not downloaded. which
				 * represents no model data needs to be shown in the view, but
				 * can be used to save data in url set for model. If isNew is
				 * not true and model is empty data needs to be fetched
				 */
				if ((!this.options.isNew)
						&& $.isEmptyObject(this.model.toJSON())) {
					console.log("to fetch");
					/*
					 * Stores view object in temp variable, to be used in
					 * success back for fetch to call render
					 */
					var that = this;

					/*
					 * Fetches model from the url property set, on success
					 * forces render to execute to show the data fetched in
					 * view.
					 */
					this.model.fetch({
						success : function(data) {
							/*
							 * Used true argument to render (forcing render to
							 * execute and show view.), which represent data is
							 * downloaded from server, If render called out
							 * "true" argument then loading image is show
							 * instead of showing data (because Showing view
							 * without downloading data causes flash effect on
							 * page, since on change in model i.e., data fetched
							 * render is called again)
							 */
							that.render(true);
						}
					});
				}
			},

			/**
			 * Defines action for click event on html element with class
			 * ".delete" in current view object, which sends delete request to
			 * server(to URL set to model in initialize function)
			 */
			deleteItem : function(e) {
				e.preventDefault();
				
				var deleteCallback = this.options.deleteCallback;
				
				if(!confirm("Are you sure you want to delete?"))
		    		return false;
				
				/*
				 * Sends delete request, and reloads view on success
				 */
				this.model.destroy({
					success : function(model, response) {
						
						// Delete callback
						if (deleteCallback && typeof (deleteCallback) === "function") {
							
							console.log(response)
							
							// execute the callback, passing parameters as necessary
							deleteCallback(model, response);
						}
						
						location.reload(true);
					}
				});
				
			},
			/**
			 * Defines action to be performed for click event on HTML element
			 * with class ".save" in current view/template, this can be used to
			 * save the model data in the view representing a form i.e., saveS
			 * the data in form, to the URL set in model.
			 */
			save : function(e) {
				e.preventDefault();

				var targetEle = e.currentTarget;

				// Check if target contains before_save class
				// If exist call saveAuth function
				if($(targetEle).hasClass("saveAuth"))
				{
					var saveAuth = this.options.saveAuth;
					if (saveAuth && typeof (saveAuth) === "function") {
						this.targetEle = targetEle;
						var isReturn = saveAuth(this.el);
						if(isReturn)
							return;
					}

				}

				if(this.targetEle)
					 targetEle = this.targetEle;
				
				// Saves tinymce content back to 
				// textarea before form serialization
				trigger_tinymce_save();

				
				/*
				 * Gets the form id from the view, this.el represents html
				 * element of the view.
				 */
				var $el = $(this.el);
				var formId = $(this.el).find('form').attr('id');
				
				var saveCallback = this.options.saveCallback;
				
				var errorCallback = this.options.errorCallback;
				
				// Represents form element
				var $form = $('#' + formId);
				console.log($form.find('.save'));
				// Returns, if the save button has disabled attribute 
				if($(targetEle).attr('disabled'))
					return;
				
								
				// Disables save button to prevent multiple click event issues
				disable_save_button($(targetEle));
				
				
				// Represents validations result of the form, and json
				// represents serialized data in the form
				var isValid, json;

				/**
				 * If view contains multiple forms, then data are all the forms
				 * in the view are serialized in to a JSON object, each form
				 * data is added to json object with key name attribute of the
				 * form as follows
				 * 
				 * <pre>
				 * 		{
				 * 			primary : {key:value ....} // Data of form with name &quot;primary&quot;
				 * 			secondary : {key : value} // Data for 2nd for with name secondary
				 * 			key1 : value1 // For forms with out a name, values 
				 * 						  //are set directly in JSON with field name
				 * 		}
				 * </pre>
				 */
				if ($(this.el).find('form').length > 1) {
					
					
					// Initialize variable json as a map
					json = {};

					/*
					 * Iterates through the forms in the view (this.el), each
					 * form is validated, if a form is not valid, isValid
					 * variable is set and returned. If form is valid then form
					 * data is serialized, and set in the JSON object with key
					 * as name of the form
					 */
					$.each($(this.el).find('form'),
							function(index, formelement) {

								/*
								 * If any form in multiple forms are not valid
								 * then returns, setting a flag form data is
								 * invalid
								 */
								if (!isValidForm($(formelement))) {
									isValid = false;
									return;
								}

								/*
								 * Form id and Mame of the form is read,
								 * required to serialize and set in JSON
								 */
								var form_id = $(formelement).attr('id');
								var name = $(formelement).attr('name');

								/*
								 * If name of the form is defined, set the
								 * serialized data in to JSON object with form
								 * name as key
								 */
								if (name) {
									json[name] = serializeForm(form_id);
								}
								/*
								 * If form name is not defined the set the
								 * serialized values to json, with filed names
								 * as key for the value
								 */
								else {
									$.each(serializeForm(form_id), function(
											key, value) {
										json[key] = value;
									});
								}
							});
				}

				/*
				 * Check isValid flag for validity(which is set in processing
				 * multiple forms), or checks validity of single form
				 */
				if (isValid == false || !isValidForm($form)) {
					
					// Removes disabled attribute of save button
					enable_save_button($(targetEle));
					
					return;
				}

				var form_custom_validate_cb = this.options.form_custom_validate;
				if(form_custom_validate_cb && !form_custom_validate_cb()){
					enable_save_button($(e.currentTarget));
					return;
				}

				// Clears all the fields in the form before saving
				this.model.clear({
					silent : true
				});

				/*
				 * If variable json is not defined i.e., view does not contacts
				 * multiple forms, so read data from single form
				 */
				if (!json)
					json = serializeForm(formId);

				/*
				 * Saves model data, (silent : true} as argument do not trigger
				 * change view so view is not reset.
				 */
				this.model.set(json, {
					silent : true
				});

				var window = this.options.window;
				var reload = this.options.reload;

				// Store Modal Id
				var modal = this.options.modal;

				var prePersist = this.options.prePersist;
				
				if (prePersist && typeof (prePersist) === "function") {
				    
				     prePersist(this.model);
				    }
				// Loading while saving
				//$save_info = $('<div style="display:inline-block"><img src="img/1-0.gif" height="15px" width="15px"></img></div>');
				//$(".form-actions", this.el).append($save_info);
				//$save_info.show();

				// Calls save on the model
				this.model
						.save(
								[],
								{
									/*
									 * Wait for the server before setting the
									 * new attributes on the model, to trigger
									 * change
									 */
									wait : true,
									/*
									 * On save success, performs the actions as
									 * specified in the options set when
									 * creating an view
									 */
									success : function(model, response) 
									{	
										// Removes disabled attribute of save button
										enable_save_button($(targetEle));
										
										if (saveCallback && typeof (saveCallback) === "function") {
											console.log(response)
											// execute the callback, passing parameters as necessary
											saveCallback(response);
										}
										// Reload the current page
										if (reload)
											location.reload(true);
										else if (window) 
										{
											/*
											 * If window option is 'back'
											 * navigate to previews page
											 */
											if (window == 'back') history.back(-1);
											
											// Else navigate to page set in
											// window attribute
											else Backbone.history.navigate( window, { trigger : true });
											

											// Reset each element
											$form.each(function() {
												this.reset();
											});

											// Hide modal if enabled
											if (modal) $(modal).modal('hide');
										}
										else {
											/* Hide loading on error
											if($save_info)
												$save_info.hide();

											/*
											 * Appends success message to form
											 * actions block in form, if window
											 * option is not set for view
											 *
											 *
											$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Saved Successfully</i></p></small></div>');
											$(".form-actions", this.el).append($save_info);
											$save_info.show().delay(3000).hide(1);	
											*/
										}
									},

									/*
									 * If error occurs in saving a model, error
									 * message in response object is shown in
									 * the form
									 */
									error : function(model, response) {
										
										// Removes disabled attribute of save button
										enable_save_button($(targetEle));
										console.log(response);
										
										if (errorCallback && typeof (errorCallback) === "function") {
											errorCallback(response);
										     return;
										    }
										// Hide loading on error
										//$save_info.hide();

										// Show cause of error in saving
										$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
												+ response.responseText
												+ '</i></p></small></div>');

										// Appends error info to form actions
										// block.
										$(targetEle).closest(".form-actions", this.el).append($save_info);
										

										// Hides the error message after 3
										// seconds
										if(response.status != 406)
											$save_info.show().delay(3000).hide(1);
									}
								}, { silent : true });
			},
			/**
			 * Render function, renders the view object with the model binded
			 * and show the view with model data filled in it. Render function
			 * shows loading image in the page if model is not download(if
			 * download is required). It is called whenever attributes of the
			 * model are changed, of when fetch is called on the model binded
			 * with current view.
			 * <p>
			 * And there are other cases when render should show to view in
			 * page.
			 * <p>
			 * 
			 * @param isFetched
			 *            Boolean, force render to show the view called with
			 *            'true' when model is download
			 */
			render : function(isFetched) {

				
				/**
				 * Renders and returns the html element of view with model data,
				 * few conditions are checked render the view according to
				 * requirement and to avoid unwanted rendering of view.
				 * conditions are
				 * <p>
				 * !this.model.isNew() = model is fetched from the server/ Sent
				 * to edit the model
				 * <p>
				 * <p>
				 * this.options.isNew = If model download form the server is not
				 * required
				 * <p>
				 * <p>
				 * !$.isEmptyObject(this.model.toJSON()) = if model is empty
				 * <p>
				 * isFetched = Force call to execute render(when fetch is
				 * success full render is called successfully)
				 * <p>
				 */
				if (!this.model.isNew() || this.options.isNew
						|| !$.isEmptyObject(this.model.toJSON()) || isFetched) {

					// $(this.el).html(getRandomLoadingImg());
					/*
					 * Uses handlebars js to fill the model data in the template
					 */
					getTemplate(this.options.template, this.model
							.toJSON(), "yes", this.buildModelViewUI);
					
				}
				// Shows loading in the view, if render conditions are
				// satisfied
				else {
					if (this.options.template == "portlets-leader-board-body-model")
					{
						var sizey = this.options.portletSizeY;
	    				var topPos = 50*sizey;
	    				if(sizey==2 || sizey==3)
	    					topPos += 50;
	        			$(this.el).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
					}
					else
					{
						// $(this.el).html(getRandomLoadingImg());
					}
				}

				// Returns view object
				return this;
			}, 
			onChange: function()
			{
				if(this.options.change == false)
					return;
				

				this.render(true);
			}, 
			buildModelViewUI : function(content)
			{
				// hideTransitionBar();
				$(this.el).on('DOMNodeInserted', function(e) {
					//alert("triggered");
					//$('form', this).focus_first();
					$(this).trigger('view_loaded');
				 });
			
				$(this.el).html(content);
				
				/*
				 * Few operations on the view after rendering the view,
				 * operations like adding some alerts, graphs etc after the
				 * view is rendered, so to perform these operations callback
				 * is provided as option when creating an model.
				 */
				var callback = this.options.postRenderCallback;
				
				/*
				 * If callback is available for the view, callback functions
				 * is called by sending el(current view html element) as
				 * parameters
				 */
				
				if (callback && typeof (callback) === "function") {
					
					// execute the callback, passing parameters as necessary
					callback($(this.el),this.model.toJSON());
				}

				
				// If isNew is not true, then serialize the form data
				if (this.options.isNew != true) {
					// If el have more than 1 form de serialize all forms
					if ($(this.el).find('form').length > 1)
						deserializeMultipleForms(this.model.toJSON(), $(
								this.el).find('form'));

					// If el have one form
					else if ($(this.el).find('form').length == 1)
						deserializeForm(this.model.toJSON(), $(this.el)
								.find('form'));
				}
				
				
				
				// Add row-fluid if user prefs are set to fluid (deprecated in BS3 so that commented)
			/*	if (IS_FLUID)
				{
					$(this.el).find('div.row').removeClass('row').addClass(
							'row-fluid');
				}
				*/
				$(this.el).trigger('agile_model_loaded');
			}
		});

/**
 * Functions Which take JQuery button elements and enable disable them.
 * 
 * Disable by setting original text in data-save-text attribute and adding disabled:disabled attribute,
 * Also set min width to current width so button can't collapse, but can expand if necessary
 * 
 * Enable by reverse of the above
 * 
 * @param elem - jQuery element corresponding to the button.
 */
function disable_save_button(elem)
{

	var loadingText = elem.attr("data-loading-text");
if(!loadingText)
	   loadingText = "Saving...";
	
	elem.css('min-width',elem.width()+'px')
		.attr('disabled', 'disabled')
		.attr('data-save-text',elem.html())
		.text(loadingText);
}

/**
 * Enables save button.
 * @param elem
 */
function enable_save_button(elem)
{
	elem.html(elem.attr('data-save-text')).removeAttr('disabled data-save-text');
}

/**
*  Extended View of Base_Model. It combines parent events to extended view events.
*/
Base_Model_View.extend = function(child) {
	var view = Backbone.View.extend.apply(this, arguments);
	view.prototype.events = _.extend({}, this.prototype.events, child.events);
	return view;
};/**
 * Infini scroll utility to control the scroll on all routes,
 * Called from base-collection when page requires infiniscroll function and from app.js when route is initialized
 */

/**
 * Map to store infini scroll object with route name as a key
 */
var INFINI_SCROLL_JSON = {};

/**
 * Adds infini_scroll object to JSON Object with current route as key. Destroys
 * infini scroll if already exists in map and sets new infini scroll object to
 * current route
 * 
 * @param inifni_scroll
 *            infiniscroll object
 */
function addInfiniScrollToRoute(infini_scroll) {
	var current_route = window.location.hash.split("#")[1];

	// Destroys infini scroll
	if (INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].destroy();

	// Sets new infini scroll object w.r.t current route
	INFINI_SCROLL_JSON[current_route] = infini_scroll;
}

// Activates infiniScroll for routes
/**
 * Activates infiniScroll for current route(if required) and disables scroll in
 * other routes, to solve unnecessary requests on scroll. This method is called
 * when routes are initialized
 */
function activateInfiniScroll() {

	// Gets the current route from the url of the browser, splits at "#" (
	// current route is after "#" ).
	var current_route = window.location.hash.split("#")[1];

	// Disables all infini scrolls in the map
	$.each(INFINI_SCROLL_JSON, function(key, value) {
		value.disableFetch();
	});

	// Enables fetch if current route exists in INFINI_SCROLL_JSON map
	if (INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].enableFetch();
}function getRandomLoadingImg(){

}

var Contact_Details_Model_Events = Base_Model_View.extend({

	events:{
		'click #adminDetailsTab a[href="#tasks"]' : 'openTasks',
    	'click #adminDetailsTab a[href="#deals"]' : 'openDeals',
    	'click #adminDetailsTab a[href="#notes"]' : 'openNotes',
        
    },
    openDeals : function(e)
	{
		e.preventDefault();
		admin_details_tab.load_deals();
	},
	openTasks :  function(e)
	{
		e.preventDefault();
		admin_details_tab.load_tasks(this.el);
	},
	openNotes : function(e){
		e.preventDefault();
		Contact_Details_Tab_Actions.showNotes(e);

        
	},
    /*addNote : function(e){
        e.preventDefault();
        _agile.add_note(note,
         {
            success: function (data) {
                console.log("success");
                console.log(data);
        },
            error: function (data) {
            console.log("error");
    }
});*/

    

});



// Global for contact View
var contactDetailView;
function viewContactDetails(contact){

contactDetailView = new Contact_Details_Model_Events({ data : contact, template : "contact-details", 
					postRenderCallback : function(el)
					{
                        setTimeout(function(){
                           $('#contacts-inner-tabs a[href="#tasks"]', el).click();    
                        }, 100);
                        
							// starify(el);
						 show_map(el);

					} });

		$('#content').html(contactDetailView.render(true).el);
}


var taskCollectionView;
function viewTaskDetails(tasks){

}

var dealsCollectionView;
function viewDealsCollection(deals){
    
}
var Contact_Details_Tab_Actions = {

        showNotes : function(e){
               //save_contact_tab_position_in_cookie("notes");
               admin_details_tab.load_notes();      
          },        
    }

$(function(){

    $(".contact-add-note").on("click",function(){
        $("#subject").val("");
        $("textarea").val("");

    });
    // Add note
    $("#note_validate").click(function(e){
             e.preventDefault();
             if (!isValidForm('#noteForm'))
             {
                    return;
             }
             $(this).closest('#noteForm');

             var $btn = $(this);

             $btn.button('loading');
             
            var note = {};
            note.subject = $('#noteForm').find('#subject').val();
            note.description = $('#noteForm').find('#description').val();
            _agile.add_note(note,
                     {
                        success: function (data) {
                            console.log("success");
                            console.log(data);
                            $("#subject").val("");
                            $("textarea").val("");

                            $btn.button('reset');

                            $("#noteModal").modal("hide");

                            try{
                                // Add this data to collection
                                notesView.collection.create(data);
                            }catch(e){}

                            notesView.render(true);

                        },
                        error: function (data) {
                        console.log("error");
                        $btn.button('reset');
                        }
                    });

    });    
});


/**
 * Searches the property fields in current contact with given property name, if
 * property with given property name exists, then returns its value in a array
 * 
 * <p>
 * This method is used when contact property has multiple values like email,
 * phone, website etc
 * </p>
 * 
 * @param propertyName
 *            name of the property
 * @returns {Array}
 */
function agile_crm_get_contact_properties_list(propertyName)
{
	// Reads current contact model form the contactDetailView
	var contact_model = _agile_contact;

	// Gets properties list field from contact
	var properties = contact_model.properties;
	var property_list = [];

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_list.push(property);
		}
	});

	// If property is defined then return property value list
	return property_list;

}

/**
 * md5.js deals with implementing the md5 cryptographic hash function 
 * which takes arbitrary-sized data and output a fixed-length (16) hash value.
 */
var Agile_MD5 = function (string) {

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
    };var notesView;
var dealsView;
var tasksView;
var admin_details_tab = {

	load_tasks : function(el)
		{
			  _agile.get_tasks({
	              success: function (tasks) {
	              	var resp = [];
	              	try{
	              		try{
	              		 tasks = JSON.parse(tasks);}
	              		 catch(e){}
	              		 if(tasks.length > 1)
		              		 for (var i = 0; i < tasks.length; i++) {
		              		 	try{
		              		 			resp[i] = JSON.parse(tasks[i]);		 	
		              		 	}catch(e){}
		              		 	
		              		 }
		              	  else 
		              	  	resp = tasks;

	              	}catch(e){
	              		console.log(e);
	              	}

	              	console.log(resp);

	                //Render tasks of that contact
	                tasksView = new Base_Collection_View({ 
						data : resp,
						templateKey : "contact-tasks", 
						individual_tag_name : "li",
						sortKey:"created_time",
						descending: true,
						postRenderCallback: function(el) {
				            	$(".task-created-time", el).timeago();				            	
				            	$('li',el).each(function(){
				            		if($(this).find('.priority_type').text().trim()== "HIGH") {
				            			$(this).css("border-left","3px solid #f05050");
				            			$(this).css({"list-style": "none"});
				            		}else if($(this).find('.priority_type').text().trim() == "NORMAL"){
				            			$(this).css("border-left","3px solid #7266ba");
				            			$(this).css({"list-style": "none"});
				            		}else if($(this).find('.priority_type').text().trim() == "LOW") {
				            			$(this).css("border-left","3px solid #fad733");
				            			$(this).css({"list-style": "none"});
				            		}


				            	});
				         	
				         }
					});

					$('#tasks', el).html(tasksView.render(true).el);
	                  console.log("success");
	              },
	              error: function (tasks) {
	                  console.log("error");
	              }
	          });
			   
		},

		//deals view
		load_deals : function()
		{

			_agile.get_deals({
			    success: function (deals) {
			    	var resp = [];
	              	try{
	              		try{
	              		 deals = JSON.parse(deals);}
	              		 catch(e){}
	              		 if(deals.length > 1)
		              		 for (var i = 0; i < deals.length; i++) {
		              		 	try{
		              		 			resp[i] = JSON.parse(deals[i]);		 	
		              		 	}catch(e){}
		              		 	
		              		 }
		              	  else 
		              	  	resp = deals;

	              	}catch(e){
	              		console.log(e);
	              	}

	              	console.log(deals);

	                //Render deals of that contact
	                dealsView = new Base_Collection_View({ 
						data : deals,
						templateKey: "deals", 						
						individual_tag_name: 'li',
						sortKey:"created_time",
						descending: true,
						postRenderCallback: function(el) {
	                	 $(".deal-created-time", el).timeago();
	            		}
					
					});

					$('#deals').html(dealsView.render(true).el);
	                  console.log("success");			       
			    },
			    error: function (deals) {
			        console.log("error");
			    }
			});

		},

		//Fetching notes
		load_notes : function()
		{
			_agile.get_notes({
			    success: function (notes) {
			    	var resp = [];
	              	try{
	              		try{
	              		 notes = JSON.parse(notes);}
	              		 catch(e){}
	              		 if(notes.length > 1)
		              		 for (var i = 0; i < notes.length; i++) {
		              		 	try{
		              		 			resp[i] = JSON.parse(notes[i]);		 	
		              		 	}catch(e){}
		              		 	
		              		 }
		              	  else 
		              	  	resp = notes;

	              	}catch(e){
	              		console.log(e);
	              	}

	              	console.log(notes);

	                //Render notes of that contact
	                notesView = new Base_Collection_View({ 
						data : resp,
						templateKey: "notes", 						
						individual_tag_name: 'li',
						sortKey:"created_time",
						descending: true,
						postRenderCallback: function(el) {		            	
	                     $(".note-created-time", el).timeago();
	            		}
					
					});
					$('#notes').html(notesView.render(true).el);
	                  console.log("success");
			        
			    },
			    error: function (notes) {
			        console.log("error");
			    }
			});

		}

}
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
// We store one template compiled - if repetitive templates are called, we save time on compilations
var Handlebars_Compiled_Templates = {};
var HANDLEBARS_PRECOMPILATION = false;


/**
 * Loads the template (script element with its id attribute as templateName
 * appended with "-template". For example if the templateName is "tasks", then
 * the script element id should be as "tasks-template") from html document body.
 * 
 * Compiles the loaded template using handlebars and replaces the context
 * related property names (which are under mustache like {{name}}) in the
 * template, with their associated values, on calling the context with the
 * compiled template.
 * 
 * @method getTemplate
 * @param {String}
 *            templateName name of the tempate to be loaded
 * @param {Object}
 *            context json object to call with the compiled template
 * @param {String}
 *            download verifies whether the template is found or not
 * 
 * @param {callback}
 *            To decide whether templates should be downloaded synchronously or
 *            asynchronously.
 * 
 * @returns compiled html with the context
 */
function getTemplate(templateName, context, download, callback, loading_place_holder)
{
	var is_async = callback && typeof (callback) == "function";

	// Check if it is (compiled template) present in templates
	if (Handlebars_Compiled_Templates[templateName])
	{
		if (callback)
			return callback(Handlebars_Compiled_Templates[templateName](context));
		else
			return Handlebars_Compiled_Templates[templateName](context);
	}
	else
		Handlebars_Compiled_Templates = {};

	// Check if source is available in body
	if (HANDLEBARS_PRECOMPILATION)
	{
		var template = Handlebars.templates[templateName + "-template"];

		// If teplate is found
		if (template)
		{
			// If callback is sent then template is downloaded asynchronously
			// and content is sent in callback
			if (is_async)
			{
				callback(template(context));
				return;
			}

			// console.log("Template " + templateName + " found");
			return template(context);
		}
	}
	else
	{
		var source = $('#' + templateName + "-template").html();
		if (source)
		{
			var template = Handlebars.compile(source);
			Handlebars_Compiled_Templates[templateName] = template;

			// If callback is sent then template is downloaded asynchronously
			// and content is sent
			if (is_async)
			{
				callback(template(context));
				return;
			}
			return template(context);
		}
	}

	// Check if the download is explicitly set to no
	if (download == 'no')
	{
		console.log("Not found " + templateName);
		return;
	}

	// Shows loader icon if there is a loader placeholder
	if(loading_place_holder)
	{
		try{
			var loaderEl = $(getRandomLoadingImg());
			$(loading_place_holder).html(loaderEl.css("margin", "10px"));
		}catch(err){}
	}
		   

	// Stores urls of templates to be downloaded.
	var template_relative_urls = getTemplateUrls(templateName);

	if (is_async)
	{
		load_templates_async(templateName, context, template_relative_urls, callback);
		return;
	}

	load_templates_sync(template_relative_urls);

	return getTemplate(templateName, context, 'no');
}

/**
 * If the template is not found in document body, then template paths are built
 * based on template name and download requests are sent. if it is down-loaded
 * append it to the document body. And call the function (getTemplate) again by
 * setting the download parameter to "no"
 */
function getTemplateUrls(templateName)
{
	// Stores template URLS
	var template_relative_urls = [];

	if (templateName.indexOf("settings") == 0)
	{
		template_relative_urls.push("settings.js");
	}
	if (templateName.indexOf("admin-settings") == 0)
	{
		template_relative_urls.push("admin-settings.js");
	}
	if (templateName.indexOf("continue") == 0)
	{
		template_relative_urls.push("continue.js");
	}
	if (templateName.indexOf("all-domain") == 0)
	{
		template_relative_urls.push("admin.js");
	}
	if (templateName.indexOf("contact-detail") == 0 || templateName.indexOf("timeline") == 0 || templateName.indexOf("company-detail") == 0)
	{
		template_relative_urls.push("contact-detail.js");
		if (HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("contact-detail.html");
	}
	if (templateName.indexOf("contact-filter") == 0 || templateName.indexOf("filter-contacts") == 0)
	{
		template_relative_urls.push("contact-filter.js");
	}
	if (templateName.indexOf("contact-view") == 0 || templateName.indexOf("contact-custom") == 0 || templateName.indexOf("contacts-custom") == 0 || templateName
			.indexOf("contacts-grid") == 0 || templateName.indexOf("company-view") == 0 || templateName.indexOf("companies-custom") == 0)
	{
		template_relative_urls.push("contact-view.js");
	}
	if (templateName.indexOf("bulk-actions") == 0)
	{
		template_relative_urls.push("bulk-actions.js");
	}
	if (templateName.indexOf("case") == 0)
	{
		template_relative_urls.push("case.js");
	}
	if (templateName.indexOf("document") == 0)
	{
		template_relative_urls.push("document.js");
	}	
	if (templateName.indexOf("voice-mail") == 0)
	{
		template_relative_urls.push("voice-mail.js");
	}
	if (templateName.indexOf("gmap") == 0)
	{
		template_relative_urls.push("gmap.js");
	}
	if (templateName.indexOf("report") == 0)
	{
		template_relative_urls.push("report.js");
	}
	if (templateName.indexOf("webrule") == 0)
	{
		template_relative_urls.push("web-rules.js");
	}
	if (templateName.indexOf("workflow") == 0 || templateName.indexOf("campaign") == 0 || templateName.indexOf("trigger") == 0 || templateName
			.indexOf("automation") == 0)
	{
		template_relative_urls.push("workflow.js");
	}
	if (templateName.indexOf("purchase") == 0 || templateName.indexOf("subscription") == 0 || templateName.indexOf("subscribe") == 0 || templateName
			.indexOf("invoice") == 0)
	{
		template_relative_urls.push("billing.js");
	}

	if (templateName.indexOf("widget") == 0)
	{
		template_relative_urls.push("widget.js");
	}
	if (templateName.indexOf("helpscout") == 0)
	{
		template_relative_urls.push("helpscout.js");
	}
	else if (templateName.indexOf("clickdesk") == 0)
	{
		template_relative_urls.push("clickdesk.js");
	}
	else if (templateName.indexOf("zendesk") == 0)
	{
		template_relative_urls.push("zendesk.js");
	}
	else if (templateName.indexOf("freshbooks") == 0)
	{
		template_relative_urls.push("freshbooks.js");
	}
	else if (templateName.indexOf("linkedin") == 0)
	{
		template_relative_urls.push("linkedin.js");
	}
	else if (templateName.indexOf("rapleaf") == 0)
	{
		template_relative_urls.push("rapleaf.js");
	}
	else if (templateName.indexOf("stripe") == 0)
	{
		template_relative_urls.push("stripe.js");
	}
	else if (templateName.indexOf("twilioio") == 0)
	{
	template_relative_urls.push("twilioio.js");
	}
	else if (templateName.indexOf("twilio") == 0)
	{
		template_relative_urls.push("twilio.js");
	}	
	else if (templateName.indexOf("sip") == 0)
	{
	template_relative_urls.push("sip.js");
	}
	else if (templateName.indexOf("twitter") == 0)
	{
		template_relative_urls.push("twitter.js");
	}
	else if (templateName.indexOf("googleplus") == 0)
	{
		template_relative_urls.push("googleplus.js");
	}	
	else if (templateName.indexOf("paypal") == 0)
	{
		template_relative_urls.push("paypal.js");
	}
	else if (templateName.indexOf("xero") == 0)
	{
		template_relative_urls.push("xero.js");
	}
	else if (templateName.indexOf("quickbooks") == 0)
	{
		template_relative_urls.push("quickbooks.js");
	}
	else if (templateName.indexOf("facebook") == 0)
	{
		template_relative_urls.push("facebook.js");
	}
	else if (templateName.indexOf("callscript") == 0)
	{
	template_relative_urls.push("callscript.js");
	}
	if (templateName.indexOf("chargify") == 0)
	{
		template_relative_urls.push("chargify.js");
	}
	if (templateName.indexOf("shopify") == 0)
	{
		template_relative_urls.push("shopify.js");
	}
	if (templateName.indexOf("socialsuite") == 0)
	{
		if(HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("socialsuite-all.js");
		else
		{
			template_relative_urls.push("socialsuite.js");
		}

		if (HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("socialsuite.html");
	}


	if (templateName.indexOf("portlet") == 0)
	{
		template_relative_urls.push("portlets.js");
	}
	if (templateName.indexOf("deal-detail") == 0)
	{
		template_relative_urls.push("deal-detail.js");
	}
	if (templateName.indexOf("fbpagetab") == 0)
	{
		template_relative_urls.push("facebookpage.js");
	}
	if (templateName.indexOf("landingpages") == 0)
	{
		template_relative_urls.push("landingpages.js");
	}
	if (templateName.indexOf("billing-settings") == 0 || templateName.indexOf("creditcard-update") == 0)
	{
		template_relative_urls.push("settings.js");
	}
	if (templateName.indexOf("bria") == 0)
	{
		template_relative_urls.push("bria.js");
	}
	if (templateName.indexOf("skype") == 0)
	{
		template_relative_urls.push("skype.js");
	}
	return template_relative_urls;
}

/**
 * Takes list of templates to downloaded and pops URL from list and sends
 * request to download asynchronously. After last URL in list is removed and
 * download request is sent, on callback of downloaded URL, new request is sent
 * to fetch next template URL in the list. Continues sending requests till list
 * is empty.
 * 
 * @param templateName
 * @param context
 * @param template_relative_urls
 * @param callback
 */
function load_templates_async(templateName, context, template_relative_urls, callback)
{
	// Removes last url from the list to fetch template.
	var url = template_relative_urls.pop();

	// URL is undefined when list is empty which means all templates specified
	// in array are downloaded. As list is empty get template is called with
	// download parameter 'no' which fills and sends template in callback
	if (!url)
	{
		getTemplate(templateName, context, 'no', callback);
		return;
	}

	// Fetches template and call current method in recursion to download other
	// templates in list
	/*downloadTemplate(url, function()
	{
		{
			// Recursion call to download other templates
			load_templates_async(templateName, context, template_relative_urls, callback);
		}
	});*/
}

/**
 * Sends request to download template synchronously
 * 
 * @param template_relative_urls
 */
function load_templates_sync(template_relative_urls)
{
	for ( var index in template_relative_urls)
		downloadTemplate(template_relative_urls[index]);
}

String.prototype.endsWith = function(suffix)
{
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i].value;
	}
}


/**
 * appends , between contact fields
 * @param items
 * @param name
 * @returns {String}
 */

function getPropertyValueByCheckingExistance(items, companyname,jobtitle)
{
	if (items == undefined)
		return;

	var companyExists=false;
	var jobTitleExists=false;
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == companyname){
			if(items[i].value){
				companyExists=true;
			}
			
		}
		else if (items[i].name == jobtitle){
			if(items[i].value){
				jobTitleExists=true;
			}
			
		}
	}
	if(companyExists&&jobTitleExists)
		return ',';
}



function getMarginLength(items, companyname)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == companyname)
			return '3px';
	}
	return '0px';
}


/**
 * checks the contact properties existance
 * @param items
 * @param name
 * @param name1
 * @returns {String}
 */
function checkPropertyValueExistance(items,name,name1){

	if (items == undefined)
		return "none";

	var valueExists=false;
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name || items[i].name == name1){
			if(items[i].value){
				valueExists=true;
			}
			
		}
	}
	if(valueExists==true)
		return 'block';
	else
		return 'none';
}

/**
 * Iterates the given "items", to find all matches with the given "name" and
 * concats each matched value by given separator
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @param {String}
 *            separator to combine matched values like ,(comma) etc
 * 
 * @returns matched values combined by separator or undefined
 */
function getAllPropertyValuesByName(items, name, separator)
{
	if (items == undefined)
		return;

	var val = "";

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			var va = items[i].value;
			val += va + separator;
		}
	}

	// Removes trailing separators
	var regex = new RegExp("(^" + separator + ")|(" + separator + "$)", "g");
	val = val.replace(regex, "");

	console.log(val);
	return val;
}

/**
 * Returns contact property based on the name of the property
 * 
 * @param items :
 *            porperties in contact object
 * @param name :
 *            name of the property
 * @returns
 */
function getProperty(items, name)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i];
	}
}

/**
 * Returns contact property based on its property name and subtype
 */
function getPropertyValueBySubtype(items, name, subtype)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name && items[i].subtype == subtype)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the sub type (LINKEDIN, TWITTER, URL, SKYPE
 * etc..) of the property
 * 
 * @param items :
 *            properties list
 * @param name :
 *            name of the property
 * @param type :
 *            type of the property
 * @param subtype :
 *            subtype of property
 * @returns
 */
function getPropertyValueBytype(items, name, type, subtype)
{
	if (items == undefined)
		return;

	// Iterates though each property object and compares each property by name
	// and its type
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			if (type && type == items[i].type)
			{
				if (subtype && subtype == items[i].subtype)
					return items[i].value;
			}

			if (subtype && subtype == items[i].subtype)
			{
				return items[i].value;
			}
		}
	}
}

function getPropertyValueInCheckbox(items, name, id, checked)
{
	if (items == undefined)
		return;
	var el = "";
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name === name)
		{		
			if(name === "website"){
			  if(checked === 'checked'){			  
				  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '" checked="'+checked+ '"><i></i></label>' + items[i].value);
			  }
			  else{
				  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '"><i></i></label>' + items[i].value);
			  }
			  el = el.concat(get_website_icon(items[i]));
			}
			else if(name === "phone"){
				 if(checked === 'checked'){			  
					  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '" checked="'+checked+ '"><i></i></label>' + items[i].value );
				 }
				 else{
					  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '"><i></i></label>' + items[i].value );
				 }
			 el = el.concat(get_subtype(items[i]));
			}
			else if(name === "email"){
				if(checked === 'checked')
					el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+ id + '" checked="'+checked+ '"><i></i></label>' + items[i].value);
				else{
					el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+ id + '"><i></i></label>' + items[i].value);
				}
				el = el.concat(get_subtype(items[i]));
			}
		}
	}
	return el;
}

function get_website_icon(item){
	var icon = get_social_icon(item.subtype);
	var str = "<i class=\"".concat(icon).concat("\"").concat(" style=\"font-size: 1.3em !important; margin-left:10px \"></i> <br>");
	return str;
}

function get_social_icon(name){
	if (!name)
	return "fa fa-globe";

    var icon_json = { "TWITTER" : "fa fa-twitter", "LINKEDIN" : "fa fa-linkedin-square", "URL" : "fa fa-globe", "GOOGLE-PLUS" : "fa fa-google-plus-square",
	"FACEBOOK" : "fa fa-facebook-square", "GITHUB" : "fa fa-github", "FEED" : "icon-rss", "XING" : "fa fa-xing-square", "SKYPE" : "icon-skype",
	"YOUTUBE" : "fa fa-youtube-square", "FLICKR" : "fa fa-flickr" };

    name = name.trim();

    if (icon_json[name])
	return icon_json[name];

    return "fa fa-globe";
}

function get_subtype(item){
	
	if(item.subtype!=undefined && item.subtype!=""){
		var str = "<span style=\"margin:3px 0px 3px 10px\">".concat(item.subtype).concat("</span> <br>");
		return str;
	}
	else
		return "<br>";
}

function get_subtype_value(item){
	
	if(item.subtype!=undefined && item.subtype!=""){
		var str = item.subtype;
		return str;
	}
	else
	   return "";
}


/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue contact
 * 
 * @param items
 * @returns
 */
function getContactCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	var fieldName='';
	var datajson={};
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			if(fieldName=='')
				fieldName=items[i].name;
			fields.push(items[i]);
			datajson[''+items[i].name]=items[i].value;
		}
	}
	
	//Added for formula type custom field
	var type='';
	/*if(App_Contacts.customFieldsList!=undefined && App_Contacts.customFieldsList!=null){
		for(var i=0;i<App_Contacts.customFieldsList.collection.models.length;i++){
			if(App_Contacts.customFieldsList.collection.models[i].get("field_label")==fieldName){
				type = App_Contacts.customFieldsList.collection.models[i].get("scope");
				break;
			}
		}
	}*/
	
	var formulaFields=[];
	var allCustomFields=[];
	var finalFields=[];
	
	/*if(App_Contacts.customFieldsList!=undefined && App_Contacts.customFieldsList!=null){
		if(type=='')
			type='CONTACT';
		for(var i=0;i<App_Contacts.customFieldsList.collection.models.length;i++){
			var json={};
			if(App_Contacts.customFieldsList.collection.models[i].get("scope")==type && App_Contacts.customFieldsList.collection.models[i].get("field_type")=="FORMULA"){
				var tplEleData = Mustache.render(App_Contacts.customFieldsList.collection.models[i].get("field_data"),datajson);
				var evalFlag = true;
				var tplEleDataAftEval;
				try{
					tplEleDataAftEval = eval(tplEleData)
				}catch(err){
					console.log(err.message);
					evalFlag = false;
				}
				if(!evalFlag)
					tplEleDataAftEval = tplEleData;
				if(evalFlag && tplEleDataAftEval!=undefined && tplEleDataAftEval!=null){
					json.name=App_Contacts.customFieldsList.collection.models[i].get("field_label");
					json.type="CUSTOM";
					json.position=App_Contacts.customFieldsList.collection.models[i].get("position");
					json.value=tplEleDataAftEval;
					json.field_type=App_Contacts.customFieldsList.collection.models[i].get("field_type");
					allCustomFields.push(json);
					
					formulaFields.push(json);
				}
			}else if(App_Contacts.customFieldsList.collection.models[i].get("scope")==type){
				json.name=App_Contacts.customFieldsList.collection.models[i].get("field_label");
				json.type="CUSTOM";
				json.position=App_Contacts.customFieldsList.collection.models[i].get("position");
				json.field_type=App_Contacts.customFieldsList.collection.models[i].get("field_type");
				allCustomFields.push(json);
			}
		}
	}*/
	if(fields.length>0){
		if(allCustomFields.length>0){
			for(var i=0;i<allCustomFields.length;i++){
				var isFieldExist = false;
				if(allCustomFields[i].field_type=="FORMULA"){
					if($.inArray(allCustomFields[i], finalFields)==-1)
						finalFields.push(allCustomFields[i]);
				}else{
					for(var j=0;j<fields.length;j++){
						if(allCustomFields[i].name==fields[j].name){
							if($.inArray(fields[j], finalFields)==-1)
								finalFields.push(fields[j]);
							isFieldExist = true;
							break;
						}
						if(!isFieldExist){
							if($.inArray(fields[j], finalFields)==-1)
								finalFields.push(fields[j]);
						}
					}
				}
			}
		}else{
			for(var k=0;k<fields.length;k++){
				if($.inArray(fields[k], finalFields)==-1)
					finalFields.push(fields[k]);	
			}
		}
		
	}else{
		for(var k=0;k<formulaFields.length;k++){
			if($.inArray(formulaFields[k], finalFields)==-1)
				finalFields.push(formulaFields[k]);	
		}
	}
	
	return finalFields;
}


/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue contact
 * 
 * @param items
 * @returns
 */
function getCompanyCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	var fieldName='';
	var datajson={};
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			if(fieldName=='')
				fieldName=items[i].name;
			fields.push(items[i]);
			datajson[''+items[i].name]=items[i].value;
		}
	}
	
	//Added for formula type custom field
	var type='';
	if(App_Companies.customFieldsList!=undefined && App_Companies.customFieldsList!=null){
		for(var i=0;i<App_Companies.customFieldsList.collection.models.length;i++){
			if(App_Companies.customFieldsList.collection.models[i].get("field_label")==fieldName){
				type = App_Companies.customFieldsList.collection.models[i].get("scope");
				break;
			}
		}
	}
	
	var formulaFields=[];
	var allCustomFields=[];
	var finalFields=[];
	
	if(App_Companies.customFieldsList!=undefined && App_Companies.customFieldsList!=null){
		if(type=='')
			type='CONTACT';
		for(var i=0;i<App_Companies.customFieldsList.collection.models.length;i++){
			var json={};
			if(App_Companies.customFieldsList.collection.models[i].get("scope")==type && App_Companies.customFieldsList.collection.models[i].get("field_type")=="FORMULA"){
				var tplEleData = Mustache.render(App_Companies.customFieldsList.collection.models[i].get("field_data"),datajson);
				var evalFlag = true;
				var tplEleDataAftEval;
				try{
					tplEleDataAftEval = eval(tplEleData)
				}catch(err){
					console.log(err.message);
					evalFlag = false;
				}
				if(!evalFlag)
					tplEleDataAftEval = tplEleData;
				if(evalFlag && tplEleDataAftEval!=undefined && tplEleDataAftEval!=null){
					json.name=App_Companies.customFieldsList.collection.models[i].get("field_label");
					json.type="CUSTOM";
					json.position=App_Companies.customFieldsList.collection.models[i].get("position");
					json.value=tplEleDataAftEval;
					json.field_type=App_Companies.customFieldsList.collection.models[i].get("field_type");
					allCustomFields.push(json);
					
					formulaFields.push(json);
				}
			}else if(App_Companies.customFieldsList.collection.models[i].get("scope")==type){
				json.name=App_Companies.customFieldsList.collection.models[i].get("field_label");
				json.type="CUSTOM";
				json.position=App_Companies.customFieldsList.collection.models[i].get("position");
				json.field_type=App_Companies.customFieldsList.collection.models[i].get("field_type");
				allCustomFields.push(json);
			}
		}
	}
	if(fields.length>0){
		if(allCustomFields.length>0){
			for(var i=0;i<allCustomFields.length;i++){
				if(allCustomFields[i].field_type=="FORMULA"){
					finalFields.push(allCustomFields[i]);
				}else{
					for(var j=0;j<fields.length;j++){
						if(allCustomFields[i].name==fields[j].name){
							finalFields.push(fields[j]);
							break;
						}
					}
				}
			}
		}else{
			for(var k=0;k<fields.length;k++){
				finalFields.push(fields[k]);	
			}
		}
		
	}else{
		for(var k=0;k<formulaFields.length;k++){
			finalFields.push(formulaFields[k]);	
		}
	}
	
	return finalFields;
}

/**
 * Turns the first letter of the given string to upper-case and the remaining to
 * lower-case (EMaiL to Email).
 * 
 * @param {String}
 *            value to convert as ucfirst
 * @returns converted string
 */
function ucfirst(value)
{
	return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';

}

/**
 * Creates titles from strings. Replaces underscore with spaces and capitalize
 * first word of string.
 * 
 * @param value
 * @returns
 */
function titleFromEnums(value)
{
	if (!value)
		return;

	var str = value.replace(/_/g, ' ');

	return ucfirst(str.toLowerCase());
}

/**
 * Counts total number of attributes in a json object
 * 
 * @param obj
 * @returns {Number}
 */
function countJsonProperties(obj)
{
	var prop;
	var propCount = 0;

	for (prop in obj)
	{
		propCount++;
	}
	return propCount;
}

/**
 * Get the current contact property
 * 
 * @param value
 * @returns {String}
 */
function getCurrentContactProperty(value)
{
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
		var contact_properties = App_Contacts.contactDetailView.model.get('properties')
		return getPropertyValue(contact_properties, value);
	}
}

function getCount(collection)
{
	if (collection[0] && collection[0].count && (collection[0].count != -1))
		return "(" + collection[0].count + " Total)";
	else
		return "(" + collection.length + " Total)";
}

/**
 * Returns id from hash. Id must be last in hash.
 */
function getIdFromHash()
{

	// Returns "workflows" from "#workflows"
	var hash = window.location.hash.substr(1);

	// remove trailing slash '/'
	if (hash.substr(-1) === "/")
	{
		hash = hash.replace(/\/$/, "");
	}

	// Returns campaign_id from "workflow/all-contacts/campaign_id".
	var id = hash.split('/').pop();

	return id;
}

function updateCustomData(el)
{
	$(".custom-data", App_Contacts.contactDetailView.el).html(el)
}

function updateCompanyCustomData(el)
{
	$(".custom-data", App_Companies.companyDetailView.el).html(el)
}

/**
 * Returns list of custom properties. used to fill custom data in fields in
 * deal details
 * 
 * @param items
 * @returns
 */
function getDealCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	var datajson={};
	for (var i = 0; i < items.length; i++)
	{
		fields.push(items[i]);
		datajson[''+items[i].name]=items[i].value;
	}
	
	var formulaFields=[];
	var allCustomFields=[];
	var finalFields=[];
	
	if(App_Deals.customFieldsList!=undefined && App_Deals.customFieldsList!=null)
	{
		for(var i=0;i<App_Deals.customFieldsList.collection.models.length;i++)
		{
			var json={};
			if(App_Deals.customFieldsList.collection.models[i].get("field_type")=="FORMULA"){
				var tplEleData = Mustache.render(App_Deals.customFieldsList.collection.models[i].get("field_data"),datajson);
				var evalFlag = true;
				var tplEleDataAftEval;
				try
				{
					tplEleDataAftEval = eval(tplEleData)
				}catch(err)
				{
					console.log(err.message);
					evalFlag = false;
				}
				if(!evalFlag)
					tplEleDataAftEval = tplEleData;
				if(evalFlag && tplEleDataAftEval!=undefined && tplEleDataAftEval!=null)
				{
					json.name=App_Deals.customFieldsList.collection.models[i].get("field_label");
					json.position=App_Deals.customFieldsList.collection.models[i].get("position");
					json.value=tplEleDataAftEval;
					json.field_type=App_Deals.customFieldsList.collection.models[i].get("field_type");
					allCustomFields.push(json);
					
					formulaFields.push(json);
				}
			}
			else
			{
				json.name=App_Deals.customFieldsList.collection.models[i].get("field_label");
				json.position=App_Deals.customFieldsList.collection.models[i].get("position");
				json.field_type=App_Deals.customFieldsList.collection.models[i].get("field_type");
				allCustomFields.push(json);
			}
		}
	}
	
	if(fields.length>0)
	{
		if(allCustomFields.length>0)
		{
			for(var i=0;i<allCustomFields.length;i++)
			{
				if(allCustomFields[i].field_type=="FORMULA")
				{
					finalFields.push(allCustomFields[i]);
				}
				else if(allCustomFields[i].field_type=="DATE")
				{
					for(var j=0;j<fields.length;j++)
					{
						if(allCustomFields[i].name==fields[j].name)
						{
							if(!fields[j].value)
								return '';
							if(fields[j].index && (CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1))
								fields[j].value = convertDateFromUKtoUS(fields[j].value);
							var dateString = new Date(fields[j].value);
							if(dateString == "Invalid Date")
								fields[j].value = getDateInFormatFromEpoc(fields[j].value);
							else
								fields[j].value = en.dateFormatter({raw: getGlobalizeFormat()})(dateString);

							finalFields.push(fields[j]);
							break;
						}
					}
				}
				else
				{
					for(var j=0;j<fields.length;j++)
					{
						if(allCustomFields[i].name==fields[j].name)
						{
							finalFields.push(fields[j]);
							break;
						}
					}
				}
			}
		}
		else
		{
			for(var k=0;k<fields.length;k++)
			{
				finalFields.push(fields[k]);	
			}
		}
		
	}
	else
	{
		for(var k=0;k<formulaFields.length;k++)
		{
			finalFields.push(formulaFields[k]);	
		}
	}
	
	return finalFields;
}var DEFAULT_GRAVATAR_url = window.location.origin + "/flatfull/images/user-default.jpg";

$(function()
{

	/**
	 * Helper function to return the value of a property matched with the given
	 * name from the array of properties
	 * 
	 * @method getPropertyValue
	 * @param {Object}
	 *            items array of objects
	 * @param {String}
	 *            name to get matched object value
	 * @returns value of the matched object
	 */
	Handlebars.registerHelper('getPropertyValue', function(items, name)
	{
		return getPropertyValue(items, name);
	});


	Handlebars.registerHelper('stripeCreditConvertion', function(amount)
	{
		if(amount == 0){
			return (amount);
		}else if(amount > 0){
			return ("-"+ parseFloat(amount/100));
		}else{
			return (Math.abs(parseFloat(amount/100)));
		}
	});

	
	/**
	 * displays , in between 2 conatct fields.
	 */
	Handlebars.registerHelper('getPropertyValueExists', function(items, companyname,jobtitle)
	{
		return getPropertyValueByCheckingExistance(items, companyname,jobtitle);
	});

	
	/**
	 * checks for the contact property value existance to display div none or block
	 */
	Handlebars.registerHelper('checkPropertyValueExistance', function(items, name,name1)
	{
		return checkPropertyValueExistance(items, name,name1);
	});
	
	
	
	/**
	 * checks for the contact property value existance to display div none or block
	 */
	Handlebars.registerHelper('getMarginLength', function(items, name)
	{
		return getMarginLength(items, name);
	});

	/**
	 * Helper function to return the checkbox html element with value of a
	 * property matched with the given name from the array of properties
	 * 
	 * @method getPropertyValue
	 * @param {Object}
	 *            items array of objects
	 * @param {String}
	 *            name to get matched object value
	 * @returns heckbox html element with value of the matched object
	 */
	Handlebars.registerHelper('getPropertyValueInCheckbox', function(items, name, separator, checked)
	{
		return getPropertyValueInCheckbox(items, name, separator, checked);
	});

	Handlebars.registerHelper('get_correct_count', function(count)
	{
		return count - 1;
	});

	/**
	 * Helper function to return the value of property based on sub-type of the
	 * property
	 */
	Handlebars.registerHelper('getPropertyValueBySubtype', function(items, name, subtype)
	{
		return getPropertyValueBySubtype(items, name, subtype);
	});

	/**
	 * Helper function to return the value of property based on type of the
	 * property
	 */
	Handlebars.registerHelper('getPropertyValueBytype', function(items, name, type, subtype)
	{
		return getPropertyValueBytype(items, name, type, subtype);
	});

	/**
	 * Returns twitter handle based on the twitter url of the profile. Accepts
	 * string URL and splits at last "/" and returns handle.
	 */
	Handlebars.registerHelper('getTwitterHandleByURL', function(value)
	{

		// if (value.indexOf("https://twitter.com/") != -1)
		// return value;

		value = value.substring(value.lastIndexOf("/") + 1);
		console.log(value);

		return value;
	});

	/**
	 * 
	 */
	Handlebars.registerHelper('getContactCustomProperties', function(items, options)
	{
		var fields = getContactCustomProperties(items);
		if (fields.length == 0)
			return options.inverse(fields);

		return options.fn(fields);

	});

	/**
	 * Returns custom fields without few fields like LINKEDIN or TWITTER or
	 * title fields
	 */
	Handlebars.registerHelper('getContactCustomPropertiesExclusively', function(items, options)
	{

		var exclude_by_subtype = [
				"LINKEDIN", "TWITTER"
		];
		var exclude_by_name = [
			"title"
		];

		var fields = getContactCustomProperties(items);

		var exclusive_fields = [];
		for (var i = 0; i < fields.length; i++)
		{
			if (jQuery.inArray(fields[i].name, exclude_by_name) != -1 || (fields[i].subtype && jQuery.inArray(fields[i].subtype, exclude_by_subtype) != -1))
			{
				continue;
			}

			exclusive_fields.push(jQuery.extend(true, {}, fields[i]));
		}
		if (exclusive_fields.length == 0)
			return options.inverse(exclusive_fields);

		/*$.getJSON("core/api/custom-fields/type/DATE", function(data)
		{

			if (data.length == 0)
				return;

			for (var j = 0; j < data.length; j++)
			{
				for (var i = 0; i < exclusive_fields.length; i++)
				{
					if (exclusive_fields[i].name == data[j].field_label)
						try
						{
							var value = exclusive_fields[i].value;

							if (!isNaN(value))
							{
								exclusive_fields[i].value = value;
								exclusive_fields[i]["subtype"] = data[j].field_type;
							}

						}
						catch (err)
						{
							exclusive_fields[i].value = exclusive_fields[i].value;
						}
				}
			}
			updateCustomData(options.fn(exclusive_fields));
		});
*/
		return options.fn(exclusive_fields)

	});
	
	/**
	 * Returns custom fields without few fields like LINKEDIN or TWITTER or
	 * title fields
	 */
	Handlebars.registerHelper('getCompanyCustomPropertiesExclusively', function(items, options)
	{

		var exclude_by_subtype = [
				"LINKEDIN", "TWITTER"
		];
		var exclude_by_name = [
			"title"
		];

		var fields = getCompanyCustomProperties(items);
		
		var exclusive_fields = [];
		for (var i = 0; i < fields.length; i++)
		{
			if (jQuery.inArray(fields[i].name, exclude_by_name) != -1 || (fields[i].subtype && jQuery.inArray(fields[i].subtype, exclude_by_subtype) != -1))
			{
				continue;
			}

			exclusive_fields.push(jQuery.extend(true, {}, fields[i]));
		}
		if (exclusive_fields.length == 0)
			return options.inverse(exclusive_fields);

		$.getJSON("core/api/custom-fields/type/DATE", function(data)
		{

			if (data.length == 0)
				return;

			for (var j = 0; j < data.length; j++)
			{
				for (var i = 0; i < exclusive_fields.length; i++)
				{
					if (exclusive_fields[i].name == data[j].field_label)
						try
						{
							var value = exclusive_fields[i].value;

							if (!isNaN(value))
							{
								exclusive_fields[i].value = value;
								exclusive_fields[i]["subtype"] = data[j].field_type;
							}

						}
						catch (err)
						{
							exclusive_fields[i].value = exclusive_fields[i].value;
						}
				}
			}
			updateCompanyCustomData(options.fn(exclusive_fields));
		});

		return options.fn(exclusive_fields)

	});

	Handlebars.registerHelper('urlEncode', function(url, key, data)
	{

		var startChar = "&";
		if (url.indexOf("?") != -1)
			startChar = "&";

		var encodedUrl = url + startChar + key + "=" + escape(JSON.stringify(data));
		// console.log(encodedUrl.length + " " + encodedUrl);
		return encodedUrl;
	});

	Handlebars.registerHelper('encodeString', function(url)
	{
		return encodeURIComponent(url);
	});

	/**
	 * Helper function to return image for an entity (contact). Checks for
	 * existing image, if not found checks for an image using the email of the
	 * entity, if again failed to found returns a default image link.
	 * 
	 * @method gravatarurl
	 * @param {Object}
	 *            items array of objects
	 * @param {Number}
	 *            width to specify the width of the image
	 * @returns image link
	 * 
	 */
	Handlebars.registerHelper('gravatarurl', function(items, width)
	{

		if (items == undefined)
			return;

		// Checks if properties already has an image, to return it
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		// Default image
		var img = DEFAULT_GRAVATAR_url;
		var backup_image = "&d=404\" ";
		// backup_image="";
		var initials = '';
		try
		{
			if(!isIE())
			initials = text_gravatar_initials(items);
		}
		catch (e)
		{
			console.log(e);
		}

		if (initials.length == 0)
			backup_image = "&d=" + DEFAULT_GRAVATAR_url + "\" ";

		var data_name =  '';
		if(!isIE())
			data_name = "onLoad=\"image_load(this)\" onError=\"image_error(this)\"_data-name=\"" + initials;
		
		var email = getPropertyValue(items, "email");
		if (email)
		{
			return new Handlebars.SafeString('https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + backup_image + data_name);
		}

		return new Handlebars.SafeString('https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '' + backup_image + data_name);

	});

	Handlebars.registerHelper('defaultGravatarurl', function(width)
	{
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
	});

	Handlebars.registerHelper('emailGravatarurl', function(width, email)
	{
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		if (email)
		{
			return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
		}

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
	});

	/**
	 * CSS text avatars
	 */
	Handlebars.registerHelper('nameAvatar', function(items, width)
	{

		if (items == undefined)
			return;

		// Checks if properties already has an image, to return it
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		var email = getPropertyValue(items, "email");
		if (email)
		{
			return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + '&d=404';
		}

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '&d=404';

	});

	/**
	 * To add data-name attribute to image tags
	 */
	Handlebars.registerHelper('dataNameAvatar', function(items)
	{

		if (items == undefined)
			return;

		return text_gravatar_initials(items);

	});

	/**
	 * Helper function to return icons based on given name
	 * 
	 * @method icons
	 * @param {String}
	 *            item name to get icon
	 * @returns icon name
	 */
	Handlebars.registerHelper('icons', function(item)
	{

		if(!item)
			  return "";
			
		item = item.toLowerCase().trim();
		console.log(item);
		if (item == "email")
						return "fa-envelope-o";
		if (item == "phone")
						return "fa-headphones";
		if (item == "url")
						return "fa-home";
		if (item == "call")
						return "fa-phone";
		if (item == "follow_up")
						return "fa-sign-out";
		if (item == "meeting")
						return "fa-group";
		if (item == "milestone")
						return "fa-cog";
		if (item == "send")
						return "fa-reply";
		if (item == "tweet")
						return "fa-share-square-o";
		if (item == "other")
						return "fa-tasks";
		if (item == "twitter")
						return "fa-twitter";
		if (item == "facebook")
						return "fa-facebook";

	});

	Handlebars.registerHelper('eachkeys', function(context, options)
	{
		var fn = options.fn, inverse = options.inverse;
		var ret = "";

		var empty = true;
		for (key in context)
		{
			empty = false;
			break;
		}

		if (!empty)
		{
			for (key in context)
			{
				ret = ret + fn({ 'key' : key, 'value' : context[key] });
			}
		}
		else
		{
			ret = inverse(this);
		}
		return ret;
	});

	/**
	 * Turns the first letter of the given string to upper-case and the
	 * remaining to lower-case (EMaiL to Email).
	 * 
	 * @method ucfirst
	 * @param {String}
	 *            value to convert as ucfirst
	 * @returns converted string
	 */
	Handlebars.registerHelper('ucfirst', function(value)
	{
		return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';
	});

	/**
	 * Returns Contact short name
	 */
	Handlebars.registerHelper('contactShortName', function()
	{
		/*if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model && !company_util.isCompany())
		{

			var contact_properties = App_Contacts.contactDetailView.model.get('properties');

			if (App_Contacts.contactDetailView.model.get('type') == 'PERSON')
			{
				var last_name;
				for (var i = 0; i < contact_properties.length; i++)
				{

					if (contact_properties[i].name == "last_name")
						last_name = contact_properties[i].value;
					else if (contact_properties[i].name == "first_name")
						return contact_properties[i].value;
				}
				if (last_name && last_name != null)
				{
					return last_name;
				}
				return "Contact";
			}
			else
			{
				for (var i = 0; i < contact_properties.length; i++)
				{
					if (contact_properties[i].name == "name")
						return contact_properties[i].value;
				}
				return "Company";
			}
		} else if (App_Companies.companyDetailView && App_Companies.companyDetailView.model)
		{
			var contact_properties = App_Companies.companyDetailView.model.get('properties');

			for (var i = 0; i < contact_properties.length; i++)
			{
				if (contact_properties[i].name == "name")
					return contact_properties[i].value;
			}
			return "Company";
		}*/
	});
	
	Handlebars.registerHelper("isCompany", function(options)
			{
				/*if (company_util.isCompany())
					return options.fn(this);

				return options.inverse(this);*/
			});

	/**
	 * Returns workflow name surrounded by quotations if exists, otherwise this
	 */
	Handlebars.registerHelper('workflowName', function()
	{
		if (App_Workflows.workflow_model)
		{
			var workflowName = App_Workflows.workflow_model.get("name");
			return "\'" + workflowName + "\'";
		}

		return "this";
	});

	/**
	 * 
	 * @method task_property
	 * @param {String}
	 *            change property value in view
	 * @returns converted string
	 */
	Handlebars.registerHelper('task_property', function(value)
	{

		if (value == "FOLLOW_UP")
			return "Follow Up";
		else
			return ucfirst(value);

	});

	/**
	 * Adds Custom Fields to contact merge form, where this helper function is
	 * called
	 */
	Handlebars.registerHelper('show_custom_fields_for_merge', function(custom_fields, contacts)
	{

		var el = show_custom_fields_helper_for_merge(custom_fields, contacts);
		return new Handlebars.SafeString(el);

	});

	/**
	 * this is useful in activity when note characters exceeds abouve 50 simply
	 * show dots
	 */
	Handlebars.registerHelper('add_dots_end', function(value)
	{

		if (value)
		{
			if (value.length > 100)
			{
				var subst = value.substr(0, 100);
				subst = subst + "....";
				return subst;
			}
		}
		return value;

	});

	// Tip on using Gravar with JS:
	// http://www.deluxeblogtips.com/2010/04/get-gravatar-using-only-javascript.html
	/**
	 * Helper function to generate a html string as desired to show-up the
	 * tags-view
	 * 
	 * @method tagslist
	 * @param {Object}
	 *            tags array containing all tags
	 */
	Handlebars.registerHelper('tagslist', function(tags)
	{

		console.log(tags);
		var json = {};

		// Store tags in a json, starting letter as key
		for (var i = 0; i < tags.length; i++)
		{

			var tag = tags[i].tag;
			// console.log(tag);
			var start = tag.charAt(0).toUpperCase();

			var array = new Array();

			// see if it is already present
			if (json[start] != undefined)
			{
				array = json[start];
			}

			array.push(tag);
			json[start] = array;

		}

		// To sort tags in case-insensitive order i.e. keys in json object
		var keys = Object.keys(json);
		keys.sort();

		// Sorts it based on characters and then draws it
		var html = "";

		for ( var i in keys)
		{

			var array = json[keys[i]];

			html += "<div class='tag-element'><div class='tag-key'>" + keys[i] + "</div> ";

			html += "<div class='tag-values'>";

			for (var i = 0; i < array.length; i++)
			{
				console.log("************************");
				console.log(array[i]);
				var hrefTag = "#tags/" + encodeURIComponent(array[i]);

				html += ('<a href=\"' + hrefTag + '\" >' + array[i] + '</a> ');
			}
			html += "</div></div>";

		}

		return html;
	});

	Handlebars
			.registerHelper(
					'setupTags',
					function(tags)
					{

						console.log(tags);
						var json = {};

						var keys = [];
						// Store tags in a json, starting letter as key
						for (var i = 0; i < tags.length; i++)
						{
							var tag = tags[i].tag;
							var key = tag.charAt(0).toUpperCase();
							// console.log(tag);
							if (jQuery.inArray(key, keys) == -1)
								keys.push(key);
						}

						// To sort tags in case-insensitive order i.e. keys in
						// json object
						keys.sort();
						console.log(keys);
						var html = "";
						for (var i = 0; i < keys.length; i++)
						{
							html += "<div class='tag-element' style='margin-right:10px;'><div class='tag-key'>" + keys[i] + "</div><div class='tag-values' tag-alphabet=\"" + encodeURI(keys[i]) + "\"></div></div>";
						}
						return new Handlebars.SafeString(html);
					});

	// To show milestones as columns in deals
	Handlebars
			.registerHelper(
					'deals_by_milestones',
					function(data)
					{
						var html = "";
						var count = Object.keys(data).length;
						$
								.each(
										data,
										function(key, value)
										{
											if (count == 1 && key == "")
											{
												html += '<div class="alert-info alert"><div class="slate-content"><div class="box-left pull-left m-r-md"><img alt="Clipboard" src="'+updateImageS3Path("/img/clipboard.png")+'"></div><div class="box-right pull-left"><h4 class="m-t-none">You have no milestones defined</h4><br><a href="#milestones" class="btn btn-default btn-sm m-t-xs"><i class="icon icon-plus-sign"></i> Add Milestones</a></div><div class="clearfix"></div></div></div>';
											}
											else
											{
												html += "<div class='milestone-column'><div class='dealtitle-angular'><p class='milestone-heading'>" + key + "</p><span></span></div><ul class='milestones' milestone='" + key + "'>";
												for ( var i in value)
												{
													if (value[i].id)
														html += "<li id='" + value[i].id + "'>" + getTemplate("opportunities-grid-view", value[i]) + "</li>";
												}
												html += "</ul></div>";
											}
										});
						return html;
					});

	// To show milestones as sortable list
	Handlebars
			.registerHelper(
					'milestone_ul',
					function(data)
					{
						var html = "";
						var wonMsg = 'Deals with this milestone are considered as Won.';
						var lostMsg = 'Deals with this milestone are considered as Lost.';
						// var html = "<ul class='milestone-value-list
						// tagsinput' style='padding:1px;list-style:none;'>";
						if (data)
						{
							var milestones = data.milestones.split(",");
							for ( var i in milestones)
							{
								html += "<tr data='" + milestones[i] + "' style='display: table-row;'><td><div class='milestone-name-block inline-block v-top text-ellipsis' style='width:80%'>";
								if(milestones[i] == data.won_milestone){
									html += milestones[i] + "<i data-toogle='tooltip' title='"+wonMsg+"' class='icon-like mark-won m-l-sm'></i></div></td><td class='b-r-none'><div class='m-b-n-xs'>";
									html += "<a class='milestone-won text-l-none-hover c-p text-xs hover-show disabled' style='visibility:hidden;' data-toggle='tooltip' title='Set as Won Milestone'><i class='icon-like'></i></a>";
									html += "<a class='milestone-lost text-l-none-hover c-p text-xs m-l-sm not-applicable hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Lost Milestone'><i class='icon-dislike'></i></a>";
								} else if(milestones[i] == data.lost_milestone){
									html += milestones[i] + "<i data-toogle='tooltip' title='"+lostMsg+"' class='icon-dislike mark-lost m-l-sm'></i></div></td><td class='b-r-none'><div class='m-b-n-xs'>";
									html += "<a class='milestone-won text-l-none-hover c-p text-xs not-applicable hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Won Milestone'><i class='icon-like'></i></a>";
									html += "<a class='milestone-lost text-l-none-hover c-p text-xs m-l-sm hover-show disabled' style='visibility:hidden;' data-toggle='tooltip' title='Set as Lost Milestone'><i class='icon-dislike'></i></a>";
								} else{
									html += milestones[i] + "</div></td><td class='b-r-none'><div class='m-b-n-xs'>";
									html += "<a class='milestone-won text-l-none-hover c-p text-xs hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Won Milestone'><i class='icon-like'></i></a>";
									html += "<a class='milestone-lost text-l-none-hover c-p text-xs m-l-sm hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Lost Milestone'><i class='icon-dislike'></i></a>";
								}
								html +=	"<a class='milestone-delete c-p m-l-sm text-l-none text-xs hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Delete Milestone'><i class='icon icon-trash'></i>" +
										"</a><a class='text-l-none-hover c-p text-xs m-l-sm hover-show' style='visibility:hidden;'><i title='Drag' class='icon-move'></i></a></div></td></tr>";
								// html += "<li data='" + milestones[i] +
								// "'><div><span>" + milestones[i] + "</span><a
								// class='milestone-delete right'
								// href='#'>&times</a></div></li>";
							}
						}
						// html += "</ul>";
						return html;
					});

	/**
	 * Helper function to return date string from epoch time
	 */
	Handlebars.registerHelper('epochToHumanDate', function(format, date)
	{

		if (!format)
			format = "mmm dd yyyy HH:MM:ss";

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			console.log(new Date(parseInt(date)).format(format));
			return new Date(parseInt(date)).format(format, 0);
		}
		// date form milliseconds
		var d = "";
		try
		{
			d= new Date(parseInt(date) * 1000).format(format);
		}
		catch (err)
		{
			console.log("Invalid date for custom field.");
		}

		return d

		// return $.datepicker.formatDate(format , new Date( parseInt(date) *
		// 1000));
	});

	Handlebars.registerHelper('paypalInvoiceDate', function(format, date)
	{
		if (date){
			// var data = new Date(date); 
			// var time = data.getTime();			
    		var din = date.replace(/-/g, "//");
			if(!format){
			 	format = "ddd mmm dd yyyy";
			}
			var d= new Date(din).format(format);
			return d;			
		}
		// return $.datepicker.formatDate(format , new Date( parseInt(date) *
		// 1000));
	});



	// Helper function to return date in user selected format in  preferences.

	Handlebars.registerHelper('epochToHumanDateInFormat', function(date)
	{

		if (!date)
			return;
		return getDateInFormatFromEpoc(date);
		
	});

	// Helper function to return date format from  preferences.

	Handlebars.registerHelper('dateFormat', function()
	{

		return "Select Date";
		
	});

	// Helper function to return current date in preferences page.

	Handlebars.registerHelper('currentDateInFormat', function(format)
	{
		if(!format)
			return;
		format = format.replace(/MM/g, "mmmm").replace(/M/g, "mmm").replace(/DD/g, "dddd").replace(/D/g, "ddd");
		return new Date().format(format);
		
	});

	Handlebars.registerHelper('stringToHumanDateInFormat', function(date)
	{
		if(!date)
			return;
		var dateString = new Date(date);
		if(dateString == "Invalid Date")
			return getDateInFormatFromEpoc(date);
		else
			return en.dateFormatter({raw: getGlobalizeFormat()})(dateString);

		
	});

	/**
	 * Helper function to return the date string converting to local timezone.
	 */
	Handlebars.registerHelper('toLocalTimezone', function(dateString)
	{
		var date = new Date(dateString);

		return date.toDateString() + ' ' + date.toLocaleTimeString();
	});

	/**
	 * Helper function to return the date string converting to local timezone
	 * from UTC.
	 */
	Handlebars.registerHelper('toLocalTimezoneFromUtc', function(dateString)
	{
		var date = new Date(dateString + ' GMT+0000');

		return date.toDateString() + ' ' + date.toLocaleTimeString();
	});

	/**
	 * Helper function to return task date (MM dd, ex: Jan 10 ) from epoch time
	 */
	Handlebars.registerHelper('epochToTaskDate', function(date)
	{

		var intMonth, intDay;

		// Verifies whether date is in milliseconds, then
		// no need to multiply with 1000
		if ((date / 100000000000) > 1)
		{
			intMonth = new Date(date).getMonth();
			intDay = new Date(date).getDate();
		}
		else
		{
			intMonth = new Date(parseInt(date) * 1000).getMonth();
			intDay = new Date(parseInt(date) * 1000).getDate();
		}
		var monthArray = [
				"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
		];

		return (monthArray[intMonth] + " " + intDay);
	});

	/**
	 * Helper function to return task color based on it's priority
	 */
	Handlebars.registerHelper('task_label_color', function(priority)
	{
		if (priority == 'HIGH' || priority == 'red')
			return 'danger';
		if (priority == 'NORMAL' || priority == '#36C')
			return 'info';
		if (priority == 'LOW')
			return 'label bg-light dk';
		if (priority == 'green')
			return 'success';
	});

	/**
	 * Helper function to return event label based on it's priority
	 */
	Handlebars.registerHelper('event_priority', function(priority)
	{
		if (priority == 'red' || priority == '#f05050')
			return 'High';
		if (priority == '#36C' || priority == '#23b7e5' || priority == 'blue')
			return 'Normal';
		if (priority == 'green' || priority == '#bbb')
			return 'Low';
	});

	/**
	 * Helper function to return event label color based on it's color
	 */
	Handlebars.registerHelper('event_label_color', function(color)
	{
		if (color == 'red' || color == '#f05050')
			return 'danger';
		if (color == '#36C' || color == '#23b7e5' || color == 'blue')
			return 'primary';
		if (color == 'green' || color == '#bbb')
			return 'warning';
	});

	/**
	 * Helper function to return type based on it's network type
	 */
	Handlebars.registerHelper('network', function(type)
	{
		if (type == 'GOOGLE')
			return 'Google Drive';
		if (type == 'S3')
			return 'Uploaded Doc';
	});

	/**
	 * Helper function to return date (Jan 10, 2012) from epoch time (users
	 * table)
	 * 
	 * @param {Object}
	 *            info_json json object containing information about
	 *            createdtime, last logged in time etc..
	 * @param {String}
	 *            date_type specifies the type of date to return (created or
	 *            logged in)
	 */
	Handlebars.registerHelper('epochToDate', function(info_json, date_type)
	{

		var obj = JSON.parse(info_json);

		if (!obj[date_type])
			return "-";
		if (date_type != "created_time")
		{
			if ((obj[date_type] / 100000000000) > 1)
			{
				return new Date(parseInt(obj[date_type])).format("mmm dd yyyy HH:MM:ss", 0);
			}
			// date form milliseconds
			return new Date(parseInt(obj[date_type]) * 1000).format("mmm dd yyyy HH:MM:ss", 0);
		}
		else
		{
			var intMonth = new Date(parseInt(obj[date_type]) * 1000).getMonth();
			var intDay = new Date(parseInt(obj[date_type]) * 1000).getDate();
			var intYear = new Date(parseInt(obj[date_type]) * 1000).getFullYear();

			var monthArray = [
					"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
			];

			return (monthArray[intMonth] + " " + intDay + ", " + intYear);
		}
	});

	/**
	 * Returns currency symbol based on the currency value (deals)
	 */
	Handlebars.registerHelper('currencySymbol', function()
	{
		//var value = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
		/*var symbol = ((value.length < 4) ? "$" : value.substring(4, value.length));
		if(symbol=='Rs')
			symbol='Rs.';
		return symbol*/
	});
	Handlebars.registerHelper('mandrill_exist', function(options)
	{
		if (IS_HAVING_MANDRILL)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	/**
	 * Calculates the "pipeline" for deals based on their value and probability
	 * (value * probability)
	 * 
	 * @param {Number}
	 *            value of the deal
	 * @param {Number}
	 *            probability of the deal
	 */
	Handlebars.registerHelper('calculatePipeline', function(value, probability)
	{

		var pipeline = parseInt(value) * parseInt(probability) / 100;
		return pipeline;
	});

	/**
	 * Returns required log (time or message) from logs (campaign logs)
	 */
	Handlebars.registerHelper('getRequiredLog', function(log_array_string, name)
	{
		var logArray = JSON.parse(log_array_string);
		if (name == "t")
		{
			var readableTime = new Date(logArray[0][name] * 1000);
			return readableTime;
		}
		return logArray[0][name];
	});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('contactTableHeadings', function(item)
	{

		var el = "";
		$.each(App_Contacts.contactViewModel[item], function(index, element)
		{
			
			if (element.indexOf("CUSTOM_") == 0) {
				element = element.split("_")[1];
				el = el.concat('<th class="text-muted">' + ucfirst(element) + '</th>');
			}
			else {
			element = element.replace("_", " ")
			el = el.concat('<th>' + ucfirst(element) + '</th>');
			}	

		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Returns table headings for reports custom contacts list view
	 */
	Handlebars.registerHelper('reportsContactTableHeadings', function(item)
	{

		var el = "";
		$.each(REPORT[item], function(index, element)
		{

			if (element.indexOf("properties_") != -1)
				element = element.split("properties_")[1];
			if (element.indexOf("custom_") == 0)
				element = element.split("custom_")[1];
			element = element.replace("_", " ")

			el = el.concat('<th>' + ucfirst(element) + '</th>');

		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Helper function, which executes different templates (entity related)
	 * based on entity type. Here "this" reffers the current entity object.
	 * (used in timeline)
	 * 
	 */
	Handlebars.registerHelper('if_entity', function(item, options)
	{

		if (this.entity_type == item)
		{
			return options.fn(this);
		}
		if (!this.entity && this[item] != undefined)
		{
			return options.fn(this);
		}
	});

	/**
	 * Returns trigger type, by removing underscore and converting into
	 * lowercase, excluding first letter.
	 */
	Handlebars.registerHelper('titleFromEnums', function(value)
	{
		if (!value)
			return;

		var str = value.replace(/_/g, ' ');
		return ucfirst(str.toLowerCase());

	});

	Handlebars.registerHelper('actionTemplate', function(actions)
	{
		if (!actions)
			return;

		var actions_count = actions.length;

		var el = '<div class="table-resp">';

		$.each(actions, function(key, val)
		{
			if (--actions_count == 0)
			{
				el = el.concat(titleFromEnums(val.action));
				return;
			}
			el = el.concat(titleFromEnums(val.action) + ", ");
		});

		el = el.concat('</div>');
		return new Handlebars.SafeString(el);

	});

	Handlebars.registerHelper('triggerType', function(value)
	{
		if (value == 'ADD_SCORE')
			return value.replace('ADD_SCORE', 'Score (>=)');

		return titleFromEnums(value);
	});

	/**
	 * Returns notification type,by replacing 'has been' with underscore and
	 * converting into lowercase.
	 */
	Handlebars.registerHelper('if_notification_type', function()
	{

		// Makes 'CONTACT CREATED' To 'COMPANY CREATED'
		if (this.type == "COMPANY")
		{
			var arr = this.notification.split('_');
			var temp = ucfirst(arr[0].replace('CONTACT', 'COMPANY')) + " " + ucfirst(arr[1]);
			return " - " + temp;
		}

		// Replaces '_' with ' '
		var str = this.notification.replace(/_/, ' ');

		switch (str) {
		case "IS BROWSING":
			return str.toLowerCase() + " " + this.custom_value;

		case "CLICKED LINK":
			var customJSON = JSON.parse(this.custom_value);

			if (customJSON["workflow_name"] == undefined)
				return str.toLowerCase() + " " + customJSON.url_clicked;

			return str.toLowerCase() + " " + customJSON.url_clicked + " " + " of campaign " + "\"" + customJSON.workflow_name + "\""

		case "OPENED EMAIL":
			var customJSON = JSON.parse(this.custom_value);

			if (customJSON.hasOwnProperty("workflow_name"))
				return str.toLowerCase() + " " + " of campaign " + "\"" + customJSON.workflow_name + "\"";

			return str.toLowerCase() + " with subject " + "\"" + customJSON.email_subject + "\"";

		case "CONTACT ADDED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "CONTACT DELETED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "DEAL CREATED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "DEAL CLOSED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "TAG ADDED":
			return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

		case "TAG DELETED":
			return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

		default:
			return str.toLowerCase();
		}
	});

	/**
	 * Converts Epoch Time to Human readable date of default format.Used for
	 * campaign-logs.
	 */
	Handlebars.registerHelper('epochToLogDate', function(logTime)
	{
		return new Date(logTime * 1000);
	});

	/**
	 * Returns country name from country code.
	 */
	Handlebars.registerHelper('getCountryName', function(countrycode)
	{
		// retrieves country name from code using country-from-code.js
		return getCode(countrycode);
	});

	/**
	 * Replace '+' symbols with space.Used in notification.
	 */
	Handlebars.registerHelper('replace_plus_symbol', function(name)
	{

		return name.replace(/\+/, ' ');
	});
	/**
	 * Replace '-' symbols with empty.Used in invoice.
	 */
	Handlebars.registerHelper('replace_minus_symbol', function(name)
	{

		return name.replace(/\-/, '');
	});

	Handlebars.registerHelper('get_amount_with_possitive', function(amount)
	{
		if (amount < 0)
			return amount / 100 * (-1);
		else
			return amount / 100;
	});
	/**
	 * Removes forward slash. Makes A/B to AB. Used in contact-detail-campaigns
	 */
	Handlebars.registerHelper('removeSlash', function(value)
	{
		if (value == 'A/B')
			return value.replace(/\//, '');

		return value;
	});

	/**
	 * Displays all the properties of a contact in its detail view, excluding
	 * the function parameters (fname, lname, company etc..)
	 */
	Handlebars
			.registerHelper(
					'if_property',
					function(fname, lname, company, title, image, email, phone, website, address, options)
					{

						if (this.name != fname && this.name != lname && this.name != company && this.name != title && this.name != image && this.name != email && this.name != phone && this.name != website && this.name != address)
							return options.fn(this);
					});

	/**
	 * Counts the existence of property name which occurred multiple times.
	 */
	Handlebars.registerHelper('property_is_exists', function(name, properties, options)
	{

		if (getPropertyValue(properties, name))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * Counts the existence of property name which occurred multiple times.
	 */
	Handlebars.registerHelper('property_json_is_not_empty', function(name, properties, options)
	{

        var value = getPropertyValue(properties, name);
        try{
        	value = JSON.parse(value);
        }catch(e){}

		if (Object.keys(value).length > 0)
			return options.fn(this);
		
		return options.inverse(this);
	});

	/**
	 * returns online scheduling url of current user
	 */
	Handlebars.registerHelper('online_schedule_URL', function()
	{
		return ONLINE_SCHEDULING_URL;
	});

	// gets the refernce code of current domain

	Handlebars.registerHelper('get_current_domain', function()
	{
		return CURRENT_DOMAIN_USER.domain;
	});

	Handlebars.registerHelper('get_current_domain_email', function()
	{
		return CURRENT_DOMAIN_USER.email;
	});

	
	/*
	 * To add comma in between the elements.
	 */
	Handlebars.registerHelper('comma_in_between_property', function(value1, value2, properties, options)
	{

		if (getPropertyValue(properties, value1) && getPropertyValue(properties, value2))
			return ",";
	});

	Handlebars.registerHelper('property_subtype_is_exists', function(name, subtype, properties, options)
	{

		if (getPropertyValueBySubtype(properties, name, subtype))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * Displays multiple times occurred properties of a contact in its detail
	 * view in single entity
	 */
	Handlebars.registerHelper('multiple_Property_Element', function(name, properties, options)
	{

		var matching_properties_list = agile_crm_get_contact_properties_list(name)
		if (matching_properties_list.length > 0)
			return options.fn(matching_properties_list);
	});
	
	/**
	 * Displays multiple times occurred properties of a contact in its detail
	 * view in single entity
	 */
	Handlebars.registerHelper('multiple_Company_Property_Element', function(name, properties, options)
	{

		var matching_properties_list = company_util.agile_crm_get_company_properties_list(name)
		if (matching_properties_list.length > 0)
			return options.fn(matching_properties_list);
	});

	/**
	 * Converts address as comma seprated values and returns as handlebars safe
	 * string.
	 */
	Handlebars
			.registerHelper(
					'address_Element',
					function(properties)
					{
						var properties_count = 0;
						for (var i = 0, l = properties.length; i < l; i++)
						{

							if (properties[i].name == "address")
							{
								var el = '';

								var address = {};
								try
								{
									address = JSON.parse(properties[i].value);
								}
								catch (err)
								{
									address['address'] = properties[i].value;
								}

								// Gets properties (keys) count of given json
								// object
								var count = countJsonProperties(address);

								if (properties_count != 0)

									el = el
											.concat('<div class="contact-addressview"><div><div class="pull-left hide" style="width:18px"><i class="icon icon-pointer"></i></div><div class="custom-color">');
								else
									el = el
											.concat('<div class="contact-addressview"><div><div class="pull-left hide" style="width:18px"><i class="icon icon-pointer"></i></div><div class="custom-color">');

								if(address.address !== undefined)
									el = el.concat(address.address+", ");

								if(address.city !== undefined)
									el = el.concat(address.city+", ");

								if(address.state !== undefined)
									el = el.concat(address.state+", ");

								if(address.zip !== undefined)
									el = el.concat(address.zip+", ");

								if(address.country !== undefined)
									el = el.concat(address.country+".");

								/*$.each(address, function(key, val)
								{
									if (--count == 0)
									{
										el = el.concat(val + ".");
										return;
									}
									el = el.concat(val + ", ");
								});*/

								if (properties[i].subtype)
									el = el.concat('<span class="label bg-light dk text-tiny">' + properties[i].subtype + '</span>');
								el = el.concat('</span>&nbsp;<span id="map_view_action"></span></div></div>');
								return new Handlebars.SafeString(el);
							}
							else if (properties[i].name == "phone" || properties[i].name == "email")
							{
								++properties_count;
							}
						}
					});

	Handlebars.registerHelper('address_Template', function(properties)
	{

		for (var i = 0, l = properties.length; i < l; i++)
		{

			if (properties[i].name == "address")
			{
				var el = '';

				var address = {};
				try
				{
					address = JSON.parse(properties[i].value);
				}
				catch (err)
				{
					address['address'] = properties[i].value;
				}

				// Gets properties (keys) count of given json
				// object
				var count = countJsonProperties(address);

				$.each(address, function(key, val)
				{
					if (--count == 0)
					{
						el = el.concat(val + ".");
						return;
					}
					el = el.concat(val + ", ");
				});
				/*
				 * if (properties[i].subtype) el = el.concat(" <span
				 * class='label'>" + properties[i].subtype + "</span>");
				 */

				return new Handlebars.SafeString(el);
			}
		}
	});
	
	/**
	 * To represent a number with commas in deals
	 */
	Handlebars.registerHelper('numberWithCommas', function(value)
	{
		if (value == 0)
			return value;

		if (value)
		{
			return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
		}
	});

	/**
	 * Converts reports/view field element as comma seprated values and returns
	 * as handlebars safe string.
	 */
	Handlebars.registerHelper('field_Element', function(properties)
	{
		var el = "";
		var count = properties.length;

		$.each(properties, function(key, value)
		{

			if (value.indexOf("properties_") != -1)
				value = value.split("properties_")[1];
			else if (value.indexOf("custom_") != -1)
				value = value.split("custom_")[1];
			else if (value.indexOf("CUSTOM_") != -1)
				value = value.split("CUSTOM_")[1];
			else if (value == "created_time")
				value = "Created Date";
			else if (value == "updated_time")
				value = "Updated Date";

			value = value.replace("_", " ");

			if (--count == 0)
			{
				el = el.concat(value);
				return;
			}
			el = el.concat(value + ", ");
		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Converts string to JSON
	 */
	Handlebars.registerHelper('stringToJSON', function(object, key, options)
	{
		console.log(object);
		console.log(key);
		if (key)
		{
			try
			{

				object[key] = JSON.parse(object[key]);
			}
			finally
			{
				return options.fn(object[key]);
			}
		}

		try
		{
			return options.fn(JSON.parse(object));
		}
		catch (err)
		{
			return options.fn(object);
		}
	});

	/**
	 * Checks the existence of property name and prints value
	 */
	Handlebars.registerHelper('if_propertyName', function(pname, options)
	{
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		if (value.search(exp) != -1)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('show_link_in_statement', function(value)
	{

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		try
		{
			value = value.replace(exp, "<a href='$1' target='_blank' class='cd_hyperlink'>$1</a>");
			return new Handlebars.SafeString(value);
		}
		catch (err)
		{
			return value;
		}

	});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('displayPlan', function(value)
	{

		return ucfirst(value).replaceAll("_", " ");

	});

	/**
	 * Returns plain text removes underscore from text
	 */
	Handlebars.registerHelper('displayPlainText', function(value)
	{

		return value.split("_").join(" ");

	});

	/**
	 * Returns plain text removes underscore from text
	 */
	Handlebars.registerHelper('displayTaskStatus', function(value)
	{
		var val = value.split("_").join("").trim().toLowerCase();
		if (val == "yettostart")
			return "Not Started";
		else
			return ucfirst(value.split("_").join(" ").trim());

	});

	Handlebars.registerHelper('getCurrentContactProperty', function(value)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return getPropertyValue(contact_properties, value);
		}
	});

	Handlebars.registerHelper('safe_string', function(data)
	{

		data = data.replace(/\n/, "<br/>");
		return new Handlebars.SafeString(data);
	});

	Handlebars.registerHelper('string_to_date', function(format, date)
	{

		return new Date(date).format(format);
	});

	Handlebars.registerHelper('isArray', function(data, options)
	{
		if (isArray(data))
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('is_string', function(data, options)
	{
		if (typeof data == "string")
			return options.fn(this);
		return options.inverse(this);

	});

	Handlebars.registerHelper("bindData", function(data)
	{

		return JSON.stringify(data);
	});

	Handlebars.registerHelper("getCurrentUserPrefs", function(options)
	{
		if (CURRENT_USER_PREFS)
			;
		return options.fn(CURRENT_USER_PREFS);
	});

	Handlebars.registerHelper("getCurrentDomain", function(options)
	{

		var url = window.location.host;

		var exp = /(\.)/;

		if (url.search(exp) >= 0)
			return url.split(exp)[0];

		return " ";
	});

	Handlebars.registerHelper("getBase64Domain", function()
			{
				return window.btoa(window.location.host.split(".")[0]);
	});

	// Gets date in given range
	Handlebars.registerHelper('date-range', function(from_date_string, no_of_days, options)
	{
		var from_date = Date.parse(from_date_string);
		var to_date = Date.today().add({ days : parseInt(no_of_days) });
		return to_date.toString('MMMM d, yyyy') + " - " + from_date.toString('MMMM d, yyyy');

	});

	Handlebars.registerHelper("extractEmail", function(content, options)
	{

		console.log(content);

		return options.fn(content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0]);
	});

	Handlebars.registerHelper('getCurrentContactPropertyBlock', function(value, options)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return options.fn(getPropertyValue(contact_properties, value));
		}
	});

	Handlebars.registerHelper('isDuplicateContactProperty', function(properties, key, options)
	{
		
	});

	Handlebars.registerHelper('containString', function(value, target, options)
	{
		if (target.search(value) != -1)
			return options.fn(this);

		return options.inverse(this);
	});
	Handlebars.registerHelper('is_emailPlan', function(planId, options)
	{

		if (planId.search("email") != -1)
			return options.fn(this);

		return options.inverse(this);

	});
	Handlebars.registerHelper('is_userPlan', function(planId, options)
	{
		if (planId.search("email") != -1)
			return options.inverse(this);
		return options.fn(this);

	});

	Handlebars.registerHelper('numeric_operation', function(operand1, operand2, operator)
	{

		var operators = "/*-+";

		if (operators.indexOf(operator) == -1)
			return "";

		if (operator == "+")
			return operand1 + operand2;

		if (operator == "-")
			return operand1 - operand2;

		if (operator == "*")
			return operand1 * operand2;

		if (operator == "/")
			return operand1 / operand2;
	});
	Handlebars.registerHelper('get_total_amount', function(operand1, operand2)
	{

		return (operand1 / 100) * operand2;
	});

	Handlebars.registerHelper('check_length', function(content, length, options)
	{

		if (parseInt(content.length) > parseInt(length))
			return options.fn(this);

		return options.inverse(this);
	});
	Handlebars.registerHelper('get_unrefunded_amount', function(operand1, operand2)
	{
		return (operand1 - operand2) / 100;

	});

	Handlebars.registerHelper('check_json_length', function(content, length, options)
	{
		var json_length = 0;
		for ( var prop in content)
		{
			json_length++;
		}

		if (json_length == parseInt(length))
		{
			for ( var prop in content)
			{
				return options.fn({ property : prop, value : content[prop], last : true });
			}
		}

		return options.inverse(content);
	});

	Handlebars.registerHelper('iterate_json', function(context, options)
	{
		var result = "";
		var count = 0;
		var length = 0;
		for ( var prop in context)
		{
			length++;
		}

		for ( var prop in context)
		{
			count++;
			if (count == length)
				result = result + options.fn({ property : prop, value : context[prop], last : true });
			else
				result = result + options.fn({ property : prop, value : context[prop], last : false });

		}

		console.log(result);
		return result;
	});

	Handlebars.registerHelper('get_social_icon', function(name)
	{
		return get_social_icon(name);

	});

	Handlebars.registerHelper("each_with_index", function(array, options)
	{
		var buffer = "";
		for (var i = 0, j = array.length; i < j; i++)
		{
			var item = array[i];

			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item.index = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	Handlebars.registerHelper('if_json', function(context, options)
	{

		try
		{
			var json = $.parseJSON(context);

			if (typeof json === 'object')
				return options.fn(this);
			return options.inverse(this);
		}
		catch (err)
		{
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('add_tag', function(tag)
	{
		addTagAgile(tag);
	});

	Handlebars.registerHelper('set_up_dashboard_padcontent', function(key)
	{
		return new Handlebars.SafeString(getTemplate("empty-collection-model", CONTENT_JSON.dashboard[key]));
	});

	/**
	 * Removes surrounded square brackets
	 */
	Handlebars.registerHelper('removeSquareBrackets', function(value)
	{
		return value.replace(/[\[\]]+/g, '');
	});

	/**
	 * Removes "" with single quotes brackets
	 */
	Handlebars.registerHelper('removeDoubleCoutes', function(value)
	{
		var strings = value.replace(/[\[\]]+/g, '');
		var charwithsinglequote = strings.replace(/"/g, "'");
		return charwithsinglequote;
	});

	/**
	 * Shows list of triggers separated by comma
	 */
	Handlebars.registerHelper('toLinkTrigger', function(context, options)
	{
		var ret = "";
		for (var i = 0, j = context.length; i < j; i++)
		{
			ret = ret + options.fn(context[i]);

			// Avoid comma appending to last element
			if (i < j - 1)
			{
				ret = ret + ", ";
			}
			;
		}
		return ret;
	});

	// Gets minutes from milli seconds
	Handlebars.registerHelper('millSecondsToMinutes', function(timeInMill)
	{
		if (isNaN(timeInMill))
			return;
		var sec = timeInMill / 1000;
		var min = Math.floor(sec / 60);

		if (min < 1)
			return Math.ceil(sec) + " secs";

		var remainingSec = Math.ceil(sec % 60);

		return min + " mins, " + remainingSec + " secs";
	});

	Handlebars.registerHelper('if_overflow', function(content, div_height, options)
	{

		if (!content)
			return;

		console.log($('#Linkedin').width());
		content = content.trim();
		var element = $("<div style='width:" + $('#Linkedin').width() + "px;" + "word-break:normal;word-wrap:break-word;display:none;'>" + content + "</div>");

		$("#content").append(element);

		console.log(element.height() + " " + parseInt(div_height))
		if (element.height() > parseInt(div_height))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * To set up star rating in contacts listing
	 */
	Handlebars.registerHelper('setupRating', function(value)
	{

		var element = "";
		for (var i = 0; i < 5; i++)
		{
			if (i < parseInt(value))
			{
				element = element.concat('<li style="display: inline;"><img src="'+updateImageS3Path("img/star-on.png")+'" alt="' + i + '"></li>');
				continue;
			}
			element = element.concat('<li style="display: inline;"><img src="'+updateImageS3Path("img/star-off.png")+'" alt="' + i + '"></li>');
		}
		return new Handlebars.SafeString(element);
	});

	/**
	 * Builds options to be shown in the table heading of CSV import. Also tries
	 * to match headings in select field
	 */
	Handlebars.registerHelper('setupCSVUploadOptions', function(type, key, context)
	{
		// console.log(context.toJSON());
		var template;
		if (type == "contacts")
		{
			template = $(getTemplate('csv_upload_options', context));
		}
		else if (type == "company")
		{
			template = $(getTemplate('csv_companies_upload_options', context));
		}
		else if (type == "deals")
		{
			template = $(getTemplate('csv_deals_options', context));
		}

		// Replaces _ with spaces
		key = key.replace("_", " ");

		var isFound = false;

		var match_weight = 0;

		var key_length = key.length;
		var key = key.toLowerCase();
		var matched_value;

		var selected_element;
		template.find('option').each(function(index, element)
		{
			if ($(element).text().toLowerCase().indexOf(key) != -1)
			{

				var current_match_weight = key_length / $(element).text().length;
				if (match_weight >= current_match_weight)
					return;

				selected_element = $(element);
				matched_value = $(element).text();
				match_weight = current_match_weight;
			}
		})

		console.log(matched_value + ", " + key + " : " + match_weight);

		for (var i = 0; i < key.length - 3; i++)
		{
			template.find('option').each(function(index, element)
			{
				if ($(element).text().toLowerCase().indexOf(key.substr(0, key.length - i).toLowerCase()) != -1)
				{
					console.log(key.substr(0, key.length - i) + " , " + $(element).text());
					var current_match_weight = key.substr(0, key.length - i).length / $(element).text().length;
					console.log(current_match_weight);
					if (match_weight >= current_match_weight)
						return;
					selected_element = $(element);
					matched_value = $(element).text();
					match_weight = current_match_weight;
				}
			})
		}

		$(selected_element).attr("selected", true);

		/*
		 * // Iterates to create various combinations and check with the header
		 * for ( var i = 0; i < key.length - 3; i++) {
		 * template.find('option').each(function(index, element) { if
		 * ($(element).val().toLowerCase().indexOf(key) != -1) { isFound = true;
		 * $(element).attr("selected", true); return false; } else if
		 * ($(element).val().toLowerCase().indexOf(key.substr(0, key.length -
		 * i).toLowerCase()) != -1) { isFound = true;
		 * $(element).attr("selected", true); return false; }
		 * 
		 * }); if (isFound) break; }
		 */
		return new Handlebars.SafeString($('<div>').html(template).html());
	});

	/**
	 * Converts total seconds into hours, minutes and seconds. For e.g. 3600
	 * secs - 1hr 0 mins 0secs
	 */
	Handlebars.registerHelper('convertSecondsToHour', function(totalSec)
	{
		var hours = parseInt(totalSec / 3600) % 24;
		var minutes = parseInt(totalSec / 60) % 60;
		var seconds = totalSec % 60;

		// show only seconds if hours and mins are zero
		if (hours == 0 && minutes == 0)
			return (seconds + "s");

		// show mins and secs if hours are zero.
		if (hours == 0)
			return (minutes + "m ") + (seconds + "s");

		var result = (hours + "h ") + (minutes + "m ") + (seconds + "s");
		return result;
	});

	/**
	 * To check and return value of original referrer
	 */
	Handlebars.registerHelper('checkOriginalRef', function(original_ref)
	{
		if (!getCurrentContactProperty(original_ref))
			return "unknown";

		var url = getCurrentContactProperty(original_ref);

		url = url.split('/');
		url = (url[0] + '//' + url[2]);
		return new Handlebars.SafeString(
				'<a style="text-decoration: none" target="_blank" href="' + getCurrentContactProperty(original_ref) + '">' + url + '</a>');
	});

	/**
	 * To check google url and key words
	 */
	Handlebars.registerHelper('queryWords', function(original_ref)
	{
		// Check if original referrer exists
		if (getCurrentContactProperty(original_ref))
		{
			// Get input url from contact properties and initialize reference
			// url
			var inputUrl = getCurrentContactProperty(original_ref);
			var referenceUrl = 'www.google.';

			// Get host from input url and compare with reference url if equal
			var tempUrl = inputUrl.split('/');
			tempUrl = tempUrl[2].slice(0, 11);
			if (tempUrl === referenceUrl)
			{
				// Get search term from input url
				var parser = document.createElement('a');
				parser.href = inputUrl;
				var search = parser.search;

				// If search term exists, check if 'q' parameter exists, and
				// return its value
				if (search.length > 1)
				{
					search = search.split('&');
					var length = search.length;
					for (var i = 0; i < length; i++)
					{
						if (search[i].indexOf('q=') != -1)
						{
							search = search[i].split('=');
							return new Handlebars.SafeString('( Keyword : ' + search[1].split('+').join(" ") + ' )');
						}
					}
				}
			}
			else
				return;
		}
	});

	/**
	 * Returns contact full name if last-name exists, otherwise only first_name
	 * for contact type PERSON. It returns company name for other contact type.
	 * 
	 */
	Handlebars.registerHelper('contact_name', function(properties, type)
	{

		if (type === 'PERSON')
		{
			for (var i = 0; i < properties.length; i++)
			{

				// if last-name exists, return full name.
				if (properties[i].name === "last_name")
					return (getPropertyValue(properties, "first_name") + " " + properties[i].value);

				else if (properties[i].name === "first_name")
					return properties[i].value;
			}

			return "Contact";
		}

		// COMPANY type
		for (var i = 0; i < properties.length; i++)
		{
			if (properties[i].name === "name")
				return properties[i].value;
		}
		return "Company";
	});

	/**
	 * Returns full name of contact. Use this when empty value is not
	 * acceptable. Takes care that, even when no names are defined, returns
	 * email(necessary for PERSON) or Company <id>. Calls function
	 * getContactName defined in agile-typeahead.js. Also typeahead uses this
	 * fxn to append values as tags.
	 */
	Handlebars.registerHelper('contact_name_necessary', function(contact)
	{
		return getContactName(contact);
	});

	/**
	 * To check if string is blank
	 */
	Handlebars.registerHelper('is_blank', function(value, options)
	{
		value = value.trim();

		if (value == "")
			return options.fn(value);
		else
			return options.inverse(value);
	})

	/**
	 * Iterate through list of values (not json)
	 */
	Handlebars.registerHelper("each_with_index1", function(array, options)
	{
		console.log(array);
		var buffer = "";
		for (var i = 0, j = array.length; i < j; i++)
		{
			var item = {};
			item["value"] = array[i];

			console.log(item);
			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item["index"] = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	/**
	 * If log_type equals true otherwise false
	 */
	Handlebars.registerHelper("if_log_type_equals", function(object, key, log_type, options)
	{

		if (object[key] == log_type)
			return options.fn(object);

		return options.inverse(object);

	});

	/**
	 * Identifies EMAIL_SENT campaign-log string and splits the log string based
	 * on '_aGiLeCrM' delimiter into To, From, Subject and Body.
	 * 
	 */
	Handlebars.registerHelper("if_email_sent", function(object, key, options)
	{

		// delimiter for campaign send-email log
		var _AGILE_CRM_DELIMITER = "_aGiLeCrM";

		// if log_type is EMAIL_SENT
		if (object[key] === "EMAIL_SENT")
		{
			// Splits logs message
			var email_fields = object["message"].split(_AGILE_CRM_DELIMITER, 4);

			// Json to apply for handlebar template
			var json = {};

			if (email_fields === undefined)
				return options.inverse(object);

			// Iterates inorder to insert each field into json
			for (var i = 0; i < email_fields.length; i++)
			{
				// Splits based on colon. E.g "To: naresh@agilecrm.com   "
				var arrcolon = email_fields[i].split(":");

				// Inserts LHS of colon as key. E.g., To
				var key = arrcolon[0];
				key = key.trim(); // if key starts with space, it
				// can't
				// accessible

				// Inserts RHS of colon as value. E.g.,
				// naresh@agilecrm.com  
				var value = arrcolon.slice(1).join(":"); // join the
				// remaining string
				// based on colon,
				// only first occurence of colon is needed
				value = value.trim();

				json[key] = value;
			}

			// inserts time into json
			json.time = object["time"];

			// apply customized json to template.
			return options.fn(json);
		}

		// if not EMAIL_SENT log, goto else in the template
		return options.inverse(object);

	});

	Handlebars.registerHelper('remove_spaces', function(value)
	{
		if(value)
			  value = value.replace(/ +/g, '');

		return value;

	});

	Handlebars.registerHelper('replace_spaces', function(value)
	{
		if(value)
			  value = value.replace(/ +/g, '_');

		return value;
		
	});

	/***************************************************************************
	 * Returns campaignStatus object from contact campaignStatus array having
	 * same campaign-id. It is used to get start and completed time from array.
	 **************************************************************************/
	Handlebars.registerHelper('if_same_campaign', function(object, data, options)
	{

		var campaignStatusArray = object[data];

		// if campaignStatus key doesn't exist return.
		if (data === undefined || campaignStatusArray === undefined)
			return;

		// Get campaign-id from hash
		var current_campaign_id = getIdFromHash();

		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{

			// compares campaign-id of each element of array with
			// current campaign-id
			if (campaignStatusArray[i].campaign_id === current_campaign_id)
			{
				// if equal, execute template current json
				return options.fn(campaignStatusArray[i]);
			}
		}

	});

	/**
	 * Returns other active campaigns in campaign-active subscribers.
	 */
	Handlebars.registerHelper('if_other_active_campaigns', function(object, data, options)
	{

		if (object === undefined || object[data] === undefined)
			return;

		var other_campaigns = {};
		var other_active_campaigns = [];
		var other_completed_campaigns = [];
		var campaignStatusArray = object[data];

		var current_campaign_id = getIdFromHash();

		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{
			// neglect same campaign
			if (current_campaign_id === campaignStatusArray[i].campaign_id)
				continue;

			// push all other active campaigns
			if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
				other_active_campaigns.push(campaignStatusArray[i])

				// push all done campaigns
			if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
				other_completed_campaigns.push(campaignStatusArray[i]);
		}

		other_campaigns["active"] = other_active_campaigns;
		other_campaigns["done"] = other_completed_campaigns;

		return options.fn(other_campaigns);

	});

	/**
	 * Returns json object of active and done subscribers from contact object's
	 * campaignStatus.
	 */
	Handlebars.registerHelper('contact_campaigns', function(object, data, options)
	{

		// if campaignStatus is not defined, return
		if (object === undefined || object[data] === undefined)
			return;

		// Temporary json to insert active and completed campaigns
		var campaigns = {};

		var active_campaigns = [];
		var completed_campaigns = [];
		var unsubscribed_campaigns = [];
		var unsubscribed_campaigns_json = {};

		// campaignStatus object of contact
		var campaignStatusArray = object[data];
		var statuses = object["campaignStatus"];
		var campaign_json = {};

		// To get campaign name for unsubscribed campaigns
		for (var i = 0, len = statuses.length; i < len; i++)
		{
			var status = statuses[i];
			
			if(status)
				campaign_json[status.campaign_id] = status.campaign_name;
		}


		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{
			if(campaignStatusArray[i].status)
			{
				// push all active campaigns
				if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
					active_campaigns.push(campaignStatusArray[i])

				// push all done campaigns
				if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
					completed_campaigns.push(campaignStatusArray[i]);
			}

			var isAll = false;
			// Unsubscribed campaigns list
			if(campaignStatusArray[i].unsubscribeType)
			{

				// Global variable set on resubscribe modal shown
				if(typeof email_workflows_list != 'undefined')
					campaignStatusArray[i].campaign_name = email_workflows_list[campaignStatusArray[i].campaign_id];

				if(campaignStatusArray[i].unsubscribeType == 'ALL'){

					if(!isAll)
					{
						unsubscribed_campaigns_json["isAll"] = true;
						isAll = true;
					}
				}

				unsubscribed_campaigns.push(campaignStatusArray[i]);
			}
		}

		if(unsubscribed_campaigns && unsubscribed_campaigns.length > 0)
			unsubscribed_campaigns_json["unsubscribed_campaigns"] = unsubscribed_campaigns;

		campaigns["active"] = active_campaigns;
		campaigns["done"] = completed_campaigns;
		campaigns["unsubscribed"] = unsubscribed_campaigns_json;

		// apply obtained campaigns context within
		// contact_campaigns block
		return options.fn(campaigns);
	});

	/**
	 * Returns first occurence string from string having underscores E.g,
	 * mac_os_x to mac
	 */
	Handlebars.registerHelper('normalize_os', function(data)
	{
		if (data === undefined || data.indexOf('_') === -1)
			return data;

		// if '_' exists splits
		return data.split('_')[0];
	});

	/**
	 * Get task list name without underscore and caps, for new task UI.
	 */
	Handlebars.registerHelper('get_normal_name', function(name)
	{
		if (!name)
			return;

		var name_json = { "HIGH" : "High", "LOW" : "Low", "NORMAL" : "Normal", "EMAIL" : "Email", "CALL" : "Call", "SEND" : "Send", "TWEET" : "Tweet",
			"FOLLOW_UP" : "Follow Up", "MEETING" : "Meeting", "MILESTONE" : "Milestone", "OTHER" : "Other", "YET_TO_START" : "Yet To Start",
			"IN_PROGRESS" : "In Progress", "COMPLETED" : "Completed", "TODAY" : "Today", "TOMORROW" : "Tomorrow", "OVERDUE" : "Overdue", "LATER" : "Later" };

		name = name.trim();

		if (name_json[name])
			return name_json[name];

		return name;

	});

	/**
	 * put user address location togather separated by comma.
	 */
	Handlebars.registerHelper('user_location', function()
	{

		var City = this.city == "?" ? "" : (this.city + ", ");
		var Region = this.region == "?" ? "" : (this.region + ", ");
		var Country = this.country;
		if (this.city == "?" && this.region == "?")
			Country = this.country == "?" ? this.city_lat_long : (this.city_lat_long + " ( " + this.country + " )");

		return (City + Region + Country).trim();
	});

	/**
	 * Trims trailing spaces
	 */
	Handlebars.registerHelper('trim_space', function(value)
	{

		if (value === undefined)
			return value;

		return value.trim();
	});

	/**
	 * Returns reputation name based on value
	 * 
	 */
	Handlebars.registerHelper('get_subaccount_reputation', function(value)
	{
		var type = "bg-light dk text-tiny";
		var reputation = "Unknown";

		if (value > 1 && value < 40)
		{
			type = "label-danger text-tiny";
			reputation = "Poor";
		}
		else if (value >= 40 && value < 75)
		{
			type = "bg-light text-tiny";
			reputation = "Ok";
		}
		else if (value >= 75 && value < 90)
		{
			type = "label-success text-tiny";
			reputation = "Good";
		}
		else if (value >= 90)
		{
			type = "label-success text-tiny";
			reputation = "Excellent";
		}

		return "<span style='position: relative;' class='label " + type

		+ "'>" + reputation + "</span> <!--<span class='badge badge-" + type + "'>" + value + "</span>-->";

	});

	/**
	 * Returns id from hash. It returns id from hash iff id exists at last.
	 * 
	 */
	Handlebars.registerHelper('get_id_from_hash', function()
	{

		return getIdFromHash();

	});
	
	Handlebars.registerHelper('isAdmin',function(options)
	{
		if(CURRENT_DOMAIN_USER.is_admin){
			return options.fn(this);
		}else{
			return options.inverse(this);
		}
		 
	});

	Handlebars.registerHelper('get_subscribers_type_from_hash', function()
	{

		// Returns "workflows" from "#workflows"
		var hash = window.location.hash.substr(1);

		if (hash.indexOf("all") != -1)
			return "All";

		if (hash.indexOf("active") != -1)
			return "Active";

		if (hash.indexOf("completed") != -1)
			return "Completed";

		if (hash.indexOf("removed") != -1)
			return "Removed";

		if (hash.indexOf("unsubscribed") != -1)
			return "Unsubscribed";

		if (hash.indexOf("hardbounced") != -1)
			return "Hard Bounced";

		if (hash.indexOf("softbounced") != -1)
			return "Soft Bounced";

		if (hash.indexOf("spam-reported") != -1)
			return "Spam Reported";
	});

	Handlebars.registerHelper("check_plan", function(plan, options)
	{
		console.log(plan);

		if (!_billing_restriction)
			return options.fn(this);

		if (_billing_restriction.currentLimits.planName == plan)
			return options.fn(this);

		return options.inverse(this);

	});

	/**
	 * Safari browser doesn't supporting few CSS properties like margin-top,
	 * margin-bottom etc. So this helper is used to add compatible CSS
	 * properties to Safari
	 */
	Handlebars.registerHelper("isSafariBrowser", function(options)
	{

		if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
			return options.fn(this);

		return options.inverse(this);
	});

	/**
	 * give custome status base on xerotype
	 */

	Handlebars.registerHelper('xeroType', function(type)
	{
		return (type == "ACCPAY") ? "Payable" : "Receivable";
	});

	/**
	 * give custom type to xero type
	 */
	Handlebars.registerHelper('xeroTypeToolTip', function(type)
	{
		return (type == "ACCPAY") ? "Payable" : "Receivable";
	});

	/**
	 * gives first latter capital for given input
	 */
	Handlebars.registerHelper('capFirstLetter', function(data)
	{
		if(data){
			if (data === "DEFAULT"){
				// console.log("return empty");
				return "";
			}else{
				var temp = data.toLowerCase();
				return temp.charAt(0).toUpperCase() + temp.slice(1);
			}
		}
	});

	Handlebars.registerHelper('qbStatus', function(Balance)
	{
		console.log(this);
		console.log(this.TotalAmt);
		if (Balance == 0)
		{
			return "Paid"
		}
		else
		{
			return "Due"
		}
	});
	Handlebars.registerHelper('currencyFormat', function(data)
	{

		return Number(data).toLocaleString('en');
		// data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	});

	Handlebars.registerHelper('formatAmount', function(data){
		data = parseFloat(data);
		return data.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	});
	
	Handlebars.registerHelper('QbDateFormat', function(data)
	{

		var i = [];
		i = data.split("-");
		return i[0] + "-" + i[2] + "-" + i[1];
	});

	Handlebars.registerHelper("hasScope", function(scope_constant, options)
	{
		if (CURRENT_DOMAIN_USER.scopes && $.inArray(scope_constant, CURRENT_DOMAIN_USER.scopes) != -1)
			return options.fn(this);

		return options.inverse(this);
	});

	/**
	 * Helps to check the permission of the user based on the ACL.
	 */
	Handlebars.registerHelper("hasMenuScope", function(scope_constant, options)
	{
		if (CURRENT_DOMAIN_USER.menu_scopes && $.inArray(scope_constant, CURRENT_DOMAIN_USER.menu_scopes) != -1)
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper("canSyncContacts", function(options)
	{
		if (canImportContacts())
			return options.fn(this);

		return options.inverse(this);
	});

	/**
	 * To check Access controls for showing icons on dashboard
	 */
	Handlebars.registerHelper('hasMenuScope', function(item, options)
	{
		if ((CURRENT_DOMAIN_USER.menu_scopes).indexOf(item) != -1)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('fetchXeroUser', function(data)
	{
		return JSON.parse(data).xeroemail;
	});

	Handlebars.registerHelper('getfbreturndomain', function(data)
	{
		var arr = window.location.href.split('/')
		return arr[2];
	});

	Handlebars
			.registerHelper(
					'tagManagementCollectionSetup',
					function(tags)
					{

						console.log(tags);
						var json = {};

						var keys = [];
						// Store tags in a json, starting letter as key
						for (var i = 0; i < tags.length; i++)
						{
							var tag = tags[i].tag;
							var key = tag.charAt(0).toUpperCase();
							// console.log(tag);
							if (jQuery.inArray(key, keys) == -1)
								keys.push(key);
						}

						console.log(keys);
						var html_temp = "";

						for (var i = 0; i < keys.length; i++)
							


							html_temp += "<div class='row b-b p-b-md'><div class='col-md-1 p-t' style='font-size:16px;padding-top:20px;'>" + keys[i] + "</div><div class='col-md-10'><div tag-alphabet=\"" + encodeURI(keys[i]) + "\"><ul class=\"tags-management tag-cloud\" style=\"list-style:none;\"></ul></div></div></div>";

						console.log(html_temp);
						return new Handlebars.SafeString(html_temp);
					});

	Handlebars.registerHelper('containsScope', function(item, list, options)
	{
		if (list.length == 0 || !item)
			return options.inverse(this);

		if (jQuery.inArray(item, list) == -1)
			return options.inverse(this);

		return options.fn(this);

	});

	Handlebars.registerHelper('isOwnerOfContact', function(owner_id, options)
	{

		if (CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('canEditContact', function(owner_id, options)
	{
		if (canEditContact(owner_id))
			return options.fn(this);

		return options.inverse(this)
	});

	Handlebars.registerHelper('canEditCurrentContact', function(owner_id, options)
	{
		if (canEditCurrentContact())
			return options.fn(this);

		return options.inverse(this)
	})

	Handlebars.registerHelper('gateway_exists', function(value, target, options)
	{

		for (var i = 0; i < target.length; i++)
		{

			var prefs = JSON.parse(target[i].prefs);

			if (target[i].name == "EmailGateway")
			{

				if (prefs.email_api == value)
					return options.fn(target[i]);
			}

			if (target[i].name == "SMS-Gateway")
			{
				if (prefs.sms_api == value)
					return options.fn(target[i]);
			}
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper("each_index_slice", function(array, index, options)
	{
		var buffer = "";
		for (var i = index; i < array.length; i++)
		{
			var item = array[i];

			// stick an index property onto the item, starting with 1, may make
			// configurable later
			// item.index = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	Handlebars.registerHelper('gateway_exists', function(value, target, options)
	{

		for (var i = 0; i < target.length; i++)
		{

			var prefs = JSON.parse(target[i].prefs);

			if (target[i].name == "EmailGateway")
			{

				if (prefs.email_api == value)
					return options.fn(target[i]);
			}

			if (target[i].name == "SMS-Gateway")
			{
				if (prefs.sms_api == value)
					return options.fn(target[i]);
			}
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('isOwnerOfContact', function(owner_id, options)
	{

		if (CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('canEditContact', function(owner_id, options)
	{
		if ((hasScope('UPDATE_CONTACTS') || hasScope('DELETE_CONTACTS')) || CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);

		return options.inverse(this)
	});

	Handlebars.registerHelper('getAccountPlanName', function(plan_name)
	{
		if (!plan_name)
			return "Free";

		var plan_fragments = plan_name.split("_");

		return ucfirst(plan_fragments[0]);

	});

	Handlebars.registerHelper('getFullAccountPlanName', function(plan_name)
	{
		if (!plan_name)
			return "Free";

		var plan_fragments = plan_name.split("_");

		return ucfirst(plan_fragments[0])+" ("+ucfirst(plan_fragments[1])+")";

	});

	Handlebars.registerHelper('getAccountPlanInteval', function(plan_name)
	{
		if (!plan_name)
			return "Monthly";

		var plan_fragments = plan_name.split("_");

		return ucfirst(plan_fragments[1]);

	});		

	Handlebars.registerHelper('getSubscriptionBasedOnPlan', function(customer, plan, options)
	{
		var subscription = getSubscriptionWithAmount(customer, plan);

		if (subscription != null)
			return options.fn(subscription);

		return options.inverse(this);
	});

	// handling with iso date
	Handlebars.registerHelper("iso_date_to_normalizeDate", function(dateString)
	{

		/*
		 * var myDate = new Date(dateString); var timestamp = myDate.getTime();
		 * var d = new Date(parseInt(timestamp) / 1000).format("dd-MM-yyyy");
		 * return d;
		 */
		if (dateString.length <= 0)
			return;
		var arr = dateString.split("T");
		console.log("normalize date " + arr[0]);
		// var d = new Date(arr[0]).format("dd-MM-yyyy");
		return arr[0];

	});

	/**
	 * Index starts from 1
	 */
	Handlebars.registerHelper("getMonthFromIndex", function(month_index)
	{
		var monthArray = [
				"January", "february", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		];
		if (month_index > 12)
			return monthArray[11];

		return monthArray[month_index - 1];
	});

	Handlebars.registerHelper('xeroOrganisationShortCode', function(block)
	{
		if (typeof SHORT_CODE == "undefined" || SHORT_CODE == "")
		{
			return false;
		}
		else
		{
			return SHORT_CODE;
		}
	});
	Handlebars.registerHelper('if_id', function(ctype, options)
	{
		if (this.type == ctype)
		{
			return options.fn(this);
		}
	});

	/**
	 * extract time from epochTime
	 */
	Handlebars.registerHelper("getTime", function(date)
	{

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();
			if (hours > 12)
				hours = hours - 12;
			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			return hours + ":" + min + " " + ampm;
		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		if (hours > 12)
			hours = hours - 12;
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		return hours + ":" + min + " " + ampm;

	});

	/**
	 * get custom date with time
	 */

	Handlebars.registerHelper("getCustomDateWithTime", function(start, end)
	{
		var day1 = getDay(start);
		var day2 = getDay(end);

		var d1 = getCustomFormatedDate(start);
		var d2 = getCustomFormatedDate(end);
		var time = extractTimeFromDate(end);

		if (day1 != day2)
			return d1 + " - " + d2;
		else
			return d1 + " - " + time;

	});

	function getCustomFormatedDate(date)
	{

		var months = [
				'Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
		];

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();
			var year = d.getFullYear();
			var date = d.getDate();
			var month = d.getMonth();
			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			if (hours > 12)
				hours = hours - 12;
			return months[month] + " " + date + ", " + year + " " + hours + ":" + min + " " + ampm;

		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		var year = d.getFullYear();
		var date = d.getDate();
		var month = d.getMonth();
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		if (hours > 12)
			hours = hours - 12;
		return months[month] + " " + date + ", " + year + " " + hours + ":" + min + " " + ampm;

	}
	function extractTimeFromDate(date)
	{
		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();

			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			if (hours > 12)
				hours = hours - 12;
			return hours + ":" + min + " " + ampm;
		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		if (hours > 12)
			hours = hours - 12;
		return hours + ":" + min + " " + ampm;
	}

	function getDay(date)
	{
		if ((date / 100000000000) > 1)
		{
			var sDate = new Date(parseInt(date));
			return sDate.getDate();
		}
		else
		{
			var sDate = new Date(parseInt(date) * 1000);
			return sDate.getDate();
		}
	}

	Handlebars.registerHelper('buildOptions', function(field_data)
	{
		var list_values = field_data.split(";");
		var list_options = '';
		// Create options based on list values
		$.each(list_values, function(index, value)
		{
			if (value != "")
				list_options = list_options.concat('<option value="' + value + '">' + value + '</option>');
		});

		return list_options;
	});

	Handlebars.registerHelper('address_Template', function(properties)
	{

		for (var i = 0, l = properties.length; i < l; i++)
		{

			if (properties[i].name == "address")
			{
				var el = '';

				var address = {};
				try
				{
					address = JSON.parse(properties[i].value);
				}
				catch (err)
				{
					address['address'] = properties[i].value;
				}

				// Gets properties (keys) count of given json
				// object
				var count = countJsonProperties(address);

				$.each(address, function(key, val)
				{
					if (--count == 0)
					{
						el = el.concat(val + ".");
						return;
					}
					el = el.concat(val + ", ");
				});
				/*
				 * if (properties[i].subtype) el = el.concat(" <span
				 * class='label'>" + properties[i].subtype + "</span>");
				 */

				return new Handlebars.SafeString(el);
			}
		}
	});

	// To show related to contacts for contacts as well as companies
	Handlebars.registerHelper('related_to_contacts', function(data, options)
	{
		var el = "";
		var count = data.length;
		$.each(data, function(key, value)
		{
			var html = getTemplate("related-to-contacts", value);
			if (--count == 0)
			{
				el = el.concat(html);
				return;
			}
			el = el.concat(html + ", ");
		});
		return new Handlebars.SafeString(el);
	});

	// To show only one related to contacts or companies in deals
	Handlebars.registerHelper('related_to_one', function(data, options)
	{
		// return "<span>" + getTemplate("related-to-contacts", data[0]) +
		// "</span>";
		var el = "";
		var count = data.length;
		$.each(data, function(key, value)
		{
			if (key <= 3)
			{
				var html = getTemplate("related-to-contacts", value);
				if (--count == 0 || key == 3)
				{
					el = el.concat(html);
					return;
				}
				el = el.concat(html + ", ");
			}

		});
		return new Handlebars.SafeString(el);

	});

	/**
	 * To represent a number with commas in deals
	 */
	Handlebars.registerHelper('numberWithCommas', function(value)
	{
		if (value)
			return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
	});

	/**
	 * Converts reports/view field element as comma seprated values and returns
	 * as handlebars safe string.
	 */
	Handlebars.registerHelper('field_Element', function(properties)
	{
		var el = "";
		var count = properties.length;

		$.each(properties, function(key, value)
		{

			if (value.indexOf("properties_") != -1)
				value = value.split("properties_")[1];
			else if (value.indexOf("custom_") != -1)
				value = value.split("custom_")[1];
			else if (value.indexOf("CUSTOM_") != -1)
				value = value.split("CUSTOM_")[1];
			else if (value == "created_time")
				value = "Created Date";
			else if (value == "updated_time")
				value = "Updated Date";

			value = value.replace("_", " ");

			if (--count == 0)
			{
				el = el.concat(value);
				return;
			}
			el = el.concat(value + ", ");
		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Converts string to JSON
	 */
	Handlebars.registerHelper('stringToJSON', function(object, key, options)
	{
		console.log(object);
		console.log(key);
		if (key)
		{
			try
			{

				object[key] = JSON.parse(object[key]);
			}
			finally
			{
				return options.fn(object[key]);
			}
		}

		try
		{
			return options.fn(JSON.parse(object));
		}
		catch (err)
		{
			return options.fn(object);
		}
	});

	/**
	 * Checks the existence of property name and prints value
	 */
	Handlebars.registerHelper('if_propertyName', function(pname, options)
	{
		for (var i = 0; i < this.properties.length; i++)
		{
			if (this.properties[i].name == pname)
				return options.fn(this.properties[i]);
		}
		return options.inverse(this);
	});

	/*
	 * Gets company image from a contact object.
	 * 
	 * --If image uploaded, returns that ( the frame size requested ). --Else if
	 * url present, fetch icon from the url via Google S2 service (frame
	 * size=32x32) --Else return img/company.png ( the frame size requested ).
	 * 
	 * --CSS for frame is adjusted when fetching from url ( default padding =
	 * 4px , now 4+adjust ). --'onError' is an attribute (js function) fired
	 * when image fails to download, maybe due to remote servers being down It
	 * defaults to img/company.png which should be present in server as static
	 * file
	 * 
	 * Usage: e.g. <img {{getCompanyImage "40" "display:inline"}} class="..."
	 * ... >
	 * 
	 * This helper sets src,onError & style attribute. "40" is full frame size
	 * requested. Additional styles like "display:inline;" or "display:block;"
	 * can be specified in 2nd param.
	 * 
	 * @author Chandan
	 */
	Handlebars
			.registerHelper(
					'getCompanyImage',
					function(frame_size, additional_style)
					{

						var full_size = parseInt(frame_size); // size
						// requested,full
						// frame
						var size_diff = 4 + ((full_size - 32) / 2); // calculating
						// padding,
						// for small
						// favicon
						// 16x16 as
						// 32x32,
						// fill rest frame with padding

						// default when we can't find image uploaded or url to
						// fetch from
						var default_return = "src='"+updateImageS3Path('img/company.png')+"' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + "'";

						// when the image from uploaded one or favicon can't be
						// fetched, then show company.png, adjust CSS ( if style
						// broken by favicon ).
						var error_fxn = "";

						for (var i = 0; i < this.properties.length; i++)
						{
							if (this.properties[i].name == "image")
							{
								default_return = "src='" + this.properties[i].value + "' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + ";'";
								// found uploaded image, break, no need to
								// lookup url

								error_fxn = "this.src='"+updateImageS3Path('img/company.png')+"'; this.onerror=null;";
								// no need to resize, company.png is of good
								// quality & can be scaled to this size

								break;
							}
							if (this.properties[i].name == "url")
							{
								default_return = "src='https://www.google.com/s2/favicons?domain=" + this.properties[i].value + "' " + "style='width:" + full_size + "px; height=" + full_size + "px; padding:" + size_diff + "px; " + additional_style + " ;'";
								// favicon fetch -- Google S2 Service, 32x32,
								// rest padding added

								error_fxn = "this.src='"+updateImageS3Path("img/company.png")+"'; " + "$(this).css('width','" + frame_size + "px'); $(this).css('height','" + frame_size + "px');" + "$(this).css('padding','4px'); this.onerror=null;";
								// resize needed as favicon is 16x16 & scaled to
								// just 32x32, company.png is adjusted on error
							}
						}
						// return safe string so that our html is not escaped
						return new Handlebars.SafeString(default_return + " onError=\"" + error_fxn + "\"");
					});

	/**
	 * Get appropriate link i.e. protocol://whatever.xxx. If no protocol
	 * present, assume http
	 */
	Handlebars.registerHelper('getHyperlinkFromURL', function(url)
	{
		if (url.match(/((http|http[s]|ftp|file):\/\/)/) != null)
			return url;
		return 'http://' + url;
	});

	Handlebars.registerHelper('getSkypeURL', function(url)
	{
		if (url.match("skype:") != null)
			return url;
		return 'skype:' + url;
	});

	Handlebars.registerHelper('getFacebookURL', function(url)
	{
		return url.replace('@', '');
	});

	// Get Count
	Handlebars.registerHelper('count', function()
	{
		return getCount(this);
	});

	Handlebars
			.registerHelper(
					'contacts_count',
					function()
					{
						var count_message;
						if (this[0] && this[0].count && (this[0].count != -1))
						{

							if (this[0].count > 9999 && (_agile_get_prefs('contact_filter') || _agile_get_prefs('dynamic_contact_filter')))
								count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: -5px">' + '<img border="0" src="'+updateImageS3Path("/img/help.png")+'"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';

							else
								count_message = "<small> (" + this[0].count + " Total) </small>";
						}
						else
							count_message = "<small> (" + this.length + " Total) </small>";

						return new Handlebars.SafeString(count_message);
					});

	Handlebars.registerHelper('duplicate_contacts_count', function()
	{
		var count_message;
		if (this[0] && this[0].count && (this[0].count != -1))
		{
			var count = this[0].count - 1;
			count_message = "<small> (" + count + " Total) </small>";
		}
		else
			count_message = "<small> (" + this.length + " Total) </small>";

		return new Handlebars.SafeString(count_message);
	});

	/**
	 * 
	 * Returns subscribers count without parenthesis
	 * 
	 */
	Handlebars.registerHelper('subscribers_count', function()
	{

		if (this[0] && this[0].count && (this[0].count != -1))
			return this[0].count;

		return this.length;

	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toLowerCase', function(value)
	{
		if (!value)
			return;
		return value.toLowerCase();
	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toUpperCase', function(value)
	{
		if (!value)
			return;
		return value.toUpperCase();
	});

	/**
	 * Executes template, based on contact type (person or company)
	 */
	Handlebars.registerHelper('if_contact_type', function(ctype, options)
	{
		if (this.type == ctype)
		{
			return options.fn(this);
		}
	});

	/**
	 * Executes template, based on contact type (person or company)
	 */
	Handlebars.registerHelper('collection_contact_type', function(ctype, options)
	{

		if (this && this[0] && this[0].type == ctype)
			return options.fn(this);

	});

	Handlebars.registerHelper('wrap_entity', function(item, options)
	{

		if (item)
			return options.fn(item);
	});

	/**
	 * Returns modified message for timeline logs
	 */
	Handlebars.registerHelper('tl_log_string', function(string)
	{

		return string.replace("Sending email From:", "Email sent From:");
	});

	/**
	 * Returns "Lead Score" of a contact, when it is greater than zero only
	 */
	Handlebars.registerHelper('lead_score', function(value)
	{
		if (this.lead_score > 0)
			return this.lead_score;
		else
			return "";
	});

	/**
	 * Returns task completion status (Since boolean false is not getting
	 * printed, converted it into string and returned.)
	 */
	Handlebars.registerHelper('task_status', function(status)
	{
		if (status)
			return true;

		// Return false as string as the template can not print boolean false
		return "false";

	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_equals', function(value, target, options)
	{

		/*
		 * console.log("typeof target: " + typeof target + " target: " +
		 * target); console.log("typeof value: " + typeof value + " value: " +
		 * value);
		 */
		/*
		 * typeof is used beacuse !target returns true if it is empty string,
		 * when string is empty it should not go undefined
		 */
		if ((typeof target === "undefined") || (typeof value === "undefined"))
			return options.inverse(this);

		if (value && (value.toString().trim() == target.toString().trim()))
			return options.fn(this);
		else
			return options.inverse(this);
	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_hasWriteAccess', function(options){

		var status = false;
		// Retrieves widget which is fetched using script API
		var stripe_widget = agile_crm_get_widget("Stripe");
		if(stripe_widget != undefined){

			if (stripe_widget.prefs != undefined)
			{			
				// Parse string Stripe widget preferences as JSON
				var stripe_widget_prefs = JSON.parse(stripe_widget.prefs);
				var scope = stripe_widget_prefs.scope;				
				if(scope == "read_write"){					
					status = true;
				}
			}
		}

		if(status){
			return options.fn(this);			
		}else{			
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('if_not_equals', function(value, target, options)
	{

		if ((typeof target === "undefined") || (typeof value === "undefined"))
			return options.inverse(this);

		if (value.toString().trim() != target.toString().trim())
			return options.fn(this);
		else
			return options.inverse(this);
	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 * working as greater than or equal to
	 */
	Handlebars.registerHelper('if_greater', function(value, target, options)
	{
		if (parseInt(target) > value)
			return options.inverse(this);
		else
			return options.fn(this);
	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_less_than', function(value, target, options)
	{
		if (target < value)
			return options.inverse(this);
		else
			return options.fn(this);
	});

	Handlebars.registerHelper('if_keyboard_shortcuts_enabled', function(options)
	{
		if (CURRENT_USER_PREFS.keyboard_shotcuts)
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('campaigns_heading', function(value, options)
	{
		var val = 0;
		if (value && value[0] && value[0].count)
			val = value[0].count;

		if (val <= 20)
			return "Workflows";

		return "(" + val + " Total)";
	});

	/**
	 * Adds Custom Fields to forms, where this helper function is called
	 */
	Handlebars.registerHelper('show_custom_fields', function(custom_fields, properties)
	{

		var el = show_custom_fields_helper(custom_fields, properties);
		return new Handlebars.SafeString(fill_custom_field_values($(el), properties));

	});

	Handlebars.registerHelper('is_link', function(value, options)
	{

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		if (value.search(exp) != -1)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('show_link_in_statement', function(value)
	{

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		try
		{
			value = value.replace(exp, "<a href='$1' target='_blank' class='cd_hyperlink'>$1</a>");
			return new Handlebars.SafeString(value);
		}
		catch (err)
		{
			return value;
		}

	});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('displayPlan', function(value)
	{

		return ucfirst(value).replaceAll("_", " ");

	});

	/**
	 * Returns plain text removes underscore from text
	 */
	Handlebars.registerHelper('displayPlainText', function(value)
	{

		return ucfirst(value).replace("_", " ");

	});

	Handlebars.registerHelper('getCurrentContactProperty', function(value)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return getPropertyValue(contact_properties, value);
		}
	});

	Handlebars.registerHelper('safe_string', function(data)
	{

		data = data.replace(/\n/, "<br/>");
		return new Handlebars.SafeString(data);
	});

	Handlebars.registerHelper('string_to_date', function(format, date)
	{

		return new Date(date).format(format);
	});

	Handlebars.registerHelper('isArray', function(data, options)
	{
		if (isArray(data))
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('is_string', function(data, options)
	{
		if (typeof data == "string")
			return options.fn(this);
		return options.inverse(this);

	});

	Handlebars.registerHelper("bindData", function(data)
	{

		return JSON.stringify(data);
	});

	Handlebars.registerHelper("getCurrentUserPrefs", function(options)
	{
		/*if (CURRENT_USER_PREFS)
			;
		return options.fn(CURRENT_USER_PREFS);*/
	});

	Handlebars.registerHelper("getCurrentDomain", function(options)
	{

		var url = window.location.host;

		var exp = /(\.)/;

		if (url.search(exp) >= 0)
			return url.split(exp)[0];

		return " ";
	});

	// Gets date in given range
	Handlebars.registerHelper('date-range', function(from_date_string, no_of_days, options)
	{
		var from_date = Date.parse(from_date_string);
		var to_date = Date.today().add({ days : parseInt(no_of_days) });
		return to_date.toString('MMMM d, yyyy') + " - " + from_date.toString('MMMM d, yyyy');

	});

		Handlebars.registerHelper('month-range', function(options)
	{
		var from_date = Date.today().moveToFirstDayOfMonth();
		var to_date = Date.today().moveToLastDayOfMonth();
		return from_date.toString('MMMM d, yyyy') + " - " + to_date.toString('MMMM d, yyyy');

	});

	Handlebars.registerHelper("extractEmail", function(content, options)
	{

		console.log(content);

		return options.fn(content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0]);
	});

	Handlebars.registerHelper('if_keyboard_shortcuts_enabled', function(options)
	{
		/*if (CURRENT_USER_PREFS.keyboard_shotcuts)
			return options.fn(this);
		return options.inverse(this);*/
	});

	Handlebars.registerHelper('getCurrentContactPropertyBlock', function(value, options)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return options.fn(getPropertyValue(contact_properties, value));
		}
	});

	Handlebars.registerHelper('containString', function(value, target, options)
	{
		if (target.search(value) != -1)
			return options.fn(this);

		return options.inverse(this);
	});
	Handlebars.registerHelper('is_emailPlan', function(planId, options)
	{

		if (planId.search("email") != -1)
			return options.fn(this);

		return options.inverse(this);

	});
	Handlebars.registerHelper('is_userPlan', function(planId, options)
	{
		if (planId.search("email") != -1)
			return options.inverse(this);
		return options.fn(this);

	});

	Handlebars.registerHelper('numeric_operation', function(operand1, operand2, operator)
	{

		var operators = "/*-+";

		if (operators.indexOf(operator) == -1)
			return "";

		if (operator == "+")
			return operand1 + operand2;

		if (operator == "-")
			return operand1 - operand2;

		if (operator == "*")
			return operand1 * operand2;

		if (operator == "/")
			return operand1 / operand2;
	});
	Handlebars.registerHelper('get_total_amount', function(operand1, operand2)
	{

		return (operand1 / 100) * operand2;
	});

	Handlebars.registerHelper('check_length', function(content, length, options)
	{

		if (parseInt(content.length) > parseInt(length))
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper('check_json_length', function(content, length, options)
	{
		var json_length = 0;
		for ( var prop in content)
		{
			json_length++;
		}

		if (json_length == parseInt(length))
		{
			for ( var prop in content)
			{
				return options.fn({ property : prop, value : content[prop], last : true });
			}
		}

		return options.inverse(content);
	});

	Handlebars.registerHelper('iterate_json', function(context, options)
	{
		var result = "";
		var count = 0;
		var length = 0;
		for ( var prop in context)
		{
			length++;
		}

		for ( var prop in context)
		{
			count++;
			if (count == length)
				result = result + options.fn({ property : prop, value : context[prop], last : true });
			else
				result = result + options.fn({ property : prop, value : context[prop], last : false });

		}

		console.log(result);
		return result;
	});

	Handlebars.registerHelper('get_social_icon', function(name)
	{
		return get_social_icon(name);

	});

	Handlebars.registerHelper("each_with_index", function(array, options)
	{
		var buffer = "";
		for (var i = 0, j = array.length; i < j; i++)
		{
			var item = array[i];

			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item.index = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	Handlebars.registerHelper('if_json', function(context, options)
	{

		try
		{
			var json = $.parseJSON(context);

			if (typeof json === 'object')
				return options.fn(this);
			return options.inverse(this);
		}
		catch (err)
		{
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('add_tag', function(tag)
	{
		addTagAgile(tag);
	});

	Handlebars.registerHelper('set_up_dashboard_padcontent', function(key)
	{
		return new Handlebars.SafeString(getTemplate("empty-collection-model", CONTENT_JSON.dashboard[key]));
	});

	/**
	 * Removes surrounded square brackets
	 */
	Handlebars.registerHelper('removeSquareBrackets', function(value)
	{
		return value.replace(/[\[\]]+/g, '');
	});

	/**
	 * Removes "" with single quotes brackets
	 */
	Handlebars.registerHelper('removeDoubleCoutes', function(value)
	{
		var strings = value.replace(/[\[\]]+/g, '');
		var charwithsinglequote = strings.replace(/"/g, "'");
		return charwithsinglequote;
	});

	/**
	 * Shows list of triggers separated by comma
	 */
	Handlebars.registerHelper('toLinkTrigger', function(context, options)
	{
		var ret = "";
		for (var i = 0, j = context.length; i < j; i++)
		{
			ret = ret + options.fn(context[i]);

			// Avoid comma appending to last element
			if (i < j - 1)
			{
				ret = ret + ", ";
			}
			;
		}
		return ret;
	});

	// Gets minutes from milli seconds
	Handlebars.registerHelper('millSecondsToMinutes', function(timeInMill)
	{
		if (isNaN(timeInMill))
			return;
		var sec = timeInMill / 1000;
		var min = Math.floor(sec / 60);

		if (min < 1)
			return Math.ceil(sec) + " secs";

		var remainingSec = Math.ceil(sec % 60);

		return min + " mins, " + remainingSec + " secs";
	});

	Handlebars.registerHelper('if_overflow', function(content, div_height, options)
	{

		if (!content)
			return;

		console.log($('#Linkedin').width());
		content = content.trim();
		var element = $("<div style='width:" + $('#Linkedin').width() + "px;" + "word-break:normal;word-wrap:break-word;display:none;'>" + content + "</div>");

		$("#content").append(element);

		console.log(element.height() + " " + parseInt(div_height))
		if (element.height() > parseInt(div_height))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * To set up star rating in contacts listing
	 */
	Handlebars.registerHelper('setupRating', function(value)
	{

		var element = "";
		for (var i = 0; i < 5; i++)
		{
			if (i < parseInt(value))
			{
				element = element.concat('<li style="display: inline;"><img src="'+updateImageS3Path("img/star-on.png")+'" alt="' + i + '"></li>');
				continue;
			}
			element = element.concat('<li style="display: inline;"><img src="'+updateImageS3Path("img/star-off.png")+'" alt="' + i + '"></li>');
		}
		return new Handlebars.SafeString(element);
	});

	/**
	 * Builds options to be shown in the table heading of CSV import. Also tries
	 * to match headings in select field
	 */
	Handlebars.registerHelper('setupCSVUploadOptions', function(type, key, context)
	{
		// console.log(context.toJSON());
		var template;
		if (type == "contacts")
		{
			getTemplate('csv_upload_options', context, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
		    	template = $(template_ui);
				
			}, null);

		}
		else if (type == "company")
		{
			getTemplate('csv_companies_upload_options', context, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
		    	template = $(template_ui);
				
			}, null);
		}
		else if (type == "deals")
		{
			getTemplate('csv_deals_options', context, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
		    	template = $(template_ui);
				
			}, null);
		}

		// Replaces _ with spaces
		key = key.replace("_", " ");

		var isFound = false;

		var match_weight = 0;

		var key_length = key.length;
		var key = key.toLowerCase();
		var matched_value;

		var selected_element;
		template.find('option').each(function(index, element)
		{
			if ($(element).text().toLowerCase().indexOf(key) != -1)
			{

				var current_match_weight = key_length / $(element).text().length;
				if (match_weight >= current_match_weight)
					return;

				selected_element = $(element);
				matched_value = $(element).text();
				match_weight = current_match_weight;
			}
		})

		console.log(matched_value + ", " + key + " : " + match_weight);

		for (var i = 0; i < key.length - 3; i++)
		{
			template.find('option').each(function(index, element)
			{
				if ($(element).text().toLowerCase().indexOf(key.substr(0, key.length - i).toLowerCase()) != -1)
				{
					console.log(key.substr(0, key.length - i) + " , " + $(element).text());
					var current_match_weight = key.substr(0, key.length - i).length / $(element).text().length;
					console.log(current_match_weight);
					if (match_weight >= current_match_weight)
						return;
					selected_element = $(element);
					matched_value = $(element).text();
					match_weight = current_match_weight;
				}
			})
		}

		$(selected_element).attr("selected", true);

		/*
		 * // Iterates to create various combinations and check with the header
		 * for ( var i = 0; i < key.length - 3; i++) {
		 * template.find('option').each(function(index, element) { if
		 * ($(element).val().toLowerCase().indexOf(key) != -1) { isFound = true;
		 * $(element).attr("selected", true); return false; } else if
		 * ($(element).val().toLowerCase().indexOf(key.substr(0, key.length -
		 * i).toLowerCase()) != -1) { isFound = true;
		 * $(element).attr("selected", true); return false; }
		 * 
		 * }); if (isFound) break; }
		 */
		return new Handlebars.SafeString($('<div>').html(template).html());
	});

	/**
	 * Converts total seconds into hours, minutes and seconds. For e.g. 3600
	 * secs - 1hr 0 mins 0secs
	 */
	Handlebars.registerHelper('convertSecondsToHour', function(totalSec)
	{
		var hours = parseInt(totalSec / 3600) % 24;
		var minutes = parseInt(totalSec / 60) % 60;
		var seconds = totalSec % 60;

		// show only seconds if hours and mins are zero
		if (hours == 0 && minutes == 0)
			return (seconds + "s");

		// show mins and secs if hours are zero.
		if (hours == 0)
			return (minutes + "m ") + (seconds + "s");

		var result = (hours + "h ") + (minutes + "m ") + (seconds + "s");
		return result;
	});

	/**
	 * To check and return value of original referrer
	 */
	Handlebars.registerHelper('checkOriginalRef', function(original_ref)
	{
		if (!getCurrentContactProperty(original_ref))
			return "unknown";

		var url = getCurrentContactProperty(original_ref);

		url = url.split('/');
		url = (url[0] + '//' + url[2]);
		return new Handlebars.SafeString(
				'<a style="text-decoration: none" target="_blank" href="' + getCurrentContactProperty(original_ref) + '">' + url + '</a>');
	});

	/**
	 * To check google url and key words
	 */
	Handlebars.registerHelper('queryWords', function(original_ref)
	{
		// Check if original referrer exists
		if (getCurrentContactProperty(original_ref))
		{
			// Get input url from contact properties and initialize reference
			// url
			var inputUrl = getCurrentContactProperty(original_ref);
			var referenceUrl = 'www.google.';

			// Get host from input url and compare with reference url if equal
			var tempUrl = inputUrl.split('/');
			tempUrl = tempUrl[2].slice(0, 11);
			if (tempUrl === referenceUrl)
			{
				// Get search term from input url
				var parser = document.createElement('a');
				parser.href = inputUrl;
				var search = parser.search;

				// If search term exists, check if 'q' parameter exists, and
				// return its value
				if (search.length > 1)
				{
					search = search.split('&');
					var length = search.length;
					for (var i = 0; i < length; i++)
					{
						if (search[i].indexOf('q=') != -1)
						{
							search = search[i].split('=');
							return new Handlebars.SafeString('( Keyword : ' + search[1].split('+').join(" ") + ' )');
						}
					}
				}
			}
			else
				return;
		}
	});

	/**
	 * Returns contact full name if last-name exists, otherwise only first_name
	 * for contact type PERSON. It returns company name for other contact type.
	 * 
	 */
	Handlebars.registerHelper('contact_name', function(properties, type)
	{

		if (type === 'PERSON')
		{
			for (var i = 0; i < properties.length; i++)
			{

				// if last-name exists, return full name.
				if (properties[i].name === "last_name")
					return (getPropertyValue(properties, "first_name") + " " + properties[i].value);

				else if (properties[i].name === "first_name")
					return properties[i].value;
			}

			return "Contact";
		}

		// COMPANY type
		for (var i = 0; i < properties.length; i++)
		{
			if (properties[i].name === "name")
				return properties[i].value;
		}
		return "Company";
	});

	/**
	 * Returns full name of contact. Use this when empty value is not
	 * acceptable. Takes care that, even when no names are defined, returns
	 * email(necessary for PERSON) or Company <id>. Calls function
	 * getContactName defined in agile-typeahead.js. Also typeahead uses this
	 * fxn to append values as tags.
	 */
	Handlebars.registerHelper('contact_name_necessary', function(contact)
	{
		return getContactName(contact);
	});

	/**
	 * To check if string is blank
	 */
	Handlebars.registerHelper('is_blank', function(value, options)
	{
		value = value.trim();

		if (value == "")
			return options.fn(value);
		else
			return options.inverse(value);
	})

	/**
	 * Iterate through list of values (not json)
	 */
	Handlebars.registerHelper("each_with_index1", function(array, options)
	{
		console.log(array);
		var buffer = "";
		for (var i = 0, j = array.length; i < j; i++)
		{
			var item = {};
			item["value"] = array[i];

			console.log(item);
			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item["index"] = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	/**
	 * If log_type equals true otherwise false
	 */
	Handlebars.registerHelper("if_log_type_equals", function(object, key, log_type, options)
	{

		if (object[key] == log_type)
			return options.fn(object);

		return options.inverse(object);

	});

	/**
	 * Identifies EMAIL_SENT campaign-log string and splits the log string based
	 * on '_aGiLeCrM' delimiter into To, From, Subject and Body.
	 * 
	 */
	Handlebars.registerHelper("if_email_sent", function(object, key, options)
	{

		// delimiter for campaign send-email log
		var _AGILE_CRM_DELIMITER = "_aGiLeCrM";

		// if log_type is EMAIL_SENT
		if (object[key] === "EMAIL_SENT")
		{
			// Splits logs message
			var email_fields = object["message"].split(_AGILE_CRM_DELIMITER, 4);

			// Json to apply for handlebar template
			var json = {};

			if (email_fields === undefined)
				return options.inverse(object);

			// Iterates inorder to insert each field into json
			for (var i = 0; i < email_fields.length; i++)
			{
				// Splits based on colon. E.g "To: naresh@agilecrm.com   "
				var arrcolon = email_fields[i].split(":");

				// Inserts LHS of colon as key. E.g., To
				var key = arrcolon[0];
				key = key.trim(); // if key starts with space, it can't
				// accessible

				// Inserts RHS of colon as value. E.g., naresh@agilecrm.com  
				var value = arrcolon.slice(1).join(":"); // join the
				// remaining string
				// based on colon,
				// only first occurence of colon is needed
				value = value.trim();

				json[key] = value;
			}

			// inserts time into json
			json.time = object["time"];

			// apply customized json to template.
			return options.fn(json);
		}

		// if not EMAIL_SENT log, goto else in the template
		return options.inverse(object);

	});

	Handlebars.registerHelper('remove_spaces', function(value)
	{
		if(value)
			  value = value.replace(/ +/g, '');

		return value;

	});

	Handlebars.registerHelper('replace_spaces', function(value)
	{
		if(value)
			  value = value.replace(/ +/g, '_');

		return value;

	});

	/***************************************************************************
	 * Returns campaignStatus object from contact campaignStatus array having
	 * same campaign-id. It is used to get start and completed time from array.
	 **************************************************************************/
	Handlebars.registerHelper('if_same_campaign', function(object, data, options)
	{

		var campaignStatusArray = object[data];

		// if campaignStatus key doesn't exist return.
		if (data === undefined || campaignStatusArray === undefined)
			return;

		// Get campaign-id from hash
		var current_campaign_id = getIdFromHash();

		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{

			// compares campaign-id of each element of array with
			// current campaign-id
			if (campaignStatusArray[i].campaign_id === current_campaign_id)
			{
				// if equal, execute template current json
				return options.fn(campaignStatusArray[i]);
			}
		}

	});

	/**
	 * Returns other active campaigns in campaign-active subscribers.
	 */
	Handlebars.registerHelper('if_other_active_campaigns', function(object, data, options)
	{

		if (object === undefined || object[data] === undefined)
			return;

		var other_campaigns = {};
		var other_active_campaigns = [];
		var other_completed_campaigns = [];
		var campaignStatusArray = object[data];

		var current_campaign_id = getIdFromHash();

		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{
			// neglect same campaign
			if (current_campaign_id === campaignStatusArray[i].campaign_id)
				continue;

			// push all other active campaigns
			if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
				other_active_campaigns.push(campaignStatusArray[i])

				// push all done campaigns
			if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
				other_completed_campaigns.push(campaignStatusArray[i]);
		}

		other_campaigns["active"] = other_active_campaigns;
		other_campaigns["done"] = other_completed_campaigns;

		return options.fn(other_campaigns);

	});

	/**
	 * Returns Contact Model from contactDetailView collection.
	 * 
	 */
	Handlebars.registerHelper('contact_model', function(options)
	{

		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{

			// To show Active Campaigns list immediately after campaign
			// assigned.
			if (CONTACT_ASSIGNED_TO_CAMPAIGN)
			{
				CONTACT_ASSIGNED_TO_CAMPAIGN = false;

				// fetches updated contact json
				var contact_json = $.ajax({ type : 'GET', url : '/core/api/contacts/' + App_Contacts.contactDetailView.model.get('id'), async : false,
					dataType : 'json' }).responseText;

				// Updates Contact Detail model
				App_Contacts.contactDetailView.model.set(JSON.parse(contact_json));

				return options.fn(JSON.parse(contact_json));
			}

			// if simply Campaigns tab clicked, use current collection
			return options.fn(App_Contacts.contactDetailView.model.toJSON());
		}
	});
	

	/**
	 * Verifies given urls length and returns options hash based on restricted
	 * count value.
	 * 
	 */
	Handlebars.registerHelper("if_more_urls", function(url_json, url_json_length, options)
	{
		var RESTRICT_URLS_COUNT = 3;
		var temp_urls_array = [];
		var context_json = {};

		// If length is less than restricted, compile
		// else block with given url_json
		if (url_json_length < RESTRICT_URLS_COUNT)
			return options.inverse(url_json);

		// Insert urls until restricted count reached
		for (var i = 0; i < url_json.length; i++)
		{
			if (i === RESTRICT_URLS_COUNT)
				break;

			temp_urls_array.push(url_json[i]);
		}

		context_json.urls = temp_urls_array;

		// More remained
		context_json.more = url_json_length - RESTRICT_URLS_COUNT;

		return options.fn(context_json);

	});

	Handlebars.registerHelper('safe_tweet', function(data)
	{
		data = data.trim();
		return new Handlebars.SafeString(data);
	});
	/**
	 * Get stream icon for social suite streams.
	 */
	Handlebars.registerHelper('get_stream_icon', function(name)
	{
		if (!name)
			return;

		var icon_json = { "Home" : "icon-home", "Retweets" : "icon-retweet", "DM_Inbox" : "icon-download-alt", "DM_Outbox" : "icon-upload-alt",
			"Favorites" : "icon-star", "Sent" : "icon-share-alt", "Search" : "icon-search", "Scheduled" : "icon-time", "All_Updates" : "icon-home",
			"My_Updates" : "icon-share-alt" };

		name = name.trim();

		if (icon_json[name])
			return icon_json[name];

		return "icon-globe";

	});

	/**
	 * Get task list name without underscore and caps, for new task UI.
	 */
	Handlebars.registerHelper('get_normal_name', function(name)
	{
		if (!name)
			return;

		var name_json = { "HIGH" : "High", "LOW" : "Low", "NORMAL" : "Normal", "YET_TO_START" : "Yet To Start",
			"IN_PROGRESS" : "In Progress", "COMPLETED" : "Completed", "TODAY" : "Today", "TOMORROW" : "Tomorrow", "OVERDUE" : "Overdue", "LATER" : "Later" };

		$.extend(name_json,categories.CATEGORIES,name_json);

		name = name.trim();

		if (name_json[name])
			return name_json[name];

		return name;

	});

	/**
	 * Get activity type without underscore and caps, for deal _details page.
	 */
	Handlebars.registerHelper('get_normal_activity_type', function(name)
	{
		if (!name)
			return;

		var name_json = { "DEAL_ADD" : "Deal Created", "DEAL_EDIT" : "Deal Edited", "DEAL_CLOSE" : "Deal Closed", "DEAL_LOST" : "Deal Lost",
			"DEAL_RELATED_CONTACTS" : " Deal Contacts Changed", "DEAL_OWNER_CHANGE" : "Deal Owner Changed", "DEAL_MILESTONE_CHANGE" : "Deal Milestone Changed",
			"DEAL_ARCHIVE" : "Deal Archived", "DEAL_RESTORE" : "Deal Restored",

			"NOTE_ADD" : "Note Added", "TASK_ADD" : "Task Created", "TASK_EDIT" : "Task Updated", "TASK_PROGRESS_CHANGE" : "Progress Changed",
			"TASK_OWNER_CHANGE" : "Owner Changed", "TASK_STATUS_CHANGE" : "Status Changed", "TASK_COMPLETED" : "Task Completed",
			"TASK_DELETE" : "Task Deleted", "TASK_RELATED_CONTACTS" : "Contacts Modified" };

		name = name.trim();

		if (name_json[name])
			return name_json[name];

		return name;

	});

	/**
	 * put user address location togather separated by comma.
	 */
	Handlebars.registerHelper('user_location', function()
	{

		var City = this.city == "?" ? "" : (this.city + ", ");
		var Region = this.region == "?" ? "" : (this.region + ", ");
		var Country = this.country;
		if (this.city == "?" && this.region == "?")
			Country = this.country == "?" ? this.city_lat_long : (this.city_lat_long + " ( " + this.country + " )");

		return (City + Region + Country).trim();
	});

	/**
	 * Trims trailing spaces
	 */
	Handlebars.registerHelper('trim_space', function(value)
	{

		if (value === undefined)
			return value;

		return value.trim();
	});

	/**
	 * Returns reputation name based on value
	 * 
	 */
	Handlebars
			.registerHelper(
					'get_subaccount_reputation',
					function(value)
					{
						var type = "bg-light dk text-tiny";
						var reputation = "Unknown";

						if (value > 1 && value < 40)
						{
							type = "label-danger text-tiny";
							reputation = "Poor";
						}
						else if (value >= 40 && value < 75)
						{
							type = "bg-light text-tiny";
							reputation = "Ok";
						}
						else if (value >= 75 && value < 90)
						{
							type = "label-success";
							reputation = "Good";
						}
						else if (value >= 90)
						{
							type = "label-success";
							reputation = "Excellent";
						}

						return "<span style='top: -3px' class='text-sm pos-rlt label " + type + "'>" + reputation + "</span> <!--<span class='badge badge-" + type + "'>" + value + "</span>-->";

					});

	/**
	 * Returns id from hash. It returns id from hash iff id exists at last.
	 * 
	 */
	Handlebars.registerHelper('get_id_from_hash', function()
	{

		return getIdFromHash();

	});

	Handlebars.registerHelper('get_subscribers_type_from_hash', function()
	{

		// Returns "workflows" from "#workflows"
		var hash = window.location.hash.substr(1);

		if (hash.indexOf("all") != -1)
			return "All";

		if (hash.indexOf("active") != -1)
			return "Active";

		if (hash.indexOf("completed") != -1)
			return "Completed";

		if (hash.indexOf("removed") != -1)
			return "Removed";

		if (hash.indexOf("unsubscribed") != -1)
			return "Unsubscribed";

		if (hash.indexOf("hardbounced") != -1)
			return "Hard Bounced";

		if (hash.indexOf("softbounced") != -1)
			return "Soft Bounced";

		if (hash.indexOf("spam-reported") != -1)
			return "Spam Reported";
	});

	Handlebars.registerHelper("check_plan", function(plan, options)
	{
		console.log(plan);

		if (!_billing_restriction)
			return options.fn(this);

		if (_billing_restriction.currentLimits.planName == plan)
			return options.fn(this);

		return options.inverse(this);

	});

	/**
	 * Safari browser doesn't supporting few CSS properties like margin-top,
	 * margin-bottom etc. So this helper is used to add compatible CSS
	 * properties to Safari
	 */
	Handlebars.registerHelper("isSafariBrowser", function(options)
	{

		if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
			return options.fn(this);

		return options.inverse(this);
	});

	/**
	 * give custome status base on xerotype
	 */

	Handlebars.registerHelper('xeroType', function(type)
	{
		return (type == "ACCPAY") ? "Payable" : "Receivable";
	});

	/**
	 * give custom type to xero type
	 */
	Handlebars.registerHelper('xeroTypeToolTip', function(type)
	{
		return (type == "ACCPAY") ? "Payable" : "Receivable";
	});

	/**
	 * gives first latter capital for given input
	 */
	Handlebars.registerHelper('capFirstLetter', function(data)
	{
		if(data){
			if (data === "DEFAULT")
			{
				// console.log("return empty");
				return "";
			}
			else
			{
				var temp = data.toLowerCase();
				return temp.charAt(0).toUpperCase() + temp.slice(1);
			}
		}
	});

	Handlebars.registerHelper('qbStatus', function(Balance)
	{
		console.log(this);
		console.log(this.TotalAmt);
		if (Balance == 0)
		{
			return "Paid"
		}
		else
		{
			return "Due"
		}
	});
	Handlebars.registerHelper('currencyFormat', function(data)
	{

		return Number(data).toLocaleString('en');
		// data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	});

	Handlebars.registerHelper('QbDateFormat', function(data)
	{

		var i = [];
		i = data.split("-");
		return i[0] + "-" + i[2] + "-" + i[1];
	});

	Handlebars.registerHelper("hasScope", function(scope_constant, options)
	{
		if (CURRENT_DOMAIN_USER.scopes && $.inArray(scope_constant, CURRENT_DOMAIN_USER.scopes) != -1)
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper("hasMenuScope", function(scope_constant, options)
	{
		if (CURRENT_DOMAIN_USER.menu_scopes && $.inArray(scope_constant, CURRENT_DOMAIN_USER.menu_scopes) != -1)
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper("canSyncContacts", function(options)
	{
		if (canImportContacts())
			return options.fn(this);

		return options.inverse(this);
	});

	/**
	 * To check Access controls for showing icons on dashboard
	 */
	Handlebars.registerHelper('hasMenuScope', function(item, options)
	{
		/*if ((CURRENT_DOMAIN_USER.menu_scopes).indexOf(item) != -1)
			return options.fn(this);
		else
			return options.inverse(this);*/
	});

	Handlebars.registerHelper('fetchXeroUser', function(data)
	{
		return JSON.parse(data).xeroemail;
	});

	Handlebars.registerHelper('isContactType', function(contact_type, contact_type_2, options)
	{
		if (!contact_type && contact_type_2 == 'PERSON')
		{
			return options.fn(this);
		}
		else if (contact_type == contact_type_2)
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper('getfbreturndomain', function(data)
	{
		var arr = window.location.href.split('/')
		return arr[2];
	});

	Handlebars
			.registerHelper(
					'tagManagementCollectionSetup',
					function(tags)
					{

						console.log(tags);
						var json = {};

						var keys = [];
						// Store tags in a json, starting letter as key
						for (var i = 0; i < tags.length; i++)
						{
							var tag = tags[i].tag;
							var key = tag.charAt(0).toUpperCase();
							// console.log(tag);
							if (jQuery.inArray(key, keys) == -1)
								keys.push(key);
						}

						console.log(keys);
						var html_temp = "";

						for (var i = 0; i < keys.length; i++)
							html_temp += "<div class='row b-b p-b-md'><div class='col-md-1' style='font-size:16px;padding-top:20px;'>" + keys[i] + "</div><div class='col-md-10'><div tag-alphabet=\"" + encodeURI(keys[i]) + "\"><ul class=\"tags-management tag-cloud\" style=\"list-style:none;\"></ul></div></div></div>";

						console.log(html_temp);
						return new Handlebars.SafeString(html_temp);
					});

	Handlebars.registerHelper('containsScope', function(item, list, options)
	{
		if (list.length == 0 || !item)
			return options.inverse(this);

		if (jQuery.inArray(item, list) == -1)
			return options.inverse(this);

		return options.fn(this);

	});

	Handlebars.registerHelper('isOwnerOfContact', function(owner_id, options)
	{

		if (CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('canEditContact', function(owner_id, options)
	{
		if (canEditContact(owner_id))
			return options.fn(this);

		return options.inverse(this)
	});

	Handlebars.registerHelper('canEditCurrentContact', function(owner_id, options)
	{
		if (canEditCurrentContact())
			return options.fn(this);

		return options.inverse(this)
	})

	Handlebars.registerHelper('gateway_exists', function(value, target, options)
	{

		for (var i = 0; i < target.length; i++)
		{

			var prefs = JSON.parse(target[i].prefs);

			if (target[i].name == "EmailGateway")
			{

				if (prefs.email_api == value)
					return options.fn(target[i]);
			}

			if (target[i].name == "SMS-Gateway")
			{
				if (prefs.sms_api == value)
					return options.fn(target[i]);
			}
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper("each_index_slice", function(array, index, options)
	{
		var buffer = "";
		for (var i = index; i < array.length; i++)
		{
			var item = array[i];

			// stick an index property onto the item, starting with 1, may make
			// configurable later
			// item.index = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	Handlebars.registerHelper('gateway_exists', function(value, target, options)
	{

		for (var i = 0; i < target.length; i++)
		{

			var prefs = JSON.parse(target[i].prefs);

			if (target[i].name == "EmailGateway")
			{

				if (prefs.email_api == value)
					return options.fn(target[i]);
			}

			if (target[i].name == "SMS-Gateway")
			{
				if (prefs.sms_api == value)
					return options.fn(target[i]);
			}
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('isOwnerOfContact', function(owner_id, options)
	{

		if (CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('canEditContact', function(owner_id, options)
	{
			return options.fn(this);

	});

	Handlebars.registerHelper('getAccountPlanName', function(plan_name)
	{
		if (!plan_name)
			return "Free";

		var plan_fragments = plan_name.split("_");

		return ucfirst(plan_fragments[0]);

	});

	Handlebars.registerHelper('getAccountPlanInteval', function(plan_name)
	{
		if (!plan_name)
			return "Monthly";

		var plan_fragments = plan_name.split("_");

		return ucfirst(plan_fragments[1]);

	});

	Handlebars.registerHelper('getSubscriptionBasedOnPlan', function(customer, plan, options)
	{
		var subscription = getSubscriptionWithAmount(customer, plan);

		if (subscription != null)
			return options.fn(subscription);

		return options.inverse(this);
	});

	// handling with iso date
	Handlebars.registerHelper("iso_date_to_normalizeDate", function(dateString)
	{

		/*
		 * var myDate = new Date(dateString); var timestamp = myDate.getTime();
		 * var d = new Date(parseInt(timestamp) / 1000).format("dd-MM-yyyy");
		 * return d;
		 */
		if (dateString.length <= 0)
			return;
		var arr = dateString.split("T");
		console.log("normalize date " + arr[0]);
		// var d = new Date(arr[0]).format("dd-MM-yyyy");
		return arr[0];

	});

	/**
	 * Index starts from 1
	 */
	Handlebars.registerHelper("getMonthFromIndex", function(month_index)
	{
		var monthArray = [
				"January", "february", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		];
		if (month_index > 12)
			return monthArray[11];

		return monthArray[month_index - 1];
	});

	Handlebars.registerHelper('xeroOrganisationShortCode', function(block)
	{
		if (typeof SHORT_CODE == "undefined" || SHORT_CODE == "")
		{
			return false;
		}
		else
		{
			return SHORT_CODE;
		}
	});

	Handlebars.registerHelper('buildOptions', function(field_data)
	{
		var list_values = field_data.split(";");
		var list_options = '';
		// Create options based on list values
		$.each(list_values, function(index, value)
		{
			if (value != "")
				list_options = list_options.concat('<option value="' + value + '">' + value + '</option>');
		});

		return list_options;
	});

	/**
	 * Choose Avatar templates
	 */
	Handlebars.registerHelper('get_avatars_template', function(options)
	{
		var template = getTemplate("choose-avatar-images-modal", {});

		getTemplate('choose-avatar-images-modal', {}, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
	    	var template = $(template_ui);
			 
		}, null);

		return template;
	});

	// checks if email type is agile or not
	Handlebars.registerHelper('if_email_type_is_agile', function(value, options)
	{
		var type = email_server_type;
		if (type)
			if (value === type)
				return options.fn(this);
			else
				return options.inverse(this);
		else
		{
			return options.fn(this);
		}
	});

	// Reads the gloabal varaible and returns it value
	Handlebars.registerHelper('read_global_var', function()
	{
		var type = email_server_type;
		if (type)
			return type;
		else
		{
			return "agilecrm";
		}
	});
	
	//checks whether current user plan is pro or not.
	Handlebars.registerHelper("if_non_pro_plan", function(options)
	{
		if (!_billing_restriction)
			return options.inverse(this);
		    if (_billing_restriction.currentLimits.planName !== "PRO")
				return options.fn(this);
		return options.inverse(this);
	});
	// Checks whether user reached email accounts(GMAIL/IMAP/OFFICE) limit
	// reached or not
	Handlebars.registerHelper('has_email_account_limit_reached', function(options)
	{
		var type = HAS_EMAIL_ACCOUNT_LIMIT_REACHED;
		if (type)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	// To pick randomly selected avatar url
	Handlebars.registerHelper('pick_random_avatar_url', function(options)
	{
		return choose_random_avatar();
	});

	Handlebars.registerHelper('getRemaininaEmails', function()
	{
		return getPendingEmails();
	});

	Handlebars.registerHelper('getLastPurchasedCount', function()
	{
		var max = getMaxEmailsLimit();
		if(max == 0)
			return "-";
		else
			return getPendingEmails();
	});

	Handlebars.registerHelper('getFreeEmailsCount', function()
	{
		var max = getMaxEmailsLimit();
		if(max == 0)
			return "5000";
		else
			return "-";
	});

	// helper function to return agile bcc special email for inbound mail event
	// trigger
	Handlebars.registerHelper('inboundMail', function()
	{
		var agile_api = $.ajax({ type : 'GET', url : '/core/api/api-key', async : false, dataType : 'json' }).responseText;
		agile_api = JSON.parse(agile_api);
		var inbound_email = window.location.hostname.split('.')[0] + "-" + agile_api.api_key + "@agle.cc";
		return new Handlebars.SafeString(inbound_email);
	});

	/**
	 * ==============================================================
	 * -------------------------- jitendra's start script ---------- Please do
	 * not add any function in this block extract time from epochTime
	 */
	Handlebars.registerHelper("getTime", function(date)
	{

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();
			if (hours > 12)
				hours = hours - 12;
			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			return hours + ":" + min + " " + ampm;
		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		if (hours > 12)
			hours = hours - 12;
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		return hours + ":" + min + " " + ampm;

	});

	/**
	 * get custom date with time
	 */

	Handlebars.registerHelper("getCustomDateWithTime", function(start, end)
	{
		var day1 = getDay(start);
		var day2 = getDay(end);

		var d1 = getCustomFormatedDate(start);
		var d2 = getCustomFormatedDate(end);
		var time = extractTimeFromDate(end);

		if (day1 != day2)
			return d1 + " - " + d2;
		else
			return d1 + " - " + time;

	});

	function getCustomFormatedDate(date)
	{

		var months = [
				'Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
		];

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();
			var year = d.getFullYear();
			var date = d.getDate();
			var month = d.getMonth();
			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			if (hours > 12)
				hours = hours - 12;
			return months[month] + " " + date + ", " + year + " " + hours + ":" + min + " " + ampm;

		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		var year = d.getFullYear();
		var date = d.getDate();
		var month = d.getMonth();
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		if (hours > 12)
			hours = hours - 12;
		return months[month] + " " + date + ", " + year + " " + hours + ":" + min + " " + ampm;

	}
	function extractTimeFromDate(date)
	{
		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();

			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			if (hours > 12)
				hours = hours - 12;
			return hours + ":" + min + " " + ampm;
		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		if (hours > 12)
			hours = hours - 12;
		return hours + ":" + min + " " + ampm;
	}

	function getDay(date)
	{
		if ((date / 100000000000) > 1)
		{
			var sDate = new Date(parseInt(date));
			return sDate.getDate();
		}
		else
		{
			var sDate = new Date(parseInt(date) * 1000);
			return sDate.getDate();
		}
	}
	/**
	 * return contact property value base on type if contact type is COMPANY
	 * then return company name other wise retun contact first_name + last_name
	 * as name
	 */

	Handlebars.registerHelper('getContactDisplayValue', function(contact)
	{
		var displayName;

		var type = contact.type;
		var properties = contact.properties;
		if (properties)
		{
			if (type == "COMPANY")
			{

				for (var i = 0; i < properties.length; i++)
				{
					if (properties[i].name == 'name')
					{
						displayName = properties[i].value;
						break;
					}
				}
			}
			else
			{
				var firstName;
				var lastName;
				for (var i = 0; i < properties.length; i++)
				{
					if (properties[i].name == 'first_name')
					{
						firstName = properties[i].value;

					}

					if (properties[i].name == 'last_name')
					{
						lastName = properties[i].value;

					}

				}
				if (!firstName)
				{
					firstName = '';
				}
				if (!lastName)
				{
					lastName == '';
				}
				displayName = firstName + " " + lastName;
			}
		}
		return displayName;
	});

	// return google event custom date and time

	Handlebars.registerHelper('getGoogleEventCustomTime', function(start, end)
	{
		var startDate = new Date(start);
		var endDate = new Date(end);

		return getGoogleCustomFormatteDate(startDate.getTime(), endDate.getTime());

	});

	function getGoogleCustomFormatteDate(start, end)
	{

		var day1 = getDay(start);
		var day2 = getDay(end);

		var d1 = getCustomFormatedDate(start);
		var d2 = getCustomFormatedDate(end);
		var time = extractTimeFromDate(end);
		var createdTime = getEventCreatedTime(start);
		if (createdTime == 0 || createdTime == 1)
		{
			var t1 = extractTimeFromDate(start);
			var t2 = extractTimeFromDate(end);
			if (t1 && t2)
				return t1 + " - " + t2;
			if (t2)
				return t1 + " - " + t2;
			else
				return t1;
		}
		else
		{

			if (day1 != day2)
			{
				if (d2)
					return d1 + " - " + d2;
				else
					return d1;
			}
			else
				return d1 + " - " + time;
		}
	}

	Handlebars.registerHelper("displayCustomDateTime", function(start, end)
	{
		var eventCreateTime = get_activity_created_time(start);

		var day1 = getDay(start);
		var day2 = getDay(end);

		var d1 = getCustomFormatedDate(start);
		var d2 = getCustomFormatedDate(end);
		var time = extractTimeFromDate(end);
		if (eventCreateTime == 0 || eventCreatedTime == 1)
		{
			return time;
		}
		else
		{
			if (day1 != day2)
				return d1 + " - " + d2;
			else
				return d1 + " - " + time;
		}
	});
	// helper function return created time for event
	function getEventCreatedTime(due)
	{
		// Get Todays Date
		var eventStartDate = new Date(due);
		due = eventStartDate.getTime() / 1000;
		var date = new Date();
		date.setHours(0, 0, 0, 0);

		date = date.getTime() / 1000;
		// console.log("Today " + date + " Due " + due);
		return Math.floor((due - date) / (24 * 3600));
	}

	/**
	 * ------ End of jitendra script------ ======== Thank you =================
	 */

	// To pick randomly selected avatar url
	Handlebars.registerHelper('arrayToCamelcase', function(values)
	{
		var result = '';
		for (var i = 0; i < values.length; i++)
		{
			result += ucfirst(values[i]);
			if (i + 1 < values.length)
				result += ', ';
		}
		return result;
	});

	// To pick randomly selected avatar url
	Handlebars.registerHelper('namesFromObject', function(jsonArray, fieldName)
	{
		var result = '';
		console.log(jsonArray.length);
		for (var i = 0; i < jsonArray.length; i++)
		{
			result += jsonArray[i][fieldName];
			if (i + 1 < jsonArray.length)
				result += ', ';
		}
		return result;
	});

	// @author Purushotham
	Handlebars.registerHelper('secondsToFriendlyTime', function(time)
	{
		var hours = Math.floor(time / 3600);
		if (hours > 0)
			time = time - hours * 60 * 60;
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		var friendlyTime = "";
		if (hours == 1)
			friendlyTime = hours + "h ";
		if (hours > 1)
			friendlyTime = hours + "h ";
		if (minutes > 0)
			friendlyTime += minutes + "m ";
		if (seconds > 0)
			friendlyTime += seconds + "s ";
		if (friendlyTime != "")
			return ' - ' + friendlyTime;
		return friendlyTime;
	});
	// To pick randomly selected avatar url
	Handlebars.registerHelper('pick_random_avatar_url', function(options)
	{
		return choose_random_avatar();
	});

	// To choose font awesome icon for custom fields
	Handlebars.registerHelper('choose_custom_field_font_icon', function(field_type)
	{
		var icon_class = '';
		if (field_type == "TEXT")
			icon_class = "icon-text-height";
		else if (field_type == "TEXTAREA")
			icon_class = "icon-file-alt";
		else if (field_type == "DATE")
			icon_class = "icon-calendar";
		else if (field_type == "CHECKBOX")
			icon_class = "icon-check";
		else if (field_type == "LIST")
			icon_class = "icon-list-ul";
		else if (field_type == "NUMBER")
			icon_class = "icon-text-height";
		return icon_class;
	});

	// To choose font awesome icon for custom fields
	Handlebars.registerHelper('choose_custom_field_type', function(field_type)
	{
		var field_type_name = '';
		if (field_type == "TEXT")
			field_type_name = "Text Field";
		else if (field_type == "TEXTAREA")
			field_type_name = "Text Area";
		else if (field_type == "DATE")
			field_type_name = "Date";
		else if (field_type == "CHECKBOX")
			field_type_name = "Checkbox";
		else if (field_type == "LIST")
			field_type_name = "List";
		else if (field_type == "NUMBER")
			field_type_name = "Number";
		else if (field_type == "FORMULA")
			field_type_name = "Formula";
		return field_type_name;
	});

	// @author Purushotham
	// function to compare integer values
	Handlebars.registerHelper('ifCond', function(v1, type, v2, options)
	{
		switch (type) {
		case "greaterthan":
			if (parseInt(v1) > parseInt(v2))
				return options.fn(this);
			break;
		case "lessthan":
			if (parseInt(v1) < parseInt(v2))
				return options.fn(this);
			break;
		case "equals":
			if (parseInt(v1) === parseInt(v2))
				return options.fn(this);
			break;
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('callActivityFriendlyStatus', function(status, direction)
	{

		switch (status) {
		case "completed":
		case "answered":
		case "inquiry":
		case "interest":
		case "no interest":
		case "incorrect referral":
		case "meeting scheduled":
		case "new oppurtunity":
			return "Call duration";
			break;
		case "busy":
		case "no-answer":
			if (direction == 'outgoing')
				return "Contact busy";
			else
				return "Not answered";
			break;
		case "failed":
			return "Failed";
			break;
		case "missed":
			return "Call Missed";
			break;	
		case "in-progress":
		case "voicemail":
			return "Left voicemail";
			break;
		case "missed":
			return "Call missed";
			break;
		default:
			return "";
		}

	});

	Handlebars.registerHelper('shopifyWebhook', function()
	{
		var agile_api = $.ajax({ type : 'GET', url : '/core/api/api-key', async : false, dataType : 'json' }).responseText;
		agile_api = JSON.parse(agile_api);
		var shopify_webhook = window.location.origin + "/shopifytrigger?api-key=" + agile_api.api_key;
		return new Handlebars.SafeString(shopify_webhook);
	});

	Handlebars.registerHelper('toProperFormat', function(timeInSec)
	{
		if (timeInSec == "0")
			return "0 s";

		return twilioSecondsToFriendly(timeInSec);
	});

	/**
	 * getting convenient name of portlet
	 */
	Handlebars.registerHelper('get_portlet_name', function(p_name)
	{
		var portlet_name = '';
		if (p_name == 'Filter Based')
			portlet_name = 'Contact List';
		else if (p_name == 'Emails Opened')
			portlet_name = 'Email Opens';
		else if (p_name == 'Emails Sent')
			portlet_name = 'Emails';
		else if (p_name == 'Growth Graph')
			portlet_name = 'Tag Graph';
		else if (p_name == 'Calls Per Person')
			portlet_name = 'Calls';
		else if (p_name == 'Pending Deals')
			portlet_name = 'Pending Deals';
		else if (p_name == 'Deals By Milestone')
			portlet_name = 'Deals by Milestone';
		else if (p_name == 'Closures Per Person')
			portlet_name = 'Closures per Person';
		else if (p_name == 'Deals Won')
			portlet_name = 'Deals Won';
		else if (p_name == 'Deals Funnel')
			portlet_name = 'Deals Funnel';
		else if (p_name == 'Deals Assigned')
			portlet_name = 'Deals Assigned';
		else if (p_name == 'Agenda')
			portlet_name = "Events";
		else if (p_name == 'Today Tasks')
			portlet_name = "Tasks";
		else if (p_name == 'Agile CRM Blog')
			portlet_name = "Agile CRM Blog";
		else if (p_name == 'Task Report')
			portlet_name = "Task Report";
		else if(p_name=='Stats Report')
			portlet_name = "Activity Overview";
		else if(p_name=='Campaign stats')
			portlet_name = "Campaign Stats"
		else
			portlet_name = p_name;
		return portlet_name;
	});
	/**
	 * getting portlet icons
	 */
	Handlebars.registerHelper('get_portlet_icon', function(p_name)
	{
		var icon_name = '';
		if (p_name == 'Filter Based')
			icon_name = 'icon-user';
		else if (p_name == 'Emails Opened')
			icon_name = 'icon-envelope';
		else if (p_name == 'Emails Sent')
			icon_name = 'icon-envelope';
		else if (p_name == 'Growth Graph')
			icon_name = 'icon-graph';
		else if (p_name == 'Calls Per Person')
			icon_name = 'icon-call-end';
		else if (p_name == 'Pending Deals')
			icon_name = 'icon-clock';
		else if (p_name == 'Deals By Milestone')
			icon_name = 'icon-flag';
		else if (p_name == 'Closures Per Person')
			icon_name = 'icon-thumbs-up';
		else if (p_name == 'Deals Won')
			icon_name = 'icon-briefcase';
		else if (p_name == 'Deals Funnel')
			icon_name = 'icon-filter';
		else if (p_name == 'Deals Assigned')
			icon_name = 'icon-user';
		else if (p_name == 'Agenda' || p_name == 'Mini Calendar')
			icon_name = "icon-calendar";
		else if (p_name == 'Today Tasks' || p_name == 'Task Report')
			icon_name = "icon-tasks";
		else if (p_name == 'Agile CRM Blog')
			icon_name = "icon-feed";
		else if(p_name=='Stats Report')
			icon_name = "icon-speedometer";
		else if (p_name == 'Leaderboard')
			icon_name = "icon-trophy";
		else if (p_name== 'User Activities')
			icon_name = "icon-cogs";
		else if (p_name== 'Account Details')
			icon_name = "icon-info";
		else if (p_name == 'Revenue Graph')
			icon_name = 'icon-graph';
		else if (p_name == 'Campaign stats')
			icon_name = 'icon-sitemap';
		else if (p_name == 'Deal Goals')
			icon_name = 'icon-flag';
		return icon_name;
	});
	

	Handlebars.registerHelper('if_equals_or', function()
	{
		var options = arguments[arguments.length - 1];
		try
		{
			for (var i = 0; i < arguments.length - 1; i = i + 2)
			{
				value = arguments[i];
				target = arguments[i + 1];
				if ((typeof target === "undefined") || (typeof value === "undefined"))
					return options.inverse(this);
				if (value.toString().trim() == target.toString().trim())
					return options.fn(this);
			}
			return options.inverse(this);
		}
		catch (err)
		{
			console.log("error while if_equals_or of handlebars helper : " + err.message);
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('buildFacebookProfileURL', function(url)
	{
		return buildFacebookProfileURL(url);
	});

	/**
	 * returns tracks count of opportunity
	 */
	Handlebars.registerHelper('getTracksCount', function(options)
	{
		if (parseInt(DEAL_TRACKS_COUNT) > 1)
			return options.fn(this);
		else
			return options.inverse(this);
	});
	
	/**
	 * getting time in AM and PM format for event portlet
	 */
	Handlebars.registerHelper('get_AM_PM_format', function(date_val)
	{
		var date = new Date(date_val * 1000);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		if(hours<10)
			hours = '0'+hours;
		var strTime = hours + ':' + minutes + '' + ampm;
		return strTime;
	});

	/**
	 * getting duration between two dates for event portlet
	 */
	Handlebars.registerHelper('get_duration', function(startDate, endDate)
	{
		var duration = '';
		var days = 0;
		var hrs = 0;
		var mins = 0;
		var diffInSeconds = endDate - startDate;
		days = Math.floor(diffInSeconds / (24 * 60 * 60));
		hrs = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
		mins = Math.floor(((diffInSeconds % (24 * 60 * 60)) % (60 * 60)) / 60);
		if (days != 0 && days == 1)
			duration += '' + days + 'd ';
		else if (days != 0 && days > 1)
			duration += '' + days + 'd ';
		if (hrs != 0 && hrs == 1)
			duration += '' + hrs + 'h ';
		else if (hrs != 0 && hrs > 1)
			duration += '' + hrs + 'h ';
		if (mins != 0 && mins == 1)
			duration += '' + mins + 'm';
		else if (mins != 0 && mins > 1)
			duration += '' + mins + 'm';
		return duration;
	});

	/**
	 * Returns plain customise text for activity remove underscore and other
	 * special charecter from string
	 */
	Handlebars.registerHelper('displayActivityFieldText', function(value)
	{
		var fields = value.replace(/[^a-zA-Z ^,]/g, " ").split(",");
		var text = "";
		if (fields.length > 1)
		{
			for (var i = 0; i < fields.length - 1; i++)
			{
				text += " " + fields[i].trim();
				if (i != fields.length - 2)
				{
					text += ",";
				}
			}
			text += " and " + fields[fields.length - 1].trim();
		}
		else
		{
			text = fields[fields.length - 1].trim();
		}
		// update title
		text = text.replace('subject', 'Title');
		// update priority
		text = text.replace('priority type', 'Priority');
		// update category
		text = text.replace('task type', 'Category');
		// update due date
		text = text.replace('due date', 'Due date');

		text = text.replace('name', 'Name');
		// update priority
		text = text.replace('probability', 'Probability');
		// update category
		text = text.replace('expected value', 'Expected value');
		// update due date
		text = text.replace('close date', 'Close date');

		text = text.replace('close date', 'Close date');

		text = text.replace('end date', 'End time');
		// update priority
		text = text.replace('priority', 'Priority');
		// update category
		text = text.replace('title', 'Title');

		return text;

	});

	/*
	 * To represent a number with commas in deals from activities menu
	 */
	Handlebars.registerHelper('numberWithCommasForActivities', function(value)
	{
		value = parseFloat(value);
		if (value == 0)
			return value;

		if (value)
			return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
	});

	// function used know weather event rescheduled or modified and task due
	// date is modified
	Handlebars.registerHelper('get_event_rescheduled', function(value, options)
	{
		console.log(value);
		var modieied_fields = value.replace(/[^a-zA-Z ^,]/g, " ").split(",");
		var fields = [];
		if (modieied_fields)
		{
			for (var i = 0; i < modieied_fields.length; i++)
			{
				fields.push(modieied_fields[i].trim());
			}
		}
		if (fields.indexOf("start date") != -1)
		{
			return options.fn(value);
		}
		if (fields.indexOf("due date") != -1)
		{
			return options.fn(value);
		}

		return options.inverse(value);

	});

	/**
	 * gets the duedate and starttime modification value for activities
	 */
	Handlebars.registerHelper('getDueDateOfTask', function(fields, values)
	{
		var field = fields.replace(/[^a-zA-Z ^,]/g, " ").split(",");
		var value = values.replace(/[^a-zA-Z0-9 ^,]/g, " ").split(",");
		var json = {};

		for (var id = 0; id < field.length; id++)
		{
			field[id] = field[id].trim();
			value[id] = value[id].trim();
		}
		for (var i = 0; i < field.length; i++)
		{

			json[field[i]] = value[i];
		}

		if (field.indexOf("due date") != -1)
		{
			var dat = parseFloat(json['due date']);
			return convertToHumanDate("ddd mmm dd yyyy h:MM TT", dat);
		}
		if (field.indexOf("start date") != -1)
		{
			var dat = parseFloat(json['start date']);
			return convertToHumanDate("ddd mmm dd yyyy h:MM TT", dat);
		}

	});
	Handlebars.registerHelper('getDealCustomProperties', function(items, options)
	{
		var fields = getDealCustomProperties(items);
		if (fields.length == 0)
			return options.inverse(fields);

		return options.fn(fields);

	});

	Handlebars.registerHelper('getFormNameFromId', function(id)
	{
		var url = '/core/api/forms/form?formId=' + id;
		var form = $.ajax({ type : 'GET', url : url, async : false, dataType : 'json' }).responseText;
		if(!form)
			return new Handlebars.SafeString("?");
		form = JSON.parse(form);
		var formName = form.formName;
		return new Handlebars.SafeString(formName);
	});

	/**
	 * Helps to check the permission of the user based on the ACL.
	 */
	Handlebars.registerHelper("isTracksEligible", function(options)
	{
		if(_billing_restriction.currentLimits.addTracks)
			   return options.fn(this);
			
		return options.inverse(this);
	});

	/**
	 * Helps to check the number of tracks.
	 */
	Handlebars.registerHelper("hasSingleTrack", function(options)
	{
		try
		{
			var tracksCount = App_Admin_Settings.pipelineGridView.collection.length;
			if (tracksCount > 1)
				return options.fn(this);

		}
		catch (e)
		{
			console.log(e);
		}
		return options.inverse(this);
	});

	/*
	 * Returns first occurance of text after "Email subject: " in the given
	 * message
	 */
	Handlebars.registerHelper('get_subject', function(message)
	{
		var delimiter = "Email subject: ";
		try
		{
			if (message)
				return message.slice(message.indexOf(delimiter) + delimiter.length, message.length);
		}
		catch (e)
		{
			return message;
		}
		return message;
	});
	/**
	 * Helps to check the current deal is the same as passed deal.
	 */
	Handlebars.registerHelper("isCurrentDeal", function(deal_id, options)
	{
		var dealId = App_Deal_Details.dealDetailView.model.id;
		if (deal_id && deal_id == dealId)
			return options.fn(this);

		return options.inverse(this);
	});
	Handlebars.registerHelper('getDealNames', function(deals)
	{
		var html = '';
		var currentDealId = 0;
		if (App_Deal_Details.dealDetailView)
			currentDealId = App_Deal_Details.dealDetailView.model.id;
		$.each(deals, function(index, deal)
		{
			if (deal.id != currentDealId)
			{
				html += '<a href="#deal/' + deal.id + '">' + deal.name + '</a>';
				if (index + 1 < deals.length)
					html += ', ';
			}
		});
		return html;

	});

	/**
	 * Returns milestone name from trigger_deal_milestone; e.g., 1234452_Won,
	 * returns Won
	 */
	Handlebars.registerHelper('trigger_milestone', function(value, options)
	{

		// If undefined
		if (!value)
			return value;

		var milestone = value.split('_');

		if (milestone.length == 1)
			return value;

		// First indexed should be pipeline id
		if (milestone.length > 1 && milestone[0] != " " && !isNaN(Number(milestone[0])))
		{
			milestone.splice(0, 1);
			return milestone.join('_');
		}

	});
	
	/*
	 * Returns the url without query parameters appended by agile
	 */
	Handlebars.registerHelper('get_url', function(url)
	{
		if (url)
		{
			if (url.indexOf("fwd=cd") == -1)
				return new Handlebars.SafeString(url);

			var delimiter;
			if (url.indexOf("?fwd=cd") != -1)
				delimiter = "?fwd=cd";
			else
				delimiter = "&fwd=cd";

			try
			{
				if (delimiter)
					return new Handlebars.SafeString(url.split(delimiter)[0]);
			}
			catch (e)
			{
				console.log("Error in get_limiter:" + e);
				return new Handlebars.SafeString(url);
			}
		}
		return new Handlebars.SafeString(url);

	});

	/*
	 * Returns first occurance of text after the given delimiter in the given
	 * message
	 */

	Handlebars.registerHelper('get_limiter', function(message, delimiter)
	{
		try
		{
			if (message && delimiter)
				return message.slice(message.indexOf(delimiter) + delimiter.length, message.length);
		}
		catch (e)
		{
			console.log("Error in get_limiter:" + e);
			return message;
		}
		return message;
	});


		Handlebars.registerHelper('isAllowedInCurrentPlan', function(functionName, options) {
	
		if(_plan_restrictions[functionName] && _plan_restrictions[functionName][0] && _plan_restrictions[functionName][0]())
		{
			return options.fn(this);
		}
		else if(_plan_restrictions[functionName] && _plan_restrictions[functionName][1])
		{
			return options.inverse(_plan_restrictions[functionName][1]());
		}
		else
			return options.inverse(this);
		
	});

	Handlebars.registerHelper("toSafeString", function(content){
		return new Handlebars.SafeString(content);
	});
	
	Handlebars.registerHelper("getPlanLimits", function(key){
		if(_billing_restriction.currentLimits.planName == "PRO")
			return "Unlimited";
		else
			return _billing_restriction.currentLimits[key];
	});

	Handlebars.registerHelper("getLeaderboardCateCount", function(options){
		var count=0;
		if(options.revenue)
			count++;
		if(options.dealsWon)
			count++;
		if(options.calls)
			count++;
		if(options.tasks)
			count++;
		return count;
	});

	/**
	 * return the increment value of index of a collection
	 */
	Handlebars.registerHelper("getIndexIncrementByOne", function(indexVal){
		return ++indexVal;
	});
	/**
	 * getting duration for portlets
	 */
	Handlebars.registerHelper('get_portlet_duration', function(duration)
	{
		var time_period = 'Today';
		if (duration == 'yesterday')
		{
			time_period = 'Yesterday';
		}
		else if (duration == '1-day' || duration == 'today')
		{
			time_period = 'Today';
		}
		else if (duration == '2-days')
		{
			time_period = 'Last 2 Days';
		}
		else if (duration == 'this-week')
		{
			time_period = 'This Week';
		}
		else if (duration == 'last-week')
		{
			time_period = 'Last Week';
		}
		else if (duration == '1-week')
		{
			time_period = 'Last 7 Days';
		}
		else if (duration == 'this-month')
		{
			time_period = 'This Month';
		}
		else if (duration == 'last-month')
		{
			time_period = 'Last Month';
		}
		else if (duration == '1-month')
		{
			time_period = 'Last 30 Days';
		}
		else if (duration == 'this-quarter')
		{
			time_period = 'This Quarter';
		}
		else if (duration == 'last-quarter')
		{
			time_period = 'Last Quarter';
		}
		else if (duration == '3-months')
		{
			time_period = 'Last 3 Months';
		}
		else if (duration == '6-months')
		{
			time_period = 'Last 6 Months';
		}
		else if (duration == '12-months')
		{
			time_period = 'Last 12 Months';
		}
		else if (duration == 'today-and-tomorrow')
		{
			time_period = 'Today and Tomorrow';
		}
		else if (duration == 'all-over-due')
		{
			time_period = 'All Over Due';
		}
		else if (duration == 'next-7-days')
		{
			time_period = 'Next 7 Days';
		}
		else if (duration == '24-hours')
		{
			time_period = 'Last 24 Hours';
		}
		else if (duration == 'next-quarter')
		{
			time_period = 'Next Quarter';
		}
		else if (duration == 'this-and-next-quarter')
		{
			time_period = 'This and Next Quarter';
		}
		else if (duration == 'this-year')
		{
			time_period = 'This Year';
		}
		else if (duration == 'next-year')
		{
			time_period = 'Next Year';
		}
		
		return time_period;
	});
	
	/**
	 * Returns a given date string to a time ago format ,used for gmaps listview implementation
	 * 
	 */
	Handlebars.registerHelper('timeAgo',function(dateString){
		
		
		var date=new Date();
		 try
			{
			 var find = '-';
			 var re = new RegExp(find, 'g');
			 dateString = dateString.replace(re, '/');
			 dateString = dateString.match(/[^:]+(\:[^:]+)?/g);
			 date = new Date(dateString[0]+' UTC');
			}
			catch (err)
			{
				console.log("Error in parsing date");
			}

	    var seconds = Math.floor((new Date() - date) / 1000);

	    var interval = Math.floor(seconds / 31536000);

	    if (interval > 1) {
	        return interval + " years ago";
	    }
	    interval = Math.floor(seconds / 2592000);
	    if (interval > 1) {
	        return interval + " months ago";
	    }
	    interval = Math.floor(seconds / 86400);
	    if (interval > 1) {
	        return interval + " days ago";
	    }
	    interval = Math.floor(seconds / 3600);
	    if (interval > 1) {
	        return interval + " hours ago";
	    }
	    interval = Math.floor(seconds / 60);
	    if (interval > 1) {
	        return interval + " minutes ago";
	    }
	    return new Handlebars.SafeString(Math.floor(seconds) + " seconds ago");

		
	
		
	});
	
	/**
	 * Returns a string by making its first letter a capital letter.
	 * Used in gmap implementation for table view
	 */
	Handlebars.registerHelper('capitalizeFirstLetter',function(city,country){
		return new Handlebars.SafeString(city.charAt(0).toUpperCase() + city.slice(1)+", "+country);
		
	});
	
	/**
	 * Returns a default image url .
	 * 
	 */
	Handlebars.registerHelper('getDefaultImage',function(){
		return new Handlebars.SafeString(updateImageS3Path(FLAT_FULL_PATH + 'images/flatfull/user-default.jpg'));
		
	});
	
	/**
	 * Returns table headings for custom companies list view
	 */
	Handlebars.registerHelper('companyTableHeadings', function(item)
	{

		var el = "";
		$.each(App_Companies.companyViewModel[item], function(index, element)
		{
			if (element.indexOf("CUSTOM_") == 0) {
				element = element.split("_")[1];
				el = el.concat('<th class="text-muted">' + ucfirst(element) + '</th>');
			}
			else {
			element = element.replace("_", " ")
			el = el.concat('<th>' + ucfirst(element) + '</th>');
			}	
		});

		return new Handlebars.SafeString(el);
	});
	
	Handlebars
	.registerHelper(
			'companies_count',
			function()
			{
				var count_message;
				if (this[0] && this[0].count && (this[0].count != -1))
				{

					if (this[0].count > 9999 && (_agile_get_prefs('company_filter') || _agile_get_prefs('dynamic_company_filter')))
						count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: -5px">' + '<img border="0" src="'+updateImageS3Path("/img/help.png")+'"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';

					else
						count_message = "<small> (" + this[0].count + " Total) </small>";
				}
				else
					count_message = "<small> (" + this.length + " Total) </small>";

				return new Handlebars.SafeString(count_message);
			});
	
});

// helper function return created time for event
function getEventCreatedTime(due)
{
	// Get Todays Date
	var eventStartDate = new Date(due);
	due = eventStartDate.getTime() / 1000;
	var date = new Date();
	date.setHours(0, 0, 0, 0);

	date = date.getTime() / 1000;
	// console.log("Today " + date + " Due " + due);
	return Math.floor((due - date) / (24 * 3600));
}

// generating circle for tasks progress
Handlebars.registerHelper('getcircle', function(percentage)
{
	prec = (360 * percentage) / 100;
	if (prec <= 180)
	{
		return 'background-image :linear-gradient(' + (prec + 90) + 'deg, transparent 50%, #e8eff0 50%),linear-gradient(90deg, #e8eff0  50%, transparent 50%)';
	}
	else
	{
		return 'background-image :linear-gradient(' + (prec - 90) + 'deg, transparent 50%, #39B4CC 50%), linear-gradient(90deg, #e8eff0 50%, transparent 50%)';
	}
});

/**
 * return onboarding scheduling url by reading fron globals.js file
 */
Handlebars.registerHelper('ONBOARDING_CALENDAR_URL', function()
{

	return ONBOARDING_SCHEDULE_URL;

});

/**
 * return support scheduling url by reading fron util.js file
 */
Handlebars.registerHelper('SUPPORT_CALENDAR_URL', function()
{

	return SUPPORT_SCHEDULE_URL;

});

/**
 * return sales scheduling url by reading fron util.js file
 */
Handlebars.registerHelper('SALES_CALENDAR_URL', function()
{

	return SALES_SCHEDULE_URL;

});
	Handlebars.registerHelper('trialDate', function()
	{
		
		var TRAIL_PENDING_DAYS;
		var _TRAIL_DAYS = 14; 

		var json = $.ajax({ type : 'GET', url : '/core/api/subscription/', async : false,
			dataType : 'json' }).responseText;
		console.log("sub json:");
		console.log(json);
		var string = JSON.parse(json);
		console.log("json string:");
		console.log(string);
//		var billingData = string.billing_data;
//		var billingDataString = JSON.parse(billingData);
		
		
		
			if(TRAIL_PENDING_DAYS)
				return TRAIL_PENDING_DAYS;
			
			if(!string || !string.created_time)
				return (TRAIL_PENDING_DAYS = 14)
				
			var time = (new Date().getTime()/1000) - (string.created_time);
			
			var days = time / (24 * 60 *60);
			
			TRAIL_PENDING_DAYS = _TRAIL_DAYS - days;
			
			if(TRAIL_PENDING_DAYS < 0)
			{
				TRAIL_PENDING_DAYS = 0;
			}
			
			TRAIL_PENDING_DAYS = Math.round(TRAIL_PENDING_DAYS);
			return TRAIL_PENDING_DAYS;
		});
	Handlebars.registerHelper('get_portlet_description', function(p_name)
			{
	var description = '';
	if (p_name == 'Filter Based')
		description = 'See a list of 50 recently added contacts customizable by filters.';
	else if (p_name == 'Emails Opened')
		description = 'See what percentage of people open your direct emails.';
	else if (p_name == 'Growth Graph')
		description = 'Gain a quick insight on how contacts with specific tag(s) have changed over time.';
	else if (p_name == 'Calls Per Person')
		description = 'Detailed reports on call activity of your team.';
	else if (p_name == 'Pending Deals')
		description = 'Gives you a heads up on all your pending Deals.';
	else if (p_name == 'Deals By Milestone')
		description = 'A pie-chart of Deals grouped by Milestone.';
	else if (p_name == 'Deals Funnel')
		description = 'A funnel report of total Deals value in each Milestone.';
	else if (p_name == 'Agenda')
		description = 'A quick view of events from your calendar.';
	else if (p_name == 'Today Tasks')
		description = 'A list of your upcoming or due Tasks';
	else if (p_name == 'Task Report')
		description = 'Get a quick view of tasks by all users reported by status and duration.';
	else if (p_name == 'Agile CRM Blog')
		description = "A feed of what's happening at our end including updates on new features.";
	else if(p_name=='Stats Report')
		description = 'Detailed list of activities done by your team members.';
	else if (p_name == 'Leaderboard')
		description = ' A leaderboard for your team based on revenue won, tasks done, calls etc.';
	else if (p_name== 'User Activities')
		description = 'See a timeline of user actions in Agile CRM.';
	else if (p_name== 'Account Details')
		description = 'Find current plan information, number of users and more.';
	else if (p_name== 'Revenue Graph')
		description = 'Forecasted revenue graph based on your Deals.';
	else if (p_name== 'Mini Calendar')
		description = 'A mini calendar with an overview of your agenda for the day.'
	else if (p_name == 'Campaign stats')
		description = 'See how your campaigns are performing with stats on email opens and link clicks.'
	else if(p_name == 'Deal Goals')
		description = 'See how much sales target you have achieved.'
	return description;
			});

	Handlebars.registerHelper('trialEndDate', function(billingData, options)
			{
		      var json={};
		      var currentEpoch = new Date().getTime()/1000;
		      currentEpoch = Math.round(currentEpoch);
		      /*console.log("billing data is:");
		      console.log(billingData.customer.metadata.trial_end);*/
		      //billingData = billingData.toString();
		      /*console.log("string is:");
		      if(billingData.subscriptions.data.trialEnd)
		        console.log(billingData.subscriptions.data.trialEnd);*/
		      if(!billingData)
		    	  {
		    	  	return options.inverse(this);
		    	  }
		    	  console.log(billingData);
		    	  /*var billingData = JSON.parse(billingData.billingData);
		    	  console.log(billingData);*/
              if(billingData.metadata && billingData.metadata.trial_end && billingData.metadata.trial_end > currentEpoch)
        	   {

        		var has_trial = (parseInt(billingData.metadata.trial_end) - currentEpoch)/(24*60*60);
        		has_trial = Math.round(has_trial);
        		var trialDate = (billingData.metadata.trial_end)/(24*60*60);
        		if(has_trial>0)
        			{
        				json['trial_exists'] = true;
        				json['days_left'] = has_trial;
        				var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        				                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        				                ];
        				var date = new Date();
        	            date.setDate(date.getDate() + has_trial); 
        	            var formattedDate = date.getDate()+' '+(monthNames[date.getMonth()])+' '+date.getFullYear();
        				/*formattedDate = JSON.stringify(formattedDate);
        	            console.log(formattedDate);*/
        				json['trial_date'] = formattedDate;
        				console.log("trial in json is:"+json['trial_date']);
        				
        			}
        		else
        			json['trial_exists'] = false;
        		
        	   }
              else
		        json['trial_exists'] = false;

		       return options.fn(json);		        

			});

	Handlebars.registerHelper('trialEnd', function(billingData, options)
			{
		      var json={};
		      var currentEpoch = new Date().getTime()/1000;
		      currentEpoch = Math.round(currentEpoch);
		      /*console.log("billing data is:");
		      console.log(billingData.customer.metadata.trial_end);*/
		      //billingData = billingData.toString();
		      /*console.log("string is:");
		      if(billingData.subscriptions.data.trialEnd)
		        console.log(billingData.subscriptions.data.trialEnd);*/
		      if(!billingData)
		    	  {
		    	  	return options.inverse(this);
		    	  }
		    	  console.log(billingData);

              if(billingData.metadata && billingData.metadata.trial_end && billingData.metadata.trial_end > currentEpoch)
        	   {

        		var has_trial = (parseInt(billingData.metadata.trial_end) - currentEpoch)/(24*60*60);
        		has_trial = Math.floor(has_trial);
        		if(has_trial>0)
        			{
        				json['trial_exists'] = true;
        				json['days_left'] = has_trial;
        				var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        				                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        				                ];
        				var date = new Date();
        	            date.setDate(date.getDate() + has_trial); 
        	            var formattedDate = date.getDate()+' '+(monthNames[date.getMonth()])+' '+date.getFullYear();
        	            formattedDate = JSON.stringify(formattedDate);
        	            console.log(formattedDate);
        				json['trial_date'] = formattedDate;
        			}
        		else
        			json['trial_exists'] = false;
        		
        	   }
              else
		        json['trial_exists'] = false;

		       return options.fn(json);		        

			});
	Handlebars.registerHelper('toggle_contacts_filter', function(options)
			{	        
		    if(_agile_get_prefs(CONTACTS_DYNAMIC_FILTER_COOKIE_STATUS)=="hide"){
			return "none";
	       	}
	    	
			});
	
	
	Handlebars.registerHelper('toggle_companies_filter', function(options)
			{	        
		   return  _agile_get_prefs('companiesFilterStatus');
		    
			});

	

	Handlebars.registerHelper('totalTimeFormat', function(timeInSec)
			{
				if (timeInSec == "0")
					return "0 sec";

				return SecondsToCampaignTime(timeInSec);
			});

	// To show allowed domains as list
	Handlebars.registerHelper('allowed_domain_list', function(data)
			{
				var html = "";
				if (data)
				{
					var allowed_domains = data.split(",");
					for ( var i in allowed_domains)
					{
						allowed_domains[i] = allowed_domains[i].trim();
						html += "<tr data='" + allowed_domains[i] + "' style='display: table-row;'><td><div class='inline-block v-top text-ellipsis' style='width:80%'>";
						html += allowed_domains[i] + "</div></td><td class='b-r-none'><div class='m-b-n-xs' style='display:none;'><a class='allowed-domain-delete c-p m-l-sm text-l-none text-xs'  data-toggle='modal' role='button' href='#'><i title='Delete Allowed Domain' class='task-action icon icon-trash'></i></a></div></td></tr>";
					}
				}
				return html;
			});

	// To show blocked ips as list
	Handlebars.registerHelper('blocked_ips_list', function(data)
			{
				var html = "";
				if (data)
				{
					var blocked_ips = data.split(",");
					for ( var i in blocked_ips)
					{
						blocked_ips[i] = blocked_ips[i].trim();
						html += "<tr data='" + blocked_ips[i] + "' style='display: table-row;'><td><div class='inline-block v-top text-ellipsis' style='width:80%'>";
						html += blocked_ips[i] + "</div></td><td class='b-r-none'><div class='m-b-n-xs' style='display:none;'><a class='blocked-ip-delete c-p m-l-sm text-l-none text-xs'  data-toggle='modal' role='button' href='#'><i title='Delete Blocked IP' class='task-action icon icon-trash'></i></a></div></td></tr>";
					}
				}
				return html;
			});

	// Is new allowed domain
	Handlebars.registerHelper("hide_allowed_domains_text", function(data, options){
		if (data && data != "localhost, *")
			return options.inverse(this);
		return options.fn(this);
	});
	
	Handlebars.registerHelper('proToEnterprise', function(plan_type, options)
			{
		var temp = "Free";

		  if(plan_type.indexOf("PRO") >= 0)
			plan_type= plan_type.replace("PRO","ENTERPRISE");

		  var fragments = plan_type.split("_");

		  var interval = "Monthly";
		  if(fragments.length > 1)
		  {
		  	 interval = ucfirst(fragments[1]);
		  	 temp = ucfirst(fragments[0]);

		  	 return temp + " (" + interval+")";
		  }

		    });
	Handlebars.registerHelper('invoice_description', function(description) {

		if (!description)
			return description;

		if (description.indexOf("Unused time on") != -1) {
			description = "Balance from previous transaction";
		} else if (description.indexOf("Remaining") != -1) {
			description = "Changed on " + description.substring(description.indexOf("after") + 5);
		}

		return description + " ";

	});

	Handlebars.registerHelper("is_unsubscribed_all", function(options){
               
               var contact_model = App_Contacts.contactDetailView.model.toJSON();

               // First name
               var first_name = getPropertyValue(contact_model["properties"], "first_name");

               if(contact_model && contact_model["unsubscribeStatus"] && contact_model["unsubscribeStatus"].length > 0)
               {
                       var statuses = contact_model["unsubscribeStatus"];

                       for(var i=0, len = statuses.length; i < len; i++)
                       {
                               var status = statuses[i];

                              if(status.unsubscribeType && status.unsubscribeType == "ALL")                                       return options.fn({"first_name": first_name, "campaign_id": status.campaign_id});
                       }
               }

               return options.inverse(this);
        });

Handlebars.registerHelper('is_mobile', function(options)
	{
		if(agile_is_mobile_browser())
		return options.fn(this);
		else
		return options.inverse(this);
	});



/**
 * Returns a S3 image url .
 * 
 */
Handlebars.registerHelper('getS3ImagePath',function(imageUrl){
	//return new Handlebars.SafeString(updateImageS3Path(imageUrl));	
});
	Handlebars.registerHelper('is_trial_exist', function(billingData, options)
	{
		if (billingData && billingData.subscriptions){
			var is_trial_exist = false;
			$.each(billingData.subscriptions.data, function( index, value ) {
			  if(!value.plan.id.indexOf("email") > -1 && value.trialStart && value.trialEnd && value.trialEnd >= (new Date().getTime()/1000))
			  {
			  	var trial_start = value.trialStart;
			  	var trial_end = value.trialEnd;
			  	if(trial_end - trial_start <= 864000){
			  		is_trial_exist = true;
			  		return false;
			  	}
			  }
			});
			if(is_trial_exist)
				return options.fn(this);
			else
				return options.inverse(this);
		}else{
			return options.inverse(this);
		}
	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 * working as greater than but not equal to
	 */ 
	Handlebars.registerHelper('is_greater', function(value, target, options)
	{
		if (parseInt(target) < value)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('is_domain_owner', function(options)
	{
		if (CURRENT_DOMAIN_USER.is_account_owner)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('is_not_allowed_trial', function(options)
	{
		if(IS_TRIAL && IS_ALLOWED_TRIAL)
			return options.inverse(this);
		else
			return options.fn(this);
	});

// the epoch time is in milisecond.
// jquery uses isostring format to implement timeago function on date...
Handlebars.registerHelper('convert_toISOString', function(dateInepoch, options) {
	try
	{
		return new Date(dateInepoch).toISOString();
	}
	catch (e)
	{
	}
	return dateInepoch;
});

	Handlebars.registerHelper('emails_next_renewal_time', function(items, name)
	{
		return getEmailsNextRenewalTime();
	});

	Handlebars.registerHelper('is_paid_emails', function(options)
	{
		var max = getMaxEmailsLimit();
		// if max is greater than zero, we consider user is subscrbed to email plan
		if (max > 0)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('is_acl_allowed', function(options)
	{
		if(!_plan_restrictions.is_ACL_allowed[0]())
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('value_check_with_boolean', function(value, options)
	{
		console.log(value)
		if(value || value == "true")
			return options.fn(this);
	});


function agile_is_mobile_browser(){
   return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
 }


(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)}else{a(jQuery)}}(function(d){d.timeago=function(h){if(h instanceof Date){return a(h)}else{if(typeof h==="string"){return a(d.timeago.parse(h))}else{if(typeof h==="number"){return a(new Date(h))}else{return a(d.timeago.datetime(h))}}}};var g=d.timeago;d.extend(d.timeago,{settings:{refreshMillis:60000,allowFuture:true,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(n){var o=this.settings.strings;var k=o.prefixAgo;var s=o.suffixAgo;if(this.settings.allowFuture){if(n<0){k=o.prefixFromNow;s=o.suffixFromNow}}var q=Math.abs(n)/1000;var h=q/60;var p=h/60;var r=p/24;var l=r/365;function j(t,v){var u=d.isFunction(t)?t(v,n):t;var w=(o.numbers&&o.numbers[v])||v;return u.replace(/%d/i,w)}var m=q<45&&j(o.seconds,Math.round(q))||q<90&&j(o.minute,1)||h<45&&j(o.minutes,Math.round(h))||h<90&&j(o.hour,1)||p<24&&j(o.hours,Math.round(p))||p<42&&j(o.day,1)||r<30&&j(o.days,Math.round(r))||r<45&&j(o.month,1)||r<365&&j(o.months,Math.round(r/30))||l<1.5&&j(o.year,1)||j(o.years,Math.round(l));var i=o.wordSeparator||"";if(o.wordSeparator===undefined){i=" "}return d.trim([k,m,s].join(i))},parse:function(i){var h=d.trim(i);h=h.replace(/\.\d+/,"");h=h.replace(/-/,"/").replace(/-/,"/");h=h.replace(/T/," ").replace(/Z/," UTC");h=h.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2");return new Date(h)},datetime:function(i){var h=g.isTime(i)?d(i).attr("datetime"):d(i).attr("title");return g.parse(h)},isTime:function(h){return d(h).get(0).tagName.toLowerCase()==="time"}});var e={init:function(){var i=d.proxy(c,this);i();var h=g.settings;if(h.refreshMillis>0){setInterval(i,h.refreshMillis)}},update:function(h){d(this).data("timeago",{datetime:g.parse(h)});c.apply(this)}};d.fn.timeago=function(j,h){var i=j?e[j]:e.init;if(!i){throw new Error("Unknown function name '"+j+"' for timeago")}this.each(function(){i.call(this,h)});return this};function c(){var h=b(this);if(!isNaN(h.datetime)){d(this).text(a(h.datetime))}return this}function b(h){h=d(h);if(!h.data("timeago")){h.data("timeago",{datetime:g.datetime(h)});var i=d.trim(h.text());if(i.length>0&&!(g.isTime(h)&&h.attr("title"))){h.attr("title",i)}}return h.data("timeago")}function a(h){return g.inWords(f(h))}function f(h){return(new Date().getTime()-h.getTime())}document.createElement("abbr");document.createElement("time")}));/**
 * Loads the "google map API" by appending the url as script to html document
 * body and displays the map (using callback of url) based on the address of the
 * contact. If the google map is already loaded, just displays the map.
 * 
 * Geocoder is used to get the latitude and longitude of the given address
 * 
 * @method show_map
 * @param {object}
 *            el html object of the contact detail view
 * @param {Object}
 *            contact going to be shown in detail
 */
function show_map(el) {
	var contact = contactDetailView.model.toJSON();
	var address = getPropertyValue(contact.properties, "address");

	// Return, if no address is found 
	if (!address) 
		return;
	
	try
	{
		address = JSON.parse(address);
	}
	catch (err)
	{
		return;
	}
	
	

	// If all the address fields are empty, just return.
	if (!address.address && !address.city && !address.state
			&& !address.country)
		return;
	
	//reads the value from cookie or local store if the value is no it will return from here
	
	/*var map_view=_agile_get_prefs('MAP_VIEW');
	if(map_view=="disabled"){
		$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='Show map' id='enable_map_view'></i>");
		return;
	}*/
		

	// If google map is already loaded display the map else load the
	// "google maps api"
	try {
		if (google.maps) {
			display_google_map();
		}
	} catch (err) {

		load_gmap_script();
	}
}

/**
 * Loads "google maps api", by appending the related url (with a callback
 * function to display map) as script element to html document body
 */
function load_gmap_script() {
	
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?&sensor=false&callback=display_google_map";
	document.body.appendChild(script);
}

/**
 * Displays related map of the given contact address.
 * 
 * Validates the status code returned by the geocoder, if it is ok proceeds
 * further to display the map using latitude and longitude of results object.
 * 
 */
function display_google_map() {

	var contact = contactDetailView.model.toJSON();
	var address = JSON.parse(getPropertyValue(contact.properties, "address"));

	// Gets the location (latitude and longitude) from the address
	var geocoder = new google.maps.Geocoder();

	// Latitude and longitude were not saved to the contact (chances to update the address)
	
	if(!address.address)address.address="";
	if(!address.city)address.city="";
	if(!address.state)address.state="";
	if(!address.country)address.country="";
	if(!address.zip)address.zip="";
	
	geocoder.geocode({
		'address' : '"'+ address.address + ', '+ address.city + ', '
		+ address.state + ', ' + getNormalCountryNameFromShortName(address.country) + ', ' + address.zip + '"'
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			console.log(results);
			//displayTimeZone(results);

			// Displays map portion
			$("#map").css('display', 'block');
			
			var myOptions = {
				zoom : 4,
				center : results[0].geometry.location,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}

			var map = new google.maps.Map(document.getElementById("map"),
					myOptions);
			
			var marker = new google.maps.Marker({
				map : map,
				position : results[0].geometry.location
			});
		}
	});
}

function getNormalCountryNameFromShortName(name){
	if (!name)
		return;

	var name_json = {  "AF" : "Afghanistan",
		    "AX" : "Aland Islands",
		    "AL" : "Albania",
		    "DZ" : "Algeria",
		    "AS" : "American Samoa",
		    "AD" : "Andorra",
		    "AO" : "Angola",
		    "AI" : "Anguilla",
		    "AQ" : "Antarctica",
		    "AG" : "Antigua And Barbuda",
		    "AR" : "Argentina",
		    "AM" : "Armenia",
		    "AW" : "Aruba",
		    "AU" : "Australia",
		    "AT" : "Austria",
		    "AZ" : "Azerbaijan",
		    "BS" : "Bahamas",
		    "BH" : "Bahrain",
		    "BD" : "Bangladesh",
		    "BB" : "Barbados",
		    "BY" : "Belarus",
		    "BE" : "Belgium",
		    "BZ" : "Belize",
		    "BJ" : "Benin",
		    "BM" : "Bermuda",
		    "BT" : "Bhutan",
		    "BO" : "Bolivia",
		    "BA" : "Bosnia And Herzegovina",
		    "BW" : "Botswana",
		    "BV" : "Bouvet Island",
		    "BR" : "Brazil",
		    "IO" : "British Indian Ocean Territory",
		    "BN" : "Brunei Darussalam",
		    "BG" : "Bulgaria",
		    "BF" : "Burkina Faso",
		    "BI" : "Burundi",
		    "KH" : "Cambodia",
		    "CM" : "Cameroon",
		    "CA" : "Canada",
		    "CV" : "Cape Verde",
		    "KY" : "Cayman Islands",
		    "CF" : "Central African Republic",
		    "TD" : "Chad",
		    "CL" : "Chile",
		    "CN" : "China",
		    "CX" : "Christmas Island",
		    "CC" : "Cocos (Keeling) Islands",
		    "CO" : "Colombia",
		    "KM" : "Comoros",
		    "CG" : "Congo",
		    "CD" : "Congo, Democratic Republic",
		    "CK" : "Cook Islands",
		    "CR" : "Costa Rica",
		    "CI" : "Cote D\"Ivoire",
		    "HR" : "Croatia",
		    "CU" : "Cuba",
		    "CY" : "Cyprus",
		    "CZ" : "Czech Republic",
		    "DK" : "Denmark",
		    "DJ" : "Djibouti",
		    "DM" : "Dominica",
		    "DO" : "Dominican Republic",
		    "EC" : "Ecuador",
		    "EG" : "Egypt",
		    "SV" : "El Salvador",
		    "GQ" : "Equatorial Guinea",
		    "ER" : "Eritrea",
		    "EE" : "Estonia",
		    "ET" : "Ethiopia",
		    "FK" : "Falkland Islands (Malvinas)",
		    "FO" : "Faroe Islands",
		    "FJ" : "Fiji",
		    "FI" : "Finland",
		    "FR" : "France",
		    "GF" : "French Guiana",
		    "PF" : "French Polynesia",
		    "TF" : "French Southern Territories",
		    "GA" : "Gabon",
		    "GM" : "Gambia",
		    "GE" : "Georgia",
		    "DE" : "Germany",
		    "GH" : "Ghana",
		    "GI" : "Gibraltar",
		    "GR" : "Greece",
		    "GL" : "Greenland",
		    "GD" : "Grenada",
		    "GP" : "Guadeloupe",
		    "GU" : "Guam",
		    "GT" : "Guatemala",
		    "GG" : "Guernsey",
		    "GN" : "Guinea",
		    "GW" : "Guinea-Bissau",
		    "GY" : "Guyana",
		    "HT" : "Haiti",
		    "HM" : "Heard Island & Mcdonald Islands",
		    "VA" : "Holy See (Vatican City State)",
		    "HN" : "Honduras",
		    "HK" : "Hong Kong",
		    "HU" : "Hungary",
		    "IS" : "Iceland",
		    "IN" : "India",
		    "ID" : "Indonesia",
		    "IR" : "Iran, Islamic Republic Of",
		    "IQ" : "Iraq",
		    "IE" : "Ireland",
		    "IM" : "Isle Of Man",
		    "IL" : "Israel",
		    "IT" : "Italy",
		    "JM" : "Jamaica",
		    "JP" : "Japan",
		    "JE" : "Jersey",
		    "JO" : "Jordan",
		    "KZ" : "Kazakhstan",
		    "KE" : "Kenya",
		    "KI" : "Kiribati",
		    "KR" : "Korea",
		    "KW" : "Kuwait",
		    "KG" : "Kyrgyzstan",
		    "LA" : "Lao People\"s Democratic Republic",
		    "LV" : "Latvia",
		    "LB" : "Lebanon",
		    "LS" : "Lesotho",
		    "LR" : "Liberia",
		    "LY" : "Libyan Arab Jamahiriya",
		    "LI" : "Liechtenstein",
		    "LT" : "Lithuania",
		    "LU" : "Luxembourg",
		    "MO" : "Macao",
		    "MK" : "Macedonia",
		    "MG" : "Madagascar",
		    "MW" : "Malawi",
		    "MY" : "Malaysia",
		    "MV" : "Maldives",
		    "ML" : "Mali",
		    "MT" : "Malta",
		    "MH" : "Marshall Islands",
		    "MQ" : "Martinique",
		    "MR" : "Mauritania",
		    "MU" : "Mauritius",
		    "YT" : "Mayotte",
		    "MX" : "Mexico",
		    "FM" : "Micronesia, Federated States Of",
		    "MD" : "Moldova",
		    "MC" : "Monaco",
		    "MN" : "Mongolia",
		    "ME" : "Montenegro",
		    "MS" : "Montserrat",
		    "MA" : "Morocco",
		    "MZ" : "Mozambique",
		    "MM" : "Myanmar",
		    "NA" : "Namibia",
		    "NR" : "Nauru",
		    "NP" : "Nepal",
		    "NL" : "Netherlands",
		    "AN" : "Netherlands Antilles",
		    "NC" : "New Caledonia",
		    "NZ" : "New Zealand",
		    "NI" : "Nicaragua",
		    "NE" : "Niger",
		    "NG" : "Nigeria",
		    "NU" : "Niue",
		    "NF" : "Norfolk Island",
		    "MP" : "Northern Mariana Islands",
		    "NO" : "Norway",
		    "OM" : "Oman",
		    "PK" : "Pakistan",
		    "PW" : "Palau",
		    "PS" : "Palestinian Territory, Occupied",
		    "PA" : "Panama",
		    "PG" : "Papua New Guinea",
		    "PY" : "Paraguay",
		    "PE" : "Peru",
		    "PH" : "Philippines",
		    "PN" : "Pitcairn",
		    "PL" : "Poland",
		    "PT" : "Portugal",
		    "PR" : "Puerto Rico",
		    "QA" : "Qatar",
		    "RE" : "Reunion",
		    "RO" : "Romania",
		    "RU" : "Russian Federation",
		    "RW" : "Rwanda",
		    "BL" : "Saint Barthelemy",
		    "SH" : "Saint Helena",
		    "KN" : "Saint Kitts And Nevis",
		    "LC" : "Saint Lucia",
		    "MF" : "Saint Martin",
		    "PM" : "Saint Pierre And Miquelon",
		    "VC" : "Saint Vincent And Grenadines",
		    "WS" : "Samoa",
		    "SM" : "San Marino",
		    "ST" : "Sao Tome And Principe",
		    "SA" : "Saudi Arabia",
		    "SN" : "Senegal",
		    "RS" : "Serbia",
		    "SC" : "Seychelles",
		    "SL" : "Sierra Leone",
		    "SG" : "Singapore",
		    "SK" : "Slovakia",
		    "SI" : "Slovenia",
		    "SB" : "Solomon Islands",
		    "SO" : "Somalia",
		    "ZA" : "South Africa",
		    "GS" : "South Georgia And Sandwich Isl.",
		    "ES" : "Spain",
		    "LK" : "Sri Lanka",
		    "SD" : "Sudan",
		    "SR" : "Suriname",
		    "SJ" : "Svalbard And Jan Mayen",
		    "SZ" : "Swaziland",
		    "SE" : "Sweden",
		    "CH" : "Switzerland",
		    "SY" : "Syrian Arab Republic",
		    "TW" : "Taiwan",
		    "TJ" : "Tajikistan",
		    "TZ" : "Tanzania",
		    "TH" : "Thailand",
		    "TL" : "Timor-Leste",
		    "TG" : "Togo",
		    "TK" : "Tokelau",
		    "TO" : "Tonga",
		    "TT" : "Trinidad And Tobago",
		    "TN" : "Tunisia",
		    "TR" : "Turkey",
		    "TM" : "Turkmenistan",
		    "TC" : "Turks And Caicos Islands",
		    "TV" : "Tuvalu",
		    "UG" : "Uganda",
		    "UA" : "Ukraine",
		    "AE" : "United Arab Emirates",
		    "GB" : "United Kingdom",
		    "US" : "United States",
		    "UM" : "United States Outlying Islands",
		    "UY" : "Uruguay",
		    "UZ" : "Uzbekistan",
		    "VU" : "Vanuatu",
		    "VE" : "Venezuela",
		    "VN" : "Viet Nam",
		    "VG" : "Virgin Islands, British",
		    "VI" : "Virgin Islands, U.S.",
		    "WF" : "Wallis And Futuna",
		    "EH" : "Western Sahara",
		    "YE" : "Yemen",
		    "ZM" : "Zambia",
		    "ZW" : "Zimbabwe"};

	name = name.trim();

	if (name_json[name])
		return name_json[name];

	return name;

}
function twilioSecondsToFriendly(time) {
	var hours = Math.floor(time / 3600);
	if(hours > 0)
	time = time - hours*60*60;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	var friendlyTime = "";
	if(hours == 1)
		friendlyTime = hours+ "h ";
	if(hours > 1)
		friendlyTime = hours+ "h ";
	if(minutes > 0)
		friendlyTime += minutes + "m ";
	if(seconds > 0)
		friendlyTime += seconds + "s ";
	if(friendlyTime != "")
	return friendlyTime;
}
/**
 * validate.js is used to validate the forms in the application, isValidFom
 * method validates the form element
 * 
 * @param form
 * @returns
 */
function isValidForm(form) {
	

	// Credit card validation to check card is valid for next 3 months
	jQuery.validator.addMethod("atleastThreeMonths", function(value, element) {

			// Gets the exp_month field because expiry should be
			// checked both on month and year
			var month = $(element).siblings('select.exp_month')
					.val(), year = value;

			// date selected
			var date = new Date().setFullYear(year, month - 1);

			// Get number of milliseconds per day
			var one_day = 1000 * 60 * 60 * 24;

			// Calculates number of days left from the current date,
			// if number of days are greater than 90 then returns
			// true
			return this.optional(element)
					|| (((date - new Date().getTime()) / one_day) > 90);
		}, "Card should be atleast 3 months valid");
	
	// Validates multiple emails separated by comma entered in textbox
	jQuery.validator.addMethod("multipleEmails", function(value, element) {
        
		if (this.optional(element)) // return true on optional element
            return true;
        
        var emails = value.split(/[,]+/); // split element by , 
        valid = true;
        
        for (var i in emails) {
            value = emails[i];
            valid = valid &&
                    jQuery.validator.methods.email.call(this, $.trim(value), element);
        }
        
        return valid;
    }, "Please enter valid email each separated by comma.");

	
	jQuery.validator.addMethod("noSpecialChars", function(value, element) {
		return isAlphaNumeric(value);
	//	console.log(params);
		
	}, "Should start with an alphabet and special characters are not allowed.");

	// Internal regex of jQuery validator allows for special characters in e-mails.
	// This regex solves that, overriding 'email'
	jQuery.validator.addMethod("email", function(value, element){
		
		if(this.optional(element))
			return true;
		
		return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
	}," Please enter a valid email.");

	// Phone number validation
	jQuery.validator.addMethod("phone", function(value, element){
		
		if(this.optional(element))
			return true;
		
		//return /^(\()?(\d{3})([\)-\. ])?(\d{3})([-\. ])?(\d{4})$/.test(value);
		return /^[^a-zA-Z]+$/.test(value);
	}," Please enter a valid phone number.");
	
	jQuery.validator.addMethod("multi-tags", function(value, element){
		
		var	tag_input = $(element).val()
		$(element).val("");
		if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
		{
			$(element).closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
		}
		
		return $(element).closest(".control-group").find('ul.tags > li').length > 0 ? true : false;
	}," This field is required.");
	
	jQuery.validator.addMethod("formulaData", function(value, element){
		var source = $(element).val();
		var tpl;
		var compiled=true;
		try{
			tpl = Handlebars.precompile(source);
		}catch(err){
			err.message;
			compiled=false;
		}
		return compiled ? true : false;
	}," Please enter a valid formula.");
	
	//Number validation
	jQuery.validator.addMethod("number_input", function(value, element){
		
		if(value=="")
			return false;
		
		return /^[0-9\-]+$/.test(value);
	}," Please enter a valid number.");
	
	jQuery.validator.addMethod("multi-select", function(value, element){
		var counter = 0;
		$(element).find(':selected').each( function( i, selected ) {
			counter++;
		});
		var limit = $(element).attr('limit');
		if(counter>limit)
			return false;
		return true;
	}," You can select maximum 3 folders only.");

	jQuery.validator.addMethod("checkedMultiSelect", function(value, element){
		
		var counter = $(element).find('option:selected').length;
		
		if(counter == 0)
			return false;

		return true;
	},"Please select atleast one option.");

	jQuery.validator.addMethod("checkedMultiCheckbox", function(value, element){
		
		console.log("value = " + value);
		console.log("element = " + element);

		var counter = $(element).find('input:checked').length;
		
		if(counter == 0)
			return false;

		return true;
	},"Please select atleast one option.");

	jQuery.validator.addMethod("date", function(value, element){
		if(value=="")
			return true;

		return !/Invalid|NaN/.test(getFormattedDateObjectWithString(value));

			
	}," Please enter a valid date.");

	jQuery.validator.addMethod("isHttpsURL", function(value, element){
		var urlregex = new RegExp("^(https:\/\/){1}([0-9A-Za-z]+\.)");
  		return urlregex.test(value);		
	}," Please enter a valid https URL");

	jQuery.validator.addMethod("date_input", function(value, element){
		if(value=="")
			return true;

		return !/Invalid|NaN/.test(getFormattedDateObjectWithString(value));

		
	}," Please enter a valid date.");

	jQuery.validator.addMethod("field_length", function(value, element){
		if(value=="")
			return true;
		var counter = 0;
		var max_len = $(element).attr('max_len');
		if(max_len == "")
			return true;
		if(value.length > max_len)
			return false;
		return true;
	}, function(params, element) {
		  return 'Maximum length is ' + $(element).attr("max_len") + ' chars only.'
		}
	);

	//Positive Number validation
	jQuery.validator.addMethod("positive_number", function(value, element){
		
		if(value=="")
			return true;

		if(isNaN(value))
		{
			return false;
		}
		if(!isNaN(value) && parseFloat(value) >= 0)
		{
			return true;
		}

	}," Please enter a value greater than or equal to 0.");

	$(form).validate({
		rules : {
			atleastThreeMonths : true,
			multipleEmails: true,
			email: true,
			checkedMultiSelect: true,
			phone: true
		},
		debug : true,
		errorElement : 'span',
		errorClass : 'help-inline',
		ignore: ':hidden:not(.checkedMultiSelect)',

		// Higlights the field and addsClass error if validation failed
		highlight : function(element, errorClass) {
			$(element).closest('.controls').addClass('single-error');
		},

		// Unhiglights and remove error field if validation check passes
		unhighlight : function(element, errorClass) {
			$(element).closest('.controls').removeClass('single-error');
		},
		invalidHandler : function(form, validator) {
			var errors = validator.numberOfInvalids();
		},
		errorPlacement: function(error, element) {
    		if (element.hasClass('checkedMultiSelect')) {
     			 error.appendTo($(element).parent());
    			} else {
      				error.insertAfter(element);
    			}
  }
	});

	// Return valid of invalid, to stop from saving the data
	return $(form).valid();
}

function isNotValid(value) {
    if (value == undefined) return true;
    if (value.length == 0) return true;
    return false;
}


function isValidField(id) {
    var value = $('#' + id).val();
    return !isNotValid(value);
}


function isAlphaNumeric(subdomain) {
	subdomain = subdomain.toString();
  
  var regularExpression  = new RegExp(/^[A-Za-z][a-zA-Z0-9]{3,20}$/);
  if(!regularExpression.test(subdomain)) {
        error = "Domain should start with an alphabet and special characters are not allowed.";
		return false;
    }
  return true;
}

function isAlphaNumeric(subdomain) {
	subdomain = subdomain.toString();
	
  var regularExpression  = new RegExp(/^[A-Za-z#@][A-Za-z0-9_:&@;/\s/g]*$/);
  if(!regularExpression.test(subdomain)) {
		return false;
    }
  return true;
}