var gk = (function(gk){
    var filters = {};

    filters.hasKey = function(key){
        return function(item){
            return item[key] !== undefined;
        }
    }

    filters.hasOwnKey = function(key){
        return function(item){
            return item.hasOwnProperty(key);
        }
    }

    filters.not = function(filter){
        return function(item){
            return !filter(item);
        }
    }

    filters.any = function(){
        var filters = arguments;
        return function(item){
            for(var i=0; i<filters.length; ++i){
                if(filters[i](item)){
                    return true;
                }
            }
            return false;
        }
    }

    filters.all = function(){
        var filters = arguments;
        return function(item){
            for(var i=0; i<filters.length; ++i){
                if(!filters[i](item)){
                    return false;
                }
            }
            return true;
        }
    }

    filters.__defineGetter__("unique", function(){
        var seen = {};
        return function(item){
            if(seen[item.hashCode]){
                return false;
            }
            seen[item.hashCode] = true;
            return true;
        } 
    });

    filters.containsOnly = function(filter){
        return function(collection){
            var it = collection.iterator();
            while(it.hasNext()){
                var item = it.next();
                if(!filter(item)){
                    return false;
                }
            }
            return true;
        }
    }

    filters.isPoint = filters.hasKey("coords");
    filters.isLineish = filters.hasKey("slope");
    filters.isCircle = filters.hasKey("radius");
    filters.isCollection = filters.hasKey("iterator");
    filters.isGraph = filters.hasKey("vertices");
    filters.yes = function(){ return true; };
    filters.no = function(){ return false; };

    gk.filters = filters;

    return gk;
})(gk || {});