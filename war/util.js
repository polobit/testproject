function isNotValid(value) {
    if (value == undefined) return true;
    if (value.length == 0) return true;
    return false;
}


function isValidField(id) {
    var value = $('#' + id).val();
    return !isNotValid(value);
}

function property_JSON(name, id, type) {
    var json = {};

    if (type == undefined) json.type = "SYSTEM";
    else json.type = type;

    json.name = name;
    json.value = $('#' + id).val();
    return json;
}


$('#ajax').hide() // hide it initially
.ajaxStart(function () {
    $(this).show();
}).ajaxStop(function () {
    $(this).hide();
}).ajaxError(function () {
    $(this).hide();
});
