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
            <div class="group" style="height:calc(100vh - 90px)">
                <div class="header-group">
                    <i class="fa fa-minus-square collapse-icon" @click="expand()"></i>
                    <i class="fa fa-plus-square collapse-icon" @click="collapse()"></i>
                </div>
                <div style="padding-top:20px">
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
            <div class="group" style="height:calc(100vh - 90px)">

            </div>
        </div>
            
    </div>
    <button 
        class="btn btn-danger"
        @click="$emit('close')"
        style="position:fixed;right:10px;bottom:10px;"
    ><i class="fa fa-times"></i> Fechar</button>
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
}
.collapse-icon:hover{
    color: rgb(218, 121, 76);
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