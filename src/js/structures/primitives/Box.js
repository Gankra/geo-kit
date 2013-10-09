var gk = (function(gk){
    var Point = gk.Point;
    var Edge = gk.LineSegment;
    var Drawable = gk.Drawable;

    function Box(ptA, ptB){
        this.ptA = ptA;
        this.ptB = ptB;
    }
    
    Box.displayName = "Box";
    Box.icon = "box";
    
    Box.createPrimitive = function(mouse){
        return new Box(new Point(mouse.x, mouse.y), new Point(mouse.x, mouse.y));
    }

    Box.prototype = new Drawable();
    
    Box.prototype.updateMousePrimitive = function(oldMouse, curMouse){
        this.ptB.updateMousePrimitive(oldMouse, curMouse);
        this.invalidate();
    }
    
    Box.prototype.updateMouse = function(oldMouse, curMouse){
        this.ptA.updateMouse(oldMouse, curMouse);
        this.ptB.updateMouse(oldMouse, curMouse);
        this.invalidate();
    }

    Box.prototype.draw = function(options){
        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        var pts = this.points;
        var pt = pts[pts.length-1];
        ctx.moveTo(pt.x, pt.y);
        for(var i=0; i<pts.length; ++i){
            var pt = pts[i];
            ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        this.applyEdgeSelectionStyle(ctx, options);
        ctx.stroke();
        this.finishRender(options);   

    }
    
    Box.prototype.tryToSelect = function(mouse, options){
        var result;
        var edges = this.edges;
        for(var i=0; i<edges.length; ++i){
            result = edges[i].tryToSelect(mouse, options);
            if(result){
                return result;
            }
        }
        return false;
    }

    Box.prototype.tryToSelectFromBox = function(box, options){ 
        return this.minX <= box.maxX && this.maxX >= box.minX 
            && this.minY <= box.maxY && this.maxY >= box.minY;
    }

    Box.prototype.tryToSnap = function(mouse, options){
        if(options.snapToPoints){
            var points = this.points;
            for(var i=0; i<points.length; ++i){
                var result = points[i].tryToSnap(mouse, options);
                if(result){
                    return result;
                }
            }    
        }
        if(options.snapToEdges){
            var edges = this.edges;
            for(var i=0; i<edges.length; ++i){
                var result = edges[i].tryToSnap(mouse, options);
                if(result){
                    return result;
                }
            }
        }
        return null;
    }

    Box.prototype.clone = function(deep){
        if(deep){
            return new Box(ptA.clone(deep), ptB.clone(deep));
        }else{
            return new Box(ptA, ptB);
        }
    }

    Box.prototype.invalidate = function(){
        delete this._edges;
        delete this._points;
    }
    
    Box.prototype.__defineGetter__("edges", function(){
        if(!this._edges){
            this._edges = [];
            var pts = this.points;
            for(var i=0; i<pts.length-1; ++i){
                this._edges.push(new Edge(pts[i], pts[i+1]));
            }
            this._edges.push(new Edge(pts[pts.length-1], pts[0]));
        }
        return this._edges;
    });
    
    Box.prototype.__defineGetter__("points", function(){
        if(!this._points){
            this._points = [
                new Point(this.minX, this.minY)
              , new Point(this.minX, this.maxY)
              , new Point(this.maxX, this.maxY)
              , new Point(this.maxX, this.minY)
            ];
        }
        return this._points;
    });

    Box.prototype.__defineGetter__("minX", function(){
        return Math.min(this.ptA.x, this.ptB.x);
    });

    Box.prototype.__defineGetter__("maxX", function(){
        return Math.max(this.ptA.x, this.ptB.x);
    });

    Box.prototype.__defineGetter__("minY", function(){
        return Math.min(this.ptA.y, this.ptB.y);
    });

    Box.prototype.__defineGetter__("maxY", function(){
        return Math.max(this.ptA.y, this.ptB.y);
    });

    Box.prototype.__defineGetter__("hashCode", function(){
        return this.minX+","+this.minY+","+this.maxX+","+this.maxY;
    });

    Box.prototype.serialize = function(){
        var result = Drawable.prototype.serialize.call(this);
        result.type = Box.displayName;
        result.ptA = this.ptA.serialize();
        result.ptB = this.ptB.serialize();
        return result;
    };

    gk.serialization.registerDeserializer(Box.displayName, function(obj){
        var result = new Box();
        result.ptA = gk.serialization.deserialize(obj.ptA);
        result.ptB = gk.serialization.deserialize(obj.ptB);
        Drawable.prototype._deserialize.call(this);
        return result;
    });

    gk.Box = Box;

    gk.registerPrimitive(Box);

    return gk;
})(gk || {});
