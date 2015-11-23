(function( $, win, nul ){
    "use strict";
    /**
     * [Area description]
     * @param {[type]} option [description]
     */
    function Area(option){
        var defaults={
            provUrl:"./assets/data/province.json",
            cityUrl:"./assets/data/city.json",
            districtUrl:"./assets/data/district.json",
            curProvId:"",
            curCityId:"",
            curDistrictId:""

        };
        return this.each(function(){
            var $this=$(this);
            var ops={
                curProvId:$this.find("input.iProv").val(),
                curCityId:$this.find("input.iCity").val(),
                curDistrictId:$this.find("input.iArea").val()
            };
            option=$.extend(defaults,option,ops);
            $this.data("com",new area($this,option));
        });
    }
    /**
     * [area description]
     * @param  {[type]} dom [description]
     * @param  {[type]} ops [description]
     * @return {[type]}     [description]
     */
    function area(dom,ops){
        
        this.dom    = dom;
        this.settings = ops;
        this.init();
    }
    var method = {

        init:function( ){

            this.createframe();
        },
        createframe:function(){
            
            var str="",
                ths=this;

            str += '<div id="city-title" tabindex="0" class="city-title">请选择省市区</div>';
            str += '<div class="drop-icon"></div>';
            str += '<div class="area-mask">';
                str += '<div class="mk-slt-tap">';
                    str += '<a class=" current" cmd="prov">省份</a>';
                    str += '<a cmd="city">城市</a>';
                    str += '<a cmd="district">县区</a>';
                str += '</div>';
                str += '<div class="mk-slt-cont">';
                    str += '<div class="city-slt prov current">';
                    str += '</div>';
                    str += '<div class="city-slt city" style="display:none">';
                    str += '</div>';
                    str += '<div class="city-slt district" style="display:none">';
                    str += '</div>';
                str += '</div>';
            str += '</div>';

            this.wrap=this.dom.find(".wrap");
            this.wrap.html(str);
            this.mask=this.wrap.find(".area-mask");
            this.mask.hide();
            this.regEvent();
            this.renderset=this.render();
            this.renderset.render();
        },
        regEvent:function(){
            var ths=this;
            this.wrap.on("click",".city-title",function(){
                
                ths.mask.show();
            });
            this.mask.find(".mk-slt-tap").on("click","a",function(){
                
                var $this = $(this);
                if( !$this.hasClass('current') ){
                    $this.siblings('a').removeClass('current');
                    $this.addClass('current');
                }
                var target=ths.mask.find("."+$this.attr("cmd")).show();
                target.siblings().hide()
            });
            this.mask.find(".prov").on("click","a",function(){

                var $this=$(this),id=$this.attr("attr-id"),name=$this.attr("title"),title=ths.wrap.find(".city-title"),value="";
                if(!$this.hasClass('current')){
                    ths.mask.find(".city-slt.prov a").removeClass('current');
                    $this.addClass('current');
                    ths.renderset.city({id:id});
                    ths.renderset.district({id:""});
                    value=name; 
                    title.html(name);
                    title.addClass('has-city-title');
                    ths.dom.find("input.iProv").val(id);
                }
                
            });
            this.mask.find(".city").on("click","a",function(){
                var $this=$(this),id=$this.attr("attr-id"),name=$this.attr("title"),title=ths.wrap.find(".city-title"),value="";
                if(!$this.hasClass('current')){
                    $this.siblings('a').removeClass('current');
                    $this.addClass('current');
                    ths.renderset.district({id:id});
                    if(title.hasClass('has-city-title')){
                        if(title.html().search("/")!=-1){
                            value=title.html().split('<span style="color:#cfcfcf"> / </span>').slice(0,-1)[0];
                        }else{
                            value=title.html();
                        }
                    }
                    value+='<span style="color:#cfcfcf"> / </span>'+name; 
                    title.html(value);
                    title.addClass('has-city-title');
                    ths.dom.find("input.iCity").val(id);
                }
            });
            this.mask.find(".district").on("click","a",function(){
                var $this=$(this),id=$this.attr("attr-id"),name=$this.attr("title"),title=ths.wrap.find(".city-title"),value="";
                if(!$this.hasClass('current')){
                    $this.siblings('a').removeClass('current');
                    $this.addClass('current');
                    if(title.hasClass('has-city-title')){
                        if(title.html().split('<span style="color:#cfcfcf"> / </span>').length > 2){
                            value=title.html().split('<span style="color:#cfcfcf"> / </span>').slice(0,-1).join('<span style="color:#cfcfcf"> / </span>');
                        }else{
                            value=title.html();
                        }
                    }
                    value+='<span style="color:#cfcfcf"> / </span>'+name; 
                    title.html(value);
                    title.addClass('has-city-title');

                    ths.dom.find("input.iArea").val(id);
                }
            });

        },
        render:function(){
            var ths=this;

            return{
                province:function(){
                    ths.postData(ths.settings.provUrl,{},function(data){
                        var _str="";
                        var _group = {"A~G":[],"H~K":[],"L~S":[],"T~Z":[]};
                        data = data.sort(function(a,b){return a.pinyin[0].toUpperCase().charCodeAt()-b.pinyin[0].toUpperCase().charCodeAt();})
                        for(var i=0;i<data.length;i++){
                            var firstLetter=data[i].pinyin[0].toUpperCase();
                            if(/[A-G]/.test(firstLetter)){
                                _group["A~G"].push(data[i]);
                            }else if(/[H-K]/.test(firstLetter)){
                                _group["H~K"].push(data[i]);
                            }else if(/[L-S]/.test(firstLetter)){
                                _group["L~S"].push(data[i]);
                            }else if(/[T-Z]/.test(firstLetter)){
                                _group["T~Z"].push(data[i]);
                            }
                        }
                        for(var c in _group){
                            if(_group.hasOwnProperty(c)){
                                _str+='<dl class="city-slt-prov">';
                                _str+='<dt>'+c+'</dt>';
                                _str+='<dd>';
                                for(var i=0;i<_group[c].length;i++){
                                    if(ths.settings.curProvId && ths.settings.curProvId==_group[c][i].ProID){
                                        _str+='<a class="current" title="'+_group[c][i].name+'" attr-id='+_group[c][i].ProID+'>'+_group[c][i].name+'</a>';
                                        ths.wrap.find(".city-title").html(_group[c][i].name).addClass('has-city-title');
                                    }else{
                                        _str+='<a title="'+_group[c][i].name+'" attr-id='+_group[c][i].ProID+'>'+_group[c][i].name+'</a>';
                                    }
                                }
                                _str+='</dd>';
                                _str+='</dl>';
                            }
                        }
                        ths.mask.find(".mk-slt-cont .prov").html(_str);
                    });
                },
                city:function(_data){

                    var id = _data.id;

                    if( !id ){
                        ths.mask.find(".mk-slt-cont .city").html("");
                        return;
                    }

                    ths.postData(ths.settings.cityUrl,{id:_data.id},function(data){
                        
                        var _str = "", _group = [],flag=1;                        
                        data = data.sort(function( a, b ){ return a.ProID - b.ProID;});
                        for( var i=0; i < data.length; i++ ){
                            console.log(data[i].ProID,id);
                            if( data[i].ProID == id ){
                                _group.push( data[i] );
                                flag=2;
                            }else{
                                if(flag==2){
                                    flag=3;
                                }
                            }
                            if(flag==3){
                                break;
                            }

                        }
                        _str += '<dl class="city-slt-city">';
                        _str += '<dd>';
                        for( var i=0; i < _group.length; i++ ){
                            if(ths.settings.curCityId && ths.settings.curCityId==_group[i].CityID){
                                _str+='<a class="current" title="'+_group[i].name+'" attr-id="'+_group[i].CityID+'" parent-id="'+_group[i].ProID+'" href="javascript:;">'+_group[i].name+'</a>';
                                var title=ths.wrap.find(".city-title");
                                title.html(title.html()+'<span style="color:#cfcfcf"> / </span>'+_group[i].name);
                            }else{
                                _str+='<a title="'+_group[i].name+'" attr-id="'+_group[i].CityID+'" parent-id="'+_group[i].ProID+'" href="javascript:;">'+_group[i].name+'</a>';
                            }
                        }
                        _str += '</dd>';
                        _str+='</dl>';
                        ths.mask.find(".mk-slt-cont .city").html(_str);
                    });
                },
                district:function(_data){
                    
                    var id=_data.id;
                    
                    if( !id ){

                        ths.mask.find(".mk-slt-cont .district").html("");
                        return;
                    }

                    ths.postData(ths.settings.districtUrl,{id:_data.id},function(data){

                        var _str = "", _group = [],flag=1;                        
                        data = data.sort(function( a, b ){ return a.CityID - b.CityID;});
                        
                        for( var i=0; i < data.length; i++ ){
                            console.log(data[i].CityID,id);

                            if( data[i].CityID == id ){
                                _group.push( data[i] );
                                flag=2;
                            }else{
                                if(flag==2){
                                    flag=3;
                                }
                            }
                            if(flag==3){
                                break;
                            }

                        }

                        _str+='<dl class="city-slt-district">';
                        _str+='<dd>';
                        for( var i=0; i < _group.length; i++ ){
                            if(ths.settings.curDistrictId && ths.settings.curDistrictId==_group[i].Id){
                                _str+='<a class="current" title="'+_group[i].name+'" attr-id="'+_group[i].Id+'" attr-parent-id="'+_group[i].CityID+'">'+_group[i].name+'</a>';
                                var title=ths.wrap.find(".city-title");
                                title.html(title.html()+'<span style="color:#cfcfcf"> / </span>'+_group[i].name);
                            }else{
                                _str+='<a title="'+_group[i].name+'" attr-id="'+_group[i].Id+'" attr-parent-id="'+_group[i].CityID+'">'+_group[i].name+'</a>';
                            }
                        }
                        _str+='</dd>';
                        _str+='</dl>';
                        ths.mask.find(".mk-slt-cont .district").html(_str);
                    });
                },
                render:function(){
                    this.province();
                    this.city({id:ths.settings.curProvId});
                    this.district({id:ths.settings.curCityId});
                }
            }
        },
        /**
         * [postData description]
         * @param  {[type]}   url  [description]
         * @param  {[type]}   data [description]
         * @param  {Function} fn   [description]
         * @return {[type]}        [description]
         */
        postData:function( url, data, fn ){
            var ths=this;
            $.ajax({
                url:url,
                data:data,
                success:function( e ){
                    if( !e.code ){
                        fn && fn.call( ths, e.data );
                        return ;
                    }
                    alert("错误代码:"+e.code+", 请排除错误后继续");
                },
                error:function(){
                    alert("获取数据出错！");
                }
            });
        }

    };
    $.extend( area.prototype, method );
    $.extend( $.fn, { "Area": Area } );

})( jQuery, window );