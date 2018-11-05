/* Prevent a certain key being used in a stream */

function filterstreamitem()
{
	var item=getfilterstreamitem();
	
	if (item.keys.indexOf("bad-key") > -1)
		return "Cannot publish items with with bad-key";
}