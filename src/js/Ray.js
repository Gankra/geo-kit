var gk = (function(gk){

    var RAY_DRAW_LENGTH = 1000;

    function Ray(ptA, ptB){
        gk.Line.call(this, ptA, ptB);
    }
    
    Ray.displayName = "Ray";
    
    Ray.createPrimitive = function(mouse){
        return new Ray(new gk.Point(mouse.x, mouse.y), new gk.Point(mouse.x, mouse.y));
    }

    Ray.prototype = new gk.Line();

    Ray.prototype.draw = function(options){
        var angle = this.angle;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        ctx.moveTo(this.ptA.x, this.ptA.y);
        ctx.lineTo(this.ptA.x-cos*RAY_DRAW_LENGTH, this.ptA.y-sin*RAY_DRAW_LENGTH);
        ctx.closePath();
        ctx.stroke();
        this.finishRender(options);   
    }

    gk.Ray = Ray;
    
    gk.registerPrimitive(Ray);
    
    return gk;
})(gk || {});
