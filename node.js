function formatDate(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    m = m < 10 ? "0" + m : m;
  
    s = s < 10 ? "0" + s : s;
  
    /* if you want 2 digit hours:
    h = h<10?"0"+h:h; */
  
    var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
  
    var replacement = h + ":" + m;
    /* if you want to add seconds
    replacement += ":"+s;  */
    replacement += " " + dd;
  
    return date.replace(pattern, replacement);
  }
  function convertTime24to12(time24){
    var tmpArr = time24.split(':'), time12;
    if(+tmpArr[0] == 12) {
    time12 = tmpArr[0] + ':' + tmpArr[1] + ' pm';
    } else {
    if(+tmpArr[0] == .00) {
    time12 = '12:' + tmpArr[1] + ' am';
    } else {
    if(+tmpArr[0] > 12) {
    time12 = (+tmpArr[0]-12) + ':' + tmpArr[1] + ' pm';
    } else {
    time12 = (+tmpArr[0]) + ':' + tmpArr[1] + ' am';
    }
    }
    }
    return time12;
    }
console.log(convertTime24to12('22:03:34'))
