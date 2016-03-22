require.config({
  baseUrl: "misc/formbuilder/assets/lib",
  shim: {
	    'backbone': {
	      deps: ['underscore', 'jquery'],
	      exports: 'Backbone'
	    },
	    'underscore': {
	      exports: '_'
	    },
	    'bootstrap': {
	      deps: ['jquery'],
	      exports: '$.fn.popover'
	    }
	  },
  paths: {
    app         : "../app"
    , collections : "../collections"
    , data        : "../data"
    , models      : "../models"
    , helper      : "../helper"
    , templates   : "../templates"
    , views       : "../views"
  }
});
require([ '../app'], function(app){
  app.initialize();
});
