interface IVault  {

function startSharingYield(address receiver, address sender , uint256 amount)
        public
        returns (uint256 shares);


function stopSharingYield() public returns (uint256 amount);



function claimYield(address planet , address  _UserAddress , uint256 amount ) public returns (uint256 claimed)


function claimable(address Planet, address _receiver)
        external
        view
        returns (uint256 amount);





}