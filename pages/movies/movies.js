// pages/movies/movies.js
const getMoviesList = require('../../utils/doubanAPI.js').getMoviesList;
const createUrlWithOpt = require('../../utils/doubanAPI.js').createUrlWithOpt;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moviesBeingRelease: [],
    moviesWillBeReleased: [],
    highScoreMovies: [],
    getMoviesList: getMoviesList,
    searchUrl: 'https://api.douban.com/v2/movie/search?q=',
    hasMoreResult: null,
    searchResult: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let urlBeingRelease = 'https://api.douban.com/v2/movie/in_theaters';
    let urlWillBeReleased = 'https://api.douban.com/v2/movie/coming_soon';
    let urlHighScoreMovies = 'https://api.douban.com/v2/movie/top250';
    // 向服务器发起请求：正在热映的电影
    urlBeingRelease = createUrlWithOpt(urlBeingRelease, 0, 3);
    getMoviesList(urlBeingRelease).then(resData => {
      this.setData({
        moviesBeingRelease: resData.resultList
      });
    }).catch(err => {
      wx.showToast({
        title: '正在热映的电影加载出错',
        icon: 'none'
      });
    })
    // 向服务器发起请求：即将上映的电影
    urlWillBeReleased = createUrlWithOpt(urlWillBeReleased, 0, 3);
    getMoviesList(urlWillBeReleased).then(resData => {
      this.setData({
        moviesWillBeReleased: resData.resultList
      });
    }).catch(err => {
      wx.showToast({
        title: '即将上映的电影加载出错',
        icon: 'none'
      });
    });
    // 向服务器发起请求：高分电影
    urlHighScoreMovies = createUrlWithOpt(urlHighScoreMovies, 0, 3);
    getMoviesList(urlHighScoreMovies).then(resData => {
      this.setData({
        highScoreMovies: resData.resultList
      });
    }).catch(err => {
      wx.showToast({
        title: '高分电影加载出错',
        icon: 'none'
      });
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.searchResult.length){
      // 未进入搜索页
      return;
    }
    if (this.data.hasMoreResult) {
      // 调用组件方法
      this.selectComponent('#search-movies').loadMoreResult();
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