<script setup lang="ts">
import type { Conversation, Message } from "~/data/mock/messages";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Messages - ISM Incubator",
});

// Mock conversations for mentor
const conversations = ref<Conversation[]>([
  {
    id: "conv-m1",
    participantIds: ["mentor-003", "admin-001"],
    participants: [
      { id: "mentor-003", name: "Ousmane Ba", role: "mentor" },
      { id: "admin-001", name: "Admin ISM", role: "admin" },
    ],
    lastMessage: "Merci pour votre retour sur le projet.",
    lastMessageAt: "2026-01-30T14:30:00Z",
    unreadCount: 1,
  },
  {
    id: "conv-m2",
    participantIds: ["mentor-003", "user-p6"],
    participants: [
      { id: "mentor-003", name: "Ousmane Ba", role: "mentor" },
      { id: "user-p6", name: "Oumar Kane", role: "participant" },
    ],
    lastMessage: "Nous avons mis a jour le pitch deck.",
    lastMessageAt: "2026-01-29T10:15:00Z",
    unreadCount: 0,
  },
  {
    id: "conv-m3",
    participantIds: ["mentor-003", "user-p14"],
    participants: [
      { id: "mentor-003", name: "Ousmane Ba", role: "mentor" },
      { id: "user-p14", name: "Awa Sow", role: "participant" },
    ],
    lastMessage: "Quand pouvons-nous planifier une session?",
    lastMessageAt: "2026-01-28T16:00:00Z",
    unreadCount: 2,
  },
]);

const messages = ref<Message[]>([
  {
    id: "msg-m1",
    senderId: "admin-001",
    senderName: "Admin ISM",
    senderRole: "admin",
    recipientId: "mentor-003",
    recipientName: "Ousmane Ba",
    content:
      "Bonjour, n'oubliez pas de soumettre vos evaluations avant vendredi.",
    read: true,
    createdAt: "2026-01-30T10:00:00Z",
  },
  {
    id: "msg-m2",
    senderId: "mentor-003",
    senderName: "Ousmane Ba",
    senderRole: "mentor",
    recipientId: "admin-001",
    recipientName: "Admin ISM",
    content:
      "Bien note, je termine l'evaluation de CreditScore Africa aujourd'hui.",
    read: true,
    createdAt: "2026-01-30T14:00:00Z",
  },
  {
    id: "msg-m3",
    senderId: "admin-001",
    senderName: "Admin ISM",
    senderRole: "admin",
    recipientId: "mentor-003",
    recipientName: "Ousmane Ba",
    content: "Merci pour votre retour sur le projet.",
    read: false,
    createdAt: "2026-01-30T14:30:00Z",
  },
]);

// State
const selectedConversation = ref<Conversation | null>(null);
const newMessage = ref("");
const searchQuery = ref("");

const currentUserId = "mentor-003";

// Computed
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;

  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter((conv) =>
    conv.participants.some((p) => p.name.toLowerCase().includes(query)),
  );
});

const conversationMessages = computed(() => {
  if (!selectedConversation.value) return [];
  return messages.value.filter(
    (m) =>
      (m.senderId === currentUserId &&
        selectedConversation.value?.participantIds.includes(m.recipientId)) ||
      (m.recipientId === currentUserId &&
        selectedConversation.value?.participantIds.includes(m.senderId)),
  );
});

// Methods
function getOtherParticipant(conv: Conversation) {
  return (
    conv.participants.find((p) => p.id !== currentUserId) ||
    conv.participants[0]
  );
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (days === 1) {
    return "Hier";
  } else {
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }
}

function selectConversation(conv: Conversation) {
  selectedConversation.value = conv;
  const index = conversations.value.findIndex((c) => c.id === conv.id);
  if (index !== -1) {
    conversations.value[index].unreadCount = 0;
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  const recipient = getOtherParticipant(selectedConversation.value);
  const message: Message = {
    id: `msg-${Date.now()}`,
    senderId: currentUserId,
    senderName: "Ousmane Ba",
    senderRole: "mentor",
    recipientId: recipient.id,
    recipientName: recipient.name,
    content: newMessage.value.trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };

  messages.value.push(message);

  const index = conversations.value.findIndex(
    (c) => c.id === selectedConversation.value!.id,
  );
  if (index !== -1) {
    conversations.value[index].lastMessage = message.content;
    conversations.value[index].lastMessageAt = message.createdAt;
  }

  newMessage.value = "";
}

function getRoleBadge(role: string) {
  const config: Record<string, { label: string; class: string }> = {
    admin: { label: "Admin", class: "bg-primary/10 text-primary" },
    mentor: { label: "Mentor", class: "bg-secondary/10 text-secondary" },
    participant: { label: "Participant", class: "bg-blue-100 text-blue-700" },
  };
  return config[role] || config.participant;
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-heading-lg text-primary mb-1">Messages</h1>
      <p class="text-body text-gray-500">
        Communiquez avec l'administration et les participants
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <UiCard class="lg:col-span-1">
        <div class="mb-4">
          <UiInput
            v-model="searchQuery"
            placeholder="Rechercher..."
            type="search"
          >
            <template #prefix>
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </template>
          </UiInput>
        </div>

        <div class="space-y-1">
          <button
            v-for="conv in filteredConversations"
            :key="conv.id"
            :class="[
              'w-full text-left p-3 rounded-lg transition-colors',
              selectedConversation?.id === conv.id
                ? 'bg-primary/10'
                : 'hover:bg-gray-50',
            ]"
            @click="selectConversation(conv)"
          >
            <div class="flex items-start gap-3">
              <div class="relative">
                <UiAvatar :name="getOtherParticipant(conv).name" size="md" />
                <span
                  v-if="conv.unreadCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {{ conv.unreadCount }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <span class="text-body-sm font-medium text-gray-900 truncate">
                    {{ getOtherParticipant(conv).name }}
                  </span>
                  <span class="text-caption text-gray-400 flex-shrink-0">
                    {{ formatTime(conv.lastMessageAt) }}
                  </span>
                </div>
                <span
                  :class="[
                    'px-1.5 py-0.5 rounded text-xs font-medium',
                    getRoleBadge(getOtherParticipant(conv).role).class,
                  ]"
                >
                  {{ getRoleBadge(getOtherParticipant(conv).role).label }}
                </span>
                <p class="text-body-sm text-gray-500 truncate mt-1">
                  {{ conv.lastMessage }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </UiCard>

      <UiCard class="lg:col-span-2 flex flex-col min-h-[500px]">
        <template v-if="selectedConversation">
          <div
            class="flex items-center gap-3 pb-4 border-b border-neutral-border"
          >
            <UiAvatar
              :name="getOtherParticipant(selectedConversation).name"
              size="md"
            />
            <div>
              <div class="text-body font-medium text-gray-900">
                {{ getOtherParticipant(selectedConversation).name }}
              </div>
              <span
                :class="[
                  'px-1.5 py-0.5 rounded text-xs font-medium',
                  getRoleBadge(getOtherParticipant(selectedConversation).role)
                    .class,
                ]"
              >
                {{
                  getRoleBadge(getOtherParticipant(selectedConversation).role)
                    .label
                }}
              </span>
            </div>
          </div>

          <div class="flex-1 py-4 space-y-4 overflow-y-auto">
            <div
              v-for="message in conversationMessages"
              :key="message.id"
              :class="[
                'flex',
                message.senderId === currentUserId
                  ? 'justify-end'
                  : 'justify-start',
              ]"
            >
              <div
                :class="[
                  'max-w-[80%] px-4 py-2 rounded-lg',
                  message.senderId === currentUserId
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900',
                ]"
              >
                <p class="text-body-sm">{{ message.content }}</p>
                <span
                  :class="[
                    'text-xs mt-1 block',
                    message.senderId === currentUserId
                      ? 'text-white/70'
                      : 'text-gray-400',
                  ]"
                >
                  {{ formatTime(message.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-border">
            <form @submit.prevent="sendMessage" class="flex gap-3">
              <UiInput
                v-model="newMessage"
                placeholder="Votre message..."
                class="flex-1"
              />
              <UiButton type="submit" :disabled="!newMessage.trim()">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </UiButton>
            </form>
          </div>
        </template>

        <template v-else>
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p class="text-body text-gray-500">
                Selectionnez une conversation
              </p>
            </div>
          </div>
        </template>
      </UiCard>
    </div>
  </div>
</template>
