// components/movie/movie.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movieId: {
      type: String
    },
    title: {
      type: String
    },
    imgSrc: {
      type: String
    },
    score: {
      type: Number
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
    naveToMovieDetails: function(event){
      const movieId = event.currentTarget.dataset.movieId;
      wx.navigateTo({
        url: '/pages/movies/movieDetails/movieDetails?movieId=' + movieId,
      })
    }
  }
})
