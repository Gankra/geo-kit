var gk = (function(){
    var Point = gk.Point;

    var input = {};

    input.KEYS = {backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,escape:27,space:32,left:37,up:38,right:39,down:40,w:87,a:65,s:83,d:68,tilde:192,del:46};
    
    input.mouse = new Point(0,0);
    input.mouseLast = new Point(0,0);
    input.keyboard = {};
    
    input.registerKey = function(keyCode){
        input.keyboard[keyCode] = true;
    }

    input.unregisterKey = function(keyCode){
        delete input.keyboard[keyCode];
    }

    input.updateMouse = function(newMousePos, down){
        input.mouseLast = input.mouse;
        input.mouse = newMousePos;  
        input.mouse.down = down === undefined ? input.mouseLast.down : down; 
    }

    input.isPressed = function(keyCode){
        return input.keyboard[keyCode];
    }

    input.isRangeSelecting = function(){
        return input.isPressed(input.KEYS.shift);
    }

    input.isUnitSelecting = function(){
        return input.isPressed(input.KEYS.ctrl);
    }

    input.isMultiSelecting = function(){
        return input.isRangeSelecting() || input.isUnitSelecting();
    }

    gk.input = input;

    return gk;
})(gk || {});
