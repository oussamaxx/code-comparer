<template>
  <div
    id="wrapper"
  >
    <div
      class="ui three column grid"
      style="height: 100%"
    >
      <div
        class="three wide column"
        style="height: inherit"
      >
        <file-list @select-file="(file)=>{fileSelected(file, 'right')}"></file-list>
      </div>
      <div
        class="ten wide column"
        style="height: inherit"
      >
        <div class="ui mini menu">
          <a
            class="item"
            :class="{'active': selectedMode === 'side-by-side'}"
            @click="changeMode('side-by-side')"
          >
            Side By Side
          </a>
          <a
            class="item"
            :class="{'active': selectedMode === 'line-by-line'}"
            @click="changeMode('line-by-line')"
          >
            Line By Line
          </a>
          <div class="right menu">
            <div class="ui dropdown item">
              {{ selectedLanguage }} <i class="dropdown icon"></i>
              <div class="menu">
                <a
                  class="item"
                  data-value="plaintext"
                >Plain Text</a>
                <a
                  class="item"
                  data-value="JavaScript"
                >JavaScript</a>
              </div>
            </div>
            <div class="item">
              <div
                class="ui primary button"
                @click="reset"
              >
                Reset
              </div>
            </div>
          </div>
        </div>
        <code-diff
          style="max-height: 97%;"
          :old-string="rightSelectedFile.content"
          :new-string="leftSelectedFile.content"
          :output-format="selectedMode"
          :language="selectedLanguage"
          :filename="rightSelectedFile.name"
        />
      </div>
      <div class="three wide column">
        <file-list
          style="height: inherit"
          @select-file="(file)=>{fileSelected(file, 'left')}"
        ></file-list>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import fileList from './fileList.vue';

  export default {
    name: 'LandingPage',
    components: { fileList },
    data(){
      return {
        leftSelectedFile: {content:'', name:''},
        rightSelectedFile: {content: '', name:''},
        selectedLanguage: 'js',
        selectedMode: 'side-by-side',
      };
    },
    mounted(){
      $('.ui.dropdown')
        .dropdown({
          clearable: true,
          onChange: (value, text) => {
            console.log(value, text);
            // custom action
            this.selectedLanguage = value;
          },
        })
      ;
    },
    methods: {
      changeMode(mode){
        this.selectedMode = mode;
      },
      reset(){
        this.rightSelectedFile = {content:'', name:''};
        this.leftSelectedFile = {content:'', name:''};
      },
      fileSelected(file, section){
        // read file
        const readFilePromise = electron.ipcRenderer.invoke('dialog:readFile', file.path);
        readFilePromise.then((fileContent)=>{
          // set content in the corresponding section
          this[section+'SelectedFile'] = {content:fileContent, ...file};
        });
      },
    },
  };
</script>

<style>
  /*@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');*/

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    padding: 10px 10px 0 10px;
    height: 100vh;
  }




</style>
