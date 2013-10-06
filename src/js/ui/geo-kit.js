//This file is a disgusting monolithic mess. Must consider a better way to do GUI
var gk = (function($, gk){
    var Set = gk.Set;
    var LinkedHashSet = gk.LinkedHashSet;
    var Point = gk.Point;
    var Box = gk.Box;
    var Stage = gk.Stage;
    var Layer = gk.Layer;
    var input = gk.input;
    var events = gk.events;
    
    var MODE_INSERT = "insert";
    var MODE_SELECT = "select";
    var MODE_MOVE = "move";

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
      , fadeLayers: false
      , layerFadeRate: 5
    }
    gk.options.misc = {
        insertLayersAbove: false
    }

    var stages = [];
    var currentStage = null;

    gk.selection = new LinkedHashSet();
    gk.selectionBox = new Set();
    gk.selectionArea = null;
    var canManipulateSelection = true;
    var canManipulateSelectionBox = true;
    var inserting = null;
    var currentPrimitiveClass = null;
    var currentMap = null;
    var mode = MODE_INSERT;
    
    gk.selection.transient = true;
    
    $(function(){ 
        gk.$stages = $("#gk-stages");
        gk.$menu = $("#gk-menu");
        gk.$globalMenu = $("#gk-global-menu");
        gk.$stageMenu = $("#gk-stage-menu");
        gk.addStage(new Stage());
        
        createGlobalMenu();
        
        var $document = $(document);
        
        $document.on("mousedown", ".stage", function(event){
            selectCurrentStage(event.target);
            
            input.updateMouse(currentStage.relMouseCoords(event), true);
            
            getModeHandler().mousedown(event);

            $(".layer.selected").removeClass("selected");
            redrawCurrentStage();
        });
        
        $document.on("mousemove", function(event){
            if(input.mouse.down){
                gk.options.selection.snapSelected = false;
            }

            input.updateMouse(currentStage.relMouseCoords(event));

            if(input.mouse.down){
                getModeHandler().mousedrag();
            }

            redrawCurrentStage();
        });
        
        $document.on("mouseup", ".stage", function(event){
            input.updateMouse(currentStage.relMouseCoords(event), false);
            inserting = null;
            gk.selectionArea = null;
            gk.selectBox(gk.selectionBox);
            gk.selectionBox.clear();
            redrawCurrentStage();
            gk.options.selection.snapSelected = true;
        });
        
        $document.on("keydown", function(event){
            input.registerKey(event.keyCode);
        });
        
        $document.on("keyup", function(event){
            input.unregisterKey(event.keyCode);
            if(event.keyCode==input.KEYS.del){
                deleteSelection();
            }
        });
    });

    function selectCurrentStage(canvasEl){
        for(var i=0; i<stages.length; ++i){
            var stage = stages[i];
            if(stage.canvas == canvasEl){
                gk.setCurrentStage(stage);
                break;
            } 
        }
    }

    function setMode(newMode){
        mode = newMode;
    }

    function getModeHandler(){
        return modes[mode];
    }

    var modes = {};
    modes[MODE_INSERT] = {
        mousedown: function(){
            var newPrimitive = currentPrimitiveClass.createPrimitive(input.mouse);
            currentStage.insert(newPrimitive);
            gk.select(newPrimitive);
            inserting = newPrimitive;
        }
      , mousedrag: function(){
            inserting.updateMousePrimitive(input.mouseLast, input.mouse);
            events.emit(inserting, events.getDefaultEvent(gk.EVENT_UPDATED)); 
        }
    }
    modes[MODE_MOVE] = {
        mousedown: function(){
            var selection = currentStage.getSelectionAt(input.mouse, gk.options.selection);
            if(selection!=null){
                gk.select(selection.item, selection.linked);
            }
        }
      , mousedrag: function(){
            if(!canManipulateSelection) return;

            var it = gk.selection.iterator();
            while(it.hasNext()){
                var item = it.next();
                item.updateMouse(input.mouseLast, input.mouse);
                events.emit(item, events.getDefaultEvent(gk.EVENT_UPDATED));
            }
        }
    }
    modes[MODE_SELECT] = {
        mousedown: function(){
            var selection = currentStage.getSelectionAt(input.mouse, gk.options.selection);
            if(selection!=null){
                gk.select(selection.item, selection.linked);
            }else if(!isSelectionDeltaed()){
                clearSelection();
            }
        }
      , mousedrag: function(){
            if(!gk.selectionArea){
                gk.selectionArea = Box.createPrimitive(input.mouseLast, input.mouse);
            }
            gk.selectionArea.updateMousePrimitive(input.mouseLast, input.mouse);
            var newSelectionBox = currentStage.getSelectionInBox(gk.selectionArea, gk.options.selection);
            canManipulateSelectionBox = !newSelectionBox.linked;
            gk.selectionBox = newSelectionBox.items;
        }
    }
    
    gk.setCurrentStage = function(stage){
        if(stage == currentStage){
            return;
        }

        if(currentStage){
            currentStage.deselect();
        }

        currentStage = stage;
        currentStage.select();
        
        gk.$stageMenu.empty();
        gk.$stageMenu.append(currentStage.$menu); 
           
    }
    
    gk.addStage = function(stage){
        stages.push(stage);
        gk.$stages.append(stage.$stage);
        if(stages.length==1){
            gk.setCurrentStage(stages[0]);
        } 
        stage.draw(gk.options.render);   
    }
    
    gk.select = function(selection, disallowManipulation){  
        if(selection.iterator){
            gk.selection = selection;
        }else{
            var ctrl = isSelectionDeltaed();
            if(!ctrl || !gk.selection.transient){
               clearSelection();
            }
            if(ctrl && gk.isSelected(selection)){
                removeSelection(selection);
            }else{
                addSelection(selection);
            }
        }
        if(disallowManipulation){
            canManipulateSelection = false;
        }
    }

    gk.selectBox = function(set){
        var it = set.iterator();
        if(!canManipulateSelectionBox){
            canManipulateSelection = false;
        }
        while(it.hasNext()){
            addSelection(it.next());
        }
    }
    
    gk.isSelected = function(item){
        return gk.selection.contains(item) || gk.selectionBox.contains(item);
    }

    function isSelectionDeltaed(){
        return input.isMultiSelecting();
    }
    
    function addSelection(item){
        gk.selection.add(item);
        updateSelection();
    }
    
    function removeSelection(item){
        gk.selection.remove(item);
        updateSelection();
    }
    
    function clearSelection(){
        canManipulateSelection = true;
        if(gk.selection.transient){
            gk.selection.clear();
        }else{
            gk.selection = new LinkedHashSet();
            gk.selection.transient = true;
        }
        updateSelection();
    }
    
    function updateSelection(){
        if(currentMap.canMap(gk.selection)){
            $("#mapButton").removeAttr("disabled");
        }else{
            $("#mapButton").attr("disabled", "disabled");
        }
    }
    
    function deleteSelection(){
        currentStage.removeAll(gk.selection);
        clearSelection();
        redrawCurrentStage();
    }
    
    function redrawCurrentStage(){
        currentStage.draw(gk.options.render);
    }
    
    function createGlobalMenu(){
        var $document = $(document);
        $document.on("click", ".unique-button-group button", function(event){
            $(this).parent().children().removeClass("pressed");
            $(this).addClass("pressed");
        });

        $document.on("click", ".mode-button", function(event){
            setMode($(this).val());
            return true;
        });

        $document.on("click", ".pressable", function(event){
            $(this).toggleClass("pressed");
        });
        
        var $inputMenu = $("#gk-input-menu");
        var $firstBtn = null;
        for(var index in gk.primitives){
            var primitive = gk.primitives[index];
            var $primitiveBtn = $("<button " 
              + "value='"+index+"' "
              + "class='icon-button' "
              + "data-icon='"+primitive.icon+"' "
              + "title='"+primitive.displayName+"' "
              + ">");
            $firstBtn = $firstBtn || $primitiveBtn;
            $inputMenu.append($primitiveBtn);
            $primitiveBtn.on("click", function(){
                setMode(MODE_INSERT);
                currentPrimitiveClass = gk.primitives[$(this).val()];    
            });    
        }

        $firstBtn.click();
        
        $("#snap-to-points-button").on("click", function(){
            gk.options.selection.snapToPoints = !$(this).is(".pressed");        
        }).click();
        
        $("#snap-to-edges-button").on("click", function(){
            gk.options.selection.snapToEdges = !$(this).is(".pressed");        
        }).click();
        
        var $mapSelect = $("#mapSelect");
        for(var index in gk.maps){
            $mapSelect.append("<option value='"+index+"'>"+gk.maps[index].displayName+"</option>");    
        }
        $mapSelect.on("change", function(event){
            currentMap = gk.maps[$mapSelect.val()];  
            updateSelection();  
        }).change();
        
        var $mapButton = $("#mapButton");
        $mapButton.on("click", function(event){
            if(currentMap.canMap(gk.selection)){
                var result;
                if(gk.selection.transient){
                    var selectionClone = gk.selection.clone();
                    selectionClone.handleChildEvents();
                    result = currentMap.map(selectionClone);
                }else{
                    result = currentMap.map(gk.selection);
                }
                var layer = new Layer({
                    name: currentMap.displayName
                  , linked: true
                  , collection: result
                });
                currentStage.addLayer(layer);
                currentStage.selectLayer(layer);
                redrawCurrentStage();
            }
        });

        $(".icon-button").each(function(index, btn){
            btn.style["background-image"] =  "url(src/img/icon-"+btn.dataset.icon+".svg)";
        })
    }
    
    return gk;
})($, gk || {});
