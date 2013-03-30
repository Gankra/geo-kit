var gk = (function(gk){

    function Stage(){
        this.layers = [new gk.Layer({})];
        
        this.$stage = $("<div>");
        this.$canvas = $("<canvas>");
        this.$menu = $("<div>");
        
        this.canvas = this.$canvas[0];
        this.ctx = this.canvas.getContext("2d");
        this.currentLayer = this.layers[0];
        
        this.$stage.append(this.$canvas);
    }
    
    Stage.prototype.draw = function(options){
        for(var i=0; i<this.layers.length; ++i){
            this.layers[i].draw(this);
        }  
    }
    
    Stage.prototype.deleteLayer = function(layer){
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
    
    Stage.prototype.addLayer = function(layer, index){
        if(index === undefined){
            this.layers.push(layer);
        }else{
            this.layers.splice(index,0,layer);
        }
    }
    
    Stage.prototype.insert = function(item){
        if(this.currentLayer!=null && !this.currentLayer.locked){
            this.currentLayer.insert(item);
        }
    }
    
    gk.Stage = Stage;

    return gk;
})(gk || {});
