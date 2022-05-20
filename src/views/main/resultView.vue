<script setup lang="ts">
import { used } from './used-fields'


let join = ''
build()
function build(parent=null)
{
    const children = used.value.filter((item:any) => item.parent == parent)
    children.forEach((item:any) => {
        const current = item?.item?.item
        if(current)
        join += current.child ? ` LEFT JOIN ${current.REFERENCED_TABLE_NAME} ON ${current.TABLE_NAME}.${current.COLUMN_NAME} = ${current.REFERENCED_TABLE_NAME}.${current.REFERENCED_COLUMN_NAME}<br>` : ` LEFT JOIN ${current.TABLE_NAME} ON ${current.TABLE_NAME}.${current.COLUMN_NAME} = ${current.REFERENCED_TABLE_NAME}.${current.REFERENCED_COLUMN_NAME}<br>`
        build(item.item)
    })
}
</script>
<template>

    <div v-html="join" class="group" style="padding:10px;height: 90vh;">
    </div>
</template>
