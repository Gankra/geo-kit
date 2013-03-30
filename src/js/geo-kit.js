var gk = (function($, gk){
    
    gk.stages = [];
    gk.currentStage = null;
    gk.selected = null;
    gk.mouseLast = {x:0, y:0, down:false};
    gk.mouse = {x:0, y:0, down:false};
    gk.keyboard = {};
    
    $(function(){
        gk.$stages = $("#gk-stages");
        gk.$menu = $("#gk-menu");
        gk.addStage(new gk.Stage());
    });
    
    gk.setCurrentStage = function(stage){
        if(gk.currentStage){
            gk.currentStage.deselect();
        }
        gk.currentStage = stage;
        gk.currentStage.select();
        
        gk.$menu.empty();
        gk.$menu.append(gk.currentStage.$menu);    
    }
    
    gk.addStage = function(stage){
        gk.stages.push(stage);
        gk.$stages.append(stage.$stage);
        if(gk.stages.length==1){
            gk.setCurrentStage(gk.stages[0]);
        }    
    }

    return gk;
})($, gk || {});
