var gk = (function(gk, _){
    var Point = gk.Point;
    var Line = gk.Line;
    var utils = gk.utils;
    
    var LINE_SEGMENT_SELECT_OPTIONS = {snapToPoints: true, snapToEdges:true};
    
    function LineSegment(ptA, ptB){
        Line.call(this, ptA, ptB);
    }
    
    LineSegment.displayName = "Line Segment";
    LineSegment.icon = "edge";
    
    LineSegment.createPrimitive = function(mouse){
        return new LineSegment(new Point(mouse.x, mouse.y), new Point(mouse.x, mouse.y));
    }

    LineSegment.prototype = new Line();
    
    LineSegment.prototype.tryToSelect = function(mouse, options){
        return !!this.tryToSnap(mouse, 
            _.defaults(LINE_SEGMENT_SELECT_OPTIONS, {edgeSnapDistance: options.edgeSelectDistance, pointSnapDistance: options.pointSelectDistance}));
    }
    
    LineSegment.prototype.tryToSnap = function(mouse, options){
        var snap = this.ptA.tryToSnap(mouse, options) || this.ptB.tryToSnap(mouse, options);
        if(snap){
            return snap;
        }
        snap = Line.prototype.tryToSnap.call(this, mouse, options);
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
        return [this.ptA, this.ptB];
    }

    LineSegment.prototype.clone = function(deep){
        if(deep){
            return new LineSegment(this.ptA.clone(deep), this.ptB.clone(deep));
        }else{
            return new LineSegment(this.ptA, this.ptB);
        }
    }

    LineSegment.prototype.hasProjection = function(pt){
        return Math.abs(utils.angleOf(this.ptB, this.ptA, pt))<=Math.PI/2
            && Math.abs(utils.angleOf(this.ptA, this.ptB, pt))<=Math.PI/2; 
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

    LineSegment.prototype.__defineGetter__("length", function(){
        return this.ptA.distance(this.ptB);
    });

    gk.LineSegment = LineSegment;
    
    gk.registerPrimitive(LineSegment);
    
    return gk;
})(gk || {}, _);
