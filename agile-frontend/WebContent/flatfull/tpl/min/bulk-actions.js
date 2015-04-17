<script id="bulk-actions-campaign-template" type="text/html">
<div class="span8">
    <div class="well">
        <form id="campaignsBulkForm" class="form-horizontal">
            <fieldset>
                <div class="control-group">         
                    <legend>Add contacts bulk to campaign</legend>  
                    <label class="control-label">Select campaign <span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="campaignBulkSelect required" id='campaignBulkSelect'>
                            <option class="campaignBulkSelectOption" value="">Select..</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">          
                    <a href="#" type="submit" id="addBulkTocampaign" class="btn btn-primary">Add</a> 
                    <a href="#contacts" class="btn ">Close</a>
                    <span class="save-status"></span>
                </div>
            </fieldset>
        </form>
    </div>
</div>
</script>				<script id="bulk-actions-owner-template" type="text/html">
<div class="span8">
    <div class="well">
        <form id="ownerBulkForm" class="form-horizontal">
            <fieldset>
                <div class="control-group">         
                    <legend>Change owner to contacts bulk</legend>  
                    <label class="control-label">Select owner <span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="ownerBulkSelect required" id='ownerBulkSelect'>
                            <option class="ownerBulkSelectOption" value="">Select..</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">          
                    <a href="#" type="submit" id="changeOwnerToBulk" class="btn btn-primary">Add</a> 
                    <a href="#contacts" class="btn ">Close</a>
                    <span class="save-status"></span>
                </div>
            </fieldset>
        </form>
    </div>
</div>
</script>			<script id="bulk-actions-tags-remove-template" type="text/html">
<div class="span8">
    <div class="well">
        <form id="tagsRemoveBulkForm" class="form-horizontal">
            <fieldset>
                <legend>Remove tags from selected contacts</legend>
                <div class="control-group">         
                    <label class="control-label">Enter Tags <span class="field_req">*</span></label>
                    <div class="controls">
                        <div class="pull-left">
                        <ul name="tags" class= "tagsinput tags"></ul>
                        </div>              
                        <input name="tags" type="text" id="removeBulkTags" class="tags-typeahead" placeholder="Enter tags separated by comma"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
	<input class="hide"/>      
              </div>
                </div>
                <div class="form-actions">          
                    <a href="#" type="submit" id="removeTagsToContactsBulk" class="btn btn-primary">Remove</a> 
                    <a href="#contacts" class="btn">Close</a>
                    <span class="save-status"></span>
                </div>
            </fieldset>
        </form>
    </div>
</div>
</script>		<script id="bulk-actions-tags-template" type="text/html">
<div class="span8">
    <div class="well">
        <form id="tagsBulkForm" class="form-horizontal">
            <fieldset>
                <legend>Add tags to selected contacts</legend>
                <div class="control-group">         
                    <label class="control-label">Add tags <span class="field_req">*</span></label>
                    <div class="controls">
                        <div class="pull-left">
                        <ul name="tags" class= "tagsinput tags"></ul>
                        </div>              
                        <input name="tags" type="text" id="addBulkTags" class="tags-typeahead" placeholder="Enter tags separated by comma"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
						<input class="hide"/>      
              		</div>
                </div>
				<div class="invalid-tags" style="display:none;color:red;">Tag name should start with an alphabet and can not contain special characters other than underscore and space.</div>
                <div class="form-actions">          
                    <a href="#" type="submit" id="addTagsToContactsBulk" class="btn btn-primary">Add</a> 
                    <a href="#contacts" class="btn">Close</a>
                    <span class="save-status"></span>
                </div>
            </fieldset>
        </form>
    </div>
</div>
</script>		