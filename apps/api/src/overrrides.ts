import { starknetNetworks } from '@snapshot-labs/sx';
import { validateAndParseAddress } from 'starknet';

export const networkNodeUrl =
  process.env.NETWORK_NODE_URL ||
  'https://starknet-sepolia.infura.io/v3/46a5dd9727bf48d4a132672d3f376146';

export const manaRpcUrl = process.env.VITE_MANA_URL || 'https://mana.box';

const createConfig = (
  networkId: keyof typeof starknetNetworks,
  { startBlock }: { startBlock: number }
) => {
  const config = starknetNetworks[networkId];

  return {
    manaRpcUrl: `${manaRpcUrl}/stark_rpc/${config.Meta.eip712ChainId}`,
    baseChainId: config.Meta.herodotusAccumulatesChainId,
    factoryAddress: config.Meta.spaceFactory,
    erc20VotesStrategy: config.Strategies.ERC20Votes,
    propositionPowerValidationStrategyAddress:
      config.ProposalValidations.VotingPower,
    spaceClassHash: config.Meta.masterSpace,
    herodotusStrategies: [
      config.Strategies.OZVotesStorageProof,
      config.Strategies.OZVotesTrace208StorageProof,
      config.Strategies.EVMSlotValue
    ]
      .filter(address => !!address)
      .map(strategy => validateAndParseAddress(strategy)),
    startBlock
  };
};

let networkProperties = createConfig('sn-sep', { startBlock: 17960 });
if (process.env.NETWORK === 'SN_MAIN') {
  networkProperties = createConfig('sn', { startBlock: 445498 });
}

export { networkProperties };
