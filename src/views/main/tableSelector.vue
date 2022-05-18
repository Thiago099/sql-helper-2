<script setup lang="ts">
import { ref } from 'vue'
import { selected_tables } from './selected-tables'
import { find_foreign_keys } from './foreign-key-finder'

for(const table of selected_tables.value)
{
    find_foreign_keys(table.table.name, table.database).then((result:any) => {
        table.foreign_keys = result
    })
}

</script>

<template>
    <div>
        <div class="row">
            <div class="col-6">
                <div class="group" style="height:calc(100vh - 70px);">
                    <div class="item" v-for="selected of selected_tables" :key="selected" > 
                        <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                        {{ selected.foreign_keys }}
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="group" style="height:calc(100vh - 70px);">
                </div>
            </div>
        </div>
    </div>
</template>