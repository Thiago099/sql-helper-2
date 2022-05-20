<script setup lang="ts">
import { ref,watch } from 'vue'
import { used_tables, available_foreign_keys, used_chained } from './used-tables'
import { used } from './used-fields'
import { connection } from '@/libraries/mysql'

watch(
    [used_tables, used_chained],
    async () => 
    {
        used.value = [...used_chained.value.reduce((previous:any, current:any)=>[...previous,...current.children],[])
        .map((item: any) => {return{database:item.database, table:item.item.name, item:item.item}}),
        ...used_tables.value.map((item: any) => {return{database:item.database, table:item.table.name}})]
        .sort((a:any,b:any) => a.table.localeCompare(b.table))
        used.value.forEach(async(item:any)=>{
            item.collapsed = false;
            item.alias = item.table;
            item.fields = await new Promise(resolve => connection.value.query(`
            SELECT
                COLUMN_NAME
            FROM
                information_schema.COLUMNS
            WHERE
                TABLE_SCHEMA = '${item.database}' AND TABLE_NAME = '${item.table}'`, (err:any, result:any) => {
                resolve(result.map((item:any) => {return {name:item.COLUMN_NAME, selected:true, alias:item.COLUMN_NAME}}))
            }))
        })
    },
  { immediate: true } // <- if you want to access it immediately
);

function update_selected(event:any, items:any)
{
    items.forEach((item:any) => {
        item.selected = event.target.checked;
    })
}
const menu = ref<HTMLElement[]>()
let lastMouseDown:any = null;
document.addEventListener(
    "mousedown",
    event => {
        lastMouseDown = event;
    },
    true // A capture handler
);
function prevent(e:Event) {
    e.stopPropagation();
    e.preventDefault();
}
function collapse(table:any)
{
    if(menu.value?.some(item => item.contains(lastMouseDown.target)))
        return
    table.collapsed = !table.collapsed;
}

</script>

<template>
    <div>
        <div class="group" style="height:90vh">
            <div v-for="table in used" :key="table">
                <div class="item" @click="collapse(table)" draggable="true">
                    <div style="display:inline;padding:8px" @click="$event.stopPropagation();">
                        <input type="checkbox" @click="update_selected($event,table.fields)" :checked="table.fields.every(item=>item.selected == true)">
                    </div>
                    <div style="display:inline;margin-right:5px;margin-left:10px">
                        <i class="fa fa-caret-right item-database" v-if="table.collapsed"></i> 
                        <i class="fa fa-caret-down item-database" v-else></i>
                    </div>
                    <span class="item-database">{{ table.database }}</span>.<span class="item-table">{{ table.table }}</span> <span :class="{'item-parent':table?.item?.child,'item-child':!table?.item?.child}">{{ table?.item?.COLUMN_NAME }}</span>
                    <input type="text" class="inline-input" v-model="table.alias" @click="$event.stopPropagation();" ref="menu">
                </div>
                <div v-show="!table.collapsed">
                    <div v-for="field in table.fields" :key="field" class="item">
                        <input style="margin-left:30px" type="checkbox" v-model="field.selected"> <span class="field-name">{{field.name}}</span> 
                        <input type="text" class="inline-input" v-model="field.alias" @click="$event.stopPropagation();">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.inline-input{
    border:1px solid #ccc;
    border-radius: 3px;
    outline:none;
    font-size:12px;
    text-align: center;
    margin-left: 10px;
}
.field-name{
    color: rgb(67, 0, 250)
}
</style>