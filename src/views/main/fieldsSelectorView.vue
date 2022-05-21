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
            <div v-for="table in used?.filter(item=>item.alias.includes(searchTable))" :key="table">
                <div class="item" @click="collapse(table)" >
                    <div style="display:inline;padding:8px" @click="$event.stopPropagation();">
                        <input type="checkbox" @click="update_selected($event,table.fields)" :checked="table?.fields?.every(item=>item.selected == true)">
                    </div>
                    <div style="display:inline;margin-right:5px;margin-left:10px">
                        <i class="fa fa-caret-right item-database" v-if="table.collapsed"></i> 
                        <i class="fa fa-caret-down item-database" v-else></i>
                    </div>
                    <span class="item-database">{{ table.database }}</span>.<span class="item-table">{{ table.table }}</span> 
                    <input type="text" class="inline-input" spellcheck="false" v-model="table.alias" @click="$event.stopPropagation();" ref="menu"> <span class="item-database">{{used.find(item=>item.item == table.parent)?.database}}</span>.{{used.find(item=>item.item == table.parent)?.alias}}.{{table?.item?.item?.COLUMN_NAME}}
                </div>
                <div v-show="!table.collapsed">
                    <div v-for="field in table.fields?.filter(item=>item.alias.includes(searchField))" :key="field" class="item">
                        <input style="margin-left:30px" type="checkbox" v-model="field.selected"> <span class="item-field">{{field.name}}</span> 
                        <div class="input-group">
                            <input type="text" spellcheck="false" class="inline-input" v-model="field.alias" @click="$event.stopPropagation();"> <button class="btn btn-primary append-button" @click="field.alias = table.alias"><div><i class="fa fa-table"></i></div></button>   <button class="btn btn-success append-button" @click="field.alias = field.name"><div><i class="fa fa-rotate-left"></i></div></button>  
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
.input-group{
    display: inline;
}
.append-button{
    height: 22px;
    width: 10px;
}
.append-button div{
    margin-top:-8px;
    margin-left:-8px;
}
</style>