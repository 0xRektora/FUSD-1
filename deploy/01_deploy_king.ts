import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const fusd = await hre.ethers.getContractAt('FUSD', (await deployments.get('FUSD')).address);
  const sWagmeAddress = '0x'.padEnd(42, '0');

  let kingExists = false
  try{
    (await deployments.get('King')).address;
    kingExists = true;
  }catch(err){}

  const args = [fusd.address, sWagmeAddress];
  await deploy('King', {
    waitConfirmations: hre.network.live ? 30 : 1,
    gasPrice: (await hre.ethers.provider.getGasPrice()).mul(2),
    from: deployer,
    log: true,
    args,
  });


  const king = await hre.ethers.getContractAt('King', (await deployments.get('King')).address);

  // If it wasn't previously deployed and called this function before
  if(!kingExists){
      // Set FUSD king
      await (await fusd.claimCrown(king.address)).wait(hre.network.live ? 30 : 1);
    }
    
    if (hre.network.live) {
      try {
      await hre.run('verify', { network: 'mainnet', address: king.address, constructorArgsParams: args });
    } catch (err) {
      console.log(String(err).split('\n')[0]);
    }
  }
};
export default func;
func.dependencies = ['FUSD'];
func.tags = ['King'];
