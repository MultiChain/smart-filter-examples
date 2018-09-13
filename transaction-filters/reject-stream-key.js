/* Note that data filters, coming soon, will provide an easier way to do this */

function filtertransaction()
{
	var tx=getfiltertransaction();
	
	for (var output=0; output<tx.vout.length; output++)
	{
		if (tx.vout[output].items)
		{
			for (var item=0; item<tx.vout[output].items.length; item++)
			{
				if (tx.vout[output].items[item].keys.indexOf("bad-key") > -1)
					return "Cannot publish items with with bad-key";
			}
		}
	}
}