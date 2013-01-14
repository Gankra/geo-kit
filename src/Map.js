var gk = (function(gk){

    /**
    * A Map is an abstract class that represents some algorithm that takes 
    * a collection of geometric objects and returns a new collection 
    * of geometric objects that results from the mapping
    */

    function Map(){
        this.invertible = false;  
    }
    
    /**
    * map performs the mapping in question, and registers relevant metadata
    *
    * returns the resulting Collection
    */
    Map.prototype.map = function(collection){
        var result = this.doMap(collection);
        result.registerMapping(collection, this);
        return result;
    }
    
    /**
    * (abstract) (private) doMap performs the mapping in question
    * 
    * returns the resulting Collection
    */
    Map.prototype.doMap = function(collection){
        throw "Unimplemented method: Map.doMap";
    }
    
    /**
    * inverse performs the inverse of the mapping in question, 
    * and registers relevant metadata
    *
    * returns the resulting Collection
    */
    Map.prototype.inverse = function(collection){
        var result = this.doInverse(collection);
        result.registerMapping(collection, this);
        return result;
    }
    
    /**
    * (abstract) (optional) (private) doInvert performs the inverse mapping 
    *
    * returns a Collection that would map to the input 
    */
    Map.prototype.doInverse = function(collection){
        throw "Unimplemented method: Map.doInverse";
    }
    
    /**
    * manipulate takes the input and output of
    * a map and the changes made to the input, and tries to change the output to
    * reflect this. By default this is done by re-generating the the output via
    * Map.map.
    * Should be overridden if something better can be done.
    * 
    * returns void
    */
    Map.prototype.manipulate = function(input, output, inputData){
        output.replaceItems(this.map(input), this);
    }
    
    /**
    * inverseManipulate takes the input and output of
    * a map and the changes made to the output, and tries to change the input to
    * reflect this. By default this is done by re-generating the the input via
    * Map.invert.
    * Should be overridden if something better can be done.
    * 
    * returns void
    */
    Map.prototype.inverseManipulate = function(input, output, outputData){
        input.replaceItems(this.inverse(output), this);
    }

    Map.prototype.isInvertible = function(collection){
        return this.invertible;
    }
    
    gk.Map = Map;

    return gk;
})(gk || {});
