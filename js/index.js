var Page = {
  init: function (len) {
    //获取随机left
    this.getRandomLeft(len);
    //获取随机right
    this.getRandomTop(len);
    //获取随机颜色
    this.getRandomColor(len);
    //植入随机left，随机right，随机颜色
    this.inserRandom(len);
    //ctrl+mouse事件
    this.ctrlMouseEvent();
  },
  getRandomLeft: function (len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      var random = Math.random();
      var result = random * 500 + 100 > 500 ? random * 500 - 100 + 'px' : random * 500 + 'px';
      arr.push(result);
    }
    this.arrLeft = arr;
  },
  getRandomTop: function (len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      var random = Math.random();
      var result = random * 500 + 20 > 500 ? random * 500 - 20 + 'px' : random * 500 + 'px';
      arr.push(result);
    }
    this.arrTop = arr;
  },
  getRandomColor: function (len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      var color = '#';
      for (var k = 0; k < 6; k++) {
        color += '0123456789abcdef'[Math.floor(Math.random() * 16)];
      }
      arr.push(color);
    }
    this.arrColor = arr;
  },
  inserRandom: function (len) {
    var _this = this;
    var ele = '.main .item';
    for (var i = 0; i < len; i++) {
      var $item = $(ele).eq(i);
      $item.css({
        left: _this.arrLeft[i],
        top: _this.arrTop[i],
        backgroundColor: _this.arrColor[i],
        index: (i + 1)
      })
    }
  },
  ctrlMouseEvent: function () {
    var _this = this;
    var ele = '.main';
    var keydownFlag = false;
    _this.mousedownFlag = false;
    $(document).on('keydown',function(event){
      event.stopPropagation();
      if(keydownFlag){
        return;
      }
      keydownFlag = true;
      var keyCode = event.keyCode; //17 ctrl
      if(keyCode === 17){
        //这里绑定鼠标事件
        $(document).on('mousedown',ele,_this.mousedownEvent)
        .on('mousemove',ele,_this.mousemoveEvent)
        .on('mouseup',ele,_this.mouseupEvent);
      }
    }).on('keyup',function(event){
      event.stopPropagation();
      keydownFlag = false;
      //这里解绑鼠标事件
      $(document).off('mousedown',ele,_this.mousedownEvent)
      .off('mousemove',ele,_this.mousemoveEvent)
      .off('mouseup',ele,_this.mouseupEvent);
      _this.clearState();
    });
  },
  mousedownEvent: function(event){
    event.stopPropagation();
    event.preventDefault();
    var  _this = Page;
    var eleMain = '.main';
    var eleWrap = '.main .wrap';
    _this.mousedownFlag = true;
    if($(eleWrap).length === 0){
      $(eleMain).append(Template.wrapDom());
    }
    _this.startPostion = _this.getMousePosition(event.clientX,event.clientY);
    $(eleWrap).css({
      left: _this.startPostion.x,
      top: _this.startPostion.y
    });
  },
  mousemoveEvent: function(event){
    event.stopPropagation();
    event.preventDefault();
    var _this= Page;
    if(_this.mousedownFlag){
      _this.movePostion = _this.getMousePosition(event.clientX,event.clientY);
      //框选渲染和计算
      _this.initWrapBox();
      //计算是否在框选范围内
      _this.isWrapBox();
    }
  },
  mouseupEvent: function(event){
    event.stopPropagation();
    event.preventDefault();
    var _this= Page;
    _this.clearState();
  },
  //获取鼠标移动的距离
  getMousePosition: function(x,y){
    var obj = {};
    var ele = '.main';
    var offsetX = $(ele).offset().left;
    var offsetY = $(ele).offset().top;
    obj['x'] = x - offsetX;
    obj['y'] = y - offsetY; 
    return obj;
  },
  //框选大小和位置计算
  initWrapBox: function(){
    var _this = this;
    var eleWrap = '.main .wrap';
    $(eleWrap).addClass('show');
    var widthMove = _this.movePostion.x - _this.startPostion.x;
    var heightMove = _this.movePostion.y - _this.startPostion.y;
    if(widthMove >= 0 && heightMove >= 0){
      $(eleWrap).css({
        transform: 'rotate(0deg)',
        width: Math.abs(widthMove),
        height: Math.abs(heightMove),
      });
    }else if(widthMove < 0 && heightMove >= 0){
      $(eleWrap).css({
        transform: 'rotate(90deg)',
        width: Math.abs(heightMove),
        height: Math.abs(widthMove),
      });
    }else if(widthMove < 0 && heightMove < 0){
      $(eleWrap).css({
        transform: 'rotate(180deg)',
        width: Math.abs(widthMove),
        height: Math.abs(heightMove),
      });
    } else if(widthMove >= 0 && heightMove < 0){
      $(eleWrap).css({
        transform: 'rotate(270deg)',
        width: Math.abs(heightMove),
        height: Math.abs(widthMove),
      });
    }
  },
  //计算是否在框选范围内
  isWrapBox: function(){
    var _this = this;
    var ele = '.main .item';
    var $ele = $(ele);
    var eleL = $ele.length;
    for(var i = 0; i < eleL; i ++){
      var eleX = Number($ele.eq(i).css('left').replace(/px/ig,'')) + 100;
      var eleY = Number($ele.eq(i).css('top').replace(/px/ig,'')) + 20 ;
      var widthMove = _this.movePostion.x - _this.startPostion.x;
      var heightMove = _this.movePostion.y - _this.startPostion.y;
      if(widthMove >= 0 && heightMove >= 0){
        if(eleX > _this.startPostion.x && eleX < _this.movePostion.x && eleY > _this.startPostion.y && eleY < _this.movePostion.y){
          $ele.eq(i).addClass('active');
        }else {
          $ele.eq(i).removeClass('active');
        }
      }else if(widthMove < 0 && heightMove >= 0){
        if(eleX < _this.startPostion.x && eleX > _this.movePostion.x && eleY > _this.startPostion.y && eleY < _this.movePostion.y){
          $ele.eq(i).addClass('active');
        }else {
          $ele.eq(i).removeClass('active');
        }
      }else if(widthMove < 0 && heightMove < 0){
        if(eleX < _this.startPostion.x && eleX > _this.movePostion.x && eleY < _this.startPostion.y && eleY > _this.movePostion.y){
          $ele.eq(i).addClass('active');
        }else {
          $ele.eq(i).removeClass('active');
        }
      } else if(widthMove >= 0 && heightMove < 0){
        if(eleX > _this.startPostion.x && eleX < _this.movePostion.x && eleY < _this.startPostion.y && eleY > _this.movePostion.y){
          $ele.eq(i).addClass('active');
        }else {
          $ele.eq(i).removeClass('active');
        }
      }
    }
  },
  //清空全部状态
  clearState: function(){
    var _this= Page;
    var eleWrap = '.main .wrap';
    var eleItem = '.main .item';
    _this.mousedownFlag = false;
    $(eleWrap).removeClass('show')
    .css({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      transform: 'rotate(0deg)'
    });
  }
}
Page.init(10);