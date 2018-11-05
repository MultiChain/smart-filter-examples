/*
	Only allow transfers of asset USD to be performed by an address if the transfer was pre-approved.
	Pre-approvals can only be created by users with low1 permissions. Approvals specify a maximum amount
	and an expiry date and are expressed as inline metadata in a UTXO which is "spent" so can only be used once.
	
	To send an approval to an address, use this regular API command:
	
	sendfrom <approver-address> <approvee-address> {"data":{"json":{"type":"approval","maxraw":<rawqty>,"expiry":<expiry>}}}
	
	<rawqty> is the maximum spend allowed in raw integer asset units (not display units)
	<expiry> is a unix timestamp representing when this approval expires
	
	(If using the command-line, be sure to put single quotes around that last parameter)
	
	The filter will ensure this approval can only be sent by addresses with low1 permissions.

	To use an approval:
	
	1. Use createrawsendfrom to create a regular transaction to send the USD assets but do not sign it
	2. Use listunspent to find one or more approvals that can be be used for this address
	3. Use appendrawtransaction to add that approval(s) txid/vout to the raw transaction
	4. Sign the result with signrawtransaction then send with sendrawtransaction
	
	The filter will ensure that there are sufficient non-expired approvals to cover the amount sent.
*/

function filtertransaction()
{
	var tx=getfiltertransaction();

	/*
		First, check if an approval is being created, and if so, that it is by anappropriate addresses.
		To do this we see if there is an approval in an output, and if so, we check that every input
		was signed by at least one address with low1 permissions.
	*/
	
	var hasapproval=false;
	
	for (var outputnum=0; outputnum<tx.vout.length; outputnum++) {
		if (outputisapproval(tx.vout[outputnum])) {
			hasapproval=true;
			break;
		}
	}
	
	if (hasapproval) {
		for (var inputnum=0; inputnum<tx.vin.length; inputnum++) {
			var input=getfiltertxinput(inputnum);
			
			for (var addressnum=0; addressnum<input.scriptPubKey.addresses.length; addressnum++)
				if (!verifypermission(input.scriptPubKey.addresses[addressnum], "low1"))
					return "Address "+input.scriptPubKey.addresses[addressnum]+" does not have low1 permission to create approvals";
		}	
	}
	
	/*
		Second, check that any transfers of USD going from an address are accompanied by sufficient
		non-expired approvals belonging to that address being spent at the same time
	*/
	
	var addressbalancechange=getfilterassetbalances("USD", true);
		
	for (var address in addressbalancechange) {
		if (addressbalancechange[address]<0) { /* this address is sending some asset units */
			var requiredraw=-addressbalancechange[address];
		
			for (var inputnum=0; inputnum<tx.vin.length; inputnum++) {
				var spentoutput=getfiltertxinput(inputnum);
				
				if (
					outputisapproval(spentoutput) &&
					(spentoutput.scriptPubKey.addresses[0]==address) &&
					(spentoutput.data[0].json.expiry >= getlastblockinfo().time)
				) {
					requiredraw-=spentoutput.data[0].json.maxraw; /* we can use this approval */
				}
			}
			
			if (requiredraw>0)
				return "Address "+address+" did not include sufficient USD spending approvals in this transaction";
		}
	}
}

function outputisapproval(output)
{
	return output.data && (output.data.length==1) && (output.data[0].json) && (output.data[0].json.type=="approval");
}