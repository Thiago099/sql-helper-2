<script setup lang="ts">
import { ref,watch } from 'vue'
import { used_tables, available_foreign_keys, used_chained } from './used-tables'
import {used} from './used-fields'

watch(
  [used_tables, used_chained],
  () => 
    {
    used.value = [...used_chained.value.reduce((previus:any, current:any)=>[...previus,...current.children],[])
    .map((item: any) => {return{database:item.database, table:item.item.name, item:item.item}}),
    ...used_tables.value.map((item: any) => {return{database:item.database, table:item.table.name}})]
    .sort((a:any,b:any) => a.table.localeCompare(b.table))
    used.value.forEach((item:any)=>{
        item.collapsed = true;
        item.alias = item?.item?.name;
    })
    
  },
  { immediate: true } // <- if you want to access it immediately
);

</script>

<template>
    <div>
        <div class="group" style="height:90vh">
            <div class="item" draggable="true" v-for="table in used" :key="table" @click="table.collapsed = !table.collapsed">
                <div style="display:inline;margin-right:5px">
                    <i class="fa fa-caret-right item-database" v-if="table.collapsed"></i> 
                    <i class="fa fa-caret-down item-database" v-else></i>
                </div>
                <span class="item-database">{{ table.database }}</span>.<span class="item-table">{{ table.table }}</span> <span :class="{'item-parent':table?.item?.child,'item-child':!table?.item?.child}">{{ table?.item?.COLUMN_NAME }}</span>
            </div>
        </div>
    </div>
</template>