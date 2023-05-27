
<template>
  <div>
    <button
      class="fluid ui  primary button"
      @click="openFileDialog"
    >
      <i class="file icon"></i>
      Select File(s)
    </button>
    <div class="ui relaxed divided selection list">
      <div
        v-for="filePath in filePaths"
        :key="filePath"
        class="item"
        @click="selectFile(filePath)"
      >
        <i class="large github middle aligned icon"></i>
        <div class="content">
          <a class="header">File1</a>
          <div class="description">{{ filePath }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'FileList',
  emits: ['selectFile'],
  data(){
    return {
      filePaths:[],

    };
  },
  methods:{
    openFileDialog(){
      electron.ipcRenderer.invoke('dialog:openFile', { properties: ['openFile', 'multiSelections'] }).then((filePaths)=>{
        this.filePaths = filePaths;
      });

    },
    selectFile(filePath){
      this.$emit('selectFile', filePath);
    },
  },
});
</script>
<style scoped>

</style>
