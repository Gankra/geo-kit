var gk = (function(gk){

    var RAY_DRAW_LENGTH = 1000;
    var RAY_SELECT_OPTIONS = {snapToPoints: true, snapToEdges:true, snapRadius:gk.Line.LINE_SELECT_DISTANCE};

    function Ray(ptA, ptB){
        gk.Line.call(this, ptA, ptB);
    }
    
    Ray.displayName = "Ray";
    
    Ray.createPrimitive = function(mouse){
        return new Ray(new gk.Point(mouse.x, mouse.y), new gk.Point(mouse.x, mouse.y));
    }

    Ray.prototype = new gk.Line();
    
    Ray.prototype.tryToSelect = function(mouse, options){
        return !!tryToSnap(mouse, RAY_SELECT_OPTIONS);
    }
    
    Ray.prototype.tryToSnap = function(mouse, options){
        var snap = this.ptA.tryToSnap(mouse, options);
        if(snap){
            return snap;
        }
        snap = gk.Line.prototype.tryToSnap.call(this, mouse, options);
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
