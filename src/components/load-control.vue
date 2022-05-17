<script setup lang="ts">
import { toRefs, defineProps } from "vue"

const props  = defineProps<{loading:boolean}>()
const { loading } = toRefs(props)
</script>

<template>
    <div v-if="loading">
        <div class="fade-bg"></div>
        <i class="fa fa-refresh center-rotate"></i>
    </div>
</template>
<style scoped>
.fade-bg{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1000;
}
.center-rotate{
    position: fixed;
    top: calc(50% - 80px);
    left: calc(50% - 80px);
    font-size: 8em;
    color: white;
    z-index: 1001;
    -webkit-animation:spin 3s linear infinite;
    -moz-animation:spin 3s linear infinite;
    animation:spin 3s linear infinite;
}
@-moz-keyframes spin { 
    100% { -moz-transform: rotate(360deg); } 
}
@-webkit-keyframes spin { 
    100% { -webkit-transform: rotate(360deg); } 
}
@keyframes spin { 
    100% { 
        -webkit-transform: rotate(360deg); 
        transform:rotate(360deg); 
    } 
}
</style>