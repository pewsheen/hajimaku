<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Options = {
  language: 'ja' | 'en-US' | 'zh-TW';
};

const language = ref<Options['language']>('ja');
const options = ref([
  { label: '日本語', value: 'ja' },
  { label: 'English (US)', value: 'en-US' },
  { label: '繁體中文', value: 'zh-TW' },
]);

function saveOptions(toStorage = true) {
  const payload: Options = { language: language.value };
  try {
    if (toStorage) {
      chrome.storage?.sync.set({ hajimakuOptions: payload });
    }
  } catch {}
  sendMessageToActiveTab({ type: 'hajimaku:setOptions', payload });
}

function sendMessageToActiveTab(message: any) {
  try {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs?.[0];
      if (!tab?.id) return;
      chrome.tabs.sendMessage(tab.id, message, () => void 0);
    });
  } catch {}
}

onMounted(() => {
  try {
    chrome.storage?.sync.get(['hajimakuOptions'], (res) => {
      const stored: Partial<Options> | undefined = res?.hajimakuOptions;
      if (stored?.language) {
        language.value = stored.language;
      }
    });
  } catch {}
});
</script>

<template>
  <div style="display: grid; gap: 8px; min-width: 260px">
    <div>
      <label for="sel-lang">Language</label>
      <select
        id="sel-lang"
        v-model="language"
        @change="saveOptions()"
        style="width: 100%"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped></style>
