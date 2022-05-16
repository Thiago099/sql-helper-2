<script setup lang="ts">
import { ref, toRefs, defineProps } from 'vue'
//props value

const props = defineProps<{value:string}>()
const { value } = toRefs(props)

</script>

<template>
    <div class="search-group">
        <i class="fa fa-search"></i>
        <div class="input-group">
            <button class="btn btn-secondary"><i class="fa fa-database"></i></button>
            <button class="btn btn-secondary"><i class="fa fa-table"></i></button>
            <input type="text" class="form-control" @input="$emit('input',value)">
        </div>
    </div>
</template>
<style scoped>
.search-group{
    margin-top:10px;
    margin-bottom:10px;
}
.form-control{
    padding-left:40px;
}
.fa-search{
    color: rgb(177, 176, 176);
    position: fixed;
    margin-top: 10px;
    margin-left: 15px;
}

</style>