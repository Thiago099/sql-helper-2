import { ref } from 'vue'
export const used_tables = ref<any>([])
export const available_foreign_keys = ref<any>([])
export const used_chained = ref<any>([])

export function clear()
{
    used_tables.value = []
    available_foreign_keys.value = []
    used_chained.value = []
}