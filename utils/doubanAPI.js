/* 
  获取电影列表：getMoviesList(url) 返回一个promise
  获取指定电影信息: getMovieDetails(url) 返回一个promise
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
  getMoviesList: function(url) {
    return getList(url, processMoviesList);
  },
  // 获取电影信息
  getMovieDetails: function(url) {
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
  },
  // 获取音乐列表
  getMusicList: function (url) {
    return getList(url, processMusicList);
  },
}
// 获取列表(电影/音乐/图书)
function getList(url, processData) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'json'
      },
      success: res => {
        processData(res, resolve, reject);
      }
    });
  });
}
// 处理电影列表
function processMoviesList(res, resolve, reject) {
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
      resolve({
        total,
        resultList: newMoviesList
      });
    } else {
      reject('返回的电影数组为空');
    }
  } else {
    reject(res.msg);
  }
}
// 处理音乐列表
function processMusicList(res, resolve, reject) {
  if(res.statusCode == 200) {
    // 服务器返回的音乐列表总数
    const total = res.data.total;
    let originalMusicList = res.data.musics;
    let newMusicList = [];
    // 筛选原始数据
    originalMusicList.forEach((music, index) => {
      // author是数组[{name: 'A'},{name: 'B'}]
      let author = music.author.map((author) => {
        return author.name;
      });
      author = author.join(' / ');
      newMusicList[index] = {
        id: music.id,
        title: music.title,
        altTitle: music.alt_title,
        author,
        musicPoster: music.image,
        score: music.rating.average
      }
    })
    if (originalMusicList.length){
      resolve({
        total,
        resultList: newMusicList
      })
    } else {
      reject('返回的音乐列表为空');
    }
  }else{
    reject('请求音乐列表失败');
  }
}
module.exports = doubanAPI;