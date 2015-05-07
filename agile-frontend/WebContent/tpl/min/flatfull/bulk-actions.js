<script id="bulk-actions-campaign-template" type="text/html">
<div class="row">
<div class="col-md-8">
    <div class="well">
        <form id="campaignsBulkForm" class="form-horizontal">
            <fieldset>
                      
                    <legend>Add contacts bulk to campaign</legend>  
<div class="control-group form-group">   
                    <label class="control-label col-sm-3">Select campaign <span class="field_req">*</span></label>
                    <div class="controls col-sm-9">
                        <select class="campaignBulkSelect required form-control" id='campaignBulkSelect'>
                            <option class="campaignBulkSelectOption" value="">Select..</option>
                        </select>
                    </div>
                </div>
<hr class="m-t-none">
<div class="row">
<div class="col-sm-offset-3 col-sm-9">
                <div class="form-actions">          
					<a href="#contacts" class="btn btn-sm btn-danger">Close</a>
                    <a href="#" type="submit" id="addBulkTocampaign" class="btn btn-sm btn-primary">Add</a> 
                    <span class="save-status"></span>
                </div>
</div>
</div>
            </fieldset>
        </form>
    </div>
</div>
</div>
</script>				<script id="bulk-actions-owner-template" type="text/html">
<div class="row">
<div class="col-md-8">
    <div class="tab-content wrapper-md">
	<div class="panel panel-default">
	<div class="panel-heading"><h4 class="h4">Change owner to contacts bulk</h4></div>
	<div class="panel-body">
        <form id="ownerBulkForm" class="form-horizontal">
            <fieldset>
				<div class="control-group form-group">    
                    <label class="control-label col-sm-2">Select owner <span class="field_req">*</span></label>
                    <div class="controls col-sm-10">
                        <select class="ownerBulkSelect required form-control" id='ownerBulkSelect'>
                            <option class="ownerBulkSelectOption" value="">Select..</option>
                        </select>
                    </div>
                </div>
				<hr class="m-t-none">
				<div class="row">
				<div class="col-sm-offset-2 col-sm-10">
                <div class="form-actions">          
					<a href="#contacts" class="btn btn-sm btn-default">Close</a>
                    <a href="#" type="submit" id="changeOwnerToBulk" class="btn btn-sm btn-primary">Add</a> 
                    <span class="save-status"></span>
                </div>
</div>
</div>
            </fieldset>
        </form>
    </div>
</div>
</div>
</div>
</script>			<script id="bulk-actions-tags-remove-template" type="text/html">
<div class="row">
<div class="col-md-8">
    <div class="well">
        <form id="tagsRemoveBulkForm" class="form-horizontal">
            <fieldset>
                <legend>Remove tags from selected contacts</legend>
                <div class="control-group form-group">         
                    <label class="control-label col-sm-2">Enter Tags <span class="field_req">*</span></label>
                    <div class="controls col-sm-10">
                        <div class="pull-left">
                        <ul name="tags" class= "tagsinput tags p-n"></ul>
                        </div>              
                        <input name="tags" type="text" id="removeBulkTags" class="tags-typeahead form-control" placeholder="Enter tags separated by comma"/>
						<span class="error-tags text-danger" style="display:none;">This field is required.</span>
	<input class="hide"/>      
              </div>
                </div>
<hr class="m-t-none">
<div class="row">
<div class="col-sm-offset-2 col-sm-10">
                <div class="form-actions">          
					<a href="#contacts" class="btn btn-sm btn-danger">Close</a>
                    <a href="#" type="submit" id="removeTagsToContactsBulk" class="btn btn-sm btn-primary">Remove</a> 
                    <span class="save-status"></span>
                </div>
</div>
            </fieldset>
        </form>
    </div>
</div>
</div>
</script>		<script id="bulk-actions-tags-template" type="text/html">
<div class="row">
<div class="col-md-8">
	<div class="tab-content wrapper-md">
	<div class="panel panel-default">
	<div class="panel-heading"><h4 class="h4">Add tags to selected contacts</h4></div>
	<div class="panel-body">
        <form id="tagsBulkForm" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">         
                    <label class="control-label col-sm-2">Add tags <span class="field_req">*</span></label>
                    <div class="controls col-sm-10">
                        <div class="pull-left">
                        <ul name="tags" class= "tagsinput tags p-n"></ul>
                        </div>              
                        <input name="tags" type="text" id="addBulkTags" class="tags-typeahead form-control" placeholder="Enter tags separated by comma"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
						<input class="hide"/>      
              		</div>
                </div>
				<div class="invalid-tags" style="display:none;color:red;">Tag name should start with an alphabet and can not contain special characters other than underscore and space.</div>
              
<hr class="m-t-none">
<div class="row">
<div class="col-sm-offset-2 col-sm-10">
  <div class="form-actions">       
					<a href="#contacts" class="btn btn-default btn-sm">Close</a>   
                    <a href="#" type="submit" id="addTagsToContactsBulk" class="btn btn-primary btn-sm">Add Tag</a> 
                    <span class="save-status"></span>
              
</div>
</div>
</div>
            </fieldset>
        </form>
    </div>
</div>
</div>
</div>
</div>
</script>		