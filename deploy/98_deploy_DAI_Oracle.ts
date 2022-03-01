import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('KingReserveDAIOracle', {
    contract:'KingReserveStableOracle',
    waitConfirmations: hre.network.live ? 30 : 1,
    gasPrice: (await hre.ethers.provider.getGasPrice()).mul(2),
    from: deployer,
    log: true,
    args: ['0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52'],
  });

  if (hre.network.live) {
    try {
      const oracle = await deployments.get('KingReserveDAIOracle');
      await hre.run('verify', { network: 'mainnet', address: oracle.address, constructorArgsParams: ['0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52']  });
    } catch (err) {
      console.log(String(err).split('\n')[0]);
    }
  }
};
export default func;
func.tags = ['KingReserveDAIOracle', 'Oracle'];
