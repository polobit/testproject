({
  name: 'main.js',
  out: 'main-built.js',
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
})
