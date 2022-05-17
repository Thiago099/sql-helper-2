<script setup lang="ts">
import { ref } from 'vue'
import { selected_tables } from './selected-tables'
</script>

<template>
    <div>
        {{ selected_tables }}
    </div>
</template>