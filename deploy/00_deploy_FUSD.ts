import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployment = await deploy('FUSD', {
    waitConfirmations: hre.network.live ? 30 : 1,
    gasPrice: (await hre.ethers.provider.getGasPrice()).mul(2),
    from: deployer,
    log: true,
    args: [deployer],
  });

  if (hre.network.live) {
    try {
      const fusd = await deployments.get('FUSD');
      await hre.run('verify', { network: 'mainnet', address: fusd.address, constructorArgsParams: [deployer] });
    } catch (err) {
      console.log(String(err).split('\n')[0]);
    }
  }
};
export default func;
func.tags = ['FUSD'];
