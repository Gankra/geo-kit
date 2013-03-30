var gk = (function(gk){

    function LineSegment(ptA, ptB){
        gk.Line.call(this, ptA, ptB);
    }

    LineSegment.prototype = new gk.Line();

    LineSegment.prototype.draw = function(options){
        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        ctx.moveTo(this.ptA.x, this.ptA.y);
        ctx.lineTo(this.ptB.x, this.ptB.y);
        ctx.closePath();
        ctx.stroke();
        this.finishRender(options);   
    }

    gk.LineSegment = LineSegment;

    return gk;
})(gk || {});