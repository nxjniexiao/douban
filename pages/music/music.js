// pages/music/music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchUrl: 'https://api.douban.com/v2/movie/search?q=',
    hasMoreResult: null,
    searchResult: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasMoreResult){
      // 调用组件方法
      this.selectComponent('#search-music').loadMoreResult();
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'none'
      });
    }
  },
  // 监听搜索框组件传入的数据
  changeSearchResult: function(event) {
    const actionType = event.detail.actionType;
    if (actionType == 'appench') {
      let newSearchResult = this.data.searchResult.concat(event.detail.data.searchResult);
      this.setData({
        hasMoreResult: event.detail.data.hasMoreResult,
        searchResult: newSearchResult
      });
    } else {
      this.setData({
        hasMoreResult: true,
        searchResult: []
      });
    }
  }
})