var gk = (function(gk){

    function Stage(){
        this.layers = [new Layer({})];
        
        this.$stage = $("<div>");
        this.$canvas = $("<canvas>");
        this.$menu = $("<div>");
        
        this.canvas = $canvas[0];
        this.ctx = this.canvas.getContext("2d");
        this.currentLayer = this.layers[0];
        
        this.$stage.append(this.$canvas);
    }
    
    this.prototype.draw = function(options){
        for(var i=0; i<this.layers.length; ++i){
            this.layers[i].draw(this);
        }  
    }
    
    this.prototype.deleteLayer = function(layer){
        var index;
        if(typeof layer == "number"){
            index = layer;
            this.layers.splice(layer, 1);
        }else{
            index = this.layers.indexOf(layer);
            this.layers.splice(index, 1);
        }
        
        if(currentLayer == layer){
            if(index>0){
                this.currentLayer = this.layers[index-1];
            }else if(this.layers.length>0){
                this.currentLayer = this.layers[0];        
            }else{
                this.currentLayer = null;
            }
        }
    }
    
    this.prototype.addLayer = function(layer, index){
        if(index === undefined){
            this.layers.push(layer);
        }else{
            this.layers.splice(index,0,layer);
        }
    }
    
    this.prototype.insert = function(item){
        if(this.currentLayer!=null & this.currentLayer
    }
    
    gk.Layer = Layer;

    return gk;
})(gk || {});
