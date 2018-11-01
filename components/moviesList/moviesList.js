// components/moviesList/moviesList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: {
      type: String
    },
    listTitle: {
      type: String
    },
    moviesList: {
      type: Array
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
    navToMoreMovies: function(event){
      // 'moviesBeingRelease' / 'moviesWillBeReleased' / 'highScoreMovies'
      const category = event.target.dataset.category;
      wx.navigateTo({
        url: '/pages/movies/moreMovies/moreMovies?category=' + category,
      })
    }
  }
})
