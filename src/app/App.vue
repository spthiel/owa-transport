<script lang="ts" setup>
import { ref } from "vue";
import IconButton from "./components/buttons/IconButton.vue";
import ExportDialog from "./views/ExportDialog.vue";
import REST, { InboxRule } from "../ms/REST";
import ImportDialog from "./views/ImportDialog.vue";

const value = ref<number>(0);
const importOpen = ref<boolean>(false);
const exportOpen = ref<boolean>(false);
const rules = ref<InboxRule[]>([]);

REST.getInboxRules().then((result) => (rules.value = result));
</script>

<template>
	<div class="owa-transport-buttons">
		<IconButton
			:icon-classes="[
				'_fc_3',
				'owaimg',
				'_opc_g',
				'ms-Icon--arrowDown',
				'ms-icon-font-size-18',
				'ms-fcl-ns-b',
			]"
			icon="documentForward"
			title="Export"
			@click="exportOpen = true"
		/>
		<IconButton
			:icon-classes="[
				'_fc_3',
				'owaimg',
				'_opc_g',
				'ms-Icon--arrowDown',
				'ms-icon-font-size-18',
				'ms-fcl-ns-b',
			]"
			icon="documentReply"
			title="Import"
			@click="importOpen = true"
		/>
	</div>
	<ExportDialog v-model:open="exportOpen" :inbox-rules="rules" />
	<ImportDialog v-model:open="importOpen" />
</template>

<style scoped></style>
