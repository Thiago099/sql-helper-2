<script setup lang="ts">
import { defineExpose, ref } from 'vue'

import searchInput from '@/components/multisearch-input.vue'

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

    if(selected_tables.value.every((item:any) => item.table.name != table.name || item.database != database))
    {
        selected_tables.value.push({database,table})
    }
    else
    {
        selected_tables.value = selected_tables.value.filter((item:any) => item.table.name != table.name || item.database != database) as []
    }
}

defineExpose({
    load,
});
</script>

<template>
<div>
    <div class="row">
        <div class="col-6">
            <search-input 
                @database="search_database = $event"
                @table="search_table = $event"
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
                        <div class="item item-database" @click="database.collapsed = !database.collapsed">
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
                                @click="move(table,database.name);table.selected = !table.selected"
                                :key="database.name+table.name"
                            >
                                &nbsp;&nbsp;&nbsp;&nbsp;{{ table.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div 
                class="group" 
                style="height:calc(100vh - 130px);margin-top:49px"
            >
                <div 
                    class="item" 
                    v-for="(selected, index) of selected_tables" 
                    :key="selected" 
                    @click="selected_tables.splice(index,1);selected.table.selected = false"
                > 
                    <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                </div>
            </div>
        </div>
            
    </div>

</div>
</template>
<style scoped>

.collapse-icon{
    padding:2px;
    font-size: 15pt;
    transition: all 0.2s;
    cursor: pointer;
    color: rgb(76, 190, 218)
}

.header-group{
    padding: 5px;
    background-color:white;
    border-bottom: 2px solid #e9ecef;
    width:100%;
    position: sticky;
    top: 0;
}


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