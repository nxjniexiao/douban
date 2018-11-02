// pages/music-bookDetails/music-bookDetails.js
const getDetails = require('../../utils/doubanAPI.js').getDetails;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfoIsFolded: true,
    authorInfoIsFolded: true,
    pageId: null,
    pageType: null,
    author: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // options: {id: '1770782', type: 'book'} 或者 {id: '1403307', type: 'music'}
    this.setData({
      pageId: options.id,
      pageType: options.type
    });
    const apiKey = '?apikey=0df993c66c0c636e29ecbb5344252a4a';
    let url = 'https://api.douban.com/v2/' + this.data.pageType + '/' + this.data.pageId + apiKey;
    // 请求数据
    getDetails(url).then(resData => {
      const image = resData.image;
      const title = resData.title;
      const alt_title = resData.alt_title;
      const score = resData.rating.average;
      const tags = resData.tags;
      let author = '';
      let publisher = '';
      let pubDate = '';
      let musicList = [];// 音乐界面独有
      let authorInfo = '';// 图书界面独有
      let bookInfo = '';// 图书界面独有
      if (this.data.pageType == 'book') {
        // 图书API中author格式为：['A', 'B']
        author = resData.author.join(' / ');
        publisher = resData.publisher;
        pubDate = resData.pubdate;
        authorInfo = resData.author_intro;
        bookInfo = resData.summary;
      } else {
        // 音乐API中author格式为：[{name: 'A'}, {name: 'B'}]
        const authorArr = resData.author.map(author => {
          return author.name;
        });
        author = authorArr.join(' / ');
        publisher = resData.attrs.publisher.join(' / ');
        pubDate = resData.attrs.pubdate.join(' / ');
        musicList = resData.attrs.tracks[0].split('\n');
      }
      this.setData({
        image,
        title,
        alt_title,
        author,
        publisher,
        pubDate,
        score,
        tags,
        musicList,
        bookInfo,
        authorInfo
      });
    });
  },
  // 展开或折叠简介
  handleBookInfo: function (event) {
    this.setData({
      bookInfoIsFolded: !this.data.bookInfoIsFolded
    });
  },
  handleAuthorInfo: function (event) {
    this.setData({
      authorInfoIsFolded: !this.data.authorInfoIsFolded
    });
  },
})