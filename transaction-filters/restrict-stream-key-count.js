/* Only allow addresses with high1 custom permission to publish items with multiple keys */
/* Note that data filters, coming soon, will provide an easier way to do this */

function filtertransaction()
{
	setfilterparam("maxshowndata", 0); /* ensures we are not given the actual data */

	var tx=getfiltertransaction();

	for (var output=0; output<tx.vout.length; output++)
	{
		if (tx.vout[output].items)
		{
			for (var item=0; item<tx.vout[output].items.length; item++)
			{
				var theitem=tx.vout[output].items[item];
				
				if (theitem.keys.length>1) {				
					for (var pub=0; pub<theitem.publishers.length; pub++)
						if (!verifypermission(theitem.publishers[pub], "high1"))
							return "Address "+theitem.publishers[pub]+" needs high1 permission to use multiple keys";
				}
			}
		}
	}
}