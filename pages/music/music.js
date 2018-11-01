// pages/music/music.js
const getMusicList = require('../../utils/doubanAPI.js').getMusicList;
const createUrlWithOpt = require('../../utils/doubanAPI.js').createUrlWithOpt;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getMusicList: getMusicList,
    searchUrl: 'https://api.douban.com/v2/music/search?q=',
    classUrl: 'https://api.douban.com/v2/music/search?tag=',
    hasMoreResult: null,
    searchResult: [],
    musicListData: [{
        tag: '华语',
        musicList: []
      },
      {
        tag: '欧美',
        musicList: []
      },
      {
        tag: '粤语',
        musicList: []
      },
      {
        tag: '日语',
        musicList: []
      },
      {
        tag: '韩语',
        musicList: []
      }
    ],
    buttons: [],
    currClassIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 定义按钮
    const buttons = this.data.musicListData.map(music => {
      return {
        value: music.tag
      };
    });
    this.setData({
      buttons
    });
    // 获取数据
    this.getMusicList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.searchResult.length) {
      // 未进入搜索页
      return;
    }
    if (this.data.hasMoreResult) {
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
  },
  // 监听单选按钮的变化
  changeIndex: function(event) {
    const newClassIndex = event.detail.newClassIndex;
    this.setData({
      currClassIndex: newClassIndex
    });
    // 获取数据
    this.getMusicList();
  },
  // 获取数据
  getMusicList() {
    const musicListData = this.data.musicListData;
    const currClassIndex = this.data.currClassIndex;
    const musicList = musicListData[currClassIndex].musicList;
    if (!musicList.length) {
      wx.showLoading({
        title: '正在加载',
      });
      // 如果 currClassIndex 对应的 musicList 为空
      let tag = musicListData[currClassIndex].tag;
      tag = encodeURIComponent(tag);
      let url = this.data.classUrl + tag;
      url = createUrlWithOpt(url, 0, 20);
      getMusicList(url).then((resData) => {
        musicListData[currClassIndex].musicList = resData.resultList;
        this.setData({
          musicListData
        });
        wx.hideLoading();
      });
    }
  }
})