var gk = (function(gk){

    function Collection(args){
        this.items = args.items;
        gk.Drawable.call(this, args.color);
    }
    
    Collection.prototype = new gk.Drawable();
    
    Collection.prototype.splice = function(){
        return this.items.splice.apply(this.items, arguments);
    }
    
    Collection.prototype.__defineGetter__("length", function(){
        return this.items.length;
    });
    
    Collection.prototype.draw = function(options){
        for(var i=0; i<items.length; i++){
            this.items[i].draw(options);
        }
    }
    
    Collection.prototype.replaceItems = function(items, replacer){
        this.items = items;
        this.emit({
            event: gk.EVENT_REPLACED,
            replacer: replacer
        });
    }
    
    Collection.prototype.registerMapping(parentCollection, parentMap){
        throw "TODO: implement this method: Collection.registerMapping";
    }
    
    gk.Collection = Collection;

    return gk;
})(gk || {});
