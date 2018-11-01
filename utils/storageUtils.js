const storageUtils = {
  // {posts_collection: {id1: false, id2: true}}
  // 根据 key 获取 storage
  get: function(name, key) {
    const postsCollection = wx.getStorageSync(name);
    if (!postsCollection){
      // posts_collection 为空
      return false;
    }
    if (!postsCollection[key]){
      // posts_collection 中不存在 key
      return false;
    }
    return postsCollection[key];
  },

  // 根据 key 和 value 设置 storage
  set: function (name, key, value) {
    let postsCollection = wx.getStorageSync(name);
    if (!postsCollection) {
      // posts_collection 为空
      postsCollection = {};
    }
    postsCollection[key] = value;
    wx.setStorageSync(name, postsCollection)
  }
}
module.exports = storageUtils;