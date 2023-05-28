
<template>
  <div style="height: inherit">
    <button
      class="fluid ui  primary button"
      @click="openFileDialog"
    >
      <i class="file icon"></i>
      Select File(s)
    </button>
    <div
      class="ui relaxed divided selection list scrolable"
      style="height: calc(100% - 20px); overflow: auto"
    >
      <div
        v-for="file in files"
        :key="file.path"
        class="item"
        @click="selectFile(file)"
      >
        <i class="large file middle aligned icon"></i>
        <div class="content">
          <a class="header">{{ file.name }}</a>
          <div class="description">{{ file.path }}</div>
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
      files:[],
    };
  },
  methods:{
    openFileDialog(){
      electron.ipcRenderer.invoke('dialog:openFile', { properties: ['openFile', 'multiSelections'] }).then((files)=>{
        this.files = files;
      });

    },
    selectFile(file){
      this.$emit('selectFile', file);
    },
  },
});
</script>
<style scoped>
.divided.selection.list.scrolable{
  overflow: auto;
  height:90vh;
}
</style>
