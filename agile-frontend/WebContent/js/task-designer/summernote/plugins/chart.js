$.summernote.plugins = {
      	"chart" : {
      		
      		label : 'chart', 
      		
      		shortcut : "",
      		
      		dropdown : function() {
      			 var dropdown = '<ul class="dropdown-menu">' +
                           '<li class="btn" data-event="chart" data-value="rect">add Rect</li>' +
                           '<li class="btn" data-event="chart" data-value="circle">add Circle</li>' +
                           '<li class="btn" data-event="chart" data-value="line">add Line</li>' +
                       '</ul>';
                       
                return dropdown;
      		},
      		
      		event : function(e, editor, layout) {
      			
      			var value = $(e.target).data('value');
      			var $editable = layout.editable();
      			$editable.trigger('focus');
      			      			
      			if (value == 'rect') {
      				var dom = $("<div />").css({width:100,height:100,background:'red'})[0]
      			} else if (value == 'circle') {
      				var dom = $("<div />").css({width:100,height:100,background:'red','border-radius' : '50px'})[0]
      			} else if (value == 'line') {
      				var dom = $("<div />").css({width:100,height:10,background:'red'})[0]
      			}
      			
				    editor.insertDom($editable, dom);
      		}
      	}
      }