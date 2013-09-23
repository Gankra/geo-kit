var gk = (function(gk){

    gk.EVENT_REPLACED = "replaced";
    gk.EVENT_UPDATED = "updated";
    gk.EVENT_DELETED = "deleted";
    
    gk.listeners = {};
    
    gk.registerListener = function(observer, observed){
        if(observed.iterator){
            var it = observed.iterator();
            registerListenerInternal(observed, observer);
            while(it.hasNext()){
                registerListenerInternal(it.next(), observer);
            }
        }else{
            registerListenerInternal(observed, observer);
        }    
    }

    gk.unregisterListener = function(observer, observed){
        if(observed.iterator){
            var it = observed.iterator();
            while(it.hasNext()){
                unregisterListenerInternal(it.next(), observer);
            }
        }else{
            unregisterListenerInternal(observed, observer);
        } 
    }
    
    function registerListenerInternal(observed, observer){
        if(!gk.listeners[observed.uid]){
            gk.listeners[observed.uid] = [];    
        }
        gk.listeners[observed.uid].push(observer);
    }

    function unregisterListenerInternal(observed, observer){
        var listeners = gk.listeners[observed.uid];
        if(listeners){
            listeners.splice(listeners.indexOf(observer), 1);
            if(listeners.length==0){
                delete gk.listeners[observed.uid];
            }
        }
    }
    
    gk.emit = function(observed, data){
        var observers = gk.listeners[observed.uid];
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
        
    
    
