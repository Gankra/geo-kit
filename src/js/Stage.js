var gk = (function(gk, _){
    
    var Point = gk.Point;
    var Line = gk.Line;
    
    var DEFAULT_CANVAS_WIDTH = 650;
    var DEFAULT_CANVAS_HEIGHT = 500;
    var axes = [
        new Line(new Point(0,0), new Point(0,1)),
        new Line(new Point(0,0), new Point(1,0))
    ];
    var axesOptions = {color: "#bbb"};
    
    function Stage(){
        this.layers = [];        
        
        this.$stage = $("<div>");
        this.$canvas = $("<canvas class='stage'>");
        this.$menu = $("<div>");
        this.$layers = $("<div id='layers'>");
        
        this.$menu.append(this.$layers);
        
        
        this.canvas = this.$canvas[0];
        this.canvas.width = DEFAULT_CANVAS_WIDTH;
        this.canvas.height = DEFAULT_CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext("2d");
        this.addLayer();
        
        this.scaleX = 1;
        this.scaleY = -1;
        this.offsetX = this.canvas.width/2;
        this.offsetY = this.canvas.height/2;
        
        this.$stage.append(this.$canvas);
        this.draw();
    }
    
    Stage.prototype.draw = _.throttle(function(options){
        this.clearRender();
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scaleX, this.scaleY);
        axesOptions.ctx = this.ctx;
        for(var i=0; i<axes.length; ++i){
            axes[i].draw(axesOptions);
        }
        for(var i=0; i<this.layers.length; ++i){
            this.layers[i].draw(this);
        }  
        this.ctx.restore();
    }, 1000/30);
    
    Stage.prototype.clearRender = function(){
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    Stage.prototype.deleteLayer = function(layer){
        var index;
        if(typeof layer == "number"){
            index = layer;
            layer = this.layers[index];
        }else{
            index = this.layers.indexOf(layer);
        }
        this.layers.splice(index, 1);
        this.removeLayerHTML(layer);
        
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
        if(!layer){
            layer = new gk.Layer();
        }
        if(index === undefined){
            this.layers.push(layer);
            this.insertLayerHTML(layer, this.layers.length-1);
        }else{
            this.layers.splice(index,0,layer);
            this.insertLayerHTML(layer, index);
        }
        if(this.layers.length==1){
            this.currentLayer = layer;
        }
        
    }
    
    Stage.prototype.setLayer = function(index){
        this.currentLayer = this.layers[index];
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
        for(var i=this.layers.length-1; i>=0; --i){
            var result = this.currentLayer.getSelectionAt(mouse, options);
            if(result){
                return result;
            }
        }
        return null;
    }
    
    Stage.prototype.tryToSnap = function(mouse, options){
        return this.currentLayer.tryToSnap(mouse, options);
    }
    
    Stage.prototype.insertLayerHTML = function(layer, index){
        layer.$html = this.getLayerHTML(layer);
        if(index==0){
            this.$layers.prepend(layer.$html);
        }else{
            layer.$html.insertAfter(this.layers[index-1].$html);
        }
    }
    
    Stage.prototype.removeLayerHTML = function(layer){
        layer.$html.remove();        
    }
    
    Stage.prototype.getLayerHTML = function(layer){
        var $layer = $("<div class='layer'>");
        $layer.append($("<button class='lock-button'>"));
        $layer.append($("<button class='visible-button'>"));
        return $layer;
    }
    
    gk.Stage = Stage;

    return gk;
})(gk || {}, _);
