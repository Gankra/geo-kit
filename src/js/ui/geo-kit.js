var gk = (function($, gk){
    
    gk.MODE_INSERT = "insert";
    gk.MODE_SELECT = "select";
    gk.MODE_MOVE = "move";
    
    gk.options = gk.options || {};
    gk.options.selection = {
        snapToPoints: true 
      , snapToEdges: true 
      , edgeSnapDistance: 10
      , pointSnapDistance: 10
      , edgeSelectDistance: 10
      , pointSelectDistance: 10
      , snapSelected: true
    };
    gk.options.render = {
        pointRadius: 3
      , lineWidth: 2
      , defaultColor: "#000000"
      , highlightColor: "#ff0000"   
      , highlightRadius: 2     
    }
    
    gk.Keys = {backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,escape:27,space:32,left:37,up:38,right:39,down:40,w:87,a:65,s:83,d:68,tilde:192,del:46};
    
    gk.stages = [];
    gk.currentStage = null;
    gk.mouseLast = new gk.Point(0,0);
    gk.mouse = new gk.Point(0,0);
    gk.keyboard = {};
    gk.selected = {};
    gk.selection = new gk.Set();
    gk.inserting = null;
    gk.currentPrimitiveClass = null;
    gk.currentMap = null;
    gk.mode = gk.MODE_INSERT;
    
    
    $(function(){ 
        gk.$stages = $("#gk-stages");
        gk.$menu = $("#gk-menu");
        gk.$globalMenu = $("#gk-global-menu");
        gk.$stageMenu = $("#gk-stage-menu");
        gk.addStage(new gk.Stage());
        
        createGlobalMenu();
        
        var $document = $(document);
        
        $document.on("mousedown", ".stage", function(event){
            var canvas = event.target;
            for(var i=0; i<gk.stages.length; ++i){
                var stage = gk.stages[i];
                if(stage.canvas == event.target){
                    gk.setCurrentStage(stage);
                    break;
                } 
            }
            
            gk.currentStage.updateMouse(event, true);
            
            if(gk.mode == gk.MODE_INSERT){
                var newPrimitive = gk.currentPrimitiveClass.createPrimitive(gk.mouse);
                gk.currentStage.insert(newPrimitive);
                gk.select(newPrimitive);
                gk.inserting = newPrimitive;
            }else if(gk.mode == gk.MODE_MOVE){
                var selection = gk.currentStage.getSelectionAt(gk.mouse, gk.options.selection);
                if(selection!=null){
                    gk.select(selection);
                }
            }else if(gk.mode == gk.MODE_SELECT){
                var selection = gk.currentStage.getSelectionAt(gk.mouse, gk.options.selection);
                if(selection!=null){
                    gk.select(selection);
                }
            }
            redrawCurrentStage();
        });
        
        $document.on("mousemove", ".stage", function(event){
            if(gk.mouse.down){
                gk.options.selection.snapSelected = false;
            }
            gk.currentStage.updateMouse(event);
            if(gk.mouse.down){
                if(gk.inserting){
                    gk.inserting.updateMousePrimitive(gk.mouseLast, gk.mouse);    
                }else if(gk.mode == gk.MODE_MOVE){
                    for(var key in gk.selected){
                        var item = gk.selected[key];
                        item.updateMouse(gk.mouseLast, gk.mouse);
                        gk.emit(item, gk.getDefaultEvent(gk.EVENT_UPDATED));
                    }
                }
            }
            redrawCurrentStage();
        });
        
        $document.on("mouseup", ".stage", function(event){
            gk.currentStage.updateMouse(event, false);
            gk.inserting = null;
            redrawCurrentStage();
            gk.options.selection.snapSelected = true;
        });
        
        $document.on("keydown", function(event){
            gk.keyboard[event.keyCode] = true;
        });
        
        $document.on("keyup", function(event){
            gk.keyboard[event.keyCode] = false;
            if(event.keyCode==gk.Keys.del){
                deleteSelection();
            }
        });
    });
    
    gk.setCurrentStage = function(stage){
        if(gk.currentStage){
            gk.currentStage.deselect();
        }
        gk.currentStage = stage;
        gk.currentStage.select();
        
        gk.$stageMenu.empty();
        gk.$stageMenu.append(gk.currentStage.$menu); 
           
    }
    
    gk.addStage = function(stage){
        gk.stages.push(stage);
        gk.$stages.append(stage.$stage);
        if(gk.stages.length==1){
            gk.setCurrentStage(gk.stages[0]);
        } 
        stage.draw(gk.options.render);   
    }
    
    gk.select = function(selection){
        var ctrl = gk.keyboard[gk.Keys.ctrl];
        if(!ctrl){
           clearSelection();
        }
        if(selection.iterator){
            var it = selection.iterator();
            while(it.hasNext()){
                var item = it.next();
                if(ctrl && gk.isSelected(item)){
                    removeSelection(item);
                }else{
                    addSelection(item);
                }
            }    
        }else{
            if(ctrl && gk.isSelected(selection)){
                removeSelection(selection);
            }else{
                addSelection(selection);
            }
        }
    }
    
    gk.isSelected = function(item){
        return !!gk.selected[item];
    }
    
    function addSelection(item){
        gk.selected[item] = item;
        gk.selection.add(item);
        updateSelection();
    }
    
    function removeSelection(item){
        delete gk.selected[item];
        gk.selection.remove(item);
        updateSelection();
    }
    
    function clearSelection(){
        gk.selected = {};
        gk.selection.clear();
        updateSelection();
    }
    
    function updateSelection(){
        if(gk.currentMap.canMap(gk.selection)){
            $("#mapButton").removeAttr("disabled");
        }else{
            $("#mapButton").attr("disabled", "disabled");
        }
    }
    
    function deleteSelection(){
        gk.currentStage.remove(gk.selection);
        clearSelection();
        redrawCurrentStage();
    }
    
    function redrawCurrentStage(){
        gk.currentStage.draw(gk.options.render);
    }
    
    function createGlobalMenu(){
        var $document = $(document);
        $document.on("click", ".unique-button-group button", function(event){
            $(this).parent().children().removeClass("pressed");
            $(this).addClass("pressed");
        });

        $document.on("click", ".mode-button", function(event){
            gk.mode = gk["MODE_"+$(this).val()];
            return true;
        });
        
        var $inputMenu = $("#gk-input-menu");
        var $firstBtn = null;
        for(var index in gk.primitives){
            var $primitiveBtn = $("<button value='"+index+"'>"+gk.primitives[index].displayName+"</button>");
            $firstBtn = $firstBtn || $primitiveBtn;
            $inputMenu.append($primitiveBtn);
            $primitiveBtn.on("click", function(){
                gk.mode = gk.MODE_INSERT;
                gk.currentPrimitiveClass = gk.primitives[$(this).val()];    
            });    
        }

        $firstBtn.click();
        
        $("#snap-to-points-button").on("click", function(){
            $(this).toggleClass("pressed");
            gk.options.selection.snapToPoints = $(this).is(".pressed");        
        }).click();
        
        $("#snap-to-edges-button").on("click", function(){
            $(this).toggleClass("pressed");
            gk.options.selection.snapToEdges = $(this).is(".pressed");        
        }).click();
        
        var $mapSelect = $("#mapSelect");
        for(var index in gk.maps){
            $mapSelect.append("<option value='"+index+"'>"+gk.maps[index].displayName+"</option>");    
        }
        $mapSelect.on("change", function(event){
            gk.currentMap = gk.maps[$mapSelect.val()];  
            updateSelection();  
        }).change();
        
        var $mapButton = $("#mapButton");
        $mapButton.on("click", function(event){
            if(gk.currentMap.canMap(gk.selection)){
                var layer = new gk.Layer();
                layer.insert(gk.currentMap.map(gk.selection.clone()));
                gk.currentStage.addLayer(layer);
                redrawCurrentStage();
            }
        });
    }
    
    return gk;
})($, gk || {});
