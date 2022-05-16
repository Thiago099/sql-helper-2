<script setup lang="ts">
import connectionView from '@/views/connectionView.vue'
import mainView from '@/views/mainView.vue'
import { ref } from 'vue'
const selectedView = ref('connection')
import mysql from 'mysql'
var connection = ref<any>()
function open(e: any)
{
    const con = mysql.createConnection({
        host     : e.ip,
        user     : e.user,
        password : e.password,
    });
    con.connect( (err: any) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + con.threadId);
        connection.value = con

        if (err) throw err;
        selectedView.value = 'main'
    });
    // select
    
}
</script>

<template>
    <connection-view v-show="selectedView == 'connection'" @open="open"/>
    <main-view v-show="selectedView == 'main'" @close="selectedView = 'connection'"/>
</template>