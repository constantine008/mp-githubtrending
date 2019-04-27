const rate = require('./ratelimit.js')
const util = require('./util.js')
module.exports = {
  callFunction,
  callFunctionWithBlog,
  callFunctionWithQrCode,
  uploadFormID,
  callFunctionWithSubscribe,
  callFunctionWithName,
  callFunctionWithRawResponse
}
const version = 'githubv1'

function callFunction(data, completeFunc) {
  if (rate.RateLimit()) {
    return
  }
  var token = wx.getStorageSync('github-token')
  if (token) {
    data['token'] = token
  } else if(data.type == 'post') {
    util.Alert('未设置 Token', 6000, function() {
      wx.navigateTo({url: '/pages/settings/settings'})
    })
    return
  }
  wx.cloud.callFunction({
    name: version,
    data: data,
    complete: res => {
      var content = ''
      if (res.result) {
        content = res.result.content || ''
      }
      completeFunc(content)
    },
  })
}

function callFunctionWithRawResponse(data, completeFunc) {
  callFunctionWithName(version, data, completeFunc)
}

function callFunctionWithName(apiname, data, completeFunc) {
  if (rate.RateLimit()) {
    return
  }
  wx.cloud.callFunction({
    name: apiname,
    data: data,
    complete: res => {
      completeFunc(res.result)
    },
  })
}

function callFunctionWithBlog(data, completeFunc) {
  callFunctionWithName('blog', data, completeFunc)
}

function callFunctionWithQrCode(data, completeFunc) {
  callFunctionWithName('qrcode', data, completeFunc)
}

function callFunctionWithSubscribe(data, completeFunc) {
  callFunctionWithName('subscribe', data, completeFunc)
}

function uploadFormID(id, source) {
  if (id.indexOf('mock') >= 0) {return}
  callFunctionWithName('collectformid', {formId: id, source}, function(r) {console.log(r)})
}