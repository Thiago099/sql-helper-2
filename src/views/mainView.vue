<script setup lang=ts>
import { defineExpose, ref } from 'vue'
import { connection } from '@/libraries/mysql'

function load(){
    connection.value.query('SELECT 1+1', (err: any, results: any, fields: any) => {
        console.log(results)
    });
}

defineExpose({
    load,
});
</script>

<template>
    <button 
        class="btn btn-danger"
        @click="$emit('close')"
        style="position:fixed;right:10px;bottom:10px;"
    ><i class="fa fa-times"></i> Fechar</button>
</template>