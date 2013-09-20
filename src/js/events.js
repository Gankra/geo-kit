var gk = (function(gk){

    gk.EVENT_REPLACED = "replaced";
    gk.EVENT_UPDATED = "updated";
    gk.EVENT_DELETED = "deleted";
    
    gk.listeners = {};
    
    gk.registerListener = function(observer, observed){
        if(observed.iterator){
            var it = observed.iterator();
            while(it.hasNext()){
                registerListenerInternal(it.next(), observer);
            }
        }else{
            registerListenerInternal(observed, observer);
        }    
    }
    
    function registerListenerInternal(observed, observer){
        if(!gk.listeners[observed]){
            gk.listeners[observed] = [];    
        }
        gk.listeners[observed].push(observer);
    }
    
    gk.emit = function(observed, data){
        var observers = gk.listeners[observed];
        if(observers){
            for(var i=0; i<observers.length; i++){
                observers[i].handleEvent(observed, data);
            }
        }
    }
    
    gk.getDefaultEvent = function(eventType){
        return {event: eventType};
    }

    return gk;
})(gk || {});
        
    
    