/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the name of the property
 * 
 * @param items :
 *            porperties in contact object
 * @param name :
 *            name of the property
 * @returns
 */
function getProperty(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i];
	}
}

function ucfirst(value)
{
 return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';
}