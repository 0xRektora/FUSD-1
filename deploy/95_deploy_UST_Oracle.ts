import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('KingReserveUSTOracle', {
    contract:'KingReserveStableOracle',
    waitConfirmations: hre.network.live ? 12 : 1,
    gasPrice: (await hre.ethers.provider.getGasPrice()).mul(2),
    from: deployer,
    log: true,
    args: ['0x6f3dd0ec672871547ea495dcf7aa963b8a179287'],
  });

  if (hre.network.live) {
    try {
      const oracle = await deployments.get('KingReserveUSTOracle');
      await hre.run('verify', { network: 'mainnet', address: oracle.address,constructorArgsParams: ['0x6f3dd0ec672871547ea495dcf7aa963b8a179287'] });
    } catch (err) {
      console.log(err);
    }
  }
};
export default func;
func.tags = ['KingReserveUSTOracle', 'Oracle'];
