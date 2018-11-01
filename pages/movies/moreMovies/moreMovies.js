// pages/movies/moreMovies/moreMovies.js
const getList = require('../../../utils/doubanAPI.js').getList;
const createUrlWithOpt = require('../../../utils/doubanAPI.js').createUrlWithOpt;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',
    total: null,
    moviesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const moviesListCategory = options.category; // 电影列表的种类
    const categorys = {
      moviesBeingRelease: {
        title: '正在热映',
        url: 'https://api.douban.com/v2/movie/in_theaters'
      },
      moviesWillBeReleased: {
        title: '即将上映',
        url: 'https://api.douban.com/v2/movie/coming_soon'
      },
      highScoreMovies: {
        title: '高分电影',
        url: 'https://api.douban.com/v2/movie/top250'
      },
    }
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: categorys[moviesListCategory].title,
    })
    this.setData({
      requestUrl: categorys[moviesListCategory].url
    })
    // 向服务器发起请求
    const url = createUrlWithOpt(categorys[moviesListCategory].url, 0, 21);
    getList(url).then(resData => {
      this.setData({
        ...resData
      });
    }).catch(err => {
      wx.showToast({
        title: '电影初次加载出错',
        icon: 'none'
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const total = this.data.total;
    const currTotal = this.data.moviesList.length;
    if (total > currTotal) {
      wx.showLoading({
        title: '加载中',
      });
      let url = this.data.requestUrl;
      url = createUrlWithOpt(url, currTotal, 21);
      // 向服务器发起请求(加载更多)
      getList(url).then(resData => {
        const moviesList = resData.moviesList;
        let newMoviesList = this.data.moviesList;
        newMoviesList = newMoviesList.concat(moviesList);
        this.setData({
          moviesList: newMoviesList
        });
        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '加载更多电影出错',
          icon: 'none'
        });
      });
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   * 监听用户下拉刷新事件
   */
  onPullDownRefresh() {
    let url = this.data.requestUrl;
    url = createUrlWithOpt(url, 0, 21);
    // 向服务器发起请求(刷新)
    getList(url).then(resData => {
      const moviesList = resData.moviesList;
      this.setData({
        moviesList
      });
      wx.stopPullDownRefresh();
    }).catch(err => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新电影出错',
        icon: 'none'
      })
    });
  }
})