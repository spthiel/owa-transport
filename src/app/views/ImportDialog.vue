<script lang="ts" setup>
import NativeDialog from "../components/NativeDialog.vue";
import { computed, ref } from "vue";
import FileUpload from "../components/FileUpload.vue";
import CheckboxTable from "../components/checkboxTable/CheckboxTable.vue";
import { ImportInboxRule } from "../../ms/REST";
import Import from "../../main/Import";
import { computedAsync } from "@vueuse/core";
import CONST from "../../data/CONST";

const open = defineModel<boolean>("open", { required: true });
const max = ref<number>(0);
const current = ref<number>(0);
const displayProgress = ref<boolean>(false);
const file = ref<File | undefined>();
const checkedRules = [];

const rules = computedAsync<ImportInboxRule[]>(async () => {
	const selectedFile = file.value;
	console.log("Read file again");
	const rules = await Import.readRulesFromFile(selectedFile);
	rules.forEach((rule, i) => (rule["OWA-Index"] = i + "-" + rule.Name));
	return rules;
}, []);

const error = computed<string | undefined>(() => {
	if (Import.isValidFile(file.value)) {
		return undefined;
	}

	return `Selected file is not of type '${CONST.FILE_EXTENSION}'`;
});

function startImport() {
	displayProgress.value = true;
}
</script>

<template>
	<NativeDialog
		v-model:open="open"
		title="Import Inbox Rules"
		@close="file = undefined"
	>
		<div class="import-dialog">
			<div class="upload">
				<FileUpload
					v-model:file="file"
					:error="error"
					button-text="Browse"
					info="Choose the location of the inbox-rules export file that you want to import."
				/>
			</div>
			<template v-if="rules.length > 0">
				<div class="owa-transport-table">
					<div class="row header ms-border-color-neutralLight">
						<div class="cell col1 ms-border-color-neutralLight">
							<span>Import</span>
						</div>
						<div class="cell col2">
							<span>Name</span>
						</div>
					</div>
					<CheckboxTable
						:key-of="(rule) => String(rule['OWA-Index'])"
						:values="rules"
						label-field="Name"
					/>
				</div>
				<div>
					<button
						aria-label="Import selected rules"
						class="_op_Y8 ms-border-color-themePrimary o365button restButton ms-bg-color-neutralLighter ms-border-color-neutralTertiary ms-font-color-neutralPrimary"
						type="submit"
						@click="startImport"
					>
						<span class="_fc_4 o365buttonLabel">Import</span>
					</button>
				</div>
				<div class="progress">
					<span v-if="displayProgress">
						Importing: {{ current }} / {{ max }} rules imported.
					</span>
				</div>
			</template>
		</div>
	</NativeDialog>
</template>

<style scoped></style>
