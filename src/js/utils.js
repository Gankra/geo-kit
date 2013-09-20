var gk = (function(gk){
    var utils = {};

    utils.isLeftTurn = function(ptA, ptB, ptC){
        return utils.signedTriangleArea(ptA, ptB, ptC) > 0; 
    }

    utils.isRightTurn = function(ptA, ptB, ptC){
        return utils.signedTriangleArea(ptA, ptB, ptC) < 0;
    }

    /**
    * Computes the signed area of the triangle 
    * defined by the three given points
    * from: http://mathworld.wolfram.com/TriangleArea.html
    */  
    utils.signedTriangleArea = function(ptA, ptB, ptC){
        return (-ptB.x*ptA.y + ptC.x*ptA.y + ptA.x*ptB.y
                - ptC.x*ptB.y - ptA.x*ptC.y + ptB.x*ptC.y)/2;
    }

    /**
    * Returns the greatest element in the collection according to the comparator
    */
    utils.maximum = function(collection, comparator){
        var best = null;
        var it = collection.iterator();

        if(it.hasNext()){
            best = it.next();
        }

        while(it.hasNext()){
            var candidate = it.next();
            if(comparator(candidate, best) > 0){
                best = candidate;
            }
        }

        return best;
    }

    /**
     * quicksort
     */
    utils.sort = function(array, comparator){
        quicksort(array, 0, array.length);

        function quicksort(arr, min, max){
            if(max-min <= 1){
                return;
            }

            var pivot = max-1;
            
            //strategy: choose right-most as pivot
            //walk left from pivot until an element greater than it is found
            //move pivot down one, move element to pivot's old place
            for(var i=pivot-1; i>=min; --i){
                if(comparator(arr[i], arr[pivot]) > 0){
                    if(i==pivot-1){
                        var temp = arr[pivot];
                        arr[pivot] = arr[i];
                        arr[i] = temp;
                    }else{
                        var temp = arr[pivot];
                        arr[pivot] = arr[i];
                        arr[i] = arr[pivot-1];
                        arr[pivot-1] = temp; 
                    }
                    pivot--;
                }
            }
            
            quicksort(arr, min, pivot);
            quicksort(arr, pivot+1, max);
        }
        return array;
    }

    utils.filter = function(collection, filter){
        var result = collection.emptyInstance();
        var it = collection.iterator();
        while(it.hasNext()){
            var item = it.next();
            if(filter(item)){
                result.add(item);
            }   
        }
        return result;
    }

    utils.intersects = function(line1, line2){
        var pt = line1.intersection(line2);
        if(isFinite(pt.x) && isFinite(pt.y)){
            return line1.isInBounds(pt) && line2.isInBounds(pt);
        }
        return false;
    }

    gk.utils = utils;

    return gk;
})(gk || {})