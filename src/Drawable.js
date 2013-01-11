var gk = (function(gk){

    var DEFAULT_COLOR = "#000000";

    function Drawable(color){
        this.color = color;
    }

    Drawable.prototype.getColor(ctx){
        return this.color || (ctx ? ctx.strokeStyle : DEFAULT_COLOR);
    }

    Drawable.prototype.draw(ctx){
        throw "Unimplemented method: Drawable.draw";
    }

    
    gk.Drawable = Drawable;

    return gk;
})(gk || {});