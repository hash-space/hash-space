## API for  APW  future yield  return strategy for hash-map  :

this strategy allowed users to stake the derivative tokens got from the vaults (stkAAVE  or yEARN  types)  to be staked into APWine in order to 

### team: 
- Chris LoveJoy 
- Ali Rizvi 
- Ignacio Pastor
- Manuel Villing
- Dhruv.

Working overview :
 provides SDK to generate fixed rate yield (WIP : to be integrated in the gaming logic and also functions to unstake the protocol tokens ).

1.  user pays to the treasury of the NFT . 
2. then finding all the future yielding strategies  using the  `getAllFutures()`.
3. based on the type of underlying strategy , compute the  APR for the given staked token using computePTAPR(token address ).
4. and then finally tokenize the given yield strategy to the interest bearing tokens  using tokenizeIBT(amountOfTokens ,tokenAddress).



