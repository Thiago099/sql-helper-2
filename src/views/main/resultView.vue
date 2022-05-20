<script setup lang="ts">
import { table } from 'console';
import { used } from './used-fields'


let join = ''
build()
function build(parent:any=null)
{
    const children = used.value.filter((item:any) => item.parent == parent?.item)
    const parent_alias = parent?.alias
    const parent_has_alias = parent?.alias != parent?.table
    const current_parent = parent?.item?.item 
    const parent_class = current_parent?current_parent?.child?'item-child':'item-parent':'item-table'
    children.forEach((item:any) => {
        const current = item?.item?.item
        const alias = item.alias
        const has_alias = alias != item.table
        if(current)
        join += current.child ? ` LEFT JOIN <span class='item-parent'>${current.REFERENCED_TABLE_NAME}</span>${has_alias?' AS '+alias+' ':''} ON <span class='item-parent'>${has_alias?alias:current.REFERENCED_TABLE_NAME}</span>.${current.REFERENCED_COLUMN_NAME} = <span class="${parent_class}">${parent_has_alias?parent_alias:current.TABLE_NAME}</span>.${current.COLUMN_NAME}<br>` :
                                ` LEFT JOIN <span class='item-child'>${current.TABLE_NAME}</span> ON <span class='item-child'>${current.TABLE_NAME}</span>.${current.COLUMN_NAME} = <span class="${parent_class}">${parent_has_alias?parent_alias:current.REFERENCED_TABLE_NAME}</span>.${current.REFERENCED_COLUMN_NAME}<br>`
        build(item)
    })
}
</script>
<template>

    <div v-html="join" class="group" style="padding:10px;height: 90vh;">
    </div>
</template>
