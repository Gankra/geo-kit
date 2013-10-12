var gk = (function(gk){
    var Drawable = gk.Drawable;

    function Point(){
        this.coords = arguments;
    }
    
    Point.displayName = "Point";
    Point.icon = "point";
    
    Point.createPrimitive = function(mouse){
        return new Point(mouse.x, mouse.y);
    }

    Point.prototype = new Drawable();   
    
    Point.prototype.updateMouse = Point.prototype.updateMousePrimitive = function(oldMouse, curMouse){
        this.x += curMouse.x-oldMouse.x;
        this.y += curMouse.y-oldMouse.y;
    }
    
    Point.prototype.__defineGetter__("x", function(){
        return this.coords[0];
    });
    
    Point.prototype.__defineGetter__("y", function(){
        return this.coords[1];
    });
    
    Point.prototype.__defineGetter__("z", function(){
        return this.coords[2];
    });
    
    Point.prototype.__defineGetter__("w", function(){
        return this.coords[3];
    });
    
    Point.prototype.__defineSetter__("x", function(val){
        this.coords[0] = val;
    });
    
    Point.prototype.__defineSetter__("y", function(val){
        this.coords[1] = val;
    });
    
    Point.prototype.__defineSetter__("z", function(val){
        this.coords[2] = val;
    });
    
    Point.prototype.__defineSetter__("w", function(val){
        this.coords[3] = val;
    });
    
    Point.prototype.distanceSquared = function(pt){
        var distSq = 0;
        for(var i=0; i<this.coords.length; ++i){
            var delta = this.coords[i] - pt.coords[i];
            distSq += delta*delta;    
        }
        return distSq;
    }
    
    Point.prototype.distance = function(pt){
        return Math.sqrt(this.distanceSquared(pt));
    }
    
    Point.prototype.draw = function(options){
        this.startRender(options);
        var ctx = this.getContext(options);
        var selected = gk.isSelected(this);
        if(selected){
            ctx.strokeStyle = options.highlightColor;
            ctx.lineWidth = options.highlightRadius;
        }else{
            ctx.strokeStyle = "none";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, options.pointRadius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        if(selected){
            ctx.stroke();
        }
        this.finishRender(options);
    }
    
    Point.prototype.tryToSelect = function(mouse, options){
        return this.distanceSquared(mouse) <= options.pointSelectDistance*options.pointSelectDistance;
    }

    Point.prototype.tryToSelectFromBox = function(box, options){
        return this.x >= box.minX && this.x <= box.maxX
            && this.y >= box.minY && this.y <= box.maxY;
    }
    
    Point.prototype.tryToSnap = function(mouse, options){
        if(options.snapToPoints && this.distanceSquared(mouse) <= options.pointSnapDistance*options.pointSnapDistance){
            return this;
        }
        return null;
    }

    Point.prototype.clone = function(deep){
        return new Point(this.x, this.y);
    }

    Point.prototype.__defineGetter__("hashCode", function(){
        return this.x+","+this.y;
    });

    Point.prototype.serialize = function(){
        var result = Drawable.prototype.serialize.call(this);
        result.type = Point.displayName;
        result.coords = this.coords;
        return result;
    };

    gk.serialization.registerDeserializer(Point.displayName, function(obj){
        var result = new Point();
        result.coords = obj.coords;
        result._deserialize(obj);
        return result;
    });
    
    gk.Point = Point;
    
    gk.registerPrimitive(Point);

    return gk;
})(gk || {});
