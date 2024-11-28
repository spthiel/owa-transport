<script generic="T extends object" lang="ts" setup>
import MSCheckbox from "../MSCheckbox.vue";
import nextId from "../../../UIDGenerator";
import { reactive, ref, watch } from "vue";
import CheckboxRow from "./CheckboxRow.vue";

const uid = nextId();

const {
	values,
	defaultValue = false,
	keyOf,
	labelField,
} = defineProps<{
	values: T[];
	keyOf: (value: T) => string;
	labelField: keyof T;
	defaultValue?: boolean;
}>();

const emit = defineEmits<{
	change: [T[]];
}>();

const states = reactive<Record<string, boolean>>({});
const allChecked = ref<boolean>(defaultValue);

watch(states, (value) => {
	allChecked.value =
		Object.values(states).find((state) => !state) === undefined;

	emit(
		"change",
		values.filter((value) => states[keyOf(value)]),
	);
});

function changeAll(value: boolean) {
	Object.keys(states).forEach((key) => (states[key] = value));
	allChecked.value = value;
}

watch(
	() => values,
	(newValues) => {
		for (const key in states) {
			if (!newValues.find((value) => keyOf(value) === key)) {
				delete states[key];
			}
		}

		for (const value of newValues) {
			states[keyOf(value)] = defaultValue;
		}
	},
);

for (const value of values) {
	states[keyOf(value)] = defaultValue;
}

function labelOf(value: T): string {
	return String(value[labelField]);
}
</script>

<template>
	<div class="row scroller customScrollBar ms-border-color-neutralLight">
		<div class="row selectAll ms-bg-color-themeLighter">
			<div class="cell col1">
				<MSCheckbox
					:aria-labelledby="`select-all-${uid}`"
					:checked="allChecked"
					@update:checked="changeAll"
				/>
			</div>
			<div class="cell col2">
				<span :id="`select-all-${uid}`" class="text-large">
					Select all
				</span>
			</div>
		</div>
		<template v-for="value in values">
			<CheckboxRow
				v-model:checked="states[keyOf(value)]"
				:label="labelOf(value)"
			/>
		</template>
	</div>
</template>

<style scoped></style>
