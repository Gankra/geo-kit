var gk = (function(gk, _){
    
    var LINE_SEGMENT_SELECT_OPTIONS = {snapToPoints: true, snapToEdges:true};
    
    function LineSegment(ptA, ptB){
        gk.Line.call(this, ptA, ptB);
    }
    
    LineSegment.displayName = "Line Segment";
    
    LineSegment.createPrimitive = function(mouse){
        return new LineSegment(new gk.Point(mouse.x, mouse.y), new gk.Point(mouse.x, mouse.y));
    }

    LineSegment.prototype = new gk.Line();
    
    LineSegment.prototype.tryToSelect = function(mouse, options){
        return !!this.tryToSnap(mouse, 
            _.defaults(RAY_SELECT_OPTIONS, {edgeSnapDistance: options.edgeSelectDistance, pointSnapDistance: options.pointSelectDistance}));
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

    LineSegment.prototype.getEndPoints = function(){
        return [ptA, ptB];
    }

    LineSegment.prototype.clone = function(deep){
        if(deep){
            return new LineSegment(ptA.clone(deep), ptB.clone(deep));
        }else{
            return new LineSegment(ptA, ptB);
        }
    }

    LineSegment.prototype.hasProjection = function(pt){
        return Math.abs(gk.utils.angleOf(ptB, ptA, pt))<=Math.PI/2
            && Math.abs(gk.utils.angleOf(ptA, ptB, pt))<=Math.PI/2; 
    }

    LineSegment.prototype.draw = function(options){
        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        ctx.moveTo(this.ptA.x, this.ptA.y);
        ctx.lineTo(this.ptB.x, this.ptB.y);
        ctx.closePath();
        this.applyEdgeSelectionStyle(ctx, options);
        ctx.stroke();
        this.finishRender(options);   
    }

    gk.LineSegment = LineSegment;
    
    gk.registerPrimitive(LineSegment);
    
    return gk;
})(gk || {}, _);
