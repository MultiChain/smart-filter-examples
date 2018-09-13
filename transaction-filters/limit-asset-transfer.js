/* Only allow 1000 raw units of asset named USD to be sent to any address per transaction */
/* It is recommended to perform asset quantity calculations using raw units for perfect precision */

function filtertransaction()
{
	var tx=getfiltertransaction();
	var addressbalancechange={};
	
	for (var inputnum=0; inputnum<tx.vin.length; inputnum++)
		outputtoaddressbalancechange(getfiltertxinput(inputnum), true, addressbalancechange);
		
	for (var outputnum=0; outputnum<tx.vout.length; outputnum++)
		outputtoaddressbalancechange(tx.vout[outputnum], false, addressbalancechange);
	
	for (var address in addressbalancechange)
		if (addressbalancechange[address]>1000)
			return "Address "+address+" is receiving too much USD";
}

function outputtoaddressbalancechange(output, spent, addressbalancechange)
{
	if (output.assets)
	{
		for (var assetnum=0; assetnum<output.assets.length; assetnum++)
		{
			if (output.assets[assetnum].name=="USD")
			{
				for (var addressnum=0; addressnum<output.scriptPubKey.addresses.length; addressnum++)
				{
					var address=output.scriptPubKey.addresses[addressnum];
					
					if (!addressbalancechange.hasOwnProperty(address))
						addressbalancechange[address]=0;
					
					var rawchange=spent ? -output.assets[assetnum].raw : output.assets[assetnum].raw;
					addressbalancechange[address]+=rawchange;
				}
			}
		}
	}
}