/* 
  获取电影列表：getList(url) 返回一个promise
  获取指定电影信息: getDetails(url) 返回一个promise
 */
const doubanAPI = {
  // url 后增加请求数量参数
  createUrlWithOpt: function(url, start, count) {
    if (arguments.length < 3) {
      throw new Error('createUrlWithOpt(url, start, count)应至少传入三个参数');
    };
    if (!url) {
      throw new Error('createUrlWithOpt(url, start, count)中的 url 不能为空');
    };
    if (typeof start !== 'number') {
      throw new Error('createUrlWithOpt(url, start, count)中的 start 必须为数字');
    };
    if (typeof count !== 'number') {
      throw new Error('createUrlWithOpt(url, start, count)中的 count 必须为数字');
    }
    // ?apikey=0df993c66c0c636e29ecbb5344252a4a
    let opts = '';
    if (/\?/.test(url)) {
      opts = '&apikey=0df993c66c0c636e29ecbb5344252a4a' + '&start=' + start + '&count=' + count;
    } else {
      opts = '?apikey=0df993c66c0c636e29ecbb5344252a4a' + '&start=' + start + '&count=' + count;
    }
    return url + opts;
  },
  // 获取电影列表
  // moviesListName
  getList: function(url) {
    return new Promise ((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'json'
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 服务器返回的电影总数
            const total = res.data.total;
            let originalMoviesList = res.data.subjects;
            if (originalMoviesList) {
              const newMoviesList = [];
              originalMoviesList.forEach((list, index) => {
                newMoviesList[index] = {
                  id: list.id,
                  title: list.title,
                  moviePoster: list.images.large,
                  rating: list.rating.average,
                };
              });
              resolve({ total, moviesList: newMoviesList});
            } else {
              reject('返回的电影数组为空');
            }
          } else {
            reject(res.msg);
          }
        }
      });
    });
  },
  // 获取电影信息
  getDetails: function(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'json'
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const movieData = res.data;
            resolve(movieData);
          } else {
            reject(res.data.msg);
          }
        }
      });
    });
  }
}
module.exports = doubanAPI;