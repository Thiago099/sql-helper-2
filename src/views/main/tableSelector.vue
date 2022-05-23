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
        const parent = { 
            name:selected.table.name,
            object:selected,
            collapsed:false,
            children:result.map((item:any) =>{ return {
                    item,
                    used:false,
                    parent_name: selected.table.name,
                    parent : selected,
                    database: selected.database
                } }).sort((a:any,b:any) => a.item.name.localeCompare(b.item.name))}
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
            collapsed:false,
            children: [chained]
        })
    }
    const name = chained.item.child ? chained.item.REFERENCED_TABLE_NAME : chained.item.TABLE_NAME
    find_foreign_keys(name, chained.database).then((result:any) => {
        const parent = { 
            name,
            object:chained,
            collapsed:false,
            children:result.map((item:any) =>{ return {
                    item,
                    used:false,
                    parent_name: name,
                    parent : chained,
                    database: chained.database
                }}).filter((item:any) => is_valid(item)).sort((a:any,b:any) => a.item.name.localeCompare(b.item.name))}
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

const collapsedFrom = ref(false)
const collapsedTo = ref(false)

function expand_from()
{
    collapsedFrom.value = false
    available_foreign_keys.value.forEach((item:any) => {
        item.collapsed = false
    })
}
function collapse_from()
{
    collapsedFrom.value = true
    available_foreign_keys.value.forEach((item:any) => {
        item.collapsed = true
    })
}
function expand_to()
{
    collapsedTo.value = false
    used_chained.value.forEach((item:any) => {
        item.collapsed = false
    })
}

function collapse_to()
{
    collapsedTo.value = true
    used_chained.value.forEach((item:any) => {
        item.collapsed = true
    })
}

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
                    <div class="header-group"  style="z-index:100">
                        <i class="fa fa-minus-square collapse-icon" @click="collapse_from()"></i>
                        <i class="fa fa-plus-square collapse-icon" @click="expand_from()"></i>
                    </div>
                    <div v-show="'selected'.includes(formSearchParent)">
                        <div class="item-group text-center" draggable="true" @click="collapsedFrom = !collapsedFrom" v-if="selected_tables.filter(item=>!item.used && item.table.name.includes(formSearchChild)).length > 0">
                        <i class="fa fa-caret-right" v-if="collapsedFrom"></i> 
                        <i class="fa fa-caret-down" v-else></i>
                        selected
                        </div>
                        <div v-show="!collapsedFrom">
                            <div style="margin-bottom:15px" class="item" draggable="true" v-for="selected of selected_tables.filter(item=>!item.used && item.table.name.includes(formSearchChild))" :key="selected" @click="use(selected)" > 
                                <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-for="item in available_foreign_keys" :key="item" v-show="!item.children.every(child=>child.used == true || !child.item.name.includes(formSearchChild))&&item.name.includes(formSearchParent)" >
                        <div class="item-group text-center" draggable="true" @click="item.collapsed = !item.collapsed">
                            <i class="fa fa-caret-right" v-if="item.collapsed"></i> 
                            <i class="fa fa-caret-down" v-else></i>
                            {{item.name}}
                            </div>
                            <div v-show="!item.collapsed" style="margin-bottom:15px">
                                <div class="item" draggable="true" v-for="selected of item.children.filter(item=>!item.used && item.item.name.includes(formSearchChild))" :key="selected" @click="use_chained(selected)" > 
                                    <span class="item-database">{{ selected.database }}</span>.<span :class="{'item-parent':selected.item.child,'item-child':!selected.item.child}">{{ selected.item.name }}</span>.<span class="item-field">{{ selected.item.COLUMN_NAME }}</span>
                                </div>
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
                    <div class="header-group"  style="z-index:100">
                        <i class="fa fa-minus-square collapse-icon" @click="collapse_to()"></i>
                        <i class="fa fa-plus-square collapse-icon" @click="expand_to()"></i>
                    </div>
                    <div v-show="'selected'.includes(toSearchParent)">
                        <div class="item-group text-center" draggable="true" @click="collapsedTo = !collapsedTo"  v-if="used_tables.filter(item=>item.table.name.includes(toSearchChild)).length > 0">
                        <i class="fa fa-caret-right" v-if="collapsedTo"></i> 
                        <i class="fa fa-caret-down" v-else></i>
                        Selected
                        </div>
                        <div v-show="!collapsedTo">
                            <div style="margin-bottom:15px" class="item" draggable="true" v-for="(selected, index) of used_tables.filter(item=>item.table.name.includes(toSearchChild))" :key="selected" @click="unuse(selected,index)" > 
                                <span class="item-database">{{ selected.database }}</span>.<span class="item-table">{{ selected.table.name }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-for="item in used_chained.filter(item=>item.name.includes(toSearchParent))" :key="item" v-show="item.children.filter(item=>item.item.name.includes(toSearchChild)).length > 0">
                        <div class="item-group text-center" draggable="true" @click="item.collapsed = !item.collapsed">
                            <i class="fa fa-caret-right" v-if="item.collapsed"></i> 
                            <i class="fa fa-caret-down" v-else></i>
                            {{item.name}}
                            </div>
                            <div v-show="!item.collapsed" style="margin-bottom:15px">
                                <div class="item" :class="{'error-item':!selected.parent.used}" draggable="true" v-for="(selected, index) of item.children.filter(item=>item.item.name.includes(toSearchChild))" :key="selected" @click="unuse_chined(item.children,selected,index)" > 
                                    <span class="item-database">{{ selected.database }}</span>.<span :class="{'item-parent':selected.item.child,'item-child':!selected.item.child}">{{ selected.item.name }}</span>.<span class="item-field">{{ selected.item.COLUMN_NAME }}</span>
                                </div>
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
    cursor: pointer;
    padding: 5px;
    border-bottom: 2px solid rgb(200, 200, 200);
    background-color: rgb(240, 240, 240);
}
</style>