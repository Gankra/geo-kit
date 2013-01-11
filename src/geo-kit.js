var gk = (function($){
    var gk = {};
    $(function(){
        var canvas = document.getElementById("gk-main-canvas");
        var ctx = canvas.getContext("2d");
        gk.canvas = canvas;
        gk.ctx = ctx;
    });

    return gk;
})($);