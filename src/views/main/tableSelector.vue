<script setup lang="ts">
import { ref } from 'vue'
import MultiSearchInput from '@/components/multisearch-input.vue'

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

    const parent = used_chained.value.find((item: any) => item.object == chained.parent)
    if(parent)
    {
        parent.children.push(chained)
    }
    else
    {
        used_chained.value.push({
            name: chained.parent_name,
            object: chained.parent,
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
                }}).filter((item:any) => is_valid(item))}
        available_foreign_keys.value.push(parent)
    })
}
function unuse_chined(children:any,chained:any,index:number)
{
    chained.used = false
    children.splice(index, 1)
    available_foreign_keys.value = available_foreign_keys.value.filter((item:any)=> item.object != chained)
}

function unuse(selected:any,index:number)
{
    selected.used = false
    used_tables.value.splice(index, 1)
    available_foreign_keys.value = available_foreign_keys.value.filter((item:any)=> item.object != selected)
}
function trace(object:any) :any
{
    if(object.item)
    return [...trace(object.parent), object.item.name] 
    return [object.table.name]
}

function is_valid(object:any) :any
{
    const list = trace(object)
    // find if there is duplicated
    return !(list.filter((item:any,index:number)=> list.indexOf(item) != index).length > 0)
}
const formSearchParent = ref('')
const formSearchChild = ref('')

const toSearchParent = ref('')
const toSearchChild = ref('')

</script>

<template>

    <div>
        <div class="row">
            <div class="col-6">
                <multi-search-input 
                    @table="formSearchParent = $event"
                    @field="formSearchChild = $event"
                    :fields="[
                        
                        {
                            name:'table',
                            icon:'fa-arrow-up'
                        },
                        {
                            name:'field',
                            icon:'fa-arrow-down'
                        }
                    ]"
                />
                <div class="group" style="height:calc(100vh - 130px);">
                    <div v-show="'selected'.includes(formSearchParent)">
                        <div class="item-group text-center" v-if="selected_tables.filter(item=>!item.used && item.table.name.includes(formSearchChild)).length > 0">selected</div>
                        <div class="item" draggable="true" v-for="selected of selected_tables.filter(item=>!item.used && item.table.name.includes(formSearchChild))" :key="selected" @click="use(selected)" > 
                            <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                        </div>
                    </div>
                    <div v-for="item in available_foreign_keys" :key="item" v-show="!item.children.every(child=>child.used == true || !child.item.name.includes(formSearchChild))&&item.name.includes(formSearchParent)" >
                        <div class="item-group text-center">{{item.name}}</div>
                        <div class="item" draggable="true" v-for="selected of item.children.filter(item=>!item.used && item.item.name.includes(formSearchChild))" :key="selected" @click="use_chained(selected)" > 
                            <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.item.name }}</span> <span :class="{'item-parent':selected.item.child,'item-child':!selected.item.child}">{{ selected.item.COLUMN_NAME }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <multi-search-input 
                    @table="toSearchParent = $event"
                    @field="toSearchChild = $event"
                    :fields="[
                        
                        {
                            name:'table',
                            icon:'fa-arrow-up'
                        },
                        {
                            name:'field',
                            icon:'fa-arrow-down'
                        }
                    ]"
                />
                <div class="group" style="height:calc(100vh - 130px);">
                    <div v-show="'selected'.includes(toSearchParent)">
                        <div class="item-group text-center" v-if="used_tables.filter(item=>item.table.name.includes(toSearchChild)).length > 0">Selected</div>
                        <div class="item" draggable="true" v-for="(selected, index) of used_tables.filter(item=>item.table.name.includes(toSearchChild))" :key="selected" @click="unuse(selected,index)" > 
                            <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                        </div>
                    </div>
                    <div v-for="item in used_chained.filter(item=>item.name.includes(toSearchParent))" :key="item" v-show="item.children.filter(item=>item.item.name.includes(toSearchChild)).length > 0">
                        <div class="item-group text-center">{{item.name}}</div>
                        <div class="item" :class="{'error-item':!selected.parent.used}" draggable="true" v-for="(selected, index) of item.children.filter(item=>item.item.name.includes(toSearchChild))" :key="selected" @click="unuse_chined(item.children,selected,index)" > 
                            <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.item.name }}</span> <span :class="{'item-parent':selected.item.child,'item-child':!selected.item.child}">{{ selected.item.COLUMN_NAME }}</span>
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
.item-group{
    padding: 5px;
    border-bottom: 2px solid rgb(200, 200, 200);
    background-color: rgb(240, 240, 240);
}
</style>