// pages/books/books.js
const getBooksList = require('../../utils/doubanAPI.js').getBooksList;
const createUrlWithOpt = require('../../utils/doubanAPI.js').createUrlWithOpt;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getBooksList: getBooksList,
    searchUrl: 'https://api.douban.com/v2/book/search?q=',
    classUrl: 'https://api.douban.com/v2/book/search?tag=',
    hasMoreResult: null,
    searchResult: [],
    listData: [{
      tag: '小说',
      list: []
    },
    {
      tag: '文学',
      list: []
    },
    {
      tag: '历史',
      list: []
    },
    {
      tag: '随笔',
      list: []
    },
    {
      tag: '漫画',
      list: []
    }
    ],
    buttons: [],
    currClassIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 定义按钮
    const buttons = this.data.listData.map(music => {
      return {
        value: music.tag
      };
    });
    this.setData({
      buttons
    });
    // 获取数据
    this.getListData();
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (!this.data.searchResult.length) {
      // 未进入搜索页
      return;
    }
    if (this.data.hasMoreResult) {
      // 调用组件方法
      this.selectComponent('#search-books').loadMoreResult();
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'none'
      });
    }
  },
  // 监听搜索框组件传入的数据
  changeSearchResult: function (event) {
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
  changeIndex: function (event) {
    const newClassIndex = event.detail.newClassIndex;
    this.setData({
      currClassIndex: newClassIndex
    });
    // 获取数据
    this.getListData();
  },
  // 获取数据
  getListData() {
    const listData = this.data.listData;
    const currClassIndex = this.data.currClassIndex;
    const list = listData[currClassIndex].list;
    if (!list.length) {
      wx.showLoading({
        title: '正在加载',
      });
      // 如果 currClassIndex 对应的 list 为空
      let tag = listData[currClassIndex].tag;
      tag = encodeURIComponent(tag);
      let url = this.data.classUrl + tag;
      url = createUrlWithOpt(url, 0, 20);
      getBooksList(url).then((resData) => {
        listData[currClassIndex].list = resData.resultList;
        this.setData({
          listData
        });
        wx.hideLoading();
      });
    }
  }
})