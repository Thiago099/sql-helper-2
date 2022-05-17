<script setup lang="ts">
import connectionView from '@/views/connectionView.vue'
import mainView from '@/views/main/databaseSelectorView.vue'
import popupControl from '@/components/popup-control.vue'
import loadControl from '@/components/load-control.vue'

import { ref, nextTick } from 'vue'
const popup = ref()
const main = ref()
const selectedView = ref('connection')
const loading = ref(false)
import mysql from 'mysql'
import { connection } from '@/libraries/mysql'
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
        nextTick(()=>main.value.load())
        
    });
    
}
</script>

<template>
    <div>
        <load-control :loading="loading"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
        <popup-control ref="popup"/>
        <connection-view v-show="selectedView == 'connection'" @open="open" />
        <main-view v-if="selectedView == 'main'" @close="selectedView = 'connection'" ref="main" />
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
</style>