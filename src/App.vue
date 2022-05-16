
<script setup lang="ts">
import searchInput from '@/components/search-input.vue'
import { ref } from 'vue'
const search = ref('')
interface connection_field{
    delete:boolean,
    selected:boolean,
    connection:connection,
}
interface connection{
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
      connection:{
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
      connection:{
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

function select(connection:connection_field){
  connections.value.forEach(item => {
    item.selected = false
  });
  connection.selected = true
  selected_connection.value = connection
}

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const db = open({
    filename: './connections.db',
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    driver: sqlite3.Database
})
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-5">
        <search-input @input="search = $event.target.value"/>
        <div class="list group">
          <div class="separator"
            v-for="connection in connections.filter(item => !item.delete)" 
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
        <button class="btn btn-danger w-100" @click="selected_connection.delete = true"><i class="fa fa-trash"></i> Apagar</button>
        </div>
      </div>
      <div class="col-7">
        <div class="form group">
          <div class="row" style="padding:20px" >
            <div class="form-group col-xl-6">
              <label for="name">Name:</label>
              <input type="text" class="form-control" id="name" v-model="selected_connection.connection.name">
            </div>
            <div class="form-group col-xl-6">
              <label for="ip">IP:</label>
              <input type="text" class="form-control" id="ip" v-model="selected_connection.connection.ip">
            </div>
            <div class="form-group col-xl-6">
              <label for="port">Port:</label>
              <input type="text" class="form-control" id="port" v-model="selected_connection.connection.port">
            </div>
            <div class="form-group col-xl-6">
              <label for="port">User:</label>
              <input type="text" class="form-control" id="user" v-model="selected_connection.connection.user">
            </div>
            <div class="form-group col-xl-6">
              <label for="password">Password:</label>
              <input type="password" class="form-control" id="user" v-model="selected_connection.connection.password">
            </div>
          </div>
        </div>
        <div class="d-flex btn-group">
          <button class="btn btn-primary" ><i class="fa fa-floppy-o"></i> Salvar</button>
          <button class="btn btn-warning" ><i class="fa fa-folder"></i> Abrir</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.group{
  border: 1px solid #ddd;
  border-radius: 3px;

}
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