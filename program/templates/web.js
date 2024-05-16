window.onload = function() {
    var iframe1 = document.getElementById('filePreview1');
    var iframe2 = document.getElementById('filePreview2');

    // 监听iframe1的滚动事件
    iframe1.contentWindow.addEventListener('scroll', function() {
        // 获取iframe1的滚动位置
        var scrollTop = iframe1.contentWindow.document.documentElement.scrollTop || iframe1.contentWindow.document.body.scrollTop;
        // 设置iframe2的滚动位置与iframe1相同
        iframe2.contentWindow.document.documentElement.scrollTop = scrollTop;
        iframe2.contentWindow.document.body.scrollTop = scrollTop;
    });

    // 如果你也想从iframe2同步到iframe1，你可以再添加一个类似的监听器
};

var iframes = document.getElementsByTagName("iframe");

// 为每个iframe添加滚动事件监听器
for (var i = 0; i < iframes.length; i++) {
  iframes[i].contentWindow.onscroll = synchronizeScroll;
}

function synchronizeScroll() {
  var scrollTop = this.pageYOffset || this.scrollTop;
  var iframes = document.getElementsByTagName("iframe");

  // 同步其他所有iframe的滚动位置
  for (var i = 0; i < iframes.length; i++) {
    if (iframes[i].contentWindow !== this) {
      iframes[i].contentWindow.scrollTo(0, scrollTop);
    }
  }
}