<template>
  <div v-if="showUserSelection" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h3>Select Members</h3>

      <div class="grid grid-cols-1 gap-3 overflow-x-auto">
        <UserIcon
          v-for="member in members"
          :key="member._id"
          :member="member"
          :is-selected="isSelected(member)"
          @selectMember="handleMemberClick"
          @removeMember="removeSelectedMember"
        />
      </div>

      <SelectedUsers
        :members="selectedMembers"
        @remove="removeSelectedMember"
      />
      <button @click="confirmSelection" class="btn mt-4">Confirm</button>
    </div>
  </div>
</template>

<script setup>
import SelectedUsers from "~/components/Chat/AddChat/SelectedUsers.vue";
import UserIcon from "~/components/Chat/AddChat/UserIcon.vue";

const showUserSelection = ref(true);
const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
  initialSelectedMembers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close"]);

const selectedMembers = ref([...props.initialSelectedMembers]);

watch(
  () => props.initialSelectedMembers,
  (newSelectedMembers) => {
    selectedMembers.value = [...newSelectedMembers];
  },
  { immediate: true }
);

const close = () => {
  emit("close");
};

const confirmSelection = () => {
  emit("selection-confirmed", selectedMembers.value);
  close();
};

const isSelected = (member) => {
  return selectedMembers.value.some((m) => m._id === member._id);
};

const removeSelectedMember = (member) => {
  selectedMembers.value = selectedMembers.value.filter(
    (m) => m._id !== member._id
  );
};

const handleMemberClick = (member) => {
  console.log(member);
  const memberIndex = selectedMembers.value.findIndex(
    (m) => m._id === member._id
  );

  if (memberIndex === -1) {
    selectedMembers.value.push(member);
  } else {
    selectedMembers.value.splice(memberIndex, 1);
  }
  console.log(selectedMembers.value);
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}

.close:hover {
  color: #333;
}
</style>
