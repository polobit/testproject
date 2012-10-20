
function fillSlate(id, el)
{
	$("#" + id, el).html(getTemplate("empty-collection-model", CONTENT_JSON[Current_Route]));
}