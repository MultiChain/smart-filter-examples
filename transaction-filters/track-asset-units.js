/*
	 Enables specific units of issued assets to be tracked across transactions by
	 using inline metadata to represent the range of unit numbers in an output.
	 Each piece of inline metadata is a JSON structure with a "start" and "end"
	 for the range, where the range represented is: "start" ... ("end"-1)

	 To use this, add (for example) "data":{"json":{"start":0,"end":1000}} into
	 the output containing a newly-issued asset with 1000 raw units. This means
	 issuing the asset using the createrawsendfrom command, as documented here:
	 https://www.multichain.com/developers/raw-transactions/
			
	 In every transaction transferring that asset, ensure that every output which
	 contains that asset also contains inline metadata with the same structure
	 "data":{"json":{"start":...,"end":...}} and that, in total, the same ranges
	 are represented by the inputs and the outputs of the transaction. This will
	 likely require manual transaction building with createrawtransaction in order
	 to control the specific set of inputs that are used.
	 
	 This will not work for assets with follow-on issuances (issuemore command)
	 and does not allow more than one asset in a single output.
*/

function filtertransaction()
{
	var outassetranges={};
	var inassetranges={};

//	Collect asset ranges from outputs (excluding new issuances)

	var tx=getfiltertransaction();

	for (var vout=0; vout<tx.vout.length; vout++) {
		var error=addtoassetranges(outassetranges, tx.vout[vout], true, vout);
		if (error)
			return error;
	}
		
//	Collect asset ranges from inputs

	for (var vin=0; vin<tx.vin.length; vin++) {
		var error=addtoassetranges(inassetranges, getfiltertxinput(vin), false, vin);
		if (error)
			return error;
	}
		
//	Verify ranges are matched for each input asset (MultiChain's built in rules
//	ensure that the same set of assets appears in the inputs and outputs)
		
	for (var assetid in inassetranges) {
		var outranges=canonicalizeassetranges(outassetranges[assetid] || []);
		var inranges=canonicalizeassetranges(inassetranges[assetid] || []);
	
		if (JSON.stringify(outranges) != JSON.stringify(inranges))
			return "Input and output ranges for asset "+(getassetinfo(assetid).name || assetid)+" do not match";
	}
}

function addtoassetranges(assetranges, txout, isoutput, index)
{
	if (txout.assets && txout.assets.length) {
		if (txout.assets.length!=1) // requires only one asset per output
			return (isoutput ? "Output" : "Input")+" "+index+" contains more than one asset";
 
		if (txout.data && txout.data[0] && txout.data[0].json) {
			var start=txout.data[0].json.start;
			var end=txout.data[0].json.end;

			if (Number.isInteger(start) && Number.isInteger(end)) {
				if ((end-start)!=txout.assets[0].raw)
					return (isoutput ? "Output" : "Input")+" "+index+" has a range that does not match its raw quantity";

				var assetid=txout.assets[0].issuetxid; // use assetid to support assets without names
				if (assetid) { // assetid will be null for an issuance, and we can skip
					if (!assetranges.hasOwnProperty(assetid))
						assetranges[assetid]=[];
	
					assetranges[assetid].push({"start":start,"end":end});
				}
			}
		}
	}
}

function canonicalizeassetranges(ranges)
{
	var sorted=ranges.sort(function (a, b) { return a.start - b.start; });
	
	for (var j=sorted.length-1; j>0; j--) // now combine adjacent ranges together
		if (sorted[j-1].end==sorted[j].start) {
			sorted[j-1].end=sorted[j].end;
			sorted.splice(j, 1);
		}
		
	return sorted;
}