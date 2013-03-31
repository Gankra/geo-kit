var gk = (function(gk){

    function Collection(args){
        this.items = args.items || [];
        gk.Drawable.call(this);
    }
    
    Collection.prototype = new gk.Drawable();
    
    Collection.prototype.splice = function(){
        return this.items.splice.apply(this.items, arguments);
    }
    
    Collection.prototype.push = function(){
        return this.items.push.apply(this.items, arguments);
    }
    
    Collection.prototype.__defineGetter__("length", function(){
        return this.items.length;
    });
    
    Collection.prototype.get = function(index){
        return this.items[index];
    }
    
    Collection.prototype.draw = function(options){
        for(var item in this){
            item.draw(options);
        }
    }
    
    Collection.prototype.replaceItems = function(items, replacer){
        this.items = items;
        this.emit({
            event: gk.EVENT_REPLACED,
            replacer: replacer
        });
    }
    
    Collection.prototype.registerMapping = function(parentCollection, parentMap){
        //TODO: this method
        throw "unimplemented method: Collection.registerMapping";
    }
    
    Collection.prototype.__iterator__ = function(){
        for(var i=0; i<this.items.length; ++i){
            yield this.items[i];
        }
    }
    
    gk.Collection = Collection;

    return gk;
})(gk || {});
