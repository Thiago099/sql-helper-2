<script setup lang="ts">
import { ref,watch } from 'vue'
import { used_tables, available_foreign_keys, used_chained } from './used-tables'
import { used } from './used-fields'
import { connection } from '@/libraries/mysql'

watch(
  [used_tables, used_chained],
  async () => 
    {
    used.value = [...used_chained.value.reduce((previus:any, current:any)=>[...previus,...current.children],[])
    .map((item: any) => {return{database:item.database, table:item.item.name, item:item.item}}),
    ...used_tables.value.map((item: any) => {return{database:item.database, table:item.table.name}})]
    .sort((a:any,b:any) => a.table.localeCompare(b.table))
    used.value.forEach(async(item:any)=>{
        item.collapsed = false;
        item.alias = item?.item?.name;
        item.fields = await new Promise(resolve => connection.value.query(`
        SELECT
            COLUMN_NAME
        FROM
            information_schema.COLUMNS
        WHERE
            TABLE_SCHEMA = '${item.database}' AND TABLE_NAME = '${item.table}'`, (err:any, result:any) => {
            resolve(result.map((item:any) => item.COLUMN_NAME))
        }))
    })
    
  },
  { immediate: true } // <- if you want to access it immediately
);

</script>

<template>
    <div>
        <div class="group" style="height:90vh">
            <div v-for="table in used" :key="table">
                <div class="item" draggable="true" @click="table.collapsed = !table.collapsed">
                    <div style="display:inline;margin-right:5px">
                        <i class="fa fa-caret-right item-database" v-if="table.collapsed"></i> 
                        <i class="fa fa-caret-down item-database" v-else></i>
                    </div>
                    <span class="item-database">{{ table.database }}</span>.<span class="item-table">{{ table.table }}</span> <span :class="{'item-parent':table?.item?.child,'item-child':!table?.item?.child}">{{ table?.item?.COLUMN_NAME }}</span>
                </div>
                <div v-show="!table.collapsed">
                    <div v-for="field in table.fields" :key="field" class="item">
                        &nbsp;&nbsp;&nbsp;&nbsp;{{field}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>