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

function allowDrop(ev:any) {
    ev.preventDefault();
}

function drag(ev:any, table:string, database:string) {
    ev.dataTransfer.setData("table", table);
    ev.dataTransfer.setData("database", database);
}

function drop(ev:any) {
    ev.preventDefault();
    var table: string = ev.dataTransfer.getData("table");
    var database: string = ev.dataTransfer.getData("database");


    if(selected_tables.value.every((item:any) => item.table != table || item.database != database))
    {
        selected_tables.value.push({database,table})
    }
}

function move(table:string, database:string) {

    if(selected_tables.value.every((item:any) => item.table != table || item.database != database))
    {
        selected_tables.value.push({database,table})
    }
}

defineExpose({
    load,
});
</script>

<template>
<div class="container">
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
                </div>
                <div style="padding-top:5px">
                    <div 
                        v-for="database of databases?.filter((item)=>item.database.includes(search_database))" 
                        :key="database.database"
                        
                    >
                        <div class="item item-database" @click="database.collapsed = !database.collapsed">
                            <i class="fa fa-caret-right" v-if="database.collapsed"></i> 
                            <i class="fa fa-caret-down" v-else></i>
                            {{ database.database }}
                        </div>
                        <div v-if="!database.collapsed">
                            <div 
                                class="item item-table" 
                                v-for="table of database.tables?.filter((item)=>item.includes(search_table))" 
                                draggable="true" 
                                @dragstart="drag($event, table, database.database)"
                                @click="move(table,database.database)"
                                :key="table"
                            >
                                &nbsp;&nbsp;&nbsp;&nbsp;{{ table }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div 
                class="group" 
                style="height:calc(100vh - 130px);margin-top:59px"
                @drop="drop($event)"
                @dragover="allowDrop($event)"
            >
                <div class="item" v-for="(selected, index) of selected_tables" :key="selected" @click="selected_tables.splice(index,1)"> 
                    <span class="item-database">{{selected.database}}</span>.<span class="item-table">{{ selected.table }}</span>
                </div>
            </div>
        </div>
            
    </div>

</div>
</template>
<style scoped>
.item{
    padding: 5px;
    padding-left: 1.5rem;
    cursor: pointer;
}
.item-database{
    color: rgb(218, 121, 76);
}
.item-table{
    color: rgb(86, 167, 54);
}
.item:hover{
    background-color: #f5f5f5;
    
}
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
</style>