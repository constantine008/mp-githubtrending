const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()
const db = cloud.database()
const baseUrl = 'https://7465-test-3c9b5e-1258459492.tcb.qcloud.la'

const BlogMap = {
  'blogcoreos': {
      'article-image_url': [baseUrl + '/trackupdates/coreos.png']
  },
  'githubblog': {
    'article-image_url': [
      'https://github.blog/wp-content/uploads/2019/01/Community@2x.png',
      'https://github.blog/wp-content/uploads/2019/01/Company@2x-2.png',
      'https://github.blog/wp-content/uploads/2019/01/Engineering@2x.png',
      'https://github.blog/wp-content/uploads/2019/01/Enterprise@2x-2.png',
      'https://github.blog/wp-content/uploads/2019/01/Product@2x.png',
    ]
  }
}

async function getItems(jobname, id, num) {
  var url = 'http://39.106.218.104:5000/api/items?jobname=' + jobname
  if (id) {
    url += '&id=' + id
  }
  var defaultnum = num || 5;
  url += '&num=' + defaultnum
  console.log('request url:', url)
  var raw = await rp(url).then(function (response) {
      console.log('response:', response)
      return response;
    }).catch(function (err) {
      console.log('request error:', err)
    });
  var data = JSON.parse(raw)
  console.log('data:', data)
  var base_url = data.yaml.parser_config.base_url + '/'
  if (data.data && jobname in BlogMap) {
    data.data.map(function (d) {
      if (!d['article-image_url'] || d['article-image_url'] == base_url) {
        var images = BlogMap[jobname]['article-image_url']
        d['article-image_url'] = images[d.id % images.length]
      }
    })
  }
  return data || {}
}

async function getLastestGitHubBlog() {
  var list = await db.collection('blog').where({ status: 'online' }).orderBy('_crawl_time', 'desc').limit(6).get()
  return list.data
}

async function getLastest() {
  var all = []
  for (var k in BlogMap) {
    try {
      var d = await getItems(k, undefined, 2)
      all.push(...d.data)
    } catch (err) {
      console.log('getItems error:', err)
    }
  }
  all.push(...await getLastestGitHubBlog())
  all.sort(function (a, b) { return new Date(b['_crawl_time']) - new Date(a['_crawl_time']) });
  return {'data': all.slice(0, 6)}
}

// 云函数入口函数
exports.main = async (event, context) => {
  var { type, jobname, id } = event;
  if (type == 'lastest') {
    return await getLastest()
  }

  return await getItems(jobname, id)
}
