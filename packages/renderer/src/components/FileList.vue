
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
      class="ui fluid icon input"
      style="margin: 5px 0 5px 0"
    >
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search..."
      >
      <i class="search icon"></i>
    </div>
    <div
      class="ui relaxed divided selection list scrolable"
      style="height: calc(100% - 65px); overflow: auto"
    >
      <div
        v-for="file in filteredFiles"
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
      searchTerm: null,
    };
  },
  computed:{
    filteredFiles() {
      if(!this.searchTerm)
        return this.files;
      return this.files.filter(file => {
        return file.name.toLowerCase().includes(this.searchTerm);
      });
    },
  },
  methods:{
    openFileDialog(){
      electron.ipcRenderer.invoke('dialog:openFile', { properties: ['openFile', 'multiSelections'] }).then((files)=>{
        this.searchTerm = null;
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
