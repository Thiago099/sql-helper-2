<script setup lang="ts">
import { defineExpose, ref } from 'vue'
import { connection } from '@/libraries/mysql'
import searchInput from '@/components/multisearch-input.vue'

const databases = ref()

const search = ref()
async function load(){
    connection.value.query('SHOW DATABASES', async (err: any, results: any, fields: any) => {
        databases.value = await Promise.all(results.map(async(item:any) => { return {
            database: item.Database,
            tables: await new Promise((resolve, reject) => {
                connection.value.query(`SHOW TABLES FROM ${item.Database}`, (err: any, results: any, fields: any) => {
                    if(results)
                    {
                        resolve(results.map((table:any) => 
                            table[`Tables_in_${item.Database}`]
                        ))
                    }
                    resolve([])
                })
            })
        }}))
    });
}

defineExpose({
    load,
});
</script>

<template>
<div class="container">
<div class="row">
    <div class="col-6">
        
        <search-input @input="search = $event?.target?.value"/>
        <div class="group" style="height:calc(100vh - 80px)">
            <div 
                v-for="database of databases?.filter((item)=>item.database.includes(search))" 
                :key="database.database"
                class="item"
            >{{ database.database }}</div>
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
}
.item:hover{
    background-color: #f5f5f5;
}
</style>