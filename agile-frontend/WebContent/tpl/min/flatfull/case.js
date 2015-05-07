<script id="cases-collection-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-sm-12 col-md-12">
       
            <h3 class="pull-left font-thin h3">Cases</h3>
            <a href="#cases-add" class="cases-add btn pull-right btn-default btn-addon btn-sm"><i class="fa fa-plus-circle"></i> Add Case</a>
			<div class="clearfix"></div>
    </div>
</div>
</div>
<div class="wrapper-md">
<div class="row">
	<div class="col-md-9">
		{{#unless this.length}}
		<div class="alert-info alert">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png">
                </div>
                <div class="box-right pull-left">
                    <h4>There are no pending cases </h4>
                    <div class="text">
						You can add case by clicking the button below or the one on the right side of the page.
                    </div>
                    <a href="#" class="cases-add btn btn-default btn-sm blue m-t-xs"><i class="icon-plus-sign"></i>  Add Case</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
		{{/unless}}
        {{#if this.length}}
        <div class="data-block">
            <div class="panel panel-default">
			    <div class="panel-heading">Cases List</div>
                <table class="table table-striped showCheckboxes m-b-none agile-table panel" url="core/api/cases/bulk" id="case-list">				 
				   <thead>
                        <tr>
                            <th style="width:10%">Owner</th>
							<th style="width:30%">Title</th>
							<th style="width:20%">Updated Time</th>
                            <th style="width:20%">Related To</th>
                            <th style="width:20%">Status</th>
                        </tr>
                    </thead>
                    <tbody id="cases-model-list" class="c-p"><!--route="cases/"-->
                    </tbody>
                </table>
            </div>
        </div>
        {{/if}}
	</div>
    <div class="col-md-3">
        <div class="data-block">
            
                <h4 class="m-t-none m-b-sm h4">
                    What are Cases?
                </h4>
     
                <p>
                    Track and resolve customer issues effectively with cases. Log a case when customers ask questions, report bugs, or have complaints. Keep track of the progress till resolution.</p>
            
        </div>
    </div>
</div>
</div>
</div>
</script>

<script id="cases-model-template" type="text/html">
<td>

    <div class="thumb-sm avatar">
	   {{#if ownerPic}}
        <img class="r r-2x" src="{{ownerPic}}" title="{{owner.name}}" />
	   {{else}}
		<img class="r r-2x" src="{{defaultGravatarurl 50}}"  title="{{owner.name}}" />
       {{/if}}
    </div>

</td>
<td data="{{id}}" class="data">
<div class="table-resp">
	<a class="text-cap">{{title}}</a>
</div>
<div class="table-resp">
	<small class="text-muted">
		{{description}}
	</small>
</div>
</td>
<td class="text-muted">
<div class="table-resp">

<i class="fa fa-clock-o m-r-xs"></i><time class="deal-created-time" value="{{created_time}}" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
</div>

</td>

<td class="overflow-hidden no-wrap">
	<div class="text-ellipsis inline-block" style="width:128px">
<div  style="width:128px">
        	{{#each contacts}}
			<div class="inline-block thumb-sm">
				{{#if_equals type "PERSON"}}
          	 	<img class="img-inital r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 50}}"  title="{{contact_name_necessary this}}" />
				{{/if_equals}}

				{{#if_equals type "COMPANY"}}
				<img class='r r-2x p-n' 
					{{getCompanyImage "50"}} 
					title="{{contact_name_necessary this}}" />
				{{/if_equals}}
			</div>
			{{/each}}
</div>
</div>
       {{#if_greater this.contacts.length "4"}}<span>...</span>{{/if_greater}}
</td>
<td class="v-middle">

	{{#if_equals status "OPEN"}}
	<div class=" text-center label label-danger text-xs">
		Open
	</div>
	{{else}}
	<div class="text-center  label label-default text-xs">
		Close
	</div>
	{{/if_equals}}
</td>
</script>


<!-- popover -->
<script id="cases-detail-popover-template" type="text/html">
<div class='row' id='cases_detail_popover-div'>
    <div class='col-md-9 m-l-none'>
        <div>
            <div class='m-b-xs' style='line-height:20px;font-style:italic;'>
                {{description}}
            </div>
            <div class='m-xs'>
                <p><span><strong>Owner:</strong></span><span>{{owner.name}}</span></p>

				{{#if contacts}}
                <p><b>Related To : </b></p> 
                <div>
				{{#each_with_index contacts}}
                	<div class='col-md-4 inline-block' style='margin-left:25px;'>
					{{#if_equals type 'PERSON'}}
                    	<img class='thumbnail thumb-sm' src='{{gravatarurl properties 50}}'/>
                    	<div class='text-ellipsis inline-block w-xs'>
                        	{{contact_name_necessary this}}
					{{/if_equals}}
					{{#if_equals type 'COMPANY'}}
                    	<img class='thumbnail' {{getCompanyImage '40'}} />
                    	<div class='text-ellipsis inline-block w-xs'>
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