<script setup lang="ts">
import { ref } from 'vue'
import { selected_tables } from './selected-tables'
</script>

<template>
    <div>
        <div class="row">
            <div class="col-6">
                <div class="group" style="height:calc(100vh - 70px);">
                    <div class="item" v-for="selected of selected_tables" :key="selected" > 
                        <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>