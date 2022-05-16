
<script setup lang="ts">
import searchInput from '@/components/search-input.vue'
import { ref } from 'vue'
const search = ref('aaa')
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-4">
        <search-input @input="search = $event.target.value"/>
        <div class="list group">
        </div>
        <div class="btn-group d-flex">
        <button class="btn btn-success w-100"><i class="fa fa-plus"></i> Novo</button>
        <button class="btn btn-danger w-100"><i class="fa fa-trash"></i> Apagar</button>
        </div>
      </div>
      <div class="col-8">
        <div class="form group">
          <div class="row" >
            <div class="form-group col-xl-6">
              <label for="ip">IP:</label>
              <input type="text" class="form-control" id="ip" v-model="ip">
            </div>
            <div class="form-group col-xl-6">
              <label for="port">Port:</label>
              <input type="text" class="form-control" id="port" v-model="port">
            </div>
            <div class="form-group col-xl-6">
              <label for="port">User:</label>
              <input type="text" class="form-control" id="user" v-model="user">
            </div>
            <div class="form-group col-xl-6">
              <label for="password">Password:</label>
              <input type="password" class="form-control" id="user" v-model="password">
            </div>
          </div>
        </div>
        <div class="d-flex flex-row-reverse btn-group">
          <button class="btn btn-primary" ><i class="fa fa-floppy-o"></i> Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.group{
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;

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
</style>