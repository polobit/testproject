{{#if_greater value.length 1 }}
	<table class = "table table-striped showCheckboxes panel agile-table">
		<tbody>
			<tr style="cursor: pointer; display: inline-flex; width: 100%;">
				<td class='data hide' data='{{id}}'>{{id}}</div>
				<td style = "width:18%">
					<div class="table-resp">
    					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    				</div>
   				</td>
   				<td style = "width:33%">
    				<div class="table-resp">
    					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    				</div>
    			</td>
				<td style = "width:36%">
    				<div class="table-resp">
    					{{get_campaign_name value}}
							<i class="icon-plus" style="font-size:10px;margin-left:5px" data-toggle="collapse" data-target="&#35;{{key}}" class="accordion-toggle" ></i>
    				</div>
    			</td>
				<td style = "width:25%">
      				<div class="text-muted table-resp text-xs"> <i class="fa fa-clock-o m-r-xs"></i>
    	       			Created <time class="created_time time-ago" value="{{value.created_time}}" datetime="{{epochToHumanDate "" value.created_time}}">{{epochToHumanDate "ddd mmm dd yyyy" value.created_time value}}</time>
          			</div>
				</td>
			</tr>
	</tbody>
</table>
			
			<div>
				<div class="hiddenRow" colspan="12">
					<div class="accordian-body collapse" id="{{key}}">
						<table class="table table-striped showCheckboxes panel agile-table" url="">
							<thead>
    							<tr>
									<th class="hide header"></th>                    
									<th class="header"></th>
        							<th class="header"></th>
        							<th class="header"></th>
									<th class="header"></th>
    							</tr>
							</thead>
							<tbody id="settings-email-templates-model-list" route="campaign-template/" class="agile-edit-row">
	
							{{#eachkeys value}}
								<tr onClick = 'show_email_nodes({{value.id}})' style="cursor:pointer" >
									<td class='data hide' data='{{id}}'>{{id}}</td>
									<td>
										<div class="table-resp">
    										{{value.node_name}}
    									</div>
   									</td> 
   									<td>
    									<div class="table-resp">
    										{{value.subject}}
    									</div>
    								</td>  
									<td>
    									<div class="table-resp">
    										{{value.campaign_name}}
    									</div>
    								</td> 
									<td class="text-muted" style="color: #b2b0b1;">
       									{{#if value.created_time}}
          									<div class="text-muted table-resp text-xs"> <i class="fa fa-clock-o m-r-xs"></i>
    	       									Created <time class="created_time time-ago" value="{{value.created_time}}" datetime="{{epochToHumanDate "" value.created_time}}">{{epochToHumanDate "ddd mmm dd yyyy" value.created_time}}</time>
          									</div>
       									{{/if}}
   	 								</td> 
								</tr>
							{{/eachkeys}}
						</table>
					</div>
				</div>
			</div>
{{else}}

<table class="table table-striped showCheckboxes panel agile-table" url="">
	<thead>
	</thead>
	<tbody id="settings-email-templates-model-list" route="campaign-template/" class="agile-edit-row">
	
		{{#eachkeys value}}
			<tr onClick = 'show_email_nodes({{value.id}})' style="cursor:pointer">
				<td class='data hide' data='{{id}}'>{{id}}</td>
				<td>
					<div class="table-resp">
    					{{value.node_name}}
    				</div>
   				</td> 
    			<td>
    				<div class="table-resp">
    					{{value.subject}}
    				</div>
    			</td>  
				<td>
    				<div class="table-resp">
    					{{value.campaign_name}}
    				</div>
    			</td> 
				<td class="text-muted" style="color: #b2b0b1;">
       				{{#if value.created_time}}
          				<div class="text-muted table-resp text-xs"> <i class="fa fa-clock-o m-r-xs"></i>
    	      				Created <time class="created_time time-ago" value="{{value.created_time}}" datetime="{{epochToHumanDate "" value.created_time}}">{{epochToHumanDate "ddd mmm dd yyyy" value.created_time}}</time>
          				</div>
       				{{/if}}
    			</td> 
			</tr>
		{{/eachkeys}}
{{/if_greater}}
