var gk = (function($, gk){
    
    $(function(){
        var canvas = document.getElementById("gk-main-canvas");
        var ctx = canvas.getContext("2d");
        
        gk.canvases = [canvas];
        gk.contexts = [ctx];
    });

    return gk;
})($, gk || {});
