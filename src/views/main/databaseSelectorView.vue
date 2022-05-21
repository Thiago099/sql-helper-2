<script setup lang="ts">
import { defineExpose, ref } from 'vue'

import MultiSearchInput from '@/components/multisearch-input.vue'
import { clear as clear_used_tables } from './used-tables'

import { load, databases } from './load-databases'

function collapse()
{
    databases.value.forEach((item:any) => {
        item.collapsed = false;
    });
}
function expand()
{
    databases.value.forEach((item:any) => {
        item.collapsed = true;
    });
}

const search_database = ref('')
const search_table = ref('')

import { selected_tables } from './selected-tables'


function move(table:any, database:string) {
    const selected = table.selected 
    selected_tables.value.forEach((element:any) => {
        element.table.selected = false;
    });
    table.selected = !selected
    selected_tables.value = []
    if(!selected)
    {
        selected_tables.value.push({database,table})
    }
    else
    {
        selected_tables.value = selected_tables.value.filter((item:any) => item.table.name != table.name || item.database != database) as []
    }
    clear_used_tables()
}

</script>

<template>
<div>
            <multi-search-input 
                @database="search_database = $event"
                @table="search_table = $event"
                :fields="[
                    {
                        name:'database',
                        icon:'fa-database'
                    },
                    {
                        name:'table',
                        icon:'fa-table'
                    }
                ]"
            />
            <div class="group" style="height:calc(100vh - 130px)">
                <div class="header-group">
                    <i class="fa fa-minus-square collapse-icon" @click="expand()"></i>
                    <i class="fa fa-plus-square collapse-icon" @click="collapse()"></i>
                    <i class="fa fa-rotate-left collapse-icon" @click="load()" style="font-size:13pt;"></i>
                </div>
                <div style="padding-top:5px">
                    <div 
                        v-for="database of databases?.filter((item)=>item.name.includes(search_database))" 
                        :key="database.name"
                        
                    >
                        <div class="item item-database collapsable" @click="database.collapsed = !database.collapsed">
                            <i class="fa fa-caret-right" v-if="database.collapsed"></i> 
                            <i class="fa fa-caret-down" v-else></i>
                            {{ database.name }}
                        </div>
                        <div v-if="!database.collapsed">
                            <div 
                                class="item item-table" 
                                v-for="table of database.tables?.filter((item)=>item.name.includes(search_table))" 
                                draggable="true" 
                                :class="{'selected-item':table.selected}"
                                @click="move(table,database.name);"
                                :key="database.name+table.name"
                            >
                                &nbsp;&nbsp;&nbsp;&nbsp;{{ table.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<style scoped>




.selected-item{
    /* dashed border */
    border: 2px dashed rgb(0, 204, 255);
    background-color: rgb(211, 244, 250);
}
.selected-item:hover{
    /* dashed border */
    border: 2px dashed rgb(0, 204, 255);
    background-color: rgb(211, 244, 250);
}
</style>