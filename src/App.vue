<script setup lang="ts">
import connectionView from '@/views/connectionView.vue'
import mainView from '@/views/main/databaseSelectorView.vue'
import popupControl from '@/components/popup-control.vue'
import loadControl from '@/components/load-control.vue'
import tableSelector from '@/views/main/tableSelector.vue'
import fieldsSelectorView from '@/views/main/fieldsSelectorView.vue'
import resultView from '@/views/main/resultView.vue'
import { clear as clear_used_tables } from './views/main/used-tables'
import { load } from './views/main/load-databases'

import { selected_tables } from '@/views/main/selected-tables'
import { databases } from '@/views/main/load-databases'
import { ref, nextTick } from 'vue'
import mysql from 'mysql'
import { connection } from '@/libraries/mysql'

const popup = ref()
const main = ref()
const selectedView = ref('connection')
const selectedTab = ref('Database')

function clear()
{
    databases.value = null
    selected_tables.value = []
    selectedTab.value = 'Database'
    clear_used_tables()
}



const tabs = ref([
    'Database',
    'Table',
    'Fields',
    'Result'
])
const loading = ref(false)

function open(e: any)
{
    
    loading.value = true
    const con = mysql.createConnection({
        host     : e.ip,
        user     : e.user,
        password : e.password,
    });
    con.connect( (err: any) => {
        if (err) {
            popup.value.addMessage('danger', 'Error connecting to database')
            loading.value = false
            return;
        }
        connection.value = con
        console.log('connected as id ' + con.threadId);
        selectedView.value = 'main'
        loading.value = false
        nextTick(()=>load())
        
    });
    
}
</script>

<template>
    <div class="container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
        <load-control :loading="loading"/>
        <popup-control ref="popup"/>
        <div v-show="selectedView == 'main'">
            <ul class="nav nav-pills">
                <li class="nav-item" v-for="tab of tabs" :key="tab">
                    <a class="nav-link"  :class="{'active':selectedTab == tab}" @click="selectedTab = tab" href="#">{{tab}}</a>
                </li>
                <li class="nav-item">
                    <a 
                        class="nav-link"
                        style="color:red;right:0px"
                        @click="clear();selectedView = 'connection'"
                        href="#"
                    ><i class="fa fa-times"></i> Close</a>
                </li>
            </ul>
        </div>
        <connection-view v-show="selectedView == 'connection'" @open="open" />
        <main-view v-show="selectedView == 'main' && selectedTab == 'Database'"   ref="main" />
        <table-selector v-show="selectedView == 'main' && selectedTab == 'Table'" ref="table" />
        <fields-selector-view v-if="selectedView == 'main' && selectedTab == 'Fields'" ref="fields" />
        <result-view v-if="selectedView == 'main' && selectedTab == 'Result'" ref="result" />
    </div>
</template>

<style scoped>
.message-box{
    position:fixed;
    background-color:red;
    color:white;
    padding: 10px;
    width: 50vh;
    text-align: center;
    font-size: 20pt;
    margin-top: 20px;
    border-radius: 10px;
    z-index: 100;
    margin-left: calc(50% - 25vh);
}
.nav{
    margin-bottom: 10px;
}
</style>