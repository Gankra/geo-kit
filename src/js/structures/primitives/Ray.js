var gk = (function(gk, _){
    var Line = gk.Line;
    var Point = gk.Point;
    var utils = gk.utils;

    var RAY_DRAW_LENGTH = 1000;
    var RAY_SELECT_OPTIONS = {snapToPoints: true, snapToEdges:true};

    function Ray(ptA, ptB){
        Line.call(this, ptA, ptB);
    }
    
    Ray.displayName = "Ray";
    Ray.icon = "ray";
    
    Ray.createPrimitive = function(mouse){
        return new Ray(new Point(mouse.x, mouse.y), new Point(mouse.x, mouse.y));
    }

    Ray.prototype = new Line();
    
    Ray.prototype.tryToSelect = function(mouse, options){
        return !!this.tryToSnap(mouse, 
            _.defaults(RAY_SELECT_OPTIONS, {edgeSnapDistance: options.edgeSelectDistance, pointSnapDistance: options.pointSelectDistance}));
    }
    
    Ray.prototype.tryToSnap = function(mouse, options){
        var snap = this.ptA.tryToSnap(mouse, options);
        if(snap){
            return snap;
        }
        snap = Line.prototype.tryToSnap.call(this, mouse, options);
        if(snap){ 
            var result = true;
            if(Math.abs(this.slope)>1){
                if(this.ptA.y <= this.ptB.y){
                    result = result && this.ptA.y <= snap.y;
                }else{
                    result = result && this.ptA.y >= snap.y;
                } 
            }else{
                if(this.ptA.x < this.ptB.x){
                    result = result && this.ptA.x <= snap.x;
                }else{
                    result = result && this.ptA.x >= snap.x;
                } 
            }
            if(result){
                return snap;
            }
        }
        return null;
    }

    Ray.prototype.getEndPoints = function(){
        return [this.ptA];
    }

    Ray.prototype.hasProjection = function(pt){
        return Math.abs(utils.angleOf(this.ptB, this.ptA, pt))<=Math.PI/2; 
    }

    Ray.prototype.clone = function(deep){
        if(deep){
            return new Ray(this.ptA.clone(deep), this.ptB.clone(deep));
        }else{
            return new Ray(this.ptA, this.ptB);
        }
    }

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
        this.applyEdgeSelectionStyle(ctx, options);
        ctx.stroke();
        this.finishRender(options);   
    }

    gk.Ray = Ray;
    
    gk.registerPrimitive(Ray);
    
    return gk;
})(gk || {}, _);
