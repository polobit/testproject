angular.module('builder')

.factory('keybinds', ['$rootScope', 'dom', 'undoManager', function($rootScope, dom, undoManager) {

	var keybinds = {

		booted: false,

		init: function() {
			if ( ! this.booted) {
			
				$($rootScope.frameDoc.documentElement).keydown(function(e) {

				   	if (e.which === 38) {
				   		// arrow donw
				   		//e.preventDefault();
				        //dom.moveSelected('up');
				   	} else if (e.which === 40) {
				   		// arrow up
				   		//e.preventDefault();
				        //dom.moveSelected('down');
				   	} else if (e.which === 46) {
				   		// del
				   		//e.preventDefault();
				        //dom.delete($rootScope.selected.node);
				   	} else if (e.which === 8) {
				   		//backspace or mac fn+delete
				   		if(navigator.platform.indexOf("Mac") != -1) {
				   			if(!confirm("It looks like you have been editing something. If you leave before saving, your changes will be lost. Are you sure ?")) {
				   				e.preventDefault();
				   			}
				   		} else {
				   			e.preventDefault();
				        	dom.delete($rootScope.selected.node);
				   		}
				   	} else if (e.which === 67 && e.ctrlKey) {
				   		// C + Ctrl
				   		e.preventDefault();
				       	dom.copy($rootScope.selected.node);
				   	} else if (e.which === 86 && e.ctrlKey) {
				   		// V + Ctrl
				   		e.preventDefault();
				       	dom.paste($rootScope.selected.node);
				   	} else if (e.which === 88 && e.ctrlKey) {
				   		// X + Ctrl
				   		e.preventDefault();
				       	dom.cut($rootScope.selected.node);
				   	} else if (e.which === 89 && e.ctrlKey) {
                        // Y + Ctrl
                        undoManager.redo();
                    } else if (e.which === 90 && e.ctrlKey) {
                        // Z + Ctrl
                        undoManager.undo();
                    }
				});

				this.booted = true;
			}
		}
	};

	return keybinds;
	
}]);