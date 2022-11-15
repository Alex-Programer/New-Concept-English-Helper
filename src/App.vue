<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import list from './article.json'
import { useSelected } from './useSelected'

const edit = ref(false);
const item = ref(null);
const value = ref("");
const textareaRef = ref(null)
const error = ref({ wrong: false, source: 'the young man said rudel', yours: 'the young man said rudel' })
const { index } = useSelected(edit);

const scroll = e => {
  edit.value && e.preventDefault();
}

const editorHeight = computed(() => edit.value ? '100%' : '0');

const onEdit = selectItem => {
  item.value = selectItem;
  edit.value = true;
}

const formatContent = target => target.replace(/('|\!|")/g, '').replace(/\s+/g, ' ').split('.').map(item => item.trim(''))

const onDone = () => {
  const source = formatContent(item.value.content);
  const target = formatContent(value.value);

  for (let i = 0; i < source.length; i++) {
    if (source[i].trim() !== target[i].trim()) {
      error.value = {
        wrong: true,
        source: source[i],
        yours: target[i]
      };
      textareaRef.value.blur();
      break;
    } else if (i === source.length - 1) {
      alert('🎉 Congratulations!');
    }
  }
}


watch(edit, (val) => {
  if (val) {
    nextTick(() => {
      textareaRef.value.focus();
    })
  } else {
    textareaRef.value.blur();
  }
});

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && error.value.wrong === false) {
      edit.value = false;
    }


    if (error.value.wrong) {
      e.preventDefault();
      error.value.wrong = false;

      if (textareaRef.value) {
        textareaRef.value.value = textareaRef.value.value.trim();
        textareaRef.value.focus();
      }
    }
  })
})

const onEnter = () => {
  if (edit.value) onDone();
}

const getItemIndex = () => list.findIndex(v => v.title === item.value.title);

const onPrev = () => {
  let i = getItemIndex();
  i--;

  if (list[i]) {
    item.value = list[i];
  } else {
    item.value = list[list.length - 1];
  }
}

const onNext = () => {
  let i = getItemIndex();
  i++;

  if (list[i]) {
    item.value = list[i];
  } else {
    item.value = list[0];
  }
}

</script>

<template>
  <ul @touchmove="scroll" @wheel="scroll">
    <li v-for="(item, i) in list" @click="onEdit(item)" :class="{ selected: index === i }">
      Lesson {{ i + 1 }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.title }}</li>
    <div class="editor">
      <div class="action">
        <span @click="edit = false">🔙</span>
        <div v-if="item">{{ item.title }}</div>
        <span class="done" @click="onDone">DONE</span>
      </div>
      <textarea ref="textareaRef" v-model="value" @touchmove.stop @wheel.stop @keydown.prevent.stop.enter="onEnter" />
      <div class="pagation">
        <span @click="onPrev">⬅️</span>
        <span @click="onNext">➡️</span>
      </div>
    </div>
  </ul>
  <div tabindex="0" class="dialog" :class="{ active: error.wrong }" @touchstart="error.wrong = false"
    @keydown.enter="error.wrong = false">
    <table border>
      <tbody>
        <tr class="wrong-row">
          <td>Yours</td>
          <td>{{ error.yours }}</td>
        </tr>
        <tr>
          <td>Source</td>
          <td>{{ error.source }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@font-face {
  font-family: verdanai;
  src: url("/font/Verdana-1.ttf") format('truetype');
}


* {
  margin: 0;
  padding: 0;
  font-family: verdanai;
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
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 40px;
  user-select: none;
  transition: all 0.1s linear;
}

li.selected {
  transform: scale(1.08);
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
  margin-bottom: 0;
  line-height: 30px;
}

.editor .action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.editor .done {
  right: 0;
  font-size: 18px;
  font-weight: bold;
}

.dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.8);
  display: none;
  justify-content: center;
  align-items: center;
}

.dialog.active {
  display: flex;
}

th,
td {
  border: none;
}

.dialog table {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  border-spacing: 0px;
  margin: 10px;
}

td {
  padding: 10px;
}

.wrong-row {
  color: red;
}

.pagation {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.pagation span {
  background-color: transparent;
  margin: 0;
  width: auto;
  height: auto;
  line-height: 1;
}
</style>
