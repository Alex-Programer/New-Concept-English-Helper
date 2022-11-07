<script setup>
import { computed, ref } from 'vue';
import list from './article.json'

const edit = ref(false);
const item = ref(null);
const value = ref(`Last week I went to the theatre. I had a very good seat. The play was very interesting. I did not enjoy it. A young man and a young woman were sitting behind me. They were talking loudly. I got very angry. I could not hear the actors. I turned round. I looked at the man and the woman angrily. They did not pay any attention. In the end, I could not bear it. I turned round again. 'I can't hear a word!' I said angrily. 'It's none of your business,' the young man said rudely. 'This is a private conversation!' `);

const scroll = e => {
  edit.value && e.preventDefault();
}

const editorHeight = computed(() => edit.value ? '100%' : '0');

const onEdit = selectItem => {
  item.value = selectItem;
  edit.value = true;
}

const formatContent = target => target.split('.').map(item => item.trim(''))

const onDone = () => {
  const source = formatContent(item.value.content);
  const target = formatContent(value.value);

  for (let i = 0; i < source.length; i++) {
    if (source[i] !== target[i]) {
      alert(`
      ERROR ❌
      
        source: ${source[i]}
         yours: ${target[i]}
      `);

      break;
    } else if (i === source.length - 1) {
      alert('🎉 Congratulations!');
    }
  }
}
</script>

<template>
  <ul @touchmove="scroll" @wheel="scroll">
    <li v-for="item in list" @click="onEdit(item)">
      {{ item.title }}</li>
    <div class="editor">
      <div class="action">
        <span @click="edit = false">🔙</span>
        <div v-if="item">{{ item.title }}</div>
        <span class="done" @click="onDone">DONE</span>
      </div>
      <textarea v-model="value" @touchmove.stop @wheel.stop />
    </div>
  </ul>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

html,
body,
#app,
ul {
  height: 100%;
}
</style>

<style scoped>
ul {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  overflow: auto;
  padding: 40px 40px 0 40px;
  box-sizing: border-box;
}

li {
  box-sizing: border-box;
  list-style: none;
  border: 1px solid #fff;
  box-shadow: 0 0 10px #ddd;
  padding: 40px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 40px;
  user-select: none;
}

.editor {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: v-bind(editorHeight);
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
}

.editor span {
  display: inline-block;
  cursor: pointer;
  background-color: #ddd;
  border-radius: 100%;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 30px;
  margin: 20px;
}

.editor textarea {
  display: block;
  box-sizing: border-box;
  resize: none;
  width: calc(100% - 40px);
  border: 1px solid #ddd;
  outline: none;
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
  font-size: 18px;
  flex: 1;
  margin-bottom: 20px;
  line-height: 30px;
}

.editor .action {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor .done {
  right: 0;
  font-size: 18px;
  font-weight: bold;
}
</style>
