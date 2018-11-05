/* Items must be in JSON format with certain fields and values */

function filterstreamitem()
{
	var item=getfilterstreamitem();

	if (item.format!="json")
		return "Only JSON items are allowed";
	
	var json=item.data.json;
			
	if ( (!json.hasOwnProperty("city")) || (json.city.length<2) )
		return "Item requires a city name";

	if ( (!json.hasOwnProperty("state")) || (json.state.length!=2) )
		return "Item requires a two-letter state code";
}