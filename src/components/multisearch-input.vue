<script setup lang="ts">
import { ref } from 'vue'
//props value

const selected = ref('database')

</script>

<template>
    <div>
        <div class="search-group">
            <i class="fa fa-search"></i>
            <div class="input-group">
                <input type="text" class="form-control" v-show="selected == 'database'" @input="$emit('database',$event.target.value)">
                <input type="text" class="form-control" v-show="selected == 'table'" @input="$emit('table',$event.target.value)">
                <button class="btn" :class="{'btn-primary':selected == 'database','btn-light':selected != 'database'}" @click="selected = 'database'"><i class="fa fa-database"></i></button>
                <button class="btn" :class="{'btn-primary':selected == 'table','btn-light':selected != 'table'}" @click="selected = 'table'"><i class="fa fa-table"></i></button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.search-group{
    margin-top:10px;
    margin-bottom:10px;
}
.form-control{
    padding-left:35px;
}
.fa-search{
    color: rgb(177, 176, 176);
    position: fixed;
    margin-top: 10px;
    margin-left: 15px;
    z-index: 100;
}
.btn-light, .btn-light:hover{
    border: 1px solid #ced4da;
}

</style>