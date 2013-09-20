var gk = (function(gk){

    function Circle(ptA, ptB){
        this.ptA = ptA;
        this.ptB = ptB;
    }
    
    Circle.displayName = "Circle";
    
    Circle.createPrimitive = function(mouse){
        return new Circle(new gk.Point(mouse.x, mouse.y), new gk.Point(mouse.x, mouse.y));
    }

    Circle.prototype = new gk.Drawable();
    
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
    
    Circle.prototype.tryToSnap = function(mouse, options){
        if(options.snapToEdges){
            if(Math.abs(this.ptA.distance(mouse)-this.radius) <= options.edgeSnapRadius){
                var angle = Math.atan2(mouse.y-this.ptA.y, mouse.x-this.ptA.x);
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                var radius = this.radius;
                return new gk.Point(this.ptA.x+cos*radius, this.ptA.y+sin*radius);
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

    gk.Circle = Circle;

    gk.registerPrimitive(Circle);

    return gk;
})(gk || {});
