<script setup lang="ts">
import connectionView from '@/views/connectionView.vue'
import mainView from '@/views/mainView.vue'
import popupControl from '@/components/popup-control.vue'

import { ref } from 'vue'
const popup = ref()
const main = ref()
const selectedView = ref('connection')
import mysql from 'mysql'
import { connection } from '@/libraries/mysql'
function open(e: any)
{
    
    const con = mysql.createConnection({
        host     : e.ip,
        user     : e.user,
        password : e.password,
    });
    con.connect( (err: any) => {
        if (err) {
            popup.value.addMessage('danger', 'Error connecting to database')
            return;
        }
        connection.value = con
        main.value.load()
        console.log('connected as id ' + con.threadId);
        selectedView.value = 'main'
    });
    
}
</script>

<template>
    <popup-control ref="popup"/>
    <connection-view v-show="selectedView == 'connection'" @open="open" />
    <main-view v-show="selectedView == 'main'" @close="selectedView = 'connection'" ref="main" />
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