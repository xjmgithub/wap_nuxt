/* 
强依赖  jQuery 1.7+
*/

/* 
 opt 参数
    data  Object 传输的数据主体  
    type  String  'GET/POST'
    dataType  String  'json'
    url   String  '微服务接口地址'
    success Function   成功回调
    error   Function   失败回掉
*/
var mAjax = new MAJAX();
function MAJAX() {
  var _this = this;
  return function(url, token, opt) {
    var mockData = _this.mock(url, token, opt);
    if (mockData && mockData.status && mockData.data) {
      if (mockData.status == 200) {
        opt.success(mockData.data);
      } else {
        opt.error(mockData.data);
      }
    } else {
      _this.real(url, token, opt);
    }
  };
}
MAJAX.prototype.real = function(url, token, opt) {
  if (!url) return false;
  var host = location.origin;
  var path = location.pathname;
  var timer = new Date().getTime();
  if (path.indexOf("/wap") == 0) {
    host += "/wap";
  }

  var headers = opt.headers || {};
  headers.url = url;
  headers.token = token || "";

  $.ajax({
    url: host + "/lib/cross.php?t=" + timer,
    type: opt.type || "GET",
    dataType: opt.dataType || "json",
    data: opt.data || {},
    headers: headers,
    contentType: opt.contentType || "application/json;",
    timeout: opt.timeout || 20000,
    success: function(data) {
      if (opt.success) opt.success(data);
    },
    error: function(err) {
      if (opt.error) opt.error(err);
    },
    complete: function(XMLHttpRequest, status) {
      if (opt.complete) opt.complete(XMLHttpRequest, status);
    }
  });
};
MAJAX.prototype.mock = function(url, token, opt) {
  return null;
};

// analaysis
function analysisSendEvent(params) {
  // countly
  Countly.q.push([
    "add_event",
    {
      key: "GAEvent",
      count: 1,
      sum: 0,
      segmentation: params
    }
  ]);

  // ga
  params = $.extend(
    {
      hitType: "event",
      eventValue: "1"
    },
    params
  );
  ga("send", {
    hitType: params.hitType,
    eventCategory: params.category,
    eventAction: params.action,
    eventLabel: params.label,
    eventValue: params.eventValue
  });
}

function getCookie(Name) {
  var search = Name + "=";
  if (document.cookie.length > 0) {
    offset = document.cookie.indexOf(search);
    if (offset != -1) {
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1) end = document.cookie.length;
      return unescape(document.cookie.substring(offset, end));
    } else return "";
  }
}

function setCookie(name, value, end, path, domain, secure) {
  if (!name) {
    return false;
  }
  var expires = "";
  if (end) {
    switch (end.constructor) {
      case Number:
        expires =
          end === Infinity
            ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
            : "; max-age=" + end;
        break;
      case String:
        expires = "; expires=" + end;
        break;
      case Date:
        expires = "; expires=" + end.toUTCString();
        break;
    }
  }
  document.cookie =
    encodeURIComponent(name) +
    "=" +
    encodeURIComponent(value) +
    expires +
    (domain ? "; domain=" + domain : "") +
    (path ? "; path=" + path : "") +
    (secure ? "; secure" : "");
  return true;
}

function malert(text, btn, callback) {
  if (!text) return false;
  btn = btn || "OK";
  var html =
    '<div class="swal-overlay">\
        <div class="swal-modal">\
            <div class="swal-text">' +
    text +
    '</div>\
            <div class="swal-footer">\
                <div class="swal-button-container">\
                    <div class="swal-button new-btn">' +
    btn +
    "</div>\
                </div>\
            </div>\
        </div>\
    </div>";

  $("body")
    .find(".swal-overlay")
    .remove()
    .end()
    .append(html);
  $(".swal-overlay")
    .off("click")
    .on("click", function() {
      $(".swal-overlay").remove();
      if (callback) callback();
    });
}

function mconfirm(text, cancelbtn, surebtn, callback, cancel) {
  if (!text) return false;
  btn1 = cancelbtn || "Cancel";
  btn2 = surebtn || "Ok";
  var html =
    '<div class="swal-overlay">\
        <div class="swal-modal">\
            <div class="swal-text">' +
    text +
    '</div>\
            <div class="swal-footer">\
                <div class="swal-button-container" style="width:90%">\
                    <div class="swal-button new-btn cancel" style="width:45%;float:left; padding:10px 0">' +
    btn1 +
    '</div>\
                    <div class="swal-button new-btn ok" style="width:45%;float:right;padding:10px 0">' +
    btn2 +
    "</div>\
                </div>\
            </div>\
        </div>\
    </div>";

  $("body")
    .find(".swal-overlay")
    .remove()
    .end()
    .append(html);
  $(".swal-overlay")
    .off("click")
    .on("click", '.ok', function() {
      $(".swal-overlay").remove();
      if (callback) callback();
    })
    .on("click", '.cancel', function() {
        $(".swal-overlay").remove();
    });
}
