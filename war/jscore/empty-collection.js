
function fillSlate(id, el)
{
	if(CONTENT_JSON[Current_Route])
		$("#" + id, el).html(getTemplate("empty-collection-model", CONTENT_JSON[Current_Route]));
}