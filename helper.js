 /*
      @param val : any Type of javascript #check unknow type argument
  */

  function type( val ){
    var toString = Object.prototype.toString;
      return toString.call(val).split(" ")[1].replace("]","");
  }
  /*
    @param obj: object | Array #Iteration object
    @param fn: function #Iteration function {return false only false will interrupt iterating}
    @param recursion : boolean , #default value false   

  */

  function each( obj , fn , recursion){
    var i , j , t = type(obj) ,r = recursion || false ;
    switch( t ){
      case "Array":
        for( i = 0 , j = obj.length; i < j ; ++i ){
            if( fn( obj[i] , i ) === false ){
              return false;
            }        
            if(recursion && (type(obj[i]) == "Array"||type(obj[i]) == "Object")){
              each(obj[i] , fn , recursion);
            }
        }
        break;
      case "Object":
        for( i in obj ){
          if( obj.hasOwnProperty( i ) ){
            if( fn( obj[i] , i ) === false ){
              return false;
            }
            if(recursion && (type(obj[i]) == "Array"||type(obj[i]) == "Object")){
              each(obj[i] , fn , recursion);
            }
          }
        }        
        break;
      default:
        throw {
          message : "Wrong type!"
        };
        break;
    }
    return true;
  }
  /*
    @param arr: Array | Array #Iteration object
    @param val1: String | Number | Boolean  #search value 

  */

  function isSub( arr , val1 ){
   return  each(arr, function(val2 , i){
      return !(val2 === val1); 
    });
  }

  /*

    @param father: Object | Array #Iteration object
    @param pjName: String #search value 
  */
 function search( father , pjName ){
    var result ;
      each( father , function( val , p){
        if( p === pjName ){
          result = val;
          return false;
        }
      },true);
      return result;
  }
exports.each = each;
exports.type = type;
exports.search = search;
exports.isSub = isSub;