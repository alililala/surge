const $ = Env()
if (typeof $request !== 'undefined') {
  set()
}

function set() {
  if ($request.headers) {
    var url = $request.url
    var cookie = $request.headers.Cookie
    var old = $.read("jd_wskey")
    var pin = old.split(";")[0]
    var wskey = old.split(";")[1]
    if (url.indexOf("serverConfig") != -1) {
      var pin = "pin=" + cookie.split(";")[1].split("=")[1] + ";"
      var jd_wskey = pin + wskey + ";"
      $.write(new_wskey, "jd_wskey")
    } else {
      var jd_wskey = pin + ";" + cookie.split(";")[0] + ";"
      $.write(new_wskey, "jd_wskey")
      $.notice("【京东】", "", "抓取wskey成功！", "http://boxjs.net")
    }
  }
}

function Env() {
  LN = typeof $loon != "undefined"
  SG = typeof $httpClient != "undefined" && !LN
  QX = typeof $task != "undefined"
  read = (key) => {
    if (LN || SG) return $persistentStore.read(key)
    if (QX) return $prefs.valueForKey(key)
  }
  write = (key, val) => {
    if (LN || SG) return $persistentStore.write(key, val);
    if (QX) return $prefs.setValueForKey(key, val)
  }
  notice = (title, subtitle, message, url) => {
    if (LN) $notification.post(title, subtitle, message, url)
    if (SG) $notification.post(title, subtitle, message, { url: url })
    if (QX) $notify(title, subtitle, message, { "open-url": url })
  }
  get = (url, cb) => {
    if (LN || SG) {$httpClient.get(url, cb)}
    if (QX) {url.method = 'GET'; $task.fetch(url).then((resp) => cb(null, {}, resp.body))}
  }
  post = (url, cb) => {
    if (LN || SG) {$httpClient.post(url, cb)}
    if (QX) {url.method = 'POST'; $task.fetch(url).then((resp) => cb(null, {}, resp.body))}
  }
  put = (url, cb) => {
    if (LN || SG) {$httpClient.put(url, cb)}
    if (QX) {url.method = 'PUT'; $task.fetch(url).then((resp) => cb(null, {}, resp.body))}
  }
  log = (message) => console.log(message)
  done = (value = {}) => {$done(value)}
  return { LN, SG, QX, read, write, notice, get, post, put, log, done }
}
