var gk = (function($, gk){
    
    gk.stages = [];
    gk.currentStage = null;
    
    $(function(){
        gk.$stages = $("#gk-stages");
        gk.$menu = $("#gk-menu");
        gk.addStage(new Stage());
    });
    
    gk.setCurrentStage = function(stage){
        gk.currentStage = stage;
        
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
