/* Apply a maximum data length of 1K for items in a particular stream, unless every publisher has high1 permissions */

function filterstreamitem()
{
	setfilterparam("maxshowndata", 0); /* ensures we are not given the actual data */

	var item=getfilterstreamitem();
	
	if (item.size > 1024)
		for (var pub=0; pub<item.publishers.length; pub++)
			if (!verifypermission(item.publishers[pub], "high1"))
				return "Items larger than 1K can only be published by addresses with high1 permissions";
}