var gk = (function(gk){

    var events = {};

    events.EVENT_REPLACED = "replaced";
    events.EVENT_UPDATED = "updated";
    events.EVENT_DELETED = "deleted";
    
    var listeners = {};
    
    events.registerListener = function(observer, observed){
        if(observed.iterator){
            if(observed.transient){
                var it = observed.iterator();
                while(it.hasNext()){
                    registerListenerInternal(it.next(), observer);
                }
            }else{
               registerListenerInternal(observed, observer); 
            }
        }else{
            registerListenerInternal(observed, observer);
        }    
    }

    events.unregisterListener = function(observer, observed){
        if(observed.iterator){
            var it = observed.iterator();
            while(it.hasNext()){
                unregisterListenerInternal(it.next(), observer);
            }
            unregisterListenerInternal(observed, observer);
        }else{
            unregisterListenerInternal(observed, observer);
        } 
    }
    
    function registerListenerInternal(observed, observer){
        if(!listeners[observed.uid]){
            listeners[observed.uid] = [];    
        }
        listeners[observed.uid].push(observer);
    }

    function unregisterListenerInternal(observed, observer){
        var observers = listeners[observed.uid];
        if(observers){
            observers.splice(observers.indexOf(observer), 1);
            if(observers.length==0){
                delete listeners[observed.uid];
            }
        }
    }
    
    events.emit = function(observed, data){
        var observers = listeners[observed.uid];
        if(observers){
            for(var i=0; i<observers.length; i++){
                observers[i].handleEvent(observed, data);
            }
        }
    }
    
    events.getDefaultEvent = function(eventType){
        return {event: eventType};
    }

    gk.events = events;

    return gk;
})(gk || {});
        
    
    
