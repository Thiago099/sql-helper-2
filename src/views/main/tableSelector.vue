<script setup lang="ts">
import { ref } from 'vue'
import { selected_tables } from './selected-tables'
</script>

<template>
    <div>
        <div class="group" style="height:calc(100vh - 70px);">

        {{ selected_tables }}
        </div>
    </div>
</template>