<template>
  <!-- <div class="my-outbox">
        <div class="my-inbox" ref='box'>
            <div class="my-list" v-for="(item,index) in sendVal" :key='index'>
                {{item.place}}<span class="my-uname">{{item.name}}</span>刚刚购买了产品
            </div>
            <div class="my-list" v-for="(item,index) in sendVal" :key='(index+1)*100'>
                {{item.place}}<span class="my-uname">{{item.name}}</span>刚刚购买了产品
            </div>
        </div>
    </div> -->
  <div class="my-outbox" id="mrq" ref="box">
    <!-- <div v-for="(item, index) in data" :key="index">
            <div class="appliance-img-container">
                <img :src="domain + item.picture" />
            </div>
            <div class="appliance-title">{{ item.name }}</div>
        </div> -->
    <div id="Marquee_x">
      <ul>
        <li>
          <div class="appliance-img-container" v-for="(item, index) in data" :key="index">
            <a href="/" target="_blank">
              <img :src="domain + item.picture" />
              <span>{{ item.name }}</span>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <!-- <div v-for="(item, index) in sendVal" :key="index">
            <div class="appliance-img-container">
                <img :src="domain + item.picture" />
            </div>
            <div class="appliance-title">{{ item.name }}</div>
        </div> -->
  </div>
</template>

<script>
import $ from 'jquery';
$.fn.jcMarquee = function (options) {
  var defaults = {
    marquee: 'x',
    margin_bottom: '0',
    margin_right: '0',
    speed: '10',
  };
  var options = $.extend(defaults, options);
  return this.each(function () {
    console.log(1231);
    var $marquee = $(this),
      $marquee_scroll = $marquee.children('ul');
    $marquee_scroll.append("<li class='clone'>" + '</li>');
    $marquee_scroll.find('li').eq(0).children().clone().appendTo('.clone');
    var $marquee_left = $marquee_scroll.find('li');
    if (options.marquee == 'x') {
      var x = 0;
      $marquee_scroll.css('width', '1000%');
      $marquee_left.find('div').css({
        'margin-right': options.margin_right,
      });
      $marquee_left.css({
        'margin-right': options.margin_right,
      });

      function Marquee_x() {
        $marquee.scrollLeft(++x);
        _margin = parseInt($marquee_left.find('div').css('margin-right'));
        if (x == $marquee_left.width() + _margin) {
          x = 0;
        }
      }
      var MyMar = setInterval(Marquee_x, options.speed);
      $marquee.hover(
        function () {
          clearInterval(MyMar);
        },
        function () {
          MyMar = setInterval(Marquee_x, options.speed);
        },
      );
    }
    if (options.marquee == 'y') {
      var y = 0;
      $marquee_scroll.css('height', '1000%');
      $marquee_left.find('div').css('margin-bottom', options.margin_bottom);
      $marquee_left.css('margin-bottom', options.margin_bottom);

      function Marquee_y() {
        $marquee.scrollTop(++y);
        _margin = parseInt($marquee_left.find('div').css('margin-bottom'));
        if (y == $marquee_left.height() + _margin) {
          y = 0;
        }
      }
      var MyMar = setInterval(Marquee_y, options.speed);
      $marquee.hover(
        function () {
          clearInterval(MyMar);
        },
        function () {
          MyMar = setInterval(Marquee_y, options.speed);
        },
      );
    }
  });
};
$('#Marquee_x').jcMarquee({
  marquee: 'x',
  margin_right: '10px',
  speed: 20,
});

export default {
  name: 'my-marquee-left',
  props: {
    sendVal: Array,
  },
  data() {
    return {
      domain: process.env.VUE_APP_DOMAIN,
      data: [],
    };
  },
  created() {
    this.data = this.sendVal;
  },
  mounted: function () {
    // var that = this
    // var target = this.$refs.box
    // var initLeft = 500
    // var count = 0
    // var data = this.data
    // setInterval(function(){
    //     initLeft ++
    //     count++
    //     if(count >= 1500) {
    //         count = 0
    //         that.data = that.data.concat(data)
    //     }
    //     if(initLeft >= target.offsetWidth * 2){
    //         // initLeft = 0;
    //     }
    //     target.style = 'transform: translateX(-'+ initLeft +'px)'
    // },16)
  },
};
</script>

<style lang="scss" scoped>
.my-outbox {
  display: flex;

  .appliance-img-container {
    padding: 8px;
    border: 1px solid #efefef;
    border-radius: 5px;
    width: 150px;
    margin-right: 10px;

    img {
      width: 100%;
      height: 150px;
    }
  }
}

#mrq {
  width: 925px;
  margin: 20px auto;
  border: 1px solid #000;
  padding: 2px;
}

#Marquee_x {
  overflow: hidden;
  width: 925px;
}

#Marquee_x ul li {
  display: flex;
}

#Marquee_x ul li,
#Marquee_x ul li div {
  line-height: 25px;
  overflow: hidden;
}

/* 横向滚动必须让所有li左浮动 */
#Marquee_x ul li div {
  line-height: 25px;
  height: 131px;
  width: 142px;
  overflow: hidden;
}

#Marquee_x ul li div img {
  border: 1px solid #dadada;
  width: 140px;
  height: 105px;
  display: block;
}

#Marquee_x ul li div span {
  display: block;
}
</style>
