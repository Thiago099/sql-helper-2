<script setup lang="ts">
import { ref } from 'vue'
import { selected_tables } from './selected-tables'
</script>

<template>
    <div class="container">
        {{selected_tables}}
    </div>
</template>