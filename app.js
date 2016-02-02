/**
 * Created by Geek on 16/2/2.
 */

var superagent = require('superagent');
var cheerio = require('cheerio');
var exec = require('child_process').exec

var sketch_url = 'http://www.sketchchina.com/read-164.html';
var headers = {
  "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  "Accept-Encoding" : 'gzip, deflate, sdch',
  "Accept-Language" : 'zh-CN,zh;q=0.8',
  "Cache-Control" : 'max-age=0',
  "Connection" : 'keep-alive',
  "Cookie" : 'dms_winduser=SpCSOuNLXElRqnFSM7hVod7TZM1OB9e6qIeD8UomNGp3KMorfqJJ6A%3D%3D; dms_lastvisit=0%091454396475%09%2Fread-163.html; dms_visitor=AXDVXv2b5TlkQ8e4Z0Ka0Z0LDmhLPdoFMxKG3tqh7myjt5lNTTV5KfcENj3dKTJ3%2BLjf2tw8iy5fc1XxswaXkg%3D%3D; Hm_lvt_e3dc434ae39053b5dbfe7b776d641f84=1454393351; Hm_lpvt_e3dc434ae39053b5dbfe7b776d641f84=1454396476',
  "Host" : 'www.sketchchina.com',
  "Referer" : 'http://www.sketchchina.com/read-164.html',
  "Upgrade-Insecure-Requests" : '1',
  "User-Agent" : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36 QQBrowser/3.9.3952.400'
}
var begin = 1, finish = 1;

superagent
  .get(sketch_url)
  .set(headers)
  .end(function (err, res) {
    var $ = cheerio.load(res.text);
    $('.editor_content').find('a').each(function () {
      var reg = /静电的Sketch设计教室视频版.*/;
      if (reg.test($(this).text())) {
        getVideoInfo($(this).attr('href'));
      }
    });
  });

var getVideoInfo = function (url) {
  superagent
    .get(url)
    .set(headers)
    .end(function (err, res) {
      var $ = cheerio.load(res.text);
      var title = $('#J_post_title').text().substr(16, $('#J_post_title').text().length - 16);
      $('script').each(function () {
        $(this).text().split("'").forEach(function (item) {
          var reg = /.*7xnezz.media1.z0.glb.clouddn.com.*m3u8$/;
          if (reg.test(item)) {
            console.log('开始下载第' + begin++ + '个视频 : ' + title);
            execDownload(item, title.replace(/\s/g,""), function (title) {
              console.log('下载完成' + finish++ + '个视频 : ' + title);
            });
          }
        });
      });
    })
}

var execDownload = function (url, title, callback) {
  var com = './ffmpeg -i ' + url + ' -c copy -bsf:a aac_adtstoasc video/' + title + '.mp4';
  exec(com, function (err, stdout, stderr) {
    if (err) {
      console.log('error!!!!!!\n' + err);
    }else {
      callback(title)
    }
  });
}