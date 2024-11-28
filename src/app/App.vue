<script lang="ts" setup>
import { ref } from "vue";
import IconButton from "./components/buttons/IconButton.vue";
import ExportDialog from "./views/ExportDialog.vue";
import REST, { InboxRule } from "../ms/REST";

const value = ref<number>(0);
const importOpen = ref<boolean>(false);
const exportOpen = ref<boolean>(false);
const rules = ref<InboxRule[]>([]);

REST.getInboxRules().then((result) => (rules.value = result));
</script>

<template>
	<div>
		<IconButton
			icon="documentForward"
			title="Export"
			@click="exportOpen = true"
		/>
		<IconButton
			icon="documentReply"
			title="Import"
			@click="importOpen = true"
		/>
	</div>
	<ExportDialog v-model:open="exportOpen" :inbox-rules="rules"></ExportDialog>
</template>

<style scoped></style>
