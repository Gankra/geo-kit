var gk = (function(gk){

    var DEFAULT_COLOR = "#000000";

    function Drawable(color){
        this.color = color;
    }

    Drawable.prototype.getColor = function(){
        return this.color || DEFAULT_COLOR;
    }

    Drawable.prototype.setColor = function(color){
        this.color = color;
    }

    Drawable.prototype.getContext = function(options){
        return options.ctx;
    }

    Drawable.prototype.startRender = function(options){
        var ctx = this.getContext(options);
        ctx.save();
        ctx.fillStyle = this.getColor();
        ctx.strokeStyle = this.getColor();
    }

    Drawable.prototype.finishRender = function(options){
        var ctx = this.getContext(options);
        ctx.restore();
    }

    Drawable.prototype.draw = function(options){
        throw "Unimplemented method: Drawable.draw";
    }

    
    gk.Drawable = Drawable;

    return gk;
})(gk || {});