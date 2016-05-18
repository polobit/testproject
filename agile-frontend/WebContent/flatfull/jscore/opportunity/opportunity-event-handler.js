/** 
* Opportunity actions collection view
*/
var Deals_Milestone_Events_Collection_View = Base_Collection_View.extend({
    events: {
    	/** Deals actions */
    	'click .deal-edit' : 'dealEdit',
        'click .deal-delete' : 'dealDelete',
        'click .deal-archive' : 'dealArchive',
        'click .deal-restore' : 'dealRestore',
        /** Deals bulk actions */
        'click #bulk_deals_owner_change' : 'bulkDealsOwnerChange',
        'click #bulk_deals_milestone_change' : 'bulkDealsMilestoneChange',
        'click #bulk_deals_add_tag_to_contacts' : 'bulkDealsAddTagToContacts',
        'click #bulk_deals_add_campaign_to_contacts' : 'bulkDealsAddCampaignToContacts',
        'click #bulk_deals_archive' : 'bulkDealsArchive',
        'click #bulk_deals_restore' : 'bulkDealsRestore',
        'click #bulk_deals_delete' : 'bulkDealsDelete'
    },

    dealEdit : function(e){
        e.preventDefault();
        var id = $(e.currentTarget).closest('.data').attr('id');
        var milestone = ($(e.currentTarget).closest('ul').attr("milestone")).trim();
        var currentDeal;

        // Get the current deal model from the collection.
        var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
        if (!dealPipelineModel)
            return;
        currentDeal = dealPipelineModel[0].get('dealCollection').get(id).toJSON();

        if (currentDeal)
            updateDeal(currentDeal, true);
    },

    dealDelete : function(e){
        e.preventDefault();

        var id = $(e.currentTarget).closest('.data').attr('id');
        var milestone = ($(e.currentTarget).closest('ul').attr("milestone")).trim();
        var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });

        if(dealPipelineModel)
        {
            if(!hasScope("MANAGE_DEALS"))
            {
                if(dealPipelineModel[0].get('dealCollection').get(id).get('owner').id != CURRENT_DOMAIN_USER.id)
                {
                    $('#deal_delete_privileges_error_modal').html(getTemplate("deal-delete-privileges-error-modal")).modal('show');
                    return;
                }
                else
                {
                    if (!confirm("Are you sure you want to delete?"))
                        return;
                }
            }
            else
            {
                if (!confirm("Are you sure you want to delete?"))
                    return;
            }
        }
        else
        {
            if (!confirm("Are you sure you want to delete?"))
                return;
        }

        var id_array = [];
        var id_json = {};

        // Create array with entity id.
        id_array.push(id);

        // Set entity id array in to json object with key ids,
        // where ids are read using form param
        id_json.ids = JSON.stringify(id_array);

        var that = this;
        $.ajax({ url : 'core/api/opportunity/' + id, type : 'DELETE', success : function()
        {
            // Remove the deal from the collection and remove the UI element.
            var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
            if (!dealPipelineModel)
                return;

            var dealRemoveModel = dealPipelineModel[0].get('dealCollection').get(id);
            
            var dealRemoveValue = dealRemoveModel.attributes.expected_value;
            
            var removeDealValue = parseFloat($('#'+milestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(dealRemoveValue); 
            


            $('#'+milestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(removeDealValue));
          
            $('#'+ milestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + milestone.replace(/ +/g, '') + '_count').text()) - 1);    
              
             /* average of deal total */
            var avg_deal_size = 0;
            var deal_count = parseInt($('#' + milestone.replace(/ +/g, '') + '_count').text()); 
            if(deal_count == 0)
                avg_new_deal_size = 0;
            else
                avg_new_deal_size = removeDealValue / deal_count;   

            removeDealValue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(removeDealValue) ;
            avg_new_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_new_deal_size);
            var heading = milestone.replace(/ +/g, '');
            var symbol = getCurrencySymbolForCharts();
           
            $("#"+heading+" .dealtitle-angular").removeAttr("data"); 
            var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();          
            var dealdata = {"dealTrack":dealTrack,"heading": heading ,"dealcount":removeDealValue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":deal_count};
            var dealDataString = JSON.stringify(dealdata); 
            $("#"+heading+" .dealtitle-angular").attr("data" , dealDataString); 

            dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));



            // Removes deal from list
            $(that).closest('li').css("display", "none");

            // Shows Milestones Pie
            pieMilestones();

            // Shows deals chart
            dealsLineChart();
        }, error : function(err)
        {
            $('.error-status', $('#opportunity-listners')).html(err.responseText);
            setTimeout(function()
            {
                $('.error-status', $('#opportunity-listners')).html('');
            }, 2000);
            console.log('-----------------', err.responseText);
        } });
    },

    dealArchive : function(e){
        e.preventDefault();

        var temp = {};
        temp.id = $(this).closest('.data').attr('id');
        temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
        $("#deal_archive_confirm_modal").html(getTemplate('archive-deal'));
        $("#archived-deal-id", $("#deal_archive_confirm_modal")).val(temp.id);
        $("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val(temp.milestone);
        $("#deal_archive_confirm_modal").modal('show');
    },

    dealRestore : function(e){
        e.preventDefault();

        var temp = {};
        temp.id = $(this).closest('.data').attr('id');
        temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
        $("#deal_restore_confirm_modal").html(getTemplate('restore-deal'));
        $("#restored-deal-id", $("#deal_restore_confirm_modal")).val(temp.id);
        $("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val(temp.milestone);
        $("#deal_restore_confirm_modal").modal('show');
    },

    bulkDealsOwnerChange : function(e){
        e.preventDefault();
        getTemplate('deal-owner-change-modal', {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            $("#deal_owner_change_modal").html($(template_ui)).modal("show");
            
            // Fills owner select element
            populateUsers("owners-list-bulk", $(template_ui), undefined, undefined, function(data, optionsHTML){
                console.log(optionsHTML);
                $("#deal_owner_change_modal").find("#owners-list-bulk").html(optionsHTML);
                $("#owners-list-bulk", $("#deal_owner_change_modal")).closest('div').find('.loading').hide(); 
            });

            $("#deal_owner_change_modal").off("click", "#deal-bulk-owner");
            $("#deal_owner_change_modal").on("click", "#deal-bulk-owner", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkOwnerChangeDeals();
            });

        }, '#owners-list-bulk');
    },

    bulkDealsMilestoneChange : function(e){
        e.preventDefault();
        getTemplate('deal-mile-change-modal', {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
            {
                showModalConfirmation("Bulk Update", 
                        "You may not have permission to update some of the deals selected. Proceeding with this operation will update only the deals that you are permitted to update.<br/><br/> Do you want to proceed?", 
                        function (){
                            $("#deal_mile_change_modal").html($(template_ui)).modal("show");
                        });
            }else
            {
                $("#deal_mile_change_modal").html($(template_ui)).modal("show");
            }
            
            // Fills tracks
            populateTracks($(template_ui), undefined, undefined, function(data, optionsHTML){
                console.log(optionsHTML);
                $("#deal_mile_change_modal").find("#pipeline-list-bulk").html(optionsHTML);
                $("#pipeline-list-bulk", $("#deal_mile_change_modal")).closest('div').find('.loading').hide(); 
            });

            $("#deal_mile_change_modal").off("change", "#pipeline-list-bulk");
            $("#deal_mile_change_modal").on("change", "#pipeline-list-bulk", function(e){
                e.preventDefault();
                var pipeline_id = $("#pipeline-list-bulk", $("#deal_mile_change_modal")).val();
                populateMilestones($(template_ui), undefined, pipeline_id, undefined, function(optionsHTML){
                    console.log(optionsHTML);
                    $("#deal_mile_change_modal").find("#milestone-list-bulk").html(optionsHTML);
                    $("#milestone-list-bulk", $("#deal_mile_change_modal")).closest('div').find('.loading').hide(); 
                });
            });

            $("#deal_mile_change_modal").off("click", "#deal-bulk-mile");
            $("#deal_mile_change_modal").on("click", "#deal-bulk-mile", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkMilestoneChange($(e.currentTarget));
            });

        }, '#pipeline-list-bulk');
    },

    bulkDealsAddTagToContacts : function(e){
        e.preventDefault();
        getTemplate('deal-contact-add-tag-modal', {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            $("#deal_contact_add_tag_modal").html($(template_ui)).modal("show");

            setup_tags_typeahead();

            $("#deal_contact_add_tag_modal").off("click", "#deal-contact-add-tag");
            $("#deal_contact_add_tag_modal").on("click", "#deal-contact-add-tag", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkAddDealContactTags($(e.currentTarget));
            });

        }, '');
    },

    bulkDealsAddCampaignToContacts : function(e){
        e.preventDefault();
        getTemplate('deal-contact-add-camp-modal', {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            $("#deal_contact_add_camp_modal").html($(template_ui)).modal("show");
            
            deal_bulk_actions.fillCampaignsList($('#workflows-list-bulk',$("#deal_contact_add_camp_modal")));

            $("#deal_contact_add_camp_modal").off("click", "#deal-contact-add-camp");
            $("#deal_contact_add_camp_modal").on("click", "#deal-contact-add-camp", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkAddDealContactsToCamp($(e.currentTarget));
            });

        }, '');
    },

    bulkDealsArchive : function(e){
        e.preventDefault();
        var template_key = "deal-bulk-archive-modal";
        if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
        {
            template_key = "deal-bulk-archive-acl-modal";
        }

        getTemplate(template_key, {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
            {
                $('#deal_bulk_archive_acl_modal').html($(template_ui)).modal("show");
            }else
            {
                $('#deal_bulk_archive_modal').html($(template_ui)).modal("show");
            }

            $("#deal_bulk_archive_modal").off("click", "#deal-bulk-archive");
            $("#deal_bulk_archive_modal").on("click", "#deal-bulk-archive", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkArchiveDeals(false);
            });

            $("#deal_bulk_archive_acl_modal").off("click", "#deal-bulk-archive-acl");
            $("#deal_bulk_archive_acl_modal").on("click", "#deal-bulk-archive-acl", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkArchiveDeals(true);
            });

        }, '');
    },

    bulkDealsRestore : function(e){
        e.preventDefault();
        var template_key = "deal-bulk-restore-modal";
        if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
        {
            template_key = "deal-bulk-restore-acl-modal";
        }

        getTemplate(template_key, {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
            {
                $('#deal_bulk_restore_acl_modal').html($(template_ui)).modal("show");
            }else
            {
                $('#deal_bulk_restore_modal').html($(template_ui)).modal("show");
            }

            $("#deal_bulk_restore_modal").off("click", "#deal-bulk-restore");
            $("#deal_bulk_restore_modal").on("click", "#deal-bulk-restore", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkRestoreDeals(false);
            });

            $("#deal_bulk_restore_acl_modal").off("click", "#deal-bulk-restore-acl");
            $("#deal_bulk_restore_acl_modal").on("click", "#deal-bulk-restore-acl", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkRestoreDeals(true);
            });

        }, '');
    },

    bulkDealsDelete : function(e){
        e.preventDefault();
        var template_key = "deal-bulk-delete-modal";
        if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
        {
            template_key = "deal-bulk-delete-acl-modal";
        }

        getTemplate(template_key, {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
            {
                $('#deal_bulk_delete_acl_modal').html($(template_ui)).modal("show");
            }else
            {
                $('#deal_bulk_delete_modal').html($(template_ui)).modal("show");
            }

            $("#deal_bulk_delete_modal").off("click", "#deal-bulk-delete");
            $("#deal_bulk_delete_modal").on("click", "#deal-bulk-delete", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkDeleteDeals(false);
            });

            $("#deal_bulk_delete_acl_modal").off("click", "#deal-bulk-delete-acl");
            $("#deal_bulk_delete_acl_modal").on("click", "#deal-bulk-delete-acl", function(e){
                e.preventDefault();
                deal_bulk_actions.bulkDeleteDeals(true);
            });

        }, '');
    },
});


/** 
* Opportunity track change actions collection view
*/
var Deals_Track_Change_Events_Collection_View = Base_Collection_View.extend({
    events: {
        /** Deals actions */
        'click #opportunity-track-list-model-list a.pipeline' : 'dealTrackChange'
    },

    /**
     * If default view is selected, deals are loaded with default view and 
     * removes the view cookie set when view is selected
    */
    dealTrackChange : function(e){
        e.preventDefault();
        if(pipeline_id == $(e.currentTarget).attr('id')){
            return;
        }
        _agile_set_prefs("agile_deal_track", $(e.currentTarget).attr('id'));
        if(_agile_get_prefs('deal-filters')){
            var json = $.parseJSON(_agile_get_prefs('deal-filters'));
            var track = $(this).attr('id');
            if(track == '1')
                json.pipeline_id = '';
            else
                json.pipeline_id = $(this).attr('id');
            _agile_set_prefs('deal-filters',JSON.stringify(json));
        }
        pipeline_id = _agile_get_prefs("agile_deal_track");
        $("#milestone-view-track",$('#opportunity-listners')).html('<i class="icon-road m-r-xs"/>'+$(e.currentTarget).text());
        startGettingDeals();
    }
});

/** 
* Opportunity filter change actions collection view
*/
var Deals_Filter_Change_Events_Collection_View = Base_Collection_View.extend({
    events: {
        /** Deals actions */
        'click .deal-filter' : 'filterChange',
        'click .default_deal_filter' : 'defaultFilterChange'
    },

    filterChange : function(e){
        e.preventDefault();
        var filter_id = $(e.currentTarget).attr("id");
        if(filter_id == _agile_get_prefs("deal-filter-name")){
            return;
        }
        var deal_filter;
        var deal_filter_json = {};
        if(filter_id == 'my-deals'){
            deal_filter_json['owner_id'] = CURRENT_DOMAIN_USER.id;
            deal_filter_json['pipeline_id'] = _agile_get_prefs('agile_deal_track');
            deal_filter_json['milestone'] = "";
            deal_filter_json['archived'] = "false";
            deal_filter_json['value_filter'] = "equals";
        }else{
            deal_filter = App_Deals.deal_filters.collection.get(filter_id);
            deal_filter_json = deal_filter.toJSON();
            deal_filter_json.filterOwner = {};
        }
        _agile_set_prefs('deal-filters', JSON.stringify(deal_filter_json));
        _agile_set_prefs('deal-filter-name',filter_id);

        if (!_agile_get_prefs("agile_deal_view")){
            if(filter_id && filter_id != 'my-deals'){
                $('#opportunity-listners').find('h3').find('.remove_deal_filter').parent().remove();
                $('#opportunity-listners').find('h3').find('small').after('<div class="inline-block tag btn btn-xs btn-primary m-l-xs"><span class="inline-block m-r-xs v-middle pull-left">'+$(e.currentTarget).text()+'</span><a class="close remove_deal_filter">×</a></div>');
            }

            if(filter_id && filter_id == 'my-deals'){
                $('#opportunity-listners').find('h3').find('.remove_deal_filter').parent().remove();
                $('#opportunity-listners').find('h3').find('small').after('<div class="inline-block tag btn btn-xs btn-primary m-l-xs"><span class="inline-block m-r-xs v-middle pull-left">My Deals</span><a class="close remove_deal_filter">×</a></div>');
            }
            startGettingDeals();
        }else{
            fetchDealsList();
        }
    },

    defaultFilterChange : function(e){
        e.preventDefault();
        if(!_agile_get_prefs("deal-filter-name")){
            return;
        }
        _agile_delete_prefs('deal-filter-name');
        _agile_delete_prefs('deal-filters');
        setupDefaultDealFilters();
        $('#opportunity-listners').find('h3').find('.remove_deal_filter').parent().remove();
        if (!_agile_get_prefs("agile_deal_view")){
            startGettingDeals();
        }else{
            fetchDealsList();
        }
    }
});