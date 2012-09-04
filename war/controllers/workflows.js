var WorkflowsRouter = Backbone.Router.extend({

    routes: {
    	
        /* Workflows/Campaigns */
        "workflows": "workflows",
        "workflow-add": "workflowAdd",
        "workflow/:id": "workflowEdit",
          },
            
      workflows: function () {
            this.workflowsListView = new Base_Collection_View({
                url: '/core/api/workflows',
                restKey: "workflow",
                templateKey: "workflows",
                individual_tag_name: 'tr'
            });
            
          
            this.workflowsListView.collection.fetch();
            $('#content').html(this.workflowsListView.el);  
            
            $(".active").removeClass("active");
            $("#workflowsmenu").addClass("active");
        },
        workflowAdd: function () {
            if (!this.workflowsListView || !this.workflowsListView.collection) {
                this.navigate("workflows", {
                    trigger: true
                });
                return;
            }

            /* Reset the designer JSON */
            this.workflow_json = undefined;
            this.workflow_model = undefined;
            
            $('#content').html(getTemplate('workflow-add', {}));
        },
        workflowEdit: function (id) {
            if (!this.workflowsListView || this.workflowsListView.collection.length == 0) {
                this.navigate("workflows", {
                    trigger: true
                });
                return;
            }

            /* Set the designer JSON. This will be deserialized*/
            this.workflow_model = this.workflowsListView.collection.get(id);
            this.workflow_json = this.workflow_model.get("rules");

            $('#content').html(getTemplate('workflow-add', {}));
            
            // Set the name
            $('#workflow-name').val(this.workflow_model.get("name")); 
        }
});