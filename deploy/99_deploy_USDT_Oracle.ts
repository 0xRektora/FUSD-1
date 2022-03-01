import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('KingReserveUSDTOracle', {
    contract:'KingReserveStableOracle',
    waitConfirmations: hre.network.live ? 12 : 1,
    gasPrice: (await hre.ethers.provider.getGasPrice()).mul(2),
    from: deployer,
    log: true,
    args: ['0xF64b636c5dFe1d3555A847341cDC449f612307d0'],
  });

  if (hre.network.live) {
    try {
      const oracle = await deployments.get('KingReserveUSDTOracle');
      await hre.run('verify', { network: 'mainnet', address: oracle.address, constructorArgsParams: ['0xF64b636c5dFe1d3555A847341cDC449f612307d0']  });
    } catch (err) {
      console.log(err);
    }
  }
};
export default func;
func.tags = ['KingReserveUSDTOracle', 'Oracle'];
