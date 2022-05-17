<script setup lang="ts">
import { ref, defineExpose } from 'vue'
const messageContainer = ref()
function addMessage(color:string, message:string,){
  const element = document.createElement('div')
  const container = messageContainer.value
  element.innerHTML = message
  element.classList.add('popup-message')
  element.classList.add(color)
  const end = () => {
      element.classList.add('popup-fade-out')
  }
  element.addEventListener('click', end)
  container.appendChild(element)
  element.ontransitionend = () => {
    element.remove()
  };
  setTimeout(end, 1000)
}
defineExpose({
  addMessage,
});
</script>
<template>
    <div class="popup-message-container" ref="messageContainer">
    </div>
</template>
<style >
.danger{
    --color: rgb(255,50,50);
    --color-background: rgb(200,50,50);
}	
.success{
    --color: rgb(50,170,50);
    --color-background: rgb(50,120,50);
}
.info{
    --color: rgb(50, 170, 190);
    --color-background: rgb(50, 100, 150);
}
.warning{
    --color: rgb(255, 170, 50);
    --color-background: rgb(255, 170, 50);
}
.popup-message-container{
  position: fixed;
  top: 0px;
  z-index: 1000;
  --width: 500px;
  width: 500px;
  left: calc(50% - var(--width)/2);
}
.popup-message{
  background-color: var(--color-background);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 1.2em;
  text-align: center;
  position: relative;
  top: calc(50% - 20px);
  margin-top: 10px;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}
.popup-fade-out{
  opacity: 0;
  transform: translate(0, -100px);
}
</style>