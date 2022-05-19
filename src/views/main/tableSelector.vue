<script setup lang="ts">

import { selected_tables } from './selected-tables'
import { find_foreign_keys } from './foreign-key-finder'

import { used_tables, available_foreign_keys, used_chained } from './used-tables'

function use(selected:any)
{
    selected.used = true
    used_tables.value.push(selected)
    find_foreign_keys(selected.table.name, selected.database).then((result:any) => {
        const parent = { name:selected.table.name, object:selected, children:result.map((item:any) =>{ return {
                    item,
                    used:false,
                    parent_name: selected.table.name,
                    parent : selected,
                    database: selected.database
                } })}
        available_foreign_keys.value.push(parent)
    })
}

function use_chained(chained:any)
{
    chained.used = true

    const parent = used_chained.value.find((item: any) => item.name == chained.parent_name)
    if(parent)
    {
        parent.children.push(chained)
    }
    else
    {
        used_chained.value.push({
            name: chained.parent_name,
            children: [chained]
        })
    }
    const name = chained.item.child ? chained.item.REFERENCED_TABLE_NAME : chained.item.TABLE_NAME
    find_foreign_keys(name, chained.database).then((result:any) => {
        const parent = { name,object:chained, children:result.map((item:any) =>{ return {
                    item,
                    used:false,
                    parent_name: name,
                    parent : chained,
                    database: chained.database
                }})}
            available_foreign_keys.value.push(parent)
    })
}
function unuse_chined(chained:any,index:number)
{
    chained.used = false
    used_chained.value.splice(index, 1)
    available_foreign_keys.value = available_foreign_keys.value.filter((item:any)=> item.object != chained)
}

function unuse(selected:any,index:number)
{
    selected.used = false
    used_tables.value.splice(index, 1)
    available_foreign_keys.value = available_foreign_keys.value.filter((item:any)=> item.object != selected)
}

</script>

<template>
    <div>
        <div class="row">
            <div class="col-6">
                <div class="group" style="height:calc(100vh - 70px);">
                    <div class="item" draggable="true" v-for="selected of selected_tables.filter(item=>!item.used)" :key="selected" @click="use(selected)" > 
                        <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                    </div>
                    <div v-for="item in available_foreign_keys" :key="item">
                        {{item.name}}
                        <div class="item" draggable="true" v-for="selected of item.children.filter(item=>!item.used)" :key="selected" @click="use_chained(selected)" > 
                            <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.item.child ? selected.item.REFERENCED_TABLE_NAME : selected.item.TABLE_NAME }}</span> <span :class="{'item-parent':selected.item.child,'item-child':!selected.item.child}">{{ selected.item.COLUMN_NAME }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="group" style="height:calc(100vh - 70px);">
                    <div class="item" draggable="true" v-for="(selected, index) of used_tables" :key="selected" @click="unuse(selected,index)" > 
                        <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                    </div>
                    <div v-for="item in used_chained" :key="item">
                        {{item.name}}
                        <div class="item" :class="{'error-item':!selected.parent.used}" draggable="true" v-for="(selected, index) of item.children" :key="selected" @click="unuse_chined(selected,index)" > 
                            <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.item.child ? selected.item.REFERENCED_TABLE_NAME : selected.item.TABLE_NAME }}</span> <span :class="{'item-parent':selected.item.child,'item-child':!selected.item.child}">{{ selected.item.COLUMN_NAME }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.error-item{
    border: 2px dashed rgb(255, 0, 0);
    background-color: rgb(250, 211, 211);
}
.error-item:hover{
    border: 2px dashed rgb(255, 0, 0);
    background-color: rgb(250, 211, 211);
}
</style>