var gk = (function(gk){
    
    var LINE_SEGMENT_SELECT_OPTIONS = {snapToPoints: true, snapToEdges:true, snapRadius:gk.Line.LINE_SELECT_DISTANCE};
    
    function LineSegment(ptA, ptB){
        gk.Line.call(this, ptA, ptB);
    }
    
    LineSegment.displayName = "Line Segment";
    
    LineSegment.createPrimitive = function(mouse){
        return new LineSegment(new gk.Point(mouse.x, mouse.y), new gk.Point(mouse.x, mouse.y));
    }

    LineSegment.prototype = new gk.Line();
    
    LineSegment.prototype.tryToSelect = function(mouse, options){
        return !!this.tryToSnap(mouse, LINE_SEGMENT_SELECT_OPTIONS);
    }
    
    LineSegment.prototype.tryToSnap = function(mouse, options){
        var snap = this.ptA.tryToSnap(mouse, options) || this.ptB.tryToSnap(mouse, options);
        if(snap){
            return snap;
        }
        snap = gk.Line.prototype.tryToSnap.call(this, mouse, options);
        if(snap){
            var minX = Math.min(this.ptA.x, this.ptB.x);
            var minY = Math.min(this.ptA.y, this.ptB.y);
            var maxX = Math.max(this.ptA.x, this.ptB.x);
            var maxY = Math.max(this.ptA.y, this.ptB.y); 
            if(Math.abs(this.slope)<1){
                if(snap.x>=minX && snap.x<=maxX){
                    return snap;
                }
            }else{
                if(snap.y>=minY && snap.y<=maxY){
				    return snap;
			    }
			} 
        }
        return null;
    }

    LineSegment.prototype.draw = function(options){
        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        ctx.moveTo(this.ptA.x, this.ptA.y);
        ctx.lineTo(this.ptB.x, this.ptB.y);
        ctx.closePath();
        this.applySelectionStyle(ctx);
        ctx.lineWidth = 2;
        ctx.stroke();
        this.finishRender(options);   
    }

    gk.LineSegment = LineSegment;
    
    gk.registerPrimitive(LineSegment);
    
    return gk;
})(gk || {});
