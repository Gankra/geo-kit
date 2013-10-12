var gk = (function(gk){

    var deserializers = {};
    var serialization = {};
    var deserializedItems = {};
    var listeners = {};

    serialization.registerDeserializer = function(type, fn){
        deserializers[type] = fn;
    }

    serialization.deserialize = function(obj){
        var result = deserializers[obj.type](obj);
        deserializedItems[result.uid] = result;
        if(listeners[result.uid]){
           listeners[result.uid](result);
           delete listeners[result.uid]; 
        }
        return result;
    }

    serialization.serializeState = function(){
        var obj = gk.getCurrentStage().serialize();
        var result = JSON.stringify(obj);
        return result;
    }

    serialization.loadState = function(string){
        var obj = JSON.parse(string);
        var result = serialization.deserialize(obj);
        deserializedItems = {};
        //TODO: embed in gk;
        return result;
    }

    serialization.registerLoadListener = function(id, fn){
        if(deserializedItems[id]){
            fn(deserializedItems[id]);
        }else{
            listeners[id] = fn;
        }
    }

    gk.serialization = serialization;

    return gk;
})(gk || {});