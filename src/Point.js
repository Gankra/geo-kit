var gk = (function(gk){

    var POINT_DRAW_RADIUS = 3;

    function Point(x, y){
        this.x = x;
        this.y = y;
    }

    Point.prototype = new gk.Drawable();

    Point.prototype.draw = function(options){
        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.strokeStyle = "none";
        ctx.beginPath();
        ctx.arc(this.x, this.y, POINT_DRAW_RADIUS, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        this.finishRender(options);
    }

    gk.Point = Point;

    return gk;
})(gk || {});