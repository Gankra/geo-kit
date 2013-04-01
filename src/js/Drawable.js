var gk = (function(gk){

    var DEFAULT_COLOR = "#000000";
    var base_id = 0;

    //Constructor//////////////////////////////////////////////////////
    function Drawable(){ }

    //Instance Methods/////////////////////////////////////////////////    
    Drawable.prototype.updateMousePrimitive = function(oldMouse, curMouse){
        throw "Class does not provide a primitive mouse update";
    }
    
    Drawable.prototype.updateMouse = function(oldMouse, curMouse){
        throw "Class does not provide a mouse update";
    }
    
    Drawable.prototype.tryToSelect = function(mouse, options){
        throw "Unimplemented abstract method: Drawable.tryToSelect";
    }
    
    Drawable.prototype.tryToSnap = function(mouse, options){
        throw "Unimplemented abstract method: Drawable.tryToSnap";
    }
    
    Drawable.prototype.draw = function(options){
        throw "Unimplemented abstract method: Drawable.draw";
    }
    
    Drawable.prototype.trigger = function(obj, data){
        //do nothing by default
    }
    
    Drawable.prototype.startRender = function(options){
        var ctx = this.getContext(options);
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
    
    Drawable.prototype.toString = function(){
        return this.id || this.generateNewId();    
    }
    
    Drawable.prototype.generateNewId = function(){
        return this.id = ++base_id;
    }
    
    //Utility methods//////////////////////////////////////////////////
    function getColor(options){
        return options.color || DEFAULT_COLOR;    
    }
    
    gk.primitives = [];
    gk.registerPrimitive = function(primitiveClass){
        gk.primitives.push(primitiveClass);    
    }
    
    gk.Drawable = Drawable;

    return gk;
})(gk || {});
