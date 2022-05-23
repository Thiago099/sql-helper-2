<script setup lang="ts">
import { table } from 'console';
import { onMounted, ref } from 'vue';
import { used } from './used-fields'

let all_tables = true
let select = ''
for(const table of used.value)
{
    let all_fields = true
    let table_select = ''
    const current = table.item.item
    const current_class = current?!current.child?'item-child':'item-parent':'item-table'
    for(const field of table.fields)
    {
        if(field.selected)
        {
            table_select += `\`<span class="${current_class}">${table.alias}</span>\`.\`<span class="item-field">${field.name}</span>\`${field.name != field.alias? ' <span class="sql-syntax">AS</span> `<span class="item-field">' + field.alias + '</span>`' : ''},<br>`
            if(field.name != field.alias)
            {
                all_fields = false
                all_tables = false
            }
        }
        else
        {
            all_fields = false
            all_tables = false
        }
    }
    if(all_fields)
    {
        select += `\`<span class="${current_class}">${table.alias}</span>\`.*,<br>`
    }
    else
    {
        select += `${table_select}`
    }
}
if(all_tables)
{
    select = '*'
}
else
{
    select = select.substring(0,select.length-5)+'<br>'
}
let join = ''
build()
function build(parent:any=null)
{
    const children = used.value.filter((item:any) => item.parent == parent?.item)
    const parent_alias = parent?.alias
    const parent_has_alias = parent?.alias != parent?.table
    const current_parent = parent?.item?.item 
    const parent_class = current_parent?!current_parent.child?'item-child':'item-parent':'item-table'
    children.forEach((item:any) => {
        const current = item?.item?.item
        const alias = item.alias
        const has_alias = alias != item.table
        if(current)
        join += current.child ? `<span class="sql-syntax">INNER JOIN </span>\`<span class='item-parent'>${current.REFERENCED_TABLE_NAME}</span>\`${has_alias?' <span class="sql-syntax">AS</span> `<span class="item-parent">'+alias+'</span>` ':''} <span class="sql-syntax">ON</span> \`<span class='item-parent'>${has_alias?alias:current.REFERENCED_TABLE_NAME}</span>\`.\`<span class="item-field">${current.REFERENCED_COLUMN_NAME}</span>\` = \`<span class="${parent_class}">${parent_has_alias?parent_alias:current.TABLE_NAME}</span>\`.\`<span class="item-field">${current.COLUMN_NAME}</span>\`<br>` :
                                `<span class="sql-syntax">INNER JOIN </span>\`<span class='item-child'>${current.TABLE_NAME}</span>\`${has_alias?' <span class="sql-syntax">AS</span> `<span class="item-child">'+alias+'</span>` ':''}  <span class="sql-syntax">ON</span> \`<span class='item-child'>${has_alias?alias:current.TABLE_NAME}</span>\`.\`<span class="item-field">${current.COLUMN_NAME}</span>\` = \`<span class="${parent_class}">${parent_has_alias?parent_alias:current.REFERENCED_TABLE_NAME}</span>\`.\`<span class="item-field">${current.REFERENCED_COLUMN_NAME}</span>\`<br>`
        build(item)
    })
}
const root = used.value.find((item:any) => item.parent == null)
let result = ''
if(root)
{
    const alias = root?.alias
    const has_alias = root?.alias != root?.table
    result = `<span class="sql-syntax">SELECT</span> ${select} <span class="sql-syntax">FROM</span> <span class="item-table">${root.table}</span>${has_alias?' <span class="sql-syntax">AS</span> <span class="item-table">'+alias+'</span> ':''}<br>${join}`
}

const element = ref()
onMounted(() => {
    element.value.setAttribute('contenteditable', true);
    element.value.spellcheck = false;
    element.value.oncut = () => false;
    element.value.onpaste = () => false;
    element.value.onkeydown = (event:any) => {
        if (event.metaKey || event.ctrlKey) {
        return;
        }
        event.preventDefault();
    }
})

</script>
<template>

    <div v-html="result" class="group element" ref="element" >
    </div>
</template>

<style scoped>
.element{
    padding:10px;
    height: 90vh;
    caret-color: transparent;
    outline: none;
}


</style>
