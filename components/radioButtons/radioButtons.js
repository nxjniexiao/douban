// components/radioButtons/buttons.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    buttons: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeButtonIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 监听点击分类按钮
    changeClass: function(event) {
      const newActiveButtonIndex = event.target.dataset.index;
      if (newActiveButtonIndex != this.data.activeButtonIndex){
        this.setData({
          activeButtonIndex: newActiveButtonIndex
        });
        // 触发自定义事件
        this.triggerEvent('change-index', { newClassIndex: newActiveButtonIndex });
      }
    }
  }
})
