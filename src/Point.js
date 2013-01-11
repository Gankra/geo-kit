var gk = (function(gk){

    var POINT_DRAW_RADIUS = 3;

    function Point(x, y){
        this.x = x;
        this.y = y;
    }

    Point.prototype = new gk.Drawable();

    Point.prototype.draw = function(ctx){
        ctx.save();
        ctx.fillStyle = this.getColor(ctx);
        ctx.strokeStyle = "none";
        ctx.beginPath();
        canvas.arc(this.x, this.y, POINT_DRAW_RADIUS, 0, Math.PI*2, true);
        canvas.closePath();
        canvas.fill();
        canvas.restore();
    }

    gk.Point = Point;

    return gk;
})(gk || {});