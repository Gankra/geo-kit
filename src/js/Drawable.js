var gk = (function(gk){

    var DEFAULT_COLOR = "#000000";

    //Constructor//////////////////////////////////////////////////////
    function Drawable(){ }
    
    Drawable.prototype = new gk.Eventable();

    //Instance Methods/////////////////////////////////////////////////
    Drawable.prototype.startRender = function(options){
        var ctx = getContext(options);
        ctx.save();
        ctx.fillStyle = getColor(options);
        ctx.strokeStyle = getColor(options);
    }

    Drawable.prototype.finishRender = function(options){
        var ctx = this.getContext(options);
        ctx.restore();
    }
    
    Drawable.prototype.getContext = function(options){
        return options.ctx;
    }

    Drawable.prototype.draw = function(options){
        throw "Unimplemented abstract method: Drawable.draw";
    }
    
    //Utility methods//////////////////////////////////////////////////
    function getColor(options){
        return options.color || DEFAULT_COLOR;    
    }
    
    gk.Drawable = Drawable;

    return gk;
})(gk || {});
