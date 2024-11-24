<template>
  <div v-if="showDate" class="flex justify-center my-4">
    <div class="bg-gray-200 rounded-full px-4 py-1 text-sm text-gray-600">
      {{ formatDateSeparator(message.timestamp) }}
    </div>
  </div>
  <div
    :class="['flex w-full mb-4', isMyMessage ? 'justify-end' : 'justify-start']"
  >
    <div
      v-if="!isMyMessage"
      class="w-8 h-8 rounded-full bg-gray-300 mr-2 flex-shrink-0"
    />

    <div
      :class="[
        'flex flex-col max-w-[70%]',
        isMyMessage ? 'items-end' : 'items-start',
      ]"
    >
      <span class="text-xs text-gray-600 mb-1">{{ message.username }}</span>

      <div
        :class="[
          'rounded-2xl px-4 py-2 break-words',
          isMyMessage
            ? 'custom-bg-green text-white rounded-tr-none'
            : 'bg-gray-200 text-black rounded-tl-none',
        ]"
      >
        <p class="text-sm">{{ message.content }}</p>
      </div>

      <span class="text-xs text-gray-500 mt-1">{{
        formatTime(message.timestamp)
      }}</span>
    </div>

    <div
      v-if="isMyMessage"
      class="w-8 h-8 rounded-full bg-gray-300 ml-2 flex-shrink-0"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isMyMessage: {
    type: Boolean,
    required: true,
  },
  showDate: {
    type: Boolean,
    required: true,
  },
});

const messageClass = computed(() =>
  props.isMyMessage ? "my-message" : "other-message"
);
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

const formatDateSeparator = (timestamp) => {
  const date = new Date(timestamp);
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (year === currentYear) {
    return `${day} ${month}`;
  }

  return `${day} ${month} ${year}`;
};
</script>

<style scoped>
.custom-bg-green {
  background-color: #12b488;
}
.my-message {
  background-color: #e0f7fa;
  text-align: right;
}

.other-message {
  background-color: #f1f1f1;
  text-align: left;
}

.message-content {
  margin: 0;
}

.message-timestamp {
  font-size: 0.8em;
  color: gray;
}

.message-createdBy {
  font-size: 0.7em;
  color: #888;
}
</style>
