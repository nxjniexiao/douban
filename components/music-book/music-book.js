// components/music/music.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isMusic: {
      type: Boolean,
      value: false
    },
    rank: {
      type: Number
    },
    info: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转至音乐详情页面
    navToMusicDetails: function(event) {
      const musicId = event.currentTarget.dataset.musicId;
      // 跳转
      wx.navigateTo({
        url: '/pages/music/musicDetails/musicDetails?musicId=' + musicId,
      })
    }
  }
})
