/** 
* Deal sources and los reasons actions collection view
*/
var Sources_Loss_Reasons_Events_Collection_View = Base_Collection_View.extend({
    events: {
        'click .add_deal_source' : 'dealSourceAdd',
        'keypress #deal_source_name' : 'dealSourceAddWithEnterBtn',
        'click .deal-source-edit' : 'dealSourceEdit',
        'keypress .update_deal_source' : 'dealSourceUpdateWithEnterBtn',
        'click .updates_deal_source' : 'dealSourceUpdate',
        'click .deal-source-delete' : 'dealSourceDelete',
        'click .add_lost_reason' : 'lossReasonAdd',
        'keypress .lost_reason_name' : 'lossReasonAddWithEnterBtn',
        'click .lost-reason-edit' : 'lossReasonEdit',
        'keypress .update_lost_reason' : 'lossReasonUpdateWithEnterBtn',
        'click .updates_lost_reason' : 'lossReasonUpdate',
        'click .lost-reason-delete' : 'lossReasonDelete',
        'click .goalSave' : 'goalSave',
        'keypress .count' : 'goalCount',
        'keypress .amount' : 'goalAmount',
        'click .show_milestone_field' : 'showMilestoneField'
    },

    dealSourceAdd : function(e){
        e.preventDefault();
        if($('#deal_source_name').val().trim()==""){
            $('#deal_source_name_error').show();
            return false;
        }
        if(!categories.isValid($('#deal_source_name').val().trim())){
            $('#deal_source_chars_error').show();
            return false;
        }
        var obj = serializeForm('dealSourcesForm');
        if(App_Admin_Settings.dealSourcesView && App_Admin_Settings.dealSourcesView.collection)
        {
            var maxPos = 0;
            $.each(App_Admin_Settings.dealSourcesView.collection.models, function(index, dealSource){
                if(dealSource.get("order") > maxPos) {
                    maxPos = dealSource.get("order");
                }
            });
            obj['order'] = maxPos + 1;
        }
        
        var model = new BaseModel();
        model.url = 'core/api/categories';
        model.save(obj, {
        success: function (data) {
            var model = data.toJSON();
            App_Admin_Settings.dealSourcesView.collection.add(new BaseModel(model));
            $('.show_field').find('#deal_source_name').val("");
            $('.show_field').hide();
            $('.show_deal_source_add').show();
        },
        error: function (model, response) {
            if(response.status==400 && response.responseText=="Source with this name already exists."){
                $('#deal_source_existed_error').show();
            }
        }});
    },

    dealSourceAddWithEnterBtn : function(e){
        $('#deal_source_name_error').hide();
        $('#deal_source_existed_error').hide();
        $('#deal_source_chars_error').hide();
        if(e.keyCode == 13)
        {
            e.preventDefault();
            var form = $(this).closest("form");
            form.find(".add_deal_source").click();
        }
    },

    dealSourceEdit : function(e){
        $(e.currentTarget).closest('tr').find('.deal_source_name_div').hide();
        $(e.currentTarget).closest('tr').find('.deal_source_name_input').show();
    },

    dealSourceUpdateWithEnterBtn : function(e){
        if(e.which == 13){
            e.preventDefault();
            if($(e.currentTarget).val().trim()==""){
                $('#deal_source_name_error_'+$(e.currentTarget).attr("id")).show();
                return false;
            }
            if(!categories.isValid($(e.currentTarget).val().trim())){
                $('#deal_source_chars_error_'+$(e.currentTarget).attr("id")).show();
                return false;
            }
            var obj = serializeForm('dealSourcesForm_'+$(e.currentTarget).attr("id"));
            var model = new BaseModel();
            model.url = 'core/api/categories';
            model.save(obj, {
            success: function (data) {
                var model = data.toJSON();
                App_Admin_Settings.dealSourcesView.collection.get(model).set(new BaseModel(model));
                $('.deal_source_name_input').hide();
                $('.deal_source_name_div').show();
            },
            error: function (model, response) {
                if(response.status==400 && response.responseText=="Source with this name already exists."){
                    $('#deal_source_existed_error').show();
                }
            }});
        }else{
            $('#deal_source_name_error_'+$(e.currentTarget).attr("id")).hide();
            $('#deal_source_existed_error_'+$(e.currentTarget).attr("id")).hide();
            $('#deal_source_chars_error_'+$(e.currentTarget).attr("id")).hide();
        }
    },

    dealSourceUpdate : function(e){
        e.preventDefault();
        if($(e.currentTarget).parent().find('input:text').val().trim()==""){
            $('#deal_source_name_error_'+$(e.currentTarget).parent().find('input:text').attr("id")).show();
            return false;
        }
        if(!categories.isValid($(e.currentTarget).parent().find('input:text').val().trim())){
            $('#deal_source_chars_error_'+$(e.currentTarget).parent().find('input:text').attr("id")).show();
            return false;
        }
        var obj = serializeForm('dealSourcesForm_'+$(e.currentTarget).parent().find('input:text').attr("id"));
        var model = new BaseModel();
        model.url = 'core/api/categories';
        model.save(obj, {
        success: function (data) {
            var model = data.toJSON();
            App_Admin_Settings.dealSourcesView.collection.get(model).set(new BaseModel(model));
            $('.deal_source_name_input').hide();
            $('.deal_source_name_div').show();
        },
        error: function (model, response) {
            if(response.status==400 && response.responseText=="Source with this name already exists."){
                $('#deal_source_existed_error').show();
            }
        }});
    },

    dealSourceDelete : function(e){
        e.preventDefault();
        var $that = $(e.currentTarget);
        showAlertModal("delete_deal_source", "confirm", function(){
            var obj = serializeForm($that.closest('form').attr("id"));
            var model = new BaseModel();
            model.url = 'core/api/categories/'+obj.id;
            model.set({ "id" : obj.id });
            model.destroy({
            success: function (data) {
                var model = data.toJSON();
              App_Admin_Settings.dealSourcesView.collection.remove(new BaseModel(model));
              $that.closest('tr').remove();
            },
            error: function (model, response) {
            
            }});
        });
    },

    lossReasonAdd : function(e){
        e.preventDefault();
        if($('#lost_reason_name').val().trim()==""){
            $('#lost_reason_name_error').show();
            return false;
        }
        if(!categories.isValid($('#lost_reason_name').val().trim())){
            $('#lost_reason_chars_error').show();
            return false;
        }
        var obj = serializeForm('lostReasonsForm');
        var model = new BaseModel();
        model.url = 'core/api/categories';
        model.save(obj, {
        success: function (data) {
            var model = data.toJSON();
            App_Admin_Settings.dealLostReasons.collection.add(new BaseModel(model));
            $('.show_field').find('#lost_reason_name').val("");
            $('.show_field').hide();
            $('.show_lost_reason_add').show();
        },
        error: function (model, response) {
            if(response.status==400 && response.responseText=="Reason with this name already exists."){
                $('#lost_reason_existed_error').show();
            }
        }});
    },

    lossReasonAddWithEnterBtn : function(e){
        $('#lost_reason_name_error').hide();
        $('#lost_reason_existed_error').hide();
        $('#lost_reason_chars_error').hide();
        if(e.keyCode == 13)
        {
            e.preventDefault();
            var form = $(this).closest("form");
            form.find(".add_lost_reason").click();
        }
    },

    lossReasonEdit : function(e){
        e.preventDefault();
        $(e.currentTarget).closest('tr').find('.lost_reason_name_div').hide();
        $(e.currentTarget).closest('tr').find('.lost_reason_name_input').show();
    },

    lossReasonUpdateWithEnterBtn : function(e){
        if(e.which == 13){
            e.preventDefault();
            if($(e.currentTarget).val().trim()==""){
                $('#lost_reason_name_error_'+$(e.currentTarget).attr("id")).show();
                return false;
            }
            if(!categories.isValid($(e.currentTarget).val().trim())){
                $('#lost_reason_chars_error_'+$(e.currentTarget).attr("id")).show();
                return false;
            }
            var obj = serializeForm('lostReasonsForm_'+$(e.currentTarget).attr("id"));
            var model = new BaseModel();
            model.url = 'core/api/categories';
            model.save(obj, {
            success: function (data) {
                var model = data.toJSON();
                App_Admin_Settings.dealLostReasons.collection.get(model).set(new BaseModel(model));
                $('.lost_reason_name_input').hide();
                $('.lost_reason_name_div').show();
            },
            error: function (model, response) {
                if(response.status==400 && response.responseText=="Reason with this name already exists."){
                    $('#lost_reason_existed_error').show();
                }
            }});
        }else{
            $('#lost_reason_name_error_'+$(e.currentTarget).attr("id")).hide();
            $('#lost_reason_existed_error_'+$(e.currentTarget).attr("id")).hide();
            $('#lost_reason_chars_error_'+$(e.currentTarget).attr("id")).hide();
        }
    },

    lossReasonUpdate : function(e){
        if($(e.currentTarget).parent().find('input:text').val().trim()==""){
            $('#lost_reason_name_error_'+$(e.currentTarget).parent().find('input:text').attr("id")).show();
            return false;
        }
        if(!categories.isValid($(e.currentTarget).parent().find('input:text').val().trim())){
            $('#lost_reason_chars_error_'+$(e.currentTarget).parent().find('input:text').attr("id")).show();
            return false;
        }
        var obj = serializeForm('lostReasonsForm_'+$(e.currentTarget).parent().find('input:text').attr("id"));
        var model = new BaseModel();
        model.url = 'core/api/categories';
        model.save(obj, {
        success: function (data) {
            var model = data.toJSON();
            App_Admin_Settings.dealLostReasons.collection.get(model).set(new BaseModel(model));
            $('.lost_reason_name_input').hide();
            $('.lost_reason_name_div').show();
        },
        error: function (model, response) {
            if(response.status==400 && response.responseText=="Reason with this name already exists."){
                $('#lost_reason_existed_error').show();
            }
        }});
    },

    lossReasonDelete : function(e){
        e.preventDefault();
        var $that = $(e.currentTarget);
        showAlertModal("delete_lost_reason", "confirm", function(){
            var obj = serializeForm($that.closest('form').attr("id"));
            var model = new BaseModel();
            model.url = 'core/api/categories/'+obj.id;
            model.set({ "id" : obj.id });
            model.destroy({
            success: function (data) {
                var model = data.toJSON();
              App_Admin_Settings.dealLostReasons.collection.remove(new BaseModel(model));
              $that.closest('tr').remove();
            },
            error: function (model, response) {
            
            }});
        });
    },

    goalSave : function(e){
        e.preventDefault();
        var flag=true;
            
        var that=$(this);
        var goals_json=[];
        var d=$('#goal_duration span').html();
        if(window.navigator.userAgent.indexOf("Mozilla") != -1 && window.navigator.userAgent.indexOf("Chrome")==-1)
                            d="01 "+d;
        d=new Date(d);
        var start=getUTCMidNightEpochFromDate(d);
                    
        $("#deal-sources-table").find("tr").not(':first').each(function(index){
            if(($(this).find('.amount').val().trim())!="" && ((parseFloat($(this).find('.amount').val().trim())<0) || !(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test($(this).find('.amount').val()))){
                $(this).find('#goal_amount_error').show();
                flag=false;
                return false;
            }
            if(($(this).find('.count').val().trim())!="" && ((parseFloat($(this).find('.count').val().trim())<0) || !(/^[0-9]*$/).test($(this).find('.count').val()))){
                $(this).find('#goal_count_error').show();
                flag=false;
                return false;
            }
            if($(this).find("#goal_amount_error").is(':visible'))
                $(this).find('#goal_amount_error').hide();
            if($(this).find("#goal_count_error").is(':visible'))
                $(this).find('#goal_count_error').hide();
            var goal_single_user={};
            if($(this).attr('id')!=null && ($(this).attr('data')==start/1000))
                goal_single_user.id=$(this).attr('id');
            goal_single_user.domain_user_id=$(this).find('.goal').attr('id');
            goal_single_user.amount=$(this).find('.amount').val().trim();
            goal_single_user.count=$(this).find('.count').val().trim();
            goal_single_user.start_time=start/1000;
            goals_json.push(goal_single_user);

        });
        if(flag){
            $('.goalSave').attr("disabled","disabled");
            $('.Count_goal').text(0);
            $('.Amount_goal').text(0);
            $.ajax({ type : 'POST', url : '/core/api/goals', data : JSON.stringify(goals_json),
                contentType : "application/json; charset=utf-8", dataType : 'json' ,
                success : function(e)
                {
                    console.log(e);
                    var count=0;
                    var amount=0;
                    $("#deal-sources-table").find("tr").not(':first').each(function(index){
                        var that=$(this);
                        $.each(e,function(index,jsond){
                            if(jsond.domain_user_id==that.find('.goalid').attr('id')){
                                that.attr('id',jsond.id);
                                that.attr('data',jsond.start_time);

                            }
                         });
                        if(that.find('.count').val().trim()!="")
                            count=count+parseInt(that.find('.count').val());
                        if(that.find('.amount').val().trim()!="")
                            amount=amount+parseFloat(that.find('.amount').val());
                    });
                    percentCountAndAmount(count,amount);
                    $save_info = $('<div style="display:inline-block"><small><p class="text-info"><i>Changes Saved</i></p></small></div>');

                    $('.Goals_message').html($save_info);

                    $save_info.show();

                    setTimeout(function()
                    {
                        $('.Goals_message').empty();
                        $('.goalSave').removeAttr("disabled");
                    }, 500);
            
                }
            });
        }
    },

    goalCount : function(e){
        $(e.currentTarget).siblings('#goal_count_error').hide();
    },

    goalAmount : function(e){
        $(e.currentTarget).siblings('#goal_amount_error').hide();
    },

    showMilestoneField : function(e){
        e.preventDefault();
        var form = $(e.currentTarget).closest('form');
        console.log('New Milestone to - ',form.attr('id'));
        $(e.currentTarget).closest("div").css("display","none");
        form.find('.show_field').css("display","block");
        form.find(".add_new_milestone").focus();
    }

    
});