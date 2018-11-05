/* Only allow 1000 raw units of asset named USD to be sent to any address per transaction */
/* It is recommended to perform asset quantity calculations using raw units for perfect precision */

function filtertransaction()
{
	var addressbalancechange=getfilterassetbalances("USD", true);
		
	for (var address in addressbalancechange)
		if (addressbalancechange[address]>1000)
			return "Address "+address+" is receiving too much USD";
}