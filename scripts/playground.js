'use strict';

(function (global) {
    $(function () {
        var id = null;
        var naka = $('#naka');
        var circle = $('.circle');


        circle.on('webkitAnimationStart', function () {
            console.log('start');
        });
        circle.on('webkitAnimationEnd', function () {
            console.log('end');
        });
        circle.on('webkitAnimationIteration', function () {
            console.log('iteration');
        });

        var start = function () {
            naka.removeClass('stop');
            naka.addClass('start');
            id = setTimeout(function () {
                naka.removeClass('start');
                naka.addClass('complete');
            }, 1750);
        };
        var complete = function () {
            naka.removeClass('start');
            naka.removeClass('complete');
            naka.addClass('stop');
            if (id !== null) clearTimeout(id);
        };
        circle.mouseenter(start);
        circle.mouseleave(complete);
        circle.on('touchstart', start);
        circle.on('touchend', complete);
    });
})(this);