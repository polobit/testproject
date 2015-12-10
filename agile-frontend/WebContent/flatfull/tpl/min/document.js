<script id="documents-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>&nbsp;Documents</h1>
            <a href="#documents-add" class="documents-add btn right" style="top:-30px;position:relative"><i class="icon-plus-sign" /> Add Document</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
		{{#unless this.length}}
		<div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>There are no documents </h3>
                    <div class="text">
						You can add document by clicking the button below or the one on the right side of the page.
                    </div>
                    <a href="#" class="documents-add btn"><i class="icon-plus-sign"></i>  Add Document</a>
                </div>
            </div>
        </div>
		{{/unless}}
        {{#if this.length}}
        <div class="data-block">
            <div class="data-container">
                <table class="table table-striped showCheckboxes agile-ellipsis-dynamic" url="core/api/documents/bulk" id="document-list">
				 <col width="30px"><col width="35%"><col width="35%"><col width="20%"><col width="10%">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Related Contacts</th>
                            <th>Uploaded Date</th>
							<th>Owner</th>
                        </tr>
                    </thead>
                    <tbody id="documents-model-list" style="cursor:pointer;">
                    </tbody>
                </table>
            </div>
        </div>
        {{/if}}
    </div>
    <div class="span3">
        <div class="data-block">
            <div class="well">
                <h3>
                    How to use Documents?
                </h3>
                <br />
                <p>
                    You can attach Documents to Contacts or Deals to add more context. Upload documents from your computer or attach them from cloud storage like Google Drive.</p>
            </div>
        </div>
    </div>
</div>
</script>

<script id="documents-model-template" type="text/html">
<td data="{{id}}" class="data">
<div style="height:20px;">	
<div class="pull-left" style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:auto; max-width:15em; overflow:hidden;display:inline-block;"><b>{{name}}</b></div>
<div class="pull-left" style="margin-left:5px;">
<b class="activate-link" style="display:none;"><a href="{{url}}" target="_blank"><i class="icon-external-link" title="Open Document"></i></a></b>
</div>
<div class="clearfix"></div>
</div>
	<div>
		<span style="vertical-align:top;">{{network network_type}}&nbsp;&nbsp;</span>
	</div>
</div>
</td>
<td>
	<div style="white-space:nowrap;width:210px;overflow:hidden;height:50px;">
		{{#each contacts}}
        	{{#if_contact_type "PERSON"}}
        		<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; "  title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
        	{{/if_contact_type}}
			{{#if_contact_type "COMPANY"}}
        		<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/></a>
        	{{/if_contact_type}}
        {{/each}}{{#if_greater this.contacts.length "4"}}<span>...</span>{{/if_greater}}
	</div>
</td>
<td>
	<div style="width:10em;"> 
		<time class="document-created-time" value="{{uploaded_time}}" datetime="{{epochToHumanDate "" uploaded_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" uploaded_time}}</time>
	</div>
</td><td>
    <div style="white-space:nowrap;width:4em;">
       {{#if ownerPic}}
        <img class="thumbnail" src="{{ownerPic}}" width="40px" height="40px" style="height:40px;"  title="{{owner.name}}" />
	   {{else}}
		<img class="thumbnail" src="{{defaultGravatarurl 50}}" width="40px" style="height:40px;" height="40px" title="{{owner.name}}" />
       {{/if}}
    </div>
</td>

</script>