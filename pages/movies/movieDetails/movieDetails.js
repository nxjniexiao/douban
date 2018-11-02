// pages/movies/movieDetails/movieDetails.js
const getDetails = require('../../../utils/doubanAPI.js').getDetails;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFolded: true,
    str_directors: '',
    str_casts: '',
    str_type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    const movieId = options.movieId;
    // console.log(movieId);
    const apiKey = '?apikey=0df993c66c0c636e29ecbb5344252a4a';
    const url = 'https://api.douban.com/v2/movie/subject/' + movieId + apiKey;
    getDetails(url).then(movieData => {
      this.setData({
        str_directors: this._concatNames(movieData.directors),
        str_casts: this._concatNames(movieData.casts),
        str_type: movieData.genres.join(' / '),
        ...movieData
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    });
  },
  onshow: function() {
    console.log(this.data.casts);
  },
  // 合并导演/演员名字
  _concatNames: function (arr) {
    let namesArr = [];
    arr.forEach((item) => {
      if(item.name){
        namesArr.push(item.name);
      }
    });
    return namesArr.join(' / ');
  },
  // 展开或折叠剧情简介
  handleContent: function(event) {
    this.setData({
      isFolded: !this.data.isFolded
    });
  },
  // 点击显示大图
  showImage: function(event) {
    const url = event.target.dataset.url;
    wx.previewImage({
      urls: [url],
    });
  }
})