var gk = (function(gk){

    var CIRCLE_SELECT_DISTANCE = 10;
    var CIRCLE_SELECT_DISTANCE_SQ = CIRCLE_SELECT_DISTANCE*CIRCLE_SELECT_DISTANCE;

    function Circle(ptA, ptB){
        this.ptA = ptA;
        this.ptB = ptB;
    }
    
    Circle.displayName = "Circle";
    Circle.CIRCLE_SELECT_DISTANCE = CIRCLE_SELECT_DISTANCE;
    Circle.CIRCLE_SELECT_DISTANCE_SQ = CIRCLE_SELECT_DISTANCE_SQ;
    
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

        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        ctx.arc(this.ptA.x, this.ptA.y, this.ptA.distance(this.ptB), 0, Math.PI*2);
        ctx.closePath();
        ctx.stroke();
        this.finishRender(options);   
    }
    
    Circle.prototype.tryToSelect = function(mouse, options){
        return Math.abs(this.ptA.distanceSquared(mouse)-this.radiusSquared) <= Circle_SELECT_DISTANCE_SQ;
    }
    
    Circle.prototype.tryToSnap = function(mouse, options){
        if(options.snapToEdges){
            if(Math.abs(this.ptA.distance(mouse)-this.radius) <= options.snapRadius){
                var angle = Math.atan2(mouse.y-this.ptA.y, mouse.x-this.ptA.x);
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                var radius = this.radius;
                return new gk.Point(this.ptA.x+cos*radius, this.ptA.y+sin*radius);
            }
        }
        return null;
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
