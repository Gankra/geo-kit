var gk = (function(gk){

    var LINE_DRAW_LENGTH = 1000;
    var LINE_SELECT_DISTANCE = 10;
    var LINE_SELECT_DISTANCE_SQ = LINE_SELECT_DISTANCE*LINE_SELECT_DISTANCE;

    function Line(ptA, ptB){
        this.ptA = ptA;
        this.ptB = ptB;
    }
    
    Line.displayName = "Line";
    Line.LINE_SELECT_DISTANCE = LINE_SELECT_DISTANCE;
    Line.LINE_SELECT_DISTANCE_SQ = LINE_SELECT_DISTANCE_SQ;
    
    Line.createPrimitive = function(mouse){
        return new Line(new gk.Point(mouse.x, mouse.y), new gk.Point(mouse.x, mouse.y));
    }

    Line.prototype = new gk.Drawable();
    
    Line.prototype.updateMousePrimitive = function(oldMouse, curMouse){
        this.ptB.updateMousePrimitive(oldMouse, curMouse);
    }
    
    Line.prototype.updateMouse = function(oldMouse, curMouse){
        this.ptA.updateMouse(oldMouse, curMouse);
        this.ptB.updateMouse(oldMouse, curMouse);
    }

    Line.prototype.__defineGetter__("slope", function(){
        return (this.ptB.y - this.ptA.y)/(this.ptB.x - this.ptA.x);
    });

    Line.prototype.__defineGetter__("yIntercept", function(){
        return this.ptA.y - this.ptA.x*this.slope;
    });

    Line.prototype.__defineGetter__("angle", function(){
        return Math.atan2(this.ptA.y-this.ptB.y,this.ptA.x-this.ptB.x);
    });

    Line.prototype.draw = function(options){
        var angle = this.angle;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        this.startRender(options);
        var ctx = this.getContext(options);
        ctx.beginPath();
        ctx.moveTo(this.ptA.x+cos*LINE_DRAW_LENGTH, this.ptA.y+sin*LINE_DRAW_LENGTH);
        ctx.lineTo(this.ptA.x-cos*LINE_DRAW_LENGTH, this.ptA.y-sin*LINE_DRAW_LENGTH);
        ctx.closePath();
        ctx.stroke();
        this.finishRender(options);   
    }
    
    Line.prototype.tryToSelect = function(mouse, options){
        return this.projectedDistanceSquared(mouse) <= LINE_SELECT_DISTANCE_SQ;
    }
    
    Line.prototype.tryToSnap = function(mouse, options){
        if(options.snapToEdges){
            var projection = this.projection(mouse);
            if(projection.distanceSquared(mouse) <= options.snapRadius*options.snapRadius){
                return projection;
            }
        }
        return null;
    }
    
    Line.prototype.projection = function(pt){
        //Honestly, I don't fully understand this code anymore, but it works
        var px = pt.x-this.ptA.x;
		var py = pt.y-this.ptA.y;
		var dx = (this.ptA.x-this.ptB.x);
		var dy = (this.ptA.y-this.ptB.y);
        if(dx == 0 && dy == 0){
            dx = 1;
        }
		var len = Math.sqrt(dx*dx+dy*dy);
		dx/=len;
		dy/=len;
	
		var projScale = px*dx+py*dy;
		return new gk.Point(dx*projScale+this.ptA.x, dy*projScale+this.ptA.y);
    }
    
    Line.prototype.projectedDistanceSquared = function(pt){
        return this.projection(pt).distanceSquared(pt);
    }
    
    Line.prototype.projectedDistance = function(pt){
        return Math.sqrt(this.projectedDistanceSquared(pt));    
    }

    gk.Line = Line;

    gk.registerPrimitive(Line);

    return gk;
})(gk || {});
