<template>
  <div
    id="wrapper"
  >
    <div class="ui three column grid">
      <div class="three wide column">
        <file-list @select-file="(path)=>{fileSelected(path, 'right')}"></file-list>
      </div>
      <div class="ten wide column">
        <code-diff
          :old-string="rightContent"
          :new-string="leftContent"
          output-format="side-by-side"
        />
      </div>
      <div class="three wide column">
        <file-list @select-file="(path)=>{fileSelected(path, 'left')}"></file-list>
      </div>
    </div>
  </div>
</template>

<script>
  import fileList from './fileList.vue';

  export default {
    name: 'LandingPage',
    components: { fileList },
    data(){
      return {
        leftContent:'',
        rightContent: '',

      };
    },
    methods: {
      fileSelected(filePath, section){
        // read file

        // set content in the corresponding section
        this[section+'Content'] = filePath;
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
    padding: 10px;
    height: 100vh;
  }




</style>
