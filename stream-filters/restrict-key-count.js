/* Only allow addresses with high2 custom permission to publish items with multiple keys */

function filterstreamitem()
{
	var item=getfilterstreamitem();

	if (item.keys.length>1) {				
		for (var pub=0; pub<item.publishers.length; pub++)
			if (!verifypermission(item.publishers[pub], "high2"))
				return "Address "+item.publishers[pub]+" needs high2 permission to use multiple keys";
	}
}