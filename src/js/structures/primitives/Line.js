var gk = (function(gk){

    var LINE_DRAW_LENGTH = 1000;

    function Line(ptA, ptB){
        this.ptA = ptA;
        this.ptB = ptB;
    }
    
    Line.displayName = "Line";
    
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
        this.applyEdgeSelectionStyle(ctx, options);
        ctx.stroke();
        this.finishRender(options);   
    }
    
    Line.prototype.tryToSelect = function(mouse, options){
        return this.projectedDistanceSquared(mouse) <= options.edgeSelectDistance*options.edgeSelectDistance;
    }
    
    Line.prototype.tryToSnap = function(mouse, options){
        if(options.snapToEdges){
            var projection = this.projection(mouse);
            if(projection.distanceSquared(mouse) <= options.edgeSnapDistance*options.edgeSnapDistance){
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

    Line.prototype.getEndPoints = function(){
        return [];
    }

    Line.prototype.clone = function(deep){
        if(deep){
            return new Line(ptA.clone(deep), ptB.clone(deep));
        }else{
            return new Line(ptA, ptB);
        }
    }

    Line.prototype.intersection = function(line){
        var thisDiffX = this.ptA.x - this.ptB.x;
        var thatDiffX = line.ptA.x - line.ptB.x;
        var thisDiffY = this.ptA.y - this.ptB.y;
        var thatDiffY = line.ptA.y - line.ptB.y;
        var denominator = thisDiffX*thatDiffY - thisDiffY*thatDiffX;
        var thisCross = this.ptA.x*this.ptB.y - this.ptA.y*this.ptB.x; 
        var thatCross = line.ptA.x*line.ptB.y - line.ptA.y*line.ptB.x;
        return new Point(
            (thisCross*thatDiffX - thatCross*thisDiffX)/denominator
          , (thisCross*thatDiffY - thatCross*thisDiffY)/denominator
        );
    }

    Line.prototype.isInBounds = function(pt){
        return true;
    }

    gk.Line = Line;

    gk.registerPrimitive(Line);

    return gk;
})(gk || {});
