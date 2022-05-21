<script setup lang="ts">
import MultiSearchInput from '@/components/multisearch-input.vue'
import { ref,watch } from 'vue'
import { used_tables, available_foreign_keys, used_chained } from './used-tables'
import { used } from './used-fields'
import { connection } from '@/libraries/mysql'

watch(
    [used_tables, used_chained],
    async () => 
    {
        const old = used.value
        used.value = [
            ...used_tables.value.map((item: any) => {return{
                    database:item.database, 
                    table:item.table.name,
                    parent:null,
                    item:item
                }}),
            ...used_chained.value.reduce((previous:any, current:any)=>[...previous,...current.children],[])
            .map((item: any) => {return{
                    database:item.database,
                    table:item.item.name,
                    parent:item.parent,
                    item:item
                }})
        ]
        

        used.value.forEach(async(item:any)=>{
            let current:any;
            current = old?.find((old_item:any)=>old_item.item == item.item)
            item.collapsed = current?.collapsed ?? false;
            item.alias = current?.alias ?? item.table;
            item.fields = await new Promise(resolve => connection.value.query(`
            SELECT
                COLUMN_NAME
            FROM
                information_schema.COLUMNS
            WHERE
                TABLE_SCHEMA = '${item.database}' AND TABLE_NAME = '${item.table}'`, (err:any, result:any) => {
                resolve(result.map((item:any) => {
                    const old_field = current?.fields?.find((old_item:any)=>old_item.name == item.COLUMN_NAME)
                    return {name:item.COLUMN_NAME, selected:old_field?.selected ?? true, alias:old_field?.alias ?? item.COLUMN_NAME}
                }))
            }))
        })
    },
  { immediate: true } // <- if you want to access it immediately
);

function update_selected(event:any, items:any)
{
    items.forEach((item:any) => {
        item.selected = event.target.checked;
    })
}
const menu = ref<HTMLElement[]>()
let lastMouseDown:any = null;
document.addEventListener(
    "mousedown",
    event => {
        lastMouseDown = event;
    },
    true // A capture handler
);
function prevent(e:Event) {
    e.stopPropagation();
    e.preventDefault();
}
function collapse(table:any)
{
    if(menu.value?.some(item => item.contains(lastMouseDown.target)))
        return
    table.collapsed = !table.collapsed;
}

const searchTable = ref<string>('')
const searchField = ref<string>('')   
const current_used:any = {}

function collapse_all()
{
    used.value.forEach((item:any) => {
        item.collapsed = false;
    });
}
function expand()
{
    used.value.forEach((item:any) => {
        item.collapsed = true;
    });
}
</script>

<template>
    <div>
                        <multi-search-input 
                    @table="searchTable = $event"
                    @field="searchField = $event"
                    :fields="[
                        
                        {
                            name:'table',
                            icon:'fa-table'
                        },
                        {
                            name:'field',
                            icon:'fa-pencil-square-o'
                        }
                    ]"
                />
        <div class="group" style="height:calc(100vh - 130px)">
            <div class="header-group"  style="z-index:100">
                <i class="fa fa-minus-square collapse-icon" @click="expand()"></i>
                <i class="fa fa-plus-square collapse-icon" @click="collapse_all()"></i>
            </div>
            <div>
                <div v-for="table in used?.filter(item=>item.alias.includes(searchTable))" :key="table">
                    <div class="item collapsable" @click="collapse(table)" >
                        <div style="display:inline;padding:8px" @click="$event.stopPropagation();">
                            <input type="checkbox" @click="update_selected($event,table.fields)" :checked="table?.fields?.every(item=>item.selected == true)">
                        </div>
                        <div style="display:inline;margin-right:5px;margin-left:10px">
                            <i class="fa fa-caret-right item-database" v-if="table.collapsed"></i> 
                            <i class="fa fa-caret-down item-database" v-else></i>
                        </div>
                        <span class="item-database">{{ table.database }}</span>.<span :class="{'item-table':table?.item?.item?.child==undefined,'item-child':table?.item?.item?.child == false,'item-parent':table?.item?.item?.child}">{{ table.table }}</span> 
                        <div class="input-group">
                        <input type="text" class="inline-input border-green" :class="{'border-red':used.filter((item:any)=>item.alias == table.alias).length>1}" spellcheck="false" v-model="table.alias" @click="$event.stopPropagation();" ref="menu"> 
                        <button class="btn btn-success append-button" @click="$event.stopPropagation();table.alias = table.table"><div><i class="fa fa-rotate-left"></i></div></button></div> 
                        <span v-show="table?.item?.item?.COLUMN_NAME"><span class="item-database"><span :set="current_used = used.find(item => item.item == table.parent)"></span> {{current_used?.database}}</span>.<span :class="{'item-table':!current_used?.item?.item?.child,'item-child':current_used?.item?.item?.child == false,'item-parent':current_used?.item?.item?.child}">{{current_used?.alias}}</span>.<span class="item-field">{{table?.item?.item?.COLUMN_NAME}}</span></span>
                        
                        
                    </div>
                    <div v-show="!table.collapsed" style="margin-bottom:15px">
                        <div v-for="field in table.fields?.filter(item=>item.alias.includes(searchField))" :key="field" class="item">
                            <input style="margin-left:30px" type="checkbox" v-model="field.selected"> <span class="item-field">{{field.name}}</span> 
                            <div class="input-group">
                                <input type="text" spellcheck="false" class="inline-input border-blue" v-model="field.alias" @click="$event.stopPropagation();"> <button class="btn btn-primary append-button" @click="field.alias = table.alias"><div><i class="fa fa-table"></i></div></button>   <button class="btn btn-success append-button" @click="field.alias = field.name"><div><i class="fa fa-rotate-left"></i></div></button>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.inline-input{
    border:1px solid #ccc;
    border-radius: 3px;
    outline:none;
    font-size:12px;
    text-align: center;
    margin-left: 10px;
    display: inline;
}

.border-green{
    border:1px solid #4caf50;
    background-color: #c8ffca;
}
.border-blue{
    border:1px solid #2196f3;
    background-color: rgb(221, 240, 255);
}


.border-red{
    border:1px solid #f44336;
    background-color: #ffebee;
}
.input-group{
    display: inline;
}
.append-button{
    margin-left: -5px!important;
    margin-top:-2px;
    height: 22px;
    width: 10px;
}
.append-button div{
    margin-top:-8px;
    margin-left:-8px;
}
.collapsable{
    cursor:pointer;
    background-color: #f5f5f5;
    border-bottom:2px solid #ccc;
}


</style>