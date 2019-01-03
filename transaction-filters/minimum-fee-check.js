/* This filter checks whether a transaction has a certain (miner) fee, defined in raw blockchain units */

function filtertransaction()
{
	var bal=getfilterassetbalances("", true);

	var fee=0;
	for (var add in bal)
		fee-=bal[add];

	if (fee < 1000)
		return "Insufficient fee";
}