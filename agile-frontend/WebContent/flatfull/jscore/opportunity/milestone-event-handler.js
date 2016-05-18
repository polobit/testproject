/** 
* Track and milestone actions collection view
*/
var Track_And_Milestone_Events_Collection_View = Base_Collection_View.extend({
    events: {
        /** Deals actions */
        'click .add-pipeline' : 'pipelineAdd',
        'click .pipeline-edit' : 'pipelineEdit',
        'click .pipeline-delete' : 'pipelineDelete',
        'click .milestone-delete' : 'milestoneDelete',
        'click .show_milestone_field' : 'showMilesoneField',
        'click .add_milestone' : 'addMilestone',
        'keypress .add_new_milestone' : 'addMilestoneWithEnterBtn'
    },

    pipelineAdd : function(e){
        e.preventDefault();
        $('#pipelineForm input').val('');
        $('#pipelineForm input#milestones').val('New,Prospect,Proposal,Won,Lost');
        $('#pipelineForm input#won_milestone').val('Won');
        $('#pipelineForm input#lost_milestone').val('Lost');
        $('#pipelineModal').find('.save-status').html('');
    },

    pipelineEdit : function(e){
        e.preventDefault();
        var id = $(e.currentTarget).attr('id');
        var json = App_Admin_Settings.pipelineGridView.collection.get(id).toJSON();
        deserializeForm(json,$('#pipelineForm'));
    },

    pipelineDelete : function(e){
        e.preventDefault();
        var id = $(e.currentTarget).attr('id');
        var name = $(e.currentTarget).attr('data');
        $('#track-name').text(name);
        // If Yes clicked
        $('body').on('click', '#pipeline-delete-confirm', function(e) {
            e.preventDefault();
            if($(this).attr('disabled'))
                 return;
            
            $(this).attr('disabled', 'disabled');
            var that = $(this);
             // Shows message
            $save_info = $('<img src="'+updateImageS3Path("img/1-0.gif")+'" height="18px" width="18px" style="opacity:0.5;"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Deleting track.</i></small></span>');
            $(this).parent('.modal-footer').find('.pipeline-delete-message').append($save_info);
            $save_info.show();
            // Export Deals.
            $.ajax({
                url: '/core/api/milestone/pipelines/'+id,
                type: 'DELETE',
                success: function() {
                    console.log('Deleted!');
                    $('#pipeline-delete-modal').modal('hide');
                    if(_agile_get_prefs("agile_deal_track") && _agile_get_prefs("agile_deal_track") == id)
                        _agile_delete_prefs("agile_deal_track");
                    if(_agile_get_prefs("deal-filters")){
                        var json = $.parseJSON(_agile_get_prefs("deal-filters"));
                        if(json.pipeline_id = id)
                            _agile_delete_prefs("deal-filters");
                    }
                    
                    App_Admin_Settings.milestones();
                    $('body').removeClass('modal-open');
                    $save_info.hide();
                    that.removeAttr('disabled');
                },
                error : function(jqXHR, status, errorThrown){
                    console.log(jqXHR);
                    $save_info.hide();
                    $('#pipeline-delete-modal').find('.pipeline-delete-message').text(jqXHR.responseText);
                    that.removeAttr('disabled');
                }
            });
        });
    },

    milestoneDelete : function(e){
        e.preventDefault();
        if (!confirm("Are you sure you want to delete ?" ))
            return;
        
        var formId = $(e.currentTarget).closest('form');
        if($(e.currentTarget).closest('tr').find('.mark-won').length > 0){
            formId.find('input[name="won_milestone"]').val('');
        } else if($(e.currentTarget).closest('tr').find('.mark-lost').length > 0){
            formId.find('input[name="lost_milestone"]').val('');
        }
        $(e.currentTarget).closest('tr').css("display", "none");
        fill_ordered_milestone($(e.currentTarget).closest('form').attr('id'));
    },

    /**
     * Shows input field to add new milestone.
     */
    showMilesoneField : function(e){
        e.preventDefault();
        var form = $(e.currentTarget).closest('form');
        console.log('New Milestone to - ',form.attr('id'));
        $(e.currentTarget).closest("div").css("display","none");
        form.find('.show_field').css("display","block");
        form.find(".add_new_milestone").focus();
    },

    /**
     * Adds new milestone to the sortable list.
     */
    addMilestone : function(e){
        e.preventDefault();
        var form = $(e.currentTarget).closest('form');
        var new_milestone = form.find(".add_new_milestone").val().trim();

        if(form.find(".add_new_milestone").val().trim()==""){
            $('#new_milestone_name_error_'+form.attr('id').split('milestonesForm_')[1]).show();
            return false;
        }
        if(!(/^[a-zA-Z0-9-_ ]*$/).test(form.find(".add_new_milestone").val().trim())){
            $('#new_milestone_chars_error_'+form.attr('id').split('milestonesForm_')[1]).show();
            return false;
        }
        form.find('.show_field').css("display","none");
        form.find(".show_milestone_field").closest("div").css("display","inline-block");
        
        if(!new_milestone || new_milestone.length <= 0 || (/^\s*$/).test(new_milestone))
        {
            return;
        }
        
        // To add a milestone when input is not empty
        if(new_milestone != "")
        {
            e.preventDefault();
        
            // Prevents comma (",") as an argument to the input field
            form.find(".add_new_milestone").val("");
            
            var milestone_list = form.find('tbody');
            var add_milestone = true;
            
            // Iterate over already present milestones, to check if this is a new milestone
            milestone_list.find('tr').each(function(index, elem){
                if($(elem).is( ":visible") && elem.getAttribute('data').toLowerCase() == new_milestone.toLowerCase())
                {
                    add_milestone = false; // milestone exists, don't add
                    return false;
                }
            });
            
            if(add_milestone)
            {

                var html = "<tr data='{{new_milestone}}' style='display: table-row;'><td><div class='milestone-name-block inline-block v-top text-ellipsis' style='width:80%'>";
                html += "{{new_milestone}}</div></td><td class='b-r-none'><div class='m-b-n-xs'>";
                html += "<a class='milestone-won text-l-none-hover c-p text-xs hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Won Milestone'><i class='icon-like'></i></a>";
                html += "<a class='milestone-lost text-l-none-hover c-p text-xs m-l-sm hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Lost Milestone'><i class='icon-dislike'></i></a>";
                html += "<a class='milestone-delete c-p m-l-sm text-l-none text-xs hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Delete Milestone'><i class='icon icon-trash'></i>" +
                "</a><a class='text-l-none-hover c-p text-xs m-l-sm hover-show' style='visibility:hidden;'><i title='Drag' class='icon-move'></i></a></div></td></tr>";
                milestone_list.append(Handlebars.compile(html)({new_milestone : new_milestone}));
                //milestone_list.append("<tr data='"+new_milestone+"' style='display: table-row;'><td><div style='display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%'>"+new_milestone+"</div></td><td><div class='m-b-n-xs' style='display:none;'><a class='text-l-none-hover c-p'><i title='Drag' class='icon-move'></i></a><a class='milestone-delete' style='cursor: pointer;margin-left:10px; text-decoration: none;' data-toggle='modal' role='button' href='#'><i title='Delete Milestone' class='task-action icon icon-trash'></i></a></div></td></tr>");
                //milestone_list.append("<li data='" + new_milestone + "'><div><span>" + new_milestone + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>");
                fill_ordered_milestone(form.attr('id'));
            }
        }
    },

    addMilestoneWithEnterBtn : function(e){
        var form = $(e.currentTarget).closest('form');
        $('#new_milestone_name_error_'+form.attr('id').split('milestonesForm_')[1]).hide();
        $('#new_milestone_existed_error_'+form.attr('id').split('milestonesForm_')[1]).hide();
        $('#new_milestone_chars_error_'+form.attr('id').split('milestonesForm_')[1]).hide();
        if(e.keyCode == 13)
        {
            var form = $(e.currentTarget).closest("form");
            form.find(".add_milestone").click();
        }
    },
});