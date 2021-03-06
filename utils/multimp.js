module.exports = {
  Navi,
}

// 在微信小程序中使用
function Navi(url) {
  var match = -1
  for (var i = 0; i < directTransform.length; i++) {
    var trans = directTransform[i]
    var urlPrefix = trans.urlPrefix
    if (url.startsWith(urlPrefix)) { 
      match = i; break;
    }
  }
  if (match == -1) {return false}
  var trans = directTransform[match]
  var urlPrefix = trans.urlPrefix
  var nickname = trans.nickname
  var to = trans.genMPUrl(trans, url)
  console.log('Navi url: ', url, ' to ', nickname, to)
  wx.navigateToMiniProgram({
    appId: trans.appid,
    path: to,
    success(res) {
      console.log('Navi success:', res)
    },
    fail(res) {
      console.log('Navi fail:', res)
    }
  })
}

var directTransform = [{
    nickname: 'GitHub Trending Hub',
    appid: 'wx6204a7df95c7fb21',
    indexPage: 'pages/github/index',
    urlPrefix: 'https://github.com',
    genMPUrl: DefaultGenMPUrl,
}, {
    nickname: 'Readhub',
    appid: 'wxd83c7f07a0b00f1b',
    urlPrefix: 'https://readhub.cn/topic',
    indexPage: 'pages/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1) { return meta.indexPage }
        // Topic URL: https://readhub.cn/topic/7NgjG2U66fX
        // Index Page: https://readhub.cn/topics
        var topicID = url.slice(meta.urlPrefix.length+idx+1, url.length)
        if (topicID == "" || topicID == "/") { return meta.indexPage }
        return 'pages/detail?id=' + topicID
    },
}, {
    nickname: '哔哩哔哩',
    appid: 'wx7564fd5313d24844',
    urlPrefix: 'https://www.bilibili.com/video/av',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1) {return meta.indexPage }
        // pages/video/video?avid=54809781
        // https://www.bilibili.com/video/av54809781?spm_id_from=333.334.b_62696c695f67756f636875616e67.51
        var qmark = url.indexOf('?')
        var start = meta.urlPrefix.length+idx
        var id = url.slice(start, qmark!=-1&&qmark>start ? qmark : url.length)
        if (id == "" || id == "/") { return meta.indexPage }
        return 'pages/video/video?avid=' + id
    },
}, {
    nickname: '腾讯视频',
    appid: 'wxa75efa648b60994b',
    urlPrefix: 'https://v.qq.com/x/cover/',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1) {return meta.indexPage }
        // pages/play/index.html?cid=jeds18ea11rrnbg&parentParams=
        // https://v.qq.com/x/cover/jeds18ea11rrnbg.html
        // https://v.qq.com/x/cover/5vgz1duinuar746/r00314e3n1i.html
        var arr = url.split('/')
        var id = arr[arr.length-1]
        if (id.indexOf('.html') != -1) {
            id = id.slice(0, id.indexOf('.html'))
        }
        if (id == "" || id == "/") { return meta.indexPage }
        return 'pages/play/index?parentParams=&cid=' + id
    },
}, {
    nickname: 'CSDN',
    appid: 'wx2115aba2ed1f96b9',
    urlPrefix: 'https://blog.csdn.net',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1 || url.indexOf('/article/details/') == -1) {return meta.indexPage }
        // pages/blog/article-detail?userName=qq_41753040&articleId=90633737&__key_=15599641012541
        // https://blog.csdn.net/qq_41753040/article/details/90633737
        var arr = url.slice(meta.urlPrefix.length, url.length).split('/')
        if (arr.length < 4) { return meta.indexPage }
        var username = arr[0]
        var id = arr[3]
        if (username == 0 || id == "" || id == "/") { return meta.indexPage }
        return 'pages/blog/article-detail?userName=' + username + '&articleId=' + id
    },
}, {
    nickname: '简书',
    appid: 'wx646159264d261dab',
    urlPrefix: 'https://www.jianshu.com',
    indexPage: 'pages/index',
    // https://www.jianshu.com/p/24d22539d45a
    genMPUrl: GenFormatOneMPUrl('p', 'pages/note?slug='),
}, {
    nickname: '知乎热榜',
    appid: 'wxeb39b10e39bf6b54',
    urlPrefix: 'https://www.zhihu.com',
    indexPage: 'pages/index/index',
    // https://www.zhihu.com/question/329765131
    genMPUrl: GenFormatOneMPUrl('question', 'zhihu/question?id='),
}, {
    nickname: '知乎热榜',
    appid: 'wxeb39b10e39bf6b54',
    urlPrefix: 'https://zhuanlan.zhihu.com',
    indexPage: 'pages/index/index',
    // https://zhuanlan.zhihu.com/p/63501230
    genMPUrl: GenFormatOneMPUrl('p', 'zhihu/article?id='),
}, {
    nickname: '什么值得买',
    appid: 'wxeb5d1f826d7998df',
    urlPrefix: 'https://www.smzdm.com',
    indexPage: 'pages/index/index',
    // https://www.smzdm.com/p/14483467/
    genMPUrl: GenFormatOneMPUrl('p', 'pages/haojia_details/haojia_details?id='),
}, {
    nickname: '什么值得买',
    appid: 'wxeb5d1f826d7998df',
    urlPrefix: 'https://post.smzdm.com',
    indexPage: 'pages/index/index',
    // https://post.smzdm.com/p/ax08nrm2/
    genMPUrl: GenFormatOneMPUrl('p', 'pages/haowen_details/haowen_details?type=11&id='),
}, {
    nickname: '百度网盘',
    appid: 'wxdcd3d073e47d1742',
    urlPrefix: 'https://pan.baidu.com',
    indexPage: 'pages/netdisk_index/index',
    //  https://pan.baidu.com/s/10v3OUqXpkBnpurKFLI40jQ
    genMPUrl: GenFormatOneMPUrl('s', 'pages/netdisk_share/share?scene='),
}, {
    nickname: '36氪Lite',
    appid: 'wx23551bed0b72cd7f',
    urlPrefix: 'https://36kr.com',
    indexPage: 'pages/list/list',
    // https://36kr.com/p/5220102
    genMPUrl: GenFormatOneMPUrl('p', 'pages/detail/detail?id='),
}, {
    nickname: '掘金第三方版',
    appid: 'wx0f72a9f832b78889',
    urlPrefix: 'https://juejin.im',
    indexPage: 'pages/launch/launch',
    // https://juejin.im/post/5d147765f265da1bb003d0dc
    genMPUrl: GenFormatOneMPUrl('post', 'pages/post/post?type=post&id='),
}, {
    nickname: 'V2EX For You',
    appid: 'wx1b979cda6b085993',
    urlPrefix: 'https://www.v2ex.com',
    indexPage: 'pages/index/index',
    // https://www.v2ex.com/t/578260#reply22
    genMPUrl: function (meta, url) {
        var p = GenFormatOneMPUrl('t', 'pages/topic/index?topicId=')(meta, url)
        if (p.indexOf('#') != -1 ){
            p = p.slice(0, p.indexOf('#'))
        }
        return p
    }
}, {
    nickname: '豆瓣评分',
    appid: 'wx2f9b06c1de1ccfca',
    urlPrefix: 'https://movie.douban.com',
    indexPage: 'pages/index/index',
    // https://movie.douban.com/subject/26794435/?from=showing
    genMPUrl: GenFormatOneMPUrl('subject', 'pages/subject/subject?type=movie&id='),
}, {
    nickname: '豆瓣评分',
    appid: 'wx2f9b06c1de1ccfca',
    urlPrefix: 'https://book.douban.com',
    indexPage: 'pages/index/index',
    // https://book.douban.com/subject/33442274/?icn=index-latestbook-subject
    genMPUrl: GenFormatOneMPUrl('subject', 'pages/subject/subject?type=book&id='),
}, {
    nickname: '豆瓣评分',
    appid: 'wx2f9b06c1de1ccfca',
    urlPrefix: 'https://music.douban.com',
    indexPage: 'pages/index/index',
    // https://music.douban.com/subject/34780472/
    genMPUrl: GenFormatOneMPUrl('subject', 'pages/subject/subject?type=music&id='),
}, {
    nickname: '腾讯新闻',
    appid: 'wxb10c47503e8c8e01',
    urlPrefix: 'https://new.qq.com',
    indexPage: 'pages/main_page/main_page',
    // https://new.qq.com/omn/TWF20190/TWF2019081200847600.html
    genMPUrl: GenFormatLastPathMPUrl('pages/normal/index?atype=0&id='),
}]

function DefaultGenMPUrl(meta, url) {
    if (url == meta.urlPrefix) {return meta.indexPage}
    return url
}

// url like: <prefix>/xxx/yyy/zzz/<last>.<sufix>
function GenFormatLastPathMPUrl(path) {
    function genMPUrl(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1) {return meta.indexPage }
        var arr = url.split('/')
        var lastpath = arr[arr.length-1].split('.')[0]
        if (lastpath == "") {return meta.indexPage} 
        return path + lastpath
    }
    return genMPUrl
}

// url like: <prefix>/<gap>/<id>, such as: https://zhuanlan.zhihu.com/p/63501230
function GenFormatOneMPUrl(gap, path) {
    function genMPUrl(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1 || url.indexOf('/'+gap+'/') == -1) {return meta.indexPage }
        var arr = url.split('/')
        if (arr.length < 5) { return meta.indexPage }
        var id = arr[4]
        if (id == "") { return meta.indexPage }
        return path + id
    }
    return genMPUrl
}