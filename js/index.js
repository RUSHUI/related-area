
$(function(){
    $('[com="related-area"]').Area();
});


(function($, win, nul) {

    "use strict";
    
    var local = { "rs":{} };//全局域
    
    /**
     * [ns 命名空间函数]
     * @param  {[string]} ns [namespace]
     * @return {[boolean]} false/object [失败返回false,成功返回一个全局local.rs对象]
     */
    var ns = function( ns ) {

        //局部变量
        var _nspieces   = ns.split("."),
            _nsPrefix   = "local.rs",
            _local      = local.rs;
        for ( var i=0, len=_nspieces.length; i < len; i++ ) {
            
            //检测该级命名是否已经存在
            if ( typeof _local[_nspieces[i]] === 'undefined' ) {
                //若不存在
                _local[_nspieces[i]] = {};
                _nsPrefix += '.' + _nspieces[i];
                if( _nsPrefix !== "local.rs.ns"){
                    console.log( "%o级命名%o可用,当前空间%o", i+3, _nspieces[i], _nsPrefix );
                }
            } else {
                //若存在，检测他是否是已经到末位级
                if ( i === len-1 ) {
                    //若是末位
                    console.log("空间%o已存在%o级命名%o，注册失败！", _nsPrefix, i+3, _nspieces[i]);
                    return false;
                }else{
                    _nsPrefix += '.' + _nspieces[i];
                }
            }
            _local = _local[_nspieces[i]];
        }

        if( _nsPrefix !== "local.rs.ns"){
            console.log( "恭喜您,%o级命名空间%o注册成功", i+2, _nsPrefix );
        }

        return local.rs;
    }; 
    
    win.local=local;
    ns("ns") ? local.rs.ns=ns : console.log(local.rs.ns);

})( jQuery, window );


