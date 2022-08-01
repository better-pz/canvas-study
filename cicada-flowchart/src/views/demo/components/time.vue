<template>
  <!--content begin-->
  <div class="ub ub-f1 ub-ver">
    <div class="ub ub-f1">
     
      <div>{{ rangeTime }}年</div>
    </div>
    <div class="ub ub-f1 ub-ver range">
      <div class="ub ub-f1 ub-ac ub-pc">
        <div
          class="ub ub-f1 range-bar"
          :style="{ 'background-size': rangeSpeed + ' 100%' }"
        ></div>
        <div class="range-thumb" :style="{ left: rangeSpeed }"></div>
      </div>
      <input
        class="ub-fh uabs-hide"
        :style="{ 'background-size': rangeSpeed + ' 100%' }"
        @input="changeSpeed"
        v-model="rangeTime"
        type="range"
        :min="rangeMin"
        :max="rangeMax"
        step="0.5"
      />
    </div>
    <div class="ub ub-f1">
      <div
        v-for="(val, idx) in rangeMax - rangeMin"
        :key="val"
        class="uabs-tr sc-text"
        :style="{ left: (idx / rangeMax) * 100 + '%' }"
      >
        {{ idx }}
      </div>
      <div class="uabs-tr sc-text">{{ rangeMax }}</div>
    </div>
  </div>
  <!--content end-->
</template>
<script>
export default {
  name: "range",
  data() {
    return {
      rangeMax: 8,
      rangeMin: 0,
      rangeTime: 4,
      rangeSpeed: "50%",
    };
  },
  mounted() {
    this.changeSpeed();
  },
  methods: {
    changeSpeed: function() {
      var value = this.rangeTime;
      var rangeMax = this.rangeMax;
      var precent = (value / rangeMax) * 100;
      this.rangeSpeed = precent + "%";
    },
  },
};
</script>
<style>
.ub {
  display: -webkit-box !important;
  display: box !important;
  position: relative;
}

.ub-ac {
  -webkit-box-align: center;
  box-align: center;
}

.ub-pc {
  -webkit-box-pack: center;
  box-pack: center;
}

.ub-ver {
  -webkit-box-orient: vertical;
  box-orient: vertical;
}

.ub-f1 {
  position: relative;
  -webkit-box-flex: 1;
  box-flex: 1;
}

.uabs-tr {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}

.uabs-hide {
  position: absolute !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  z-index: 100;
}

.range {
  height: 20px;
  padding: 5px 0;
}

.range-bar {
  border: 1px solid #108ee9;
  border-radius: 7px;
  height: 7px;
  background: -webkit-linear-gradient(#108ee9, #108ee9) no-repeat, #fff;
  background-size: 30% 100%;
}

.range-thumb {
  position: absolute;
  top: 0;
  bottom: 0;
  margin-bottom: 10px;
  margin-left: -10px;
  height: 20px;
  width: 20px;
  background: #fff;
  border-radius: 50%;
  border: solid 1px #ff9000;
}
</style>
