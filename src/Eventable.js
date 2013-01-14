var gk = (function(gk){

    gk.EVENT_REPLACED = "replaced";
    gk.EVENT_UPDATED = "updated";

    function Eventable(){
        this.observers = [];
    }
    
    Eventable.prototype.listen = function(observer){
        this.observers.push(observer);
    }

    Eventable.prototype.unlisten = function(observer){
        for(var i=0; i<this.observers.length; i++){
            if(this.observers[i] == observer){
                this.observers.splice(i,1);
                return true;
            }
        }
        return false;
    }
    
    Eventable.prototype.emit = function(data){
        for(var i=0; i<this.observers.length; i++){
            this.observers[i].trigger(this, data);
        }
    }
    
    Eventable.prototype.trigger = function(obj, data){
        //do nothing by default
    }
    
    gk.Eventable = Eventable;

    return gk;
})(gk || {});
        
    
    
