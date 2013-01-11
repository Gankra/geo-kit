var gk = (function(gk){

    var LINE_DRAW_LENGTH = 1000;

    function Line(ptA, ptB){
        this.ptA = ptA;
        this.ptB = ptB;
    }

    Line.prototype = new gk.Drawable();

    Line.prototype.getSlope = function(){
        return (this.ptB.y - this.ptA.y)/(this.ptB.x - this.ptA.x);
    }

    Line.prototype.getYIntercept = function(){
        return this.ptA.y - this.ptA.x*this.getSlope();
    }

    Line.prototype.getAngle = function(){
        return Math.atan2(this.ptA.y-this.ptB.y,this.ptA.x-this.ptB.x);
    }

    Line.prototype.draw = function(ctx){

        var angle = this.getAngle();
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        ctx.save();
        ctx.strokeStyle = this.getColor();
        ctx.beginPath();
        ctx.moveTo(this.ptA.x+cos*LINE_DRAW_LENGTH, this.ptA.y+sin*LINE_DRAW_LENGTH);
        ctx.lineTo(this.ptA.x-cos*LINE_DRAW_LENGTH, this.ptA.y-sin*LINE_DRAW_LENGTH);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();    
    }

    gk.Line = Line;

    return gk;
})(gk || {});