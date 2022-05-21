<script setup lang="ts">
import { ref, toRefs, defineProps } from 'vue'

interface fieldInput
{
    icon:string
    name:string
}

const props = defineProps<{fields:fieldInput[]}>()

const { fields } = toRefs(props)

const selected = ref(fields.value[0].name)

</script>

<template>
    <div>
        <div class="search-group">
            <i class="fa fa-search"></i>
            <div class="input-group">
                <input type="text" class="form-control" v-for="{name} in fields" :key="name" v-show="selected == name" @input="$emit(name,$event.target.value)">
                <button class="btn" v-for="{name, icon} in fields" :key="name" :class="{'btn-primary':selected == name,'btn-light':selected != name}" @click="selected = name"><i class="fa" :class="icon"></i></button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.search-group{
    margin-bottom:10px;
}
.form-control{
    padding-left:35px;
}
.fa-search{
    color: rgb(177, 176, 176);
    position: absolute;
    margin-top: 10px;
    margin-left: 15px;
    z-index: 100;
}
.btn-light, .btn-light:hover{
    border: 1px solid #ced4da;
}

</style>