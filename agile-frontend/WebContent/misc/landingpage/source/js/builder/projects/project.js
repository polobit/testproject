'use strict';

angular.module('builder.projects', [])

.factory('project', ['$rootScope', '$http', '$timeout', 'css', 'dom', 'settings', 'themes', 'localStorage', function($rootScope, $http, $timeout, css, dom, settings, themes, localStorage) {
	
	var project = {

		/**
		 * Currently active project.
		 * 
		 * @type mixed
		 */
		active: false,

		/**
		 * Currentle active page.
		 * 
		 * @type mixed
		 */
		activePage: false,

		/**
		 * All projects user has access to.
		 * 
		 * @type {Array}
		 */
		all: [],

		/**
		 * Remove page by name
		 * 
		 * @param  {string} name
		 * @return promise
		 */
		removePage: function(name) {
            for (var i = project.active.pages.length - 1; i >= 0; i--) {
                var page = project.active.pages[i];

                if (page.name == name) {
                    project.active.pages.splice(i, 1);
                    project.changePage();
                    break;
                }
            }

            this.save();
		},

		/**
		 * Remove all pages from currently active project.
		 * 
		 * @return Promise
		 */
		removeAllPages: function() {
            this.active.pages = [];
            this.save();
		},

		/**
		 * Return projects page by name.
		 * 
		 * @param {string} name
		 * @return Object
		 */
		getPage: function(name) {
			for (var i = this.active.pages.length - 1; i >= 0; i--) {
				if (this.active.pages[i].name == name) {
					return this.active.pages[i];
				}
			}
		},

		/**
		 * Change currently active page to the given one.
		 * 
		 * @param  {string} name
		 * @param  {boolean}  noEvent  whether or not to fire page.changed event
		 * 
		 * @return void
		 */
		changePage: function(name, noEvent) {
			var page = false;

			//bail if project has no pages
			if ( ! project.active.pages || ! project.active.pages.length) {
				return false;
			}

			//if no name passed select first page
			if ( ! name) {
				name = project.active.pages[0].name;
			}
			
			//try to find page by given name
			for (var i = 0; i < project.active.pages.length; i++) {
				if (project.active.pages[i].name == name) {			
					page = project.active.pages[i];
				}
			}

			//if we couldn't find page by name just grab the first one
			if ( ! page) {
				page = project.active.pages[0];
			}

			//load the page
			dom.loadHtml(page.html);
			css.loadCss(page.css);
			dom.setMeta({
				title: page.title,
				tags: page.tags,
				description: page.description
			});

			project.activePage = page;

			localStorage.set('activePage', page.name);

			if ( ! noEvent) {
				$rootScope.$broadcast('builder.page.changed', page);
                $rootScope.selectBox.hide();
                $rootScope.hoverBox.hide();
			}
		},

		/**
		 * Load saved project into builder or init new one.
		 * 
		 * @return void
		 */
		load: function(name) {

            this.get(name).success(function(data) { 
				project.active = data;
            	if (project.active) {
                	project.changePage(localStorage.get('activePage'));
            	} else {
                	project.createNewProject();
                	project.changePage('index');
            	}
			});

		},

		/**
		* Loads existing page from datastore
		* @author reddy
		*/
		loadExistingPage: function(pageId) {

            this.getPageFromDatastore(pageId).success(function(data) { 

            	var returnDataFormat = {"pages": []};
            	returnDataFormat.pages[0] = data;
            	$("#landingpagename",parent.document).val(returnDataFormat.pages[0].name);
            	$("#metatitle",parent.document).val(returnDataFormat.pages[0].title);
            	$("#metadesc",parent.document).val(returnDataFormat.pages[0].tags);
            	$("#metakeywords",parent.document).val(returnDataFormat.pages[0].description);
            	returnDataFormat.pages[0].name = "index";
				project.active = returnDataFormat;

            	if (project.active) {
                	project.changePage(localStorage.get('activePage'));
            	} else {
                	project.createNewProject();
                	project.changePage('index');
            	}
			});

		},

        createNewProject: function() {
            this.active = {
                pages: [
                    {
                        name: 'index',
                        html: '<!DOCTYPE html><html><head><title></title></head><body></body></html>',
                    }
                ]
            }
        },

		/**
		 * Save current project in database.
		 * 
		 * @param  {array}  what
		 * @return promise
		 */
		save: function(what) {
			
			if ($rootScope.savingChanges || ! project.active) {
				return false;
			}
			
			$rootScope.savingChanges = true;

			if ( ! what) { what = 'all'; }

			var page = project.getPage(project.activePage.name);

			//get new html
			if (what == 'all' || what.indexOf('html') > -1) {
				page.html = style_html(dom.getHtml());
			}
			
			//get new css
			if (what == 'all' || what.indexOf('css') > -1) {
				page.css = css.compile();
			}

            // localStorage.set('architect-project', this.active);

            var projectPageData = project.active.pages[0];

            var landingPageName = $("#landingpagename",parent.document).val();
            projectPageData['title'] = $("#metatitle",parent.document).val();
            projectPageData['tags'] = $("#metadesc",parent.document).val();
            projectPageData['description'] = $("#metakeywords",parent.document).val();

            if(landingPageName == "") {
            	alertify.log("Page name is required.", "error");
            	$rootScope.savingChanges = false;
            	return;
            }

            var reqMethod = "POST";

            var webPageObject = {
			  "name": landingPageName,
			  "html": projectPageData.html,
			  "css": projectPageData.css,
			  "js": projectPageData.js,
			  "title": projectPageData.title,
			  "tags": projectPageData.tags,
			  "description": projectPageData.description
			};

            if(typeof projectPageData.id != "undefined") {
            	webPageObject["id"] = projectPageData.id;
            	reqMethod = "PUT";
            }

			var req = {
			 method: reqMethod,
			 url: AGILE_LP_ROOT + 'core/api/landingpages',
			 headers: {
			   'Content-Type': "application/json"
			 },
			 data: JSON.stringify(webPageObject)
			};

            return $http(req).success(function(data) {

            	var returnDataFormat = {"pages": []};
            	returnDataFormat.pages[0] = data;
            	returnDataFormat.pages[0].name = "index";
				project.active = returnDataFormat;

				$("#landingpagename-msg",parent.document).html('<span style="color: green; margin-left: 85px;">Page saved.</span>').show().fadeOut(3000);

				$timeout(function() {
                	$(".saveLandingPageButton",parent.document).prop("disabled",false);
					$(".saveLandingPageButton",parent.document).html("Save Page");
					//window.parent.location.hash = ("landing-page/"+returnDataFormat.pages[0].id);
					if(typeof projectPageData.id == "undefined") {
						window.parent.location.hash = ("landing-pages");
					}
            	}, 3000);

				//alertify.log("Saved successfully.", "success");

			}).error(function(data) {
				$timeout(function() {
                	$(".saveLandingPageButton",parent.document).prop("disabled",false);
					$(".saveLandingPageButton",parent.document).html("Save Page");
            	}, 3000);
				//alertify.log(data.substring(0, 500), 'error', 2500);
			}).finally(function(data) {
				$rootScope.savingChanges = false;
			});

            $timeout(function() {
                $rootScope.savingChanges = false;
            }, 300)
		},

		/**
		 * Apply template with given id to active project.
		 * 
		 * @param  {int} id
		 * @return Promise
		 */
		useTemplate: function(id) {

			return $http.put('projects/'+this.active.id, { project: this.active, template: id }).success(function(data) {
				project.active = data;
				localStorage.set('activePage', 'index');
				project.changePage();

				if (angular.isString(project.activePage.libraries)) {
					project.activePage.libraries = JSON.parse(project.activePage.libraries);
				}			
			});            		      		
		},

		/**
		 * Request single project by id.
		 * 
		 * @param  {int} id
		 * @return promise
		 */
		get: function(id) {
			return $http.get(AGILE_LP_ROOT + 'landingpages/get-template?id='+id);
		},

		/**
		* Get page content from datastore
		* @author reddy
		*/
		getPageFromDatastore: function(id) {
			return $http.get(AGILE_LP_ROOT + 'core/api/landingpages/'+id);
		},

		/**
		 * Get all projects current user has access to.
		 * 
		 * @return promise
		 */
		getAll: function() {
			return $http.get('projects').success(function(data) { 
				project.all = data;
			});
		},

		/**
		 * Delete given project.
		 * 
		 * @param  {object} pr
		 * @return Promise
		 */
		delete: function(pr) {
			return $http.delete('projects/'+pr.id).success(function(data) {
				for (var i = 0; i < project.all.length; i++) {
					if (project.all[i].id == pr.id) {
						project.all.splice(i, 1);
					}
				};
			}).error(function(data) {
				alertify.log(data, 'error', 2000);
			});
		},

		/**
		 * Clear all active projects html,css and js.
		 * 
		 * @return promise
		 */
		clear: function() {
			if ($rootScope.savingChanges) {
				return false;
			}

			$rootScope.savingChanges = true;

			for (var i = project.active.pages.length - 1; i >= 0; i--) {
				project.active.pages[i].html = '';
				project.active.pages[i].css = '';
				project.active.pages[i].js = '';
			}

			$rootScope.selected.path = false;

            $rootScope.frameBody.html('');
            $rootScope.selectBox.hide();
            $rootScope.hoverBox.hide();
            $rootScope.savingChanges = false;

            project.save();
            $rootScope.$broadcast('builder.project.cleared');
		}
	};

	$rootScope.$on('builder.html.changed', blDebounce(function(e) {
		if (settings.get('enableAutoSave') && ! $rootScope.dragging) { project.save(['html']); };
	}, settings.get('autoSaveDelay')));

	$rootScope.$on('builder.css.changed', blDebounce(function(e) {
		if (settings.get('enableAutoSave') && ! $rootScope.dragging) { project.save(['css']); };
	}, settings.get('autoSaveDelay')));

	$rootScope.$on('builder.js.changed', blDebounce(function(e) {
		if (settings.get('enableAutoSave') && ! $rootScope.dragging) { project.save(['js']); };
	}, settings.get('autoSaveDelay')));

	$rootScope.$on('builder.theme.changed', blDebounce(function(e) {
		if (settings.get('enableAutoSave') && ! $rootScope.dragging) { project.save(['theme']); };
	}, settings.get('autoSaveDelay')));

	return project;
}]);
