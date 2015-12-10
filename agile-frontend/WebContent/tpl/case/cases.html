<script id="cases-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>&nbsp;Cases</h1>
            <a href="#cases-add" class="cases-add btn right" style="top:-30px;position:relative"><i class="icon-plus-sign" /> Add Case</a>
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
                    <h3>There are no pending cases </h3>
                    <div class="text">
						You can add case by clicking the button below or the one on the right side of the page.
                    </div>
                    <a href="#" class="cases-add btn blue"><i class="icon-plus-sign"></i>  Add Case</a>
                </div>
            </div>
        </div>
		{{/unless}}
        {{#if this.length}}
        <div class="data-block">
            <div class="data-container">
                <table class="table table-striped showCheckboxes" url="core/api/cases/bulk" id="case-list">
				 <col width="30px"><col width="10%"><col width="30%"><col width="20%"><col width="30%"><col width="10%">
                    <thead>
                        <tr>
                            <th>Owner</th>
							<th>Title</th>
							<th>Updated Time</th>
                            <th>Related To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="cases-model-list" style="cursor:pointer;"><!--route="cases/"-->
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
                    What are Cases?
                </h3>
                <br />
                <p>
                    Track and resolve customer issues effectively with cases. Log a case when customers ask questions, report bugs, or have complaints. Keep track of the progress till resolution.</p>
            </div>
        </div>
    </div>
</div>
</script>

<script id="cases-model-template" type="text/html">
<td>
    <div style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:5em;overflow:hidden;">
	   {{#if ownerPic}}
        <img class="thumbnail" src="{{ownerPic}}" width="40px" height="40px" title="{{owner.name}}" />
	   {{else}}
		<img class="thumbnail" src="{{defaultGravatarurl 50}}" width="40px" height="40px" title="{{owner.name}}" />
       {{/if}}
    </div>
</td>
<td data="{{id}}" class="data">
		<b style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:auto; max-width:20em; overflow:hidden;display:inline-block;">{{title}}</b>
	<div style="height:3em; overflow:hidden; text-overflow:ellipsis; position:relative; padding-top:0.2em;">
		{{description}}
	</div>
</td>
<td><time class="deal-created-time" value="{{created_time}}" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time></td>
<td>
	<div style="height:auto;white-space:nowrap;width:157px;overflow:hidden;display:inline-block;">
        	{{#each contacts}}
			<div style="display:inline-block;">
				{{#if_equals type "PERSON"}}
          	 	<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 50}}" width="40px" height="40px" style=" width:40px; height:40px; " title="{{contact_name_necessary this}}" />
				{{/if_equals}}

				{{#if_equals type "COMPANY"}}
				<img class='thumbnail' 
					{{getCompanyImage "40"}} 
					title="{{contact_name_necessary this}}" />
				{{/if_equals}}
			</div>
			{{/each}}
	</div>
       {{#if_greater this.contacts.length "4"}}<span>...</span>{{/if_greater}}
</td>
<td>
	{{#if_equals status "OPEN"}}
	<div style="border-radius:4px; border: 1px solid; background-color:red; text-align:center; color:white; font-size:0.9em; ">
		<b>Open</b>
	</div>
	{{else}}
	<div style="border-radius:4px; border: 1px solid; background-color:grey; text-align:center; color:white; font-size:0.9em; ">
		<b>Close</b>
	</div>
	{{/if_equals}}
</td>
</script>


<!-- popover -->
<script id="cases-detail-popover-template" type="text/html">
<div class="row-fluid" id='cases_detail_popover-div'>
    <div class="span9" style="margin-left:0px;">
        <div>
            <div style="line-height:20px;font-style:italic;margin-bottom:5px;">
                {{description}}
            </div>
            <div style="margin:5px;">
                <p><b>Owner : </b>{{owner.name}}</p>

				{{#if contacts}}
                <p><b>Related To : </b></p> 
                <div>
				{{#each_with_index contacts}}
                	<div class="span4" style="display:inline-block;margin:5px;margin-left:25px;">
					{{#if_equals type "PERSON"}}
                    	<img class="thumbnail" src="{{gravatarurl properties 50}}" width="40px" height="40px" style=" width:40px; height:40px; "/>
                    	<div style="display:inline-block;text-overflow:ellipsis;white-space:nowrap;width:90px;overflow:hidden;">
                        	{{contact_name_necessary this}}
					{{/if_equals}}
					{{#if_equals type "COMPANY"}}
                    	<img class="thumbnail" {{getCompanyImage "40"}} />
                    	<div style="display:inline-block;text-overflow:ellipsis;white-space:nowrap;width:90px;overflow:hidden;">
                        	{{contact_name_necessary this}}
					{{/if_equals}}
						{{#if_equals index ../contacts.length}}
						{{else}}
							,
						{{/if_equals}}
						</div>
                	</div>
                {{/each_with_index}}
                </div>
				{{/if}}
            </div>
        </div>
    </div>
</div>

</script>
<!--end popover-->