<script setup lang="ts">
import { ref } from 'vue'
import { selected_tables } from './selected-tables'
import { connection } from '@/libraries/mysql'

const foreign_keys = ref<any[]>([])
for(const table of selected_tables.value)
{
    connection.value.query(`SELECT 
        KEY_COLUMN_USAGE.TABLE_NAME,
        KEY_COLUMN_USAGE.COLUMN_NAME,
        KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME,
        KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME
        FROM information_schema.TABLE_CONSTRAINTS
        INNER JOIN information_schema.KEY_COLUMN_USAGE ON TABLE_CONSTRAINTS.CONSTRAINT_NAME = KEY_COLUMN_USAGE.CONSTRAINT_NAME
        WHERE TABLE_CONSTRAINTS.CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND TABLE_CONSTRAINTS.TABLE_SCHEMA = '${table.database}'
        AND KEY_COLUMN_USAGE.TABLE_SCHEMA = '${table.database}'
        AND 
        (
            KEY_COLUMN_USAGE.TABLE_NAME = '${table.table.name}'
            OR KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME = '${table.table.name}'
        )`,(err:any, rows:any)=>{
            table.foreign_keys = rows
        })
}

</script>

<template>
    <div>
        {{foreign_keys}}
        <div class="row">
            <div class="col-6">
                <div class="group" style="height:calc(100vh - 70px);">
                    <div class="item" v-for="selected of selected_tables" :key="selected" > 
                        <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                        <!-- {{selected.foreign_keys}} -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>