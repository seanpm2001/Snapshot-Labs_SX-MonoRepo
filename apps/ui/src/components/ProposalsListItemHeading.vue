<script setup lang="ts">
import { quorumLabel, quorumProgress } from '@/helpers/quorum';
import { _n, _p, _rt, getProposalId, shortenAddress } from '@/helpers/utils';
import { Choice, Proposal as ProposalType } from '@/types';

const props = withDefaults(
  defineProps<{
    proposal: ProposalType;
    showSpace?: boolean;
    showAuthor?: boolean;
    showVotedIndicator?: boolean;
  }>(),
  {
    showSpace: true,
    showAuthor: true,
    showVotedIndicator: true
  }
);

const { getTsFromCurrent } = useMetaStore();

const { votes } = useAccount();
const modalOpenTimeline = ref(false);
const modalOpenVote = ref(false);
const selectedChoice = ref<Choice | null>(null);

const totalProgress = computed(() => quorumProgress(props.proposal));
</script>
<template>
  <div v-bind="$attrs">
    <div class="space-x-2 flex">
      <AppLink
        :to="{
          name: 'proposal-overview',
          params: {
            proposal: proposal.proposal_id,
            space: `${proposal.network}:${proposal.space.id}`
          }
        }"
      >
        <ProposalIconStatus
          width="17"
          height="17"
          :state="proposal.state"
          class="top-1.5"
        />
      </AppLink>

      <div class="md:flex md:min-w-0 my-1 items-center leading-6">
        <AppLink
          v-if="showSpace"
          :to="{
            name: 'space-overview',
            params: {
              space: `${proposal.network}:${proposal.space.id}`
            }
          }"
          class="text-[21px] text-skin-text mr-2 font-bold inline shrink-0"
        >
          {{ proposal.space.name }}
        </AppLink>

        <AppLink
          :to="{
            name: 'proposal-overview',
            params: {
              proposal: proposal.proposal_id,
              space: `${proposal.network}:${proposal.space.id}`
            }
          }"
          class="md:flex md:min-w-0"
        >
          <h3
            class="text-[21px] inline md:truncate mr-2"
            v-text="proposal.title || `Proposal #${proposal.proposal_id}`"
          />
          <IH-check
            v-if="
              showVotedIndicator && votes[`${proposal.network}:${proposal.id}`]
            "
            class="text-skin-success inline-block shrink-0 relative top-[-1px] md:top-0.5"
          />
        </AppLink>
      </div>
    </div>
    <div class="inline">
      {{ getProposalId(proposal) }}
      <template v-if="showAuthor">
        by
        <AppLink
          class="text-skin-text"
          :to="{
            name: 'space-user-statement',
            params: {
              space: `${proposal.network}:${proposal.space.id}`,
              user: proposal.author.id
            }
          }"
        >
          {{ proposal.author.name || shortenAddress(proposal.author.id) }}
        </AppLink>
      </template>
    </div>
    <span>
      <template v-if="proposal.vote_count">
        · {{ _n(proposal.vote_count, 'compact') }}
        {{ proposal.vote_count !== 1 ? 'votes' : 'vote' }}
      </template>
      <span v-if="proposal.quorum" class="lowercase">
        · {{ _p(totalProgress) }} {{ quorumLabel(proposal.quorum_type) }}
      </span>
      ·
      <button
        type="button"
        class="text-skin-text"
        @click="modalOpenTimeline = true"
        v-text="_rt(getTsFromCurrent(proposal.network, proposal.max_end))"
      />
    </span>
  </div>
  <teleport to="#modal">
    <ModalTimeline
      :open="modalOpenTimeline"
      :proposal="proposal"
      @close="modalOpenTimeline = false"
    />
    <ModalVote
      :choice="selectedChoice"
      :proposal="proposal"
      :open="modalOpenVote"
      @close="modalOpenVote = false"
      @voted="selectedChoice = null"
    />
  </teleport>
</template>
