import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('KingReserveUSDCOracle', {
    contract:'KingReserveStableOracle',
    waitConfirmations: hre.network.live ? 30 : 1,
    gasPrice: (await hre.ethers.provider.getGasPrice()).mul(2),
    from: deployer,
    log: true,
    args: ['0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c'],
  });

  if (hre.network.live) {
    try {
      const oracle = await deployments.get('KingReserveUSDCOracle');
      await hre.run('verify', { network: 'mainnet', address: oracle.address, constructorArgsParams: ['0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c'] });
    } catch (err) {
      console.log(String(err).split('\n')[0]);
    }
  }
};
export default func;
func.tags = ['KingReserveUSDCOracle', 'Oracle'];
