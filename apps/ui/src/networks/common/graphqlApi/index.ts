import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import {
  VOTES_QUERY,
  USER_VOTES_QUERY,
  PROPOSALS_QUERY,
  PROPOSALS_SUMMARY_QUERY,
  PROPOSAL_QUERY,
  SPACES_QUERY,
  SPACE_QUERY,
  USER_QUERY
} from './queries';
import type { PaginationOpts, SpacesFilter, NetworkApi } from '@/networks/types';
import type { Space, Proposal, Vote, User, Transaction, NetworkID } from '@/types';

type ApiSpace = Omit<Space, 'network'>;
type ApiProposal = Omit<
  Proposal,
  | 'has_started'
  | 'has_execution_window_started'
  | 'has_veto_period_ended'
  | 'has_ended'
  | 'execution'
  | 'network'
> & {
  execution: string;
};

function formatExecution(execution: string): Transaction[] {
  if (execution === '') return [];

  try {
    const result = JSON.parse(execution);

    return Array.isArray(result) ? result : [];
  } catch (e) {
    console.log('Failed to parse execution');
    return [];
  }
}

function formatSpace(space: ApiSpace, networkId: NetworkID): Space {
  return {
    ...space,
    network: networkId
  };
}

function formatProposal(
  proposal: ApiProposal,
  networkId: NetworkID,
  now: number = Date.now()
): Proposal {
  return {
    ...proposal,
    execution: formatExecution(proposal.execution),
    has_started: proposal.start * 1000 >= now,
    has_execution_window_opened: proposal.min_end * 1000 <= now,
    has_ended: proposal.max_end * 1000 <= now,
    has_veto_period_ended: proposal.execution_time === 0 || proposal.execution_time * 1000 <= now,
    network: networkId
  };
}

export function createApi(uri: string, networkId: NetworkID): NetworkApi {
  const httpLink = createHttpLink({ uri });

  const apollo = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
      addTypename: false
    }),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      }
    }
  });

  return {
    loadProposalVotes: async (proposal: Proposal): Promise<Vote[]> => {
      const { data } = await apollo.query({
        query: VOTES_QUERY,
        variables: {
          space: proposal.space.id,
          proposal: proposal.proposal_id
        }
      });

      return data.votes;
    },
    loadUserVotes: async (voter: string): Promise<{ [key: string]: Vote }> => {
      const { data } = await apollo.query({
        query: USER_VOTES_QUERY,
        variables: {
          voter: voter.toLowerCase()
        }
      });

      return Object.fromEntries(
        (data.votes as Vote[]).map(vote => [`${networkId}:${vote.space.id}/${vote.proposal}`, vote])
      );
    },
    loadProposals: async (
      spaceId: string,
      { limit, skip = 0 }: PaginationOpts,
      searchQuery = ''
    ): Promise<Proposal[]> => {
      const { data } = await apollo.query({
        query: PROPOSALS_QUERY,
        variables: {
          space: spaceId,
          searchQuery,
          first: limit,
          skip
        }
      });

      return data.proposals.map(proposal => formatProposal(proposal, networkId));
    },
    loadProposalsSummary: async (spaceId: string, limit: number) => {
      const now = Date.now();

      const { data } = await apollo.query({
        query: PROPOSALS_SUMMARY_QUERY,
        variables: {
          first: limit,
          space: spaceId,
          threshold: Math.floor(now / 1000)
        }
      });

      return [...data.active, ...data.expired].map(proposal =>
        formatProposal(proposal, networkId, now)
      );
    },
    loadProposal: async (spaceId: string, proposalId: number): Promise<Proposal> => {
      const { data } = await apollo.query({
        query: PROPOSAL_QUERY,
        variables: { id: `${spaceId}/${proposalId}` }
      });

      return formatProposal(data.proposal, networkId);
    },
    loadSpaces: async (
      { limit, skip = 0 }: PaginationOpts,
      filter?: SpacesFilter
    ): Promise<Space[]> => {
      const { data } = await apollo.query({
        query: SPACES_QUERY,
        variables: {
          first: limit,
          skip,
          ...(filter ? { where: filter } : {})
        }
      });

      return data.spaces.map(space => formatSpace(space, networkId));
    },
    loadSpace: async (id: string): Promise<Space | null> => {
      const { data } = await apollo.query({
        query: SPACE_QUERY,
        variables: { id }
      });

      if (!data.space) return null;

      return formatSpace(data.space, networkId);
    },
    loadUser: async (id: string): Promise<User> => {
      const { data } = await apollo.query({
        query: USER_QUERY,
        variables: { id }
      });

      return data.user;
    }
  };
}
