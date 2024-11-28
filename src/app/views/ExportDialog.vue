<script lang="ts" setup>
import NativeDialog from "../components/NativeDialog.vue";
import { InboxRule } from "../../ms/REST";
import MSCheckbox from "../components/MSCheckbox.vue";
import { reactive, ref, watch } from "vue";

const open = defineModel<boolean>("open", { required: true });

const emit = defineEmits<{
	export: [Record<string, boolean>];
}>();

defineProps<{
	inboxRules: InboxRule[];
}>();

const allChecked = ref<boolean>(true);

const states = reactive<Record<string, boolean>>({});

watch(states, (value) => {
	allChecked.value =
		Object.values(states).find((state) => !state) === undefined;
});

function changeAll(value: boolean) {
	Object.keys(states).forEach((key) => (states[key] = value));
	allChecked.value = value;
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
				<div
					ref="grid"
					class="row scroller customScrollBar ms-border-color-neutralLight"
				>
					<div class="row selectAll ms-bg-color-themeLighter">
						<div class="cell col1">
							<MSCheckbox
								:checked="allChecked"
								label="Select all"
								@update:checked="changeAll"
							/>
						</div>
						<div class="cell col2">
							<span class="text-large">Select all</span>
						</div>
					</div>
				</div>
				<template v-for="rule in inboxRules">
					<div class="row checkbox-row">
						<div class="cell col1">
							<MSCheckbox
								v-model:checked="
									states[rule.Identity.RawIdentity]
								"
								label="Export {{ rule.Name }}"
							/>
						</div>
						<div class="cell col2">
							<span class="text-large">{{ rule.Name }}</span>
						</div>
					</div>
				</template>
			</div>
			<div>
				<button
					ref="button"
					aria-label="Export selected rules"
					class="_op_Y8 ms-border-color-themePrimary o365button restButton ms-bg-color-neutralLighter ms-border-color-neutralTertiary ms-font-color-neutralPrimary"
					type="submit"
					@click="emit('export', states)"
				>
					<span class="_fc_4 o365buttonLabel">Export</span>
				</button>
			</div>
		</div>
	</NativeDialog>
</template>

<style scoped></style>
