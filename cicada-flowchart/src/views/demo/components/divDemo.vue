<template>
    <div>

      <div class="content">
      <div class="root pointer">
        dy
      </div>
      <div class="right">
        <div class="child">
        </div>
      </div>
    </div>
    </div>
    

</template>

<script>
  export default {
    
  }
</script>

<style  scoped>
.pointer {
  cursor: pointer;

}
.content {
  border-radius: 6px;
  max-width: 1100px;
  background-color: rgb(231, 231, 231);
  height: 300px;
  padding: 20px;
  margin: 100px auto;
  display: flex;
  align-items: center;
}
.root {
  width: 20px;
  height: 300px;
  background-color: rgb(162, 63, 63);
  text-align: center;
  line-height: 300px;
}
.right {
  border-radius: 6px;
  border-left:1px solid #ececec ;
  margin-left:10px;
  background-color: #fff;
  width: 100%;
  height: 100%;

}
</style>