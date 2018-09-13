MultiChain Smart Filter Examples
================================

This repository contains some examples of Smart Filters to be used with MultiChain 2.0.

License: Public domain, use as you like


About Smart Filters
-------------------

A Smart Filter is a piece of code which is embedded in the blockchain, and which allows custom rules to be defined regarding the validity of transactions or data. Smart Filters are written in JavaScript and run within a deterministic version of Google’s V8 JavaScript engine, which is embedded directly within MultiChain 2.0 alpha 5+. This is the same JavaScript engine used in Chrome, Node.js and many other platforms. It offers excellent performance by compiling JavaScript to machine code and continuing to optimizing that code as it runs.

For more information and documentation, see [Working with Smart Filters](https://www.multichain.com/developers/smart-filters/)


Smart Filters roadmap
---------------------

Transaction filters define rules about whether a transaction is valid, by examining that transaction’s inputs, outputs and metadata. These are available in MultiChain 2.0 alpha 5.

Data filters define rules about whether the data in a stream item is valid, by examining that (on-chain or off-chain) data together with the item’s publishers and keys. These will be available in MultiChain2.0 alpha 6.
