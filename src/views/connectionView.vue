
<script setup lang="ts">
import searchInput from '@/components/search-input.vue'
import { ref } from 'vue'
const search = ref('')
interface connection_field{
    delete:boolean,
    selected:boolean,
    enabled:boolean,
    connection:connection,
}
interface connection{
  rowid:number,
  name:string,
  ip:string,
  port:string,
  user:string,
  password:string,
}
const connections = ref<connection_field[]>([])
const selected_connection = ref<connection_field>({
      delete:false,
      selected:true,
      enabled:false,
      connection:{
        rowid:0,
        name:'',
        ip:'',
        port:'',
        user:'',
        password:'',
      }
    })

function add(){
  connections.value.forEach(item => {
    item.selected = false
  });
  const new_connection = {
      delete:false,
      selected:true,
      enabled:true,
      connection:{
        rowid:0,
        name:'',
        ip:'',
        port:'',
        user:'',
        password:'',
      }
    }
  selected_connection.value = new_connection
  connections.value.push(new_connection)
}
function remove()
{
  selected_connection.value.delete = true
  selected_connection.value = {
      delete:false,
      selected:false,
      enabled:false,
      connection:{
        rowid:0,
        name:'',
        ip:'',
        port:'',
        user:'',
        password:'',
      }
    }
}

function select(connection:connection_field){
  connections.value.forEach(item => {
    item.selected = false
  });
  connection.selected = true
  selected_connection.value = connection
}
import { sqlite } from '@/libraries/sqlite'
(async ()=>{
  const db = await sqlite
  db.exec('CREATE TABLE IF NOT EXISTS connections(name varchar(64),ip varchar(64),port varchar(64),user varchar(64),password varchar(64))')
  const load_data = await db.all('SELECT rowid, * FROM connections',[])
  load_data.forEach(item => {
    connections.value.push({
      enabled:true,
      delete:false,
      selected:false,
      connection:item,
    })
  });
})()

async function save()
{
  const db = await sqlite
  connections.value.forEach(async (item: any) => {
    if(item.delete)
    {
      if(item.connection.rowid != 0)
      {
        db.exec(`DELETE FROM connections WHERE rowid = ${item.connection.rowid}`)
      }
    }
    else
      {
        if(item.connection.rowid == 0)
        {
          db.exec(
            `INSERT INTO connections(name,ip,port,user,password) 
            VALUES('${item.connection.name}','${item.connection.ip}','${item.connection.port}','${item.connection.user}','${item.connection.password}')`
          )
        }
        else
        {
          db.exec(
            `UPDATE connections SET name = '${item.connection.name}',ip = '${item.connection.ip}',port = '${item.connection.port}',user = '${item.connection.user}',password = '${item.connection.password}' WHERE rowid = ${item.connection.rowid}`
          )
        }
      }
  });
}
</script>
<template>
  <div>
    <div class="row">
      <div class="col-5">
        <search-input @input="search = $event?.target?.value"/>
        <div class="list group" style="overflow:auto">
          <div class="separator"
            v-for="connection in connections.filter(item => !item.delete && item.connection.name.includes(search))" 
              :key="connection" 
          >
            <div 
              class="item" 
              
              :class="{'selected-item':connection.selected}"
              @click="select(connection)"
            > {{connection.connection.name || '&nbsp;'}}</div>
          </div>
          
        </div>
        <div class="btn-group d-flex">
        <button class="btn btn-success w-100" @click="add"><i class="fa fa-plus"></i> Novo</button>
        <button class="btn btn-danger w-100" @click="remove"><i class="fa fa-trash"></i> Apagar</button>
        </div>
      </div>
      <div class="col-7">
        <div class="form group" style="overflow:hidden">
          <div class="row" style="padding:20px" >
            <div class="form-group col-xl-6">
              <label for="name">Name:</label>
              <input type="text" class="form-control" id="name" :disabled="!selected_connection.enabled" v-model="selected_connection.connection.name">
            </div>
            <div class="form-group col-xl-6">
              <label for="ip">IP:</label>
              <input type="text" class="form-control" id="ip" :disabled="!selected_connection.enabled" v-model="selected_connection.connection.ip">
            </div>
            <div class="form-group col-xl-6">
              <label for="port">Port:</label>
              <input type="text" class="form-control" id="port" :disabled="!selected_connection.enabled" v-model="selected_connection.connection.port">
            </div>
            <div class="form-group col-xl-6">
              <label for="port">User:</label>
              <input type="text" class="form-control" id="user" :disabled="!selected_connection.enabled" v-model="selected_connection.connection.user">
            </div>
            <div class="form-group col-xl-6">
              <label for="password">Password:</label>
              <input type="password" class="form-control" id="user" :disabled="!selected_connection.enabled" v-model="selected_connection.connection.password">
            </div>
          </div>
        </div>
        <div class="d-flex btn-group">
          <button class="btn btn-primary" @click="save()"><i class="fa fa-floppy-o" ></i> Salvar</button>
          <button class="btn btn-warning" @click="if(selected_connection.enabled){$emit('open',selected_connection.connection);}"><i class="fa fa-folder"></i> Abrir</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

.list{
  height: calc(100vh - 120px);
}
.form{
  margin-top:10px;
  height: calc(100vh - 73px);
}


.form-group{
  margin-bottom: 10px;
}
.btn-group{
  margin-top: 10px;
}

.item{
  padding: 10px;
  border:2px solid white;
  cursor: pointer;
}

.item:hover{
  background-color: #ddd;
  border:2px solid #ddd;
}
.selected-item{
  /* dashed border */
  border: 2px dashed rgb(0, 204, 255);
  background-color: rgb(211, 244, 250);
}
.selected-item:hover{
  /* dashed border */
  border: 2px dashed rgb(0, 204, 255);
  background-color: rgb(211, 244, 250);
}

.separator{
  border-bottom: 1px solid #ddd;
}
</style>