<script lang="ts" setup>
import NativeDialog from "../components/NativeDialog.vue";
import REST, { InboxRule } from "../../ms/REST";
import Export from "../../main/Export";
import CheckboxTable from "../components/checkboxTable/CheckboxTable.vue";

const open = defineModel<boolean>("open", { required: true });

const emit = defineEmits<{
	export: [Record<string, boolean>];
}>();

const { inboxRules } = defineProps<{
	inboxRules: InboxRule[];
}>();

let checkedRules = inboxRules;

function onChange(rules: InboxRule[]) {
	checkedRules = rules;
}

async function startExport() {
	const checkedIds = checkedRules.map((rule) => rule.Identity.RawIdentity);

	const rules = await REST.getInboxRules();

	Export.exportRules(
		rules.filter((rule) => checkedIds.includes(rule.Identity.RawIdentity)),
	);
}
</script>

<template>
	<NativeDialog v-model:open="open" title="Export Inbox Rule">
		<div class="export-dialog">
			<div class="owa-transport-table">
				<div class="row header ms-border-color-neutralLight">
					<div class="cell col1 ms-border-color-neutralLight">
						<span>Export</span>
					</div>
					<div class="cell col2">
						<span>Name</span>
					</div>
				</div>
				<CheckboxTable
					:default-value="true"
					:key-of="(rule) => rule.Identity.RawIdentity"
					:values="inboxRules"
					label-field="Name"
					@change="onChange"
				/>
			</div>
			<div>
				<button
					ref="button"
					aria-label="Export selected rules"
					class="_op_Y8 ms-border-color-themePrimary o365button restButton ms-bg-color-neutralLighter ms-border-color-neutralTertiary ms-font-color-neutralPrimary"
					type="submit"
					@click="startExport"
				>
					<span class="_fc_4 o365buttonLabel">Export</span>
				</button>
			</div>
		</div>
	</NativeDialog>
</template>

<style scoped></style>
