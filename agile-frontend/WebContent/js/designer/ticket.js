function getUsersFromGroup(element, jsonData) {

	var $element = $(element);

	$('select[name="assignee-id"]').html('');

	var groupId = $element.val();

	if (!groupId)
		return;

	// Get Users from group id
	$.ajax({
		type : 'get',
		async : false,
		dataType : "json",
		url : '/core/api/tickets/groups/domain-users?group_id=' + groupId,
		success : function(data) {

			var usersSelectField = "";
			$.each(data, function(index, userData) {
				usersSelectField += "<option value='" + userData.id + "'>"
						+ userData.name + " (" + userData.email + ") "
						+ "</option>";
			});

			$('select[name="assignee-id"]').html(usersSelectField);

			if (jsonData) {
				$.each(jsonData, function(index, data) {

					if (data.name == "assignee-id")
						$('select[name="assignee-id"]').val(data.value);

				});
			}

		}

	});

}