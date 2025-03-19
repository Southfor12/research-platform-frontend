import { Message } from 'element-ui'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function findIndexByKeyValue(arr, key, valuetosearch) {
  for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] == valuetosearch) {
          return i;
      }
  }
  return -1;
}

export function removeByValue(arr, val) {
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
 }

export function timestampFormat(format, timestamp){ 
  var a, ret, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date()); 
  var pad = function(n, c){ 
   if((n = n + "").length < c){ 
    return new Array(++c - n.length).join("0") + n; 
   } else { 
    return n; 
   } 
  }; 
  var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
  var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"}; 
  var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
  var f = { 
   // Day 
   d: function(){return pad(f.j(), 2)}, 
   D: function(){return f.l().substr(0,3)}, 
   j: function(){return jsdate.getDate()}, 
   l: function(){return txt_weekdays[f.w()]}, 
   N: function(){return f.w() + 1}, 
   S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'}, 
   w: function(){return jsdate.getDay()}, 
   z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0}, 
   
   // Week 
   W: function(){ 
    var a = f.z(), b = 364 + f.L() - a; 
    var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1; 
    if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){ 
     return 1; 
    } else{ 
     if(a <= 2 && nd >= 4 && a >= (6 - nd)){ 
      nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31"); 
      return date("W", Math.round(nd2.getTime()/1000)); 
     } else{ 
      return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0); 
     } 
    } 
   }, 
   
   // Month 
   F: function(){return txt_months[f.n()]}, 
   m: function(){return pad(f.n(), 2)}, 
   M: function(){return f.F().substr(0,3)}, 
   n: function(){return jsdate.getMonth() + 1}, 
   t: function(){ 
    var n; 
    if( (n = jsdate.getMonth() + 1) == 2 ){ 
     return 28 + f.L(); 
    } else{ 
     if( n & 1 && n < 8 || !(n & 1) && n > 7 ){ 
      return 31; 
     } else{ 
      return 30; 
     } 
    } 
   }, 
   
   // Year 
   L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0}, 
   //o not supported yet 
   Y: function(){return jsdate.getFullYear()}, 
   y: function(){return (jsdate.getFullYear() + "").slice(2)}, 
   
   // Time 
   a: function(){return jsdate.getHours() > 11 ? "pm" : "am"}, 
   A: function(){return f.a().toUpperCase()}, 
   B: function(){ 
    // peter paul koch: 
    var off = (jsdate.getTimezoneOffset() + 60)*60; 
    var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off; 
    var beat = Math.floor(theSeconds/86.4); 
    if (beat > 1000) beat -= 1000; 
    if (beat < 0) beat += 1000; 
    if ((String(beat)).length == 1) beat = "00"+beat; 
    if ((String(beat)).length == 2) beat = "0"+beat; 
    return beat; 
   }, 
   g: function(){return jsdate.getHours() % 12 || 12}, 
   G: function(){return jsdate.getHours()}, 
   h: function(){return pad(f.g(), 2)}, 
   H: function(){return pad(jsdate.getHours(), 2)}, 
   i: function(){return pad(jsdate.getMinutes(), 2)}, 
   s: function(){return pad(jsdate.getSeconds(), 2)}, 
   //u not supported yet 
   
   // Timezone 
   //e not supported yet 
   //I not supported yet 
   O: function(){ 
    var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4); 
    if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t; 
    return t; 
   }, 
   P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))}, 
   //T not supported yet 
   //Z not supported yet 
   
   // Full Date/Time 
   c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()}, 
   //r not supported yet 
   U: function(){return Math.round(jsdate.getTime()/1000)} 
  }; 
  
  return format.replace(/[\ ]?([a-zA-Z])/g, function(t, s){ 
   if( t!=s ){ 
    // escaped 
    ret = s; 
   } else if( f[s] ){ 
    // a date function exists 
    ret = f[s](); 
   } else{ 
    // nothing special 
    ret = s; 
   } 
   return ret; 
  }); 
 }

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

export function objToQuery(obj) {
  // 首先判断obj是否为真，为真则进行处理，不然直接return
  if (obj) {
    // 定义变量接收query字符串
    let query = ""
    // 循环遍历对象
    for (let i in obj) {
      // 定义变量接收对象的value值
      let value = obj[i]
      // 若对象的value值为数组，则进行join打断
      if (Array.isArray(value)) {
        value = value.join(",")
      }
      // 进行字符串拼接
      query += `&${i}=${value}`
    }
    // replace返回一个新的字符串，要用query重新接受一下，并把第一个&替换为?
    query = query.replace('&', '?')
    // 返回生成的query字符串
    return query
  }
  return ""
}

export function transTime(time) {
  let currYear = true
  let year = (new Date).getFullYear().toString()
  if (time.replace(/^\s*|\s*$/g,"").substring(0, 4) !== year) currYear = false
  switch (time.length) {
    case 7:
      return time.replace(/(.+?)\-(.+)/, currYear ? '$2月' : '$1年$2月')
    case 10:
      return time.replace(/(.+?)\-(.+?)\-(.+)/, currYear ? '$2月$3日' : '$1年$2月$3日')
    case 13:
      return time.replace(/(.+?)\-(.+?)\-(.+?) (.+)/, currYear ? '$2月$3日 $4时' : '$1年$2月$3日 $4时')
    case 16:
      return time.replace(/(.+?)\-(.+?)\-(.+?) (.+?):(.+)/, currYear ? '$2月$3日 $4时$5分' : '$1年$2月$3日 $4时$5分')
    default:
      return time.replace(/(.+?)\-(.+?)\-(.+?) (.+?):(.+?):(.+)/, currYear ? '$2月$3日 $4时$5分$6秒' : '$1年$2月$3日 $4时$5分$6秒')
  }
}

export function timeFormat(date, fmt) {
  var o = { 
       "M+" : date.getMonth()+1,                 //月份 
       "d+" : date.getDate(),                    //日 
       "h+" : date.getHours(),                   //小时 
       "m+" : date.getMinutes(),                 //分 
       "s+" : date.getSeconds(),                 //秒 
       "q+" : Math.floor((date.getMonth()+3)/3), //季度 
       "S"  : date.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}

export function checkImgFile(file, size, message){
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isBMP = file.type === 'image/bmp'
  const isLt = file.size / 1024 / 1024 < size;

  if (!isJPG && !isPNG && !isBMP) {
    message.error('请上传 .jpg,.png,.bmp 格式的图片');
  }
  if (!isLt) {
    message.error('上传图片大小不能超过 ' + size + 'M');
  }
  return (isJPG || isPNG || isBMP) && isLt
}

export function checkAttachFile(file, size, message){
  const isFile = (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png') || file.name.endsWith('.gif') ||
                  file.name.endsWith('.bmp') || file.name.endsWith('.pdf') || file.name.endsWith('.JPG') || file.name.endsWith('.JPEG') ||
                  file.name.endsWith('.PNG') || file.name.endsWith('.GIF') || file.name.endsWith('.BMP') || file.name.endsWith('.PDF') ||
                  file.name.endsWith('.rar') || file.name.endsWith('.zip') || file.name.endsWith('.doc') || file.name.endsWith('.docx') ||
                  file.name.endsWith('.xls') || file.name.endsWith('.xlsx') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx'))
  const isLt = file.size / 1024 / 1024 < size;

  if (!isFile) {
    message.error('请上传 .jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PNG,.GIF,.BMP,.PDF,.rar,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx 格式的文件');
  }
  if (!isLt) {
    message.error('文件大小不能超过 ' + size + 'M');
  }
  return isFile && isLt
}

export function checkVideoFile(file, size, message){
  const isVedio = (file.name.endsWith('.mp4') || file.name.endsWith('.avi') || file.name.endsWith('.wmv') || file.name.endsWith('.rmvb') ||
                  file.name.endsWith('.flv') || file.name.endsWith('.mov') || file.name.endsWith('.m4v') || file.name.endsWith('.rm'))
  const isLt = file.size / 1024 / 1024 < size;

  if (!isVedio) {
    message.error('请上传 .mp4,.avi,.wmv,.rm,.rmvb,.flv,.mov,.m4v 格式的文件');
  }
  if (!isLt) {
    message.error('文件大小不能超过 ' + size + 'M');
  }
  return isVedio && isLt
}

export function checkExcelFile(file, size, message){
  const isExcel = file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
  const isLt = file.size / 1024 / 1024 < size;

  if (!isExcel) {
    message.error('请上传 .xls / .xlsx  格式的文件');
  }
  if (!isLt) {
    message.error('文件大小不能超过 ' + size + 'M');
  }
  return isExcel && isLt
}

export function downloadIamge(imgsrc, name) {
  var image = new Image()
  // 解决跨域 Canvas 污染问题
  image.onload = function() {
    var canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    var context = canvas.getContext("2d")
    context.drawImage(image, 0, 0, image.width, image.height)
    var url = canvas.toDataURL("image/png") //得到图片的base64编码数据
 
    var a = document.createElement("a") // 生成一个a元素
    var event = new MouseEvent("click") // 创建一个单击事件
    a.download = name || "photo" // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  };
  // image.setAttribute("crossOrigin", "Anonymous")
  image.crossOrigin = 'anonymous'
  image.src = imgsrc;
}

export function toast(msg, type = 'error', duration = 2000) {
  Message({
      message: msg,
      type: type,
      duration: duration
  })
}
