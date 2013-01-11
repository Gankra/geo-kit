var gk = (function(gk){

    function LineSegment(ptA, ptB){
        gk.Line.call(this, ptA, ptB);
    }

    LineSegment.prototype = new Line();

    LineSegment.prototype.draw = function(ctx){
        ctx.save();
        ctx.strokeStyle = this.getColor();
        ctx.beginPath();
        ctx.moveTo(this.ptA.x, this.ptA.y);
        ctx.lineTo(this.ptB.x, this.ptB.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();    
    }

    gk.LineSegment = LineSegment;

    return gk;
})(gk || {});