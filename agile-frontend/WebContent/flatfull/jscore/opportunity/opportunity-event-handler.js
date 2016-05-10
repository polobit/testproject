/** 
* Opportunity actions collection view
*/
var Deals_Events_Collection_View = Base_Collection_View.extend({
    events: {
    	/** Deals actions */
    	'click .deal-edit' : 'dealEdit',
        //'click .deal-delete' : 'dealDelete',
        //'click .deal-archive' : 'dealArchive',
        //'click .deal-restore' : 'dealRestore'
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
                    $('#deal_delete_privileges_error_modal').modal('show');
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
});