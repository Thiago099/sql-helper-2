<script setup lang="ts">
import { ref } from 'vue'
import { selected_tables } from './selected-tables'
import { connection } from '@/libraries/mysql'

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
            table.child = rows.filter((item:any)=>item.TABLE_NAME == table.table.name)
            table.parent = rows.filter((item:any)=>item.REFERENCED_TABLE_NAME == table.table.name)
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
                        {{selected.child}}
                        {{selected.parent}}
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