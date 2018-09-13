/* Apply a maximum data length of 1K for items in a particular stream */
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
				if (
					(tx.vout[output].items[item].type == "stream") &&
					(tx.vout[output].items[item].name == "stream1") &&
					(tx.vout[output].items[item].data.size > 1024)
				)
					return "Items larger than 1K are not permitted in stream1";
			}
		}
	}
}