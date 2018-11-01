// components/searchBox/searchBox.js
const createUrlWithOpt = require('../../utils/doubanAPI.js').createUrlWithOpt;
const getList = require('../../utils/doubanAPI.js').getList;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchUrl: {
      type: String
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    searchContent: '',
    totalResultQuantity: 0,
    currResultQuantity: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 键盘输入时触发
    onInput: function(event) {
      const value = event.detail.value;
      this.setData({
        searchContent: value
      });
      if (value) {
        // 输入框不为空:
        // 显示清空按钮
        this.setData({
          showClearBtn: true
        });
      } else {
        // 输入框为空:
        // 隐藏清空按钮
        this.setData({
          showClearBtn: false
        });
        // 触发自定义事件
        const detail = {
          actionType: 'clear'
        };
        this.triggerEvent('search-result', detail);
      }
    },
    // 点击完成按钮时触发
    onConfirm: function(event) {
      let content = this.data.searchContent;
      content = encodeURIComponent(content);
      if (content) {
        wx.showLoading({
          title: '加载中',
        });
        // 编码
        let url = this.properties.searchUrl + content;
        url = createUrlWithOpt(url, 0, 18);
        // 搜索电影
        getList(url).then(resData => {
          this.setData({
            totalResultQuantity: resData.total,
            currResultQuantity: 18
          });
          // 触发自定义事件
          const detail = {
            actionType: 'appench',
            data: {
              hasMoreResult: this.data.totalResultQuantity > this.data.currResultQuantity,
              searchResult: resData.moviesList
            }
          };
          this.triggerEvent('search-result', detail);
          wx.hideLoading();
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: '搜索电影出错',
            icon: 'none'
          });
        });
      } else {
        // 搜索框内容为空
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
      }
    },
    // 清空搜索框内容
    clearSearchContent: function(event) {
      this.setData({
        searchContent: '',
        showClearBtn: false,
        searchResult: [],
      });
      // this._scrollToTop(); // 显示热映等电影内容时，立即滚动到顶部
      // 触发自定义事件
      const detail = {
        actionType: 'clear'
      };
      this.triggerEvent('search-result', detail);
    },
    // 搜索更多结果
    loadMoreResult() {
      let url = this.properties.searchUrl;
      let content = this.data.searchContent;
      content = encodeURIComponent(content);
      url = url + content;
      if (content) {
        const totalResultQuantity = this.data.totalResultQuantity;
        const currResultQuantity = this.data.currResultQuantity;
        wx.showLoading({
          title: '加载中',
        });
        url = createUrlWithOpt(url, currResultQuantity, 18);
        // 请求更多的搜索结果
        getList(url).then(resData => {
          this.setData({
            currResultQuantity: currResultQuantity + 18
          });
          // 触发自定义事件
          const detail = {
            actionType: 'appench',
            data: {
              hasMoreResult: totalResultQuantity > currResultQuantity,
              searchResult: resData.moviesList
            }
          };
          this.triggerEvent('search-result', detail);
          wx.hideLoading();
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: '加载更多出错',
            icon: 'none'
          })
        });
      }
    }
  }
})