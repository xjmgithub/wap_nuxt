(function ($, window, undefined) {
    $.fn.DataLazyLoad = function (options) {
        var elements = $(this);
        var settings = {
            //Data Load Offset
            offset: 300,
            //Load data callback
            load: function () {
            },
            //Which page to load
            page: 2
        };
        var srcollWrapperDom = $(".leave-message-show-container");
        if (options) {
            $.extend(settings, options);
        }
        //The height of the browser window
        var winHeight = srcollWrapperDom.height();
        var locked = false;
        srcollWrapperDom.scroll(function () {
            // 被滚动的距离
            var scrollTop = srcollWrapperDom.scrollTop();
            var offset = $(elements).height() - (scrollTop + winHeight);
            // console.log(offset);
            if (offset < settings.offset && !locked) {
                locked = true;
                settings.page += 1;
                settings.load(settings.page, function (aa) {
                    locked = false;
                });
            }
        });
    }
})(jQuery, window);