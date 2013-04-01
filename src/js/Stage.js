var gk = (function(gk){
    
    var DEFAULT_CANVAS_WIDTH = 650;
    var DEFAULT_CANVAS_HEIGHT = 500;
    
    function Stage(){
        this.layers = [new gk.Layer()];        
        
        this.$stage = $("<div>");
        this.$canvas = $("<canvas class='stage'>");
        this.$menu = $("<div>");
        
        this.canvas = this.$canvas[0];
        this.canvas.width = DEFAULT_CANVAS_WIDTH;
        this.canvas.height = DEFAULT_CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext("2d");
        this.currentLayer = this.layers[0];
        
        this.scaleX = 1;
        this.scaleY = -1;
        this.offsetX = this.canvas.width/2;
        this.offsetY = this.canvas.height/2;
        
        this.$stage.append(this.$canvas);
        
        this.clearRender();
    }
    
    Stage.prototype.draw = function(options){
        this.clearRender();
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scaleX, this.scaleY);
        for(var i=0; i<this.layers.length; ++i){
            this.layers[i].draw(this);
        }  
        this.ctx.restore();
    }
    
    Stage.prototype.clearRender = function(){
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
    
    Stage.prototype.select = function(){
        this.$canvas.addClass("stage-selected");
    }
    
    Stage.prototype.deselect = function(){
        this.$canvas.removeClass("stage-selected");
    }
    
    
    Stage.prototype.updateMouse = function(event, down){
        gk.mouseLast = gk.mouse;
        gk.mouse = this.relMouseCoords(event);   
        gk.mouse.down = down === undefined ? gk.mouseLast.down : down;     
    }
    
    Stage.prototype.relMouseCoords = function(event){
        var canvas = event.target;
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = canvas;

        do{
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        }while(currentElement = currentElement.offsetParent);
        
        canvasX = (event.pageX - totalOffsetX - this.offsetX)/this.scaleX;
        canvasY = (event.pageY - totalOffsetY - this.offsetY)/this.scaleY;
        var pt = new gk.Point(canvasX, canvasY);
        var snap = this.tryToSnap(pt, gk.selectionOptions);
	    return snap || pt;
    }
    
    Stage.prototype.getSelectionAt = function(mouse, options){
        return this.currentLayer.getSelectionAt(mouse, options);
    }
    
    Stage.prototype.tryToSnap = function(mouse, options){
        return this.currentLayer.tryToSnap(mouse, options);
    }
    
    gk.Stage = Stage;

    return gk;
})(gk || {});
