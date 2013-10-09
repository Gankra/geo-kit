var gk = (function(gk){
    var Point = gk.Point;
    var Drawable = gk.Drawable;

    function Circle(ptA, ptB){
        this.ptA = ptA;
        this.ptB = ptB;
    }
    
    Circle.displayName = "Circle";
    Circle.icon = "circle";
    
    Circle.createPrimitive = function(mouse){
        return new Circle(new Point(mouse.x, mouse.y), new Point(mouse.x, mouse.y));
    }

    Circle.prototype = new Drawable();
    
    Circle.prototype.updateMousePrimitive = function(oldMouse, curMouse){
        this.ptB.updateMousePrimitive(oldMouse, curMouse);
    }
    
    Circle.prototype.updateMouse = function(oldMouse, curMouse){
        this.ptA.updateMouse(oldMouse, curMouse);
        this.ptB.updateMouse(oldMouse, curMouse);
    }

    Circle.prototype.draw = function(options){
        var angle = this.angle;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var selected = gk.isSelected(this);
        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        ctx.arc(this.ptA.x, this.ptA.y, this.ptA.distance(this.ptB), 0, Math.PI*2);
        ctx.closePath();
        this.applyEdgeSelectionStyle(ctx, options);
        ctx.stroke();
        this.finishRender(options);   
    }
    
    Circle.prototype.tryToSelect = function(mouse, options){
        return Math.abs(this.ptA.distanceSquared(mouse)-this.radiusSquared) <= options.edgeSelectDistance*options.edgeSelectDistance;
    }

    Circle.prototype.tryToSelectFromBox = function(box, options){ 
        //TODO: make this smarter?   
        if(this.ptA.tryToSelectFromBox(box, options)){
            return true;
        }
        return false;
    }
    Circle.prototype.tryToSnap = function(mouse, options){
        if(options.snapToEdges){
            if(Math.abs(this.ptA.distance(mouse)-this.radius) <= options.edgeSnapRadius){
                var angle = Math.atan2(mouse.y-this.ptA.y, mouse.x-this.ptA.x);
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                var radius = this.radius;
                return new Point(this.ptA.x+cos*radius, this.ptA.y+sin*radius);
            }
        }
        return null;
    }

    Circle.prototype.clone = function(deep){
        if(deep){
            return new Circle(ptA.clone(deep), ptB.clone(deep));
        }else{
            return new Circle(ptA, ptB);
        }
    }
    
    Circle.prototype.__defineGetter__("radius", function(){
        return this.ptA.distance(this.ptB);    
    });
    
    Circle.prototype.__defineGetter__("radiusSquared", function(){
        return this.ptA.distanceSquared(this.ptB);
    });

    Circle.prototype.__defineGetter__("hashCode", function(){
        return this.ptA.hashCode+";"+this.radius;
    });

    Circle.prototype.serialize = function(){
        var result = Drawable.prototype.serialize.call(this);
        result.type = Circle.displayName;
        result.ptA = this.ptA.serialize();
        result.ptB = this.ptB.serialize();
        return result;
    };

    gk.serialization.registerDeserializer(Circle.displayName, function(obj){
        var result = new Circle();
        result.ptA = gk.serialization.deserialize(obj.ptA);
        result.ptB = gk.serialization.deserialize(obj.ptB);
        Drawable.prototype._deserialize.call(this);
        return result;
    });

    gk.Circle = Circle;

    gk.registerPrimitive(Circle);

    return gk;
})(gk || {});
