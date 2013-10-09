var gk = (function(gk){

    var deserializers = {};
    var serialization = {};

    serialization.registerDeserializer = function(type, fn){
        deserializers[type] = fn;
    }

    serialization.deserialize = function(string){
        return deserializers[obj.type](obj);
    }

    gk.serialization = serialization;

    return gk;
})(gk || {});