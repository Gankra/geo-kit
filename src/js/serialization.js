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

    serialization.serializeState = function(raw){
        var obj = gk.getStage().serialize();
        var result = JSON.stringify(obj);
        if(!raw) result = LZString.compressToBase64(result);
        return result;
    }

    serialization.parseState = function(string, raw){
        if(!raw) string = LZString.decompressFromBase64(string);
        var obj = JSON.parse(string);
        var result = serialization.deserialize(obj);
        deserializedItems = {};
        gk.setStage(result);
        return result;
    }

    serialization.saveState = function(name){
        localStorage.setItem(name, serialization.serializeState());
    }

    serialization.loadState = function(name){
        serialization.parseState(localStorage.getItem(name));
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