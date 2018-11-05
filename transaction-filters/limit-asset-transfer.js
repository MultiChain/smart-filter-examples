/* Only allow 1000 raw units of asset named USD to be sent to any address per transaction */
/* It is recommended to perform asset quantity calculations using raw units for perfect precision */

function filtertransaction()
{
	var addressbalancechange=getfilterassetbalances("USD", true);
		
	for (var address in addressbalancechange)
		if (addressbalancechange[address]>1000)
			return "Address "+address+" is receiving too much USD";
<<<<<<< HEAD
}
=======
}

function outputtoaddressbalancechange(output, spent, addressbalancechange)
{
	if (output && output.assets)
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
>>>>>>> b3387f760f4cabab6a1da73fe2a8b709663efe37
