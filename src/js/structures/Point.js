var gk = (function(gk){

    var POINT_DRAW_RADIUS = 3;

    function Point(){
        this.coords = arguments;
    }
    
    Point.displayName = "Point";
    
    Point.createPrimitive = function(mouse){
        return new Point(mouse.x, mouse.y);
    }

    Point.prototype = new gk.Drawable();   
    
    Point.prototype.updateMouse = function(oldMouse, curMouse){
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
    
    Point.prototype.draw = function(options){
        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.strokeStyle = "none";
        ctx.beginPath();
        ctx.arc(this.x, this.y, POINT_DRAW_RADIUS, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        this.finishRender(options);
    }

    gk.Point = Point;
    
    gk.registerPrimitive(Point);

    return gk;
})(gk || {});
