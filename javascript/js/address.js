var api={//数据交互
        hotCity : '',//热门城市数据
        provinceCitys: "",
        dateInfo :{//数据信息
            channelSource : "WEIXIN",
            addressId: "",
            memType:"2",
            contactName: "",
            contactTel: "",
            countryCode:"A000086000",
            country:"中国",
            province: "",
            provinceCode: "",
            city: "",
            cityCode: "",
            county: "",
            countyCode: "",
            locationCode: "",
            latitude: "",
            longitude: "",
            address: "",
            companyName: "",
            contactSpell : "", // 联系人拼音
            postCode : "", // 邮政编码
            type : "1" ,//0删除 1新增 2修改  3 需要保存但不会添加到地址簿的地址
            isDefault : "0"//0:不是默认地址，1是默认地址
        },
        SplitTip:function(statu){//智能拆分后显示了提示，再次编辑不同模块将提示消失
        	console.log(statu);
        	el.SmartSplit = 0;//提示信息之后重置智能拆分的点击量。
    		switch(statu){
				case "user":
			  		el.SplitTips.hide();
		  			el.userNameLine.hide();
			  	break;
			  	case "tel":
			  		el.SplitTips.hide();
			  		el.userTelLine.hide();
			  	break;
			  	case "address":
			  		el.SplitTips.hide();
			  		el.nearlyLine.hide();
			  	break;
			  	case "clear":
			  		el.userTelLine.hide();
		        	el.userNameLine.hide();
		        	el.nearlyLine.hide();
		        	el.SplitTips.hide();
			  	break;
			  	case "split":
		        	el.userTelLine.hide();
		        	el.userNameLine.hide();
		        	el.nearlyLine.hide();
		        	el.SplitTips.show();
		        	el.userInput = 0;//点击智能拆分之后将用户姓名栏的点击量恢复为0
		        	el.telInput = 0;
		        	//姓名
		        	api.dateInfo.contactName == '' ? el.userNameLine.show() : "";
		        	//电话
		        	api.dateInfo.contactTel == '' ? el.userTelLine.show() : "";
		        	//详细地址
		        	api.dateInfo.address == '' ? el.nearlyLine.show() : "";
		        break;
		        default:
			}
        },
        addrResolution:function(_address){//地址拆分
            new_address_ctly.addrResolution_ctly(_address);
            cm.mutual.tipsLoading("地址解析中");
            /*
             * 拆分之前将缓存中的电话和手机号清空,因为拆分完之后如果没有手机号可能会显示之前的电话号。
             */
            api.dateInfo.contactTel = "";
            api.dateInfo.contactPhone ="";

            $.ajax({
                type : "POST",
                data : {
                    address : _address
                },
                dataType : "json",
                url : "/cx-wechat-order/order/address/intelAddressResolution",
                success : function(data) {
                    if(!data.success || data.success=="false" ){
                        cm.mutual.tipsLoading();
                        cm.mutual.tipsDialog("地址识别失败，请您手动输入！");
                        return;
                    }
                    var o = data.obj;
                    if(!o.personalName && !o.telephone && !o.site){
                        cm.mutual.tipsLoading();
                        cm.mutual.tipsDialog("无法识别您输入的信息！");
                        sessionStorage.removeItem("addrResolutionSession");
                        return;
                    }
                    api.dateInfo.contactName=o.personalName;
                    var _tel = o.telephone;
                     if(_tel && (_tel.indexOf("1")==0 || _tel.indexOf("+86")==0 || _tel.indexOf("86")==0)){
                        //_tel = _tel.replace(/[^\d\-|\+]/g,"");
                        _tel = _tel.replace(/\-/g,"");
                     }
                    api.dateInfo.contactTel=_tel || "";;
                    api.dateInfo.province=o.province || "";
                    api.dateInfo.city=o.city || "";
                    api.dateInfo.address=o.site || "";
                    api.dateInfo.county=o.area || "";
                    api.dateInfo.addressId="";
                    api.dateInfo.companyName="";
					api.dateInfo.isDefault = "0";
                    if(!o.city || !o.area){
                        fillin.initDate(api.dateInfo);
						$(window).scrollTop(0);
                        cm.mutual.tipsLoading();
                        return;
                    }
                    var _addr=o.province + o.city +o.area + o.site+"";
                    //根据地址信息查询经纬度
                    bdMap.getAddressByLocal(o.city,_addr,function(point){//用顺丰方式
                        if(point){
                            var p = point.split(",");
                            api.dateInfo.latitude=p[0];
                            api.dateInfo.longitude=p[1];
                        }
                        fillin.initDate(api.dateInfo);
                        fillin.isBtnDo();
						$(window).scrollTop(0);
                        cm.mutual.tipsLoading();
                    });

                    //设置拆分后的提示信息显示
                    api.SplitTip("split");

                },
                error : function(XMLHttpRequest, textStatus,errorThrown) {
                    cm.mutual.tipsLoading();
                    cm.mutual.tipsDialog("服务器繁忙，请稍后再试！");
                }
            });
        },
        areaAddressInfo : function(status, area) {// 查询省市。area为空时，查询省。否则查询市区,status: province:省，city:市，county：区
            if (status == "province") {// 查询省份。传递级别字段为1
                fillin.provide_map = new Map();
                var provincelist = new Array();
                var proCityobj = JSON.parse(api.provinceCitys);
                var provinces = proCityobj.obj;
                for (var i = 0; i < provinces.length; i++) {
                    provincelist.push(provinces[i].fullName);
                    fillin.provide_map.put(provinces[i].fullName,provinces[i]);
                }
                fillin.provinceNameList = provincelist;
                return;
            }  else if (status == "city") {// 省份需要areaCode
                fillin.city_map = new Map();
                var citylist = new Array();
                if(!fillin.provide_map.get(area)){
                    return;
                }
                var citys = fillin.provide_map.get(area).city;
                for (var i = 0; i < citys.length; i++) {
                    citylist.push(citys[i].fullName);
                    fillin.city_map.put(citys[i].fullName,citys[i]);
                }
                fillin.cityNameList = citylist;
                return;
            }  else if (status == "county") {
                fillin.county_map = new Map();
                var countylist = new Array();
                if(!fillin.city_map.get(area)){
                    return;
                }
                var countys = fillin.city_map.get(area).county;
                if(countys.length==0){
                    api.queryCounty("5",fillin.city_map.get(area).areaCode);
                    return;
                }
                for (var i = 0; i < countys.length; i++) {
                    countylist.push(countys[i].fullName);
                    fillin.county_map.put(countys[i].fullName,countys[i]);
                }
                countylist.push("暂不选择");
                fillin.countyNameList = countylist;
            }
            return;
            // var _jsonStr = {};
            // if (area == null || area == "") {// 查询省份。传递级别字段为1
            //     _jsonStr = {
            //         level : "2",
            //         areaCode : "A000086000"
            //     };
            // } else {// 省份需要areaCode
            //     var _areaCode = "";
            //     var _areaLevel = "";
            //     if (status == "city") {
            //         var providedate = fillin.provide_map.get(area);// 根据省获取城市相关信息。
            //         if (providedate != null && providedate != "") {
            //             _areaCode = providedate.areaCode;
            //             _areaLevel = parseInt(providedate.level) + 1;
            //         }
            //     } else if (status == "county") {
            //         var citydate = fillin.city_map.get(area);// 根据市获取区相关信息。
            //         if (citydate != null && citydate != "") {
            //             if (area.indexOf("北京")!=-1 || area.indexOf("天津")!=-1 || area.indexOf("上海")!=-1 || area.indexOf("重庆")!=-1) {
            //                 _areaCode = citydate.parentareaCode;
            //             } else {
            //                 _areaCode = citydate.areaCode;
            //             }
            //             _areaLevel = parseInt(citydate.level) + 1;
            //         }
            //         if (_areaCode == "") {
            //             return;
            //         }
            //     }
            //     _jsonStr = {
            //         level : _areaLevel + "",
            //         areaCode : _areaCode
            //     };
            // }
            // var s = JSON.stringify(_jsonStr);
            // var ddArr = {};
            // ddArr.jsonStr = s;
            //
            // $.ajax({
            //     type : "POST",
            //     data : ddArr,
            //     async : false,
            //     dataType : "json",
            //     url : "/cx-wechat-order/order/weixin/adress/queryProviderCity",
            //     success : function(data) {
            //         if (data) {
            //             if (data.success == false|| data.success == "false") {
            //                 cm.mutual.tipsDialog("查询省市失败，请稍后再试！");
            //                 return;
            //             }
            //             var result = data.obj.levelList;
            //             if (status == "province") {// 查询省份。传递级别字段为1
            //                 fillin.provide_map = new Map();
            //                 var provincelist = new Array();
            //                 for (var i = 0; i < result.length; i++) {
            //                     provincelist.push(result[i].fullName);
            //                     fillin.provide_map.put(result[i].fullName,result[i]);
            //                 }
            //                 fillin.provinceNameList = provincelist;
            //             } else if (status == "city") {// 省份需要areaCode
            //                 fillin.city_map = new Map();
            //                 var citylist = new Array();
            //                 for (var i = 0; i < result.length; i++) {
            //                     citylist.push(result[i].fullName);
            //                     fillin.city_map.put(result[i].fullName,result[i]);
            //                 }
            //                 fillin.cityNameList = citylist;
            //             } else if (status == "county") {
            //                 fillin.county_map = new Map();
            //                 var countylist = new Array();
            //                 for (var i = 0; i < result.length; i++) {
            //                     countylist.push(result[i].fullName);
            //                     fillin.county_map.put(result[i].fullName,result[i]);
            //                 }
            //                 fillin.countyNameList = countylist;
            //             }
            //         }
            //     },
            //     error : function(XMLHttpRequest, textStatus,errorThrown) {
            //         cm.mutual.tipsDialog("服务器繁忙，请稍后再试！");
            //     }
            // });
        },
        queryCounty: function(_level,_areaCode){//查询省市区
            cm.mutual.tipsLoading("查询中");
            var _jsonStr = {
                    level : _level,
                    areaCode : _areaCode
                };
            var s = JSON.stringify(_jsonStr);
            var ddArr = {};
            ddArr.jsonStr = s;
            $.ajax({
                type : "POST",
                data : ddArr,
                async : false,
                dataType : "json",
                url : "/cx-wechat-order/order/weixin/adress/queryProviderCity",
                success : function(data) {
                    cm.mutual.tipsLoading();
                    if (data) {
                        var countylist = new Array();
                        if (data.success == false|| data.success == "false") {
                            cm.mutual.tipsDialog("查询区失败，请稍后再试！");
                            countylist.push("暂不选择");
                            fillin.countyNameList = countylist;
                            return;
                        }
                        var result = data.obj.levelList;
                        fillin.county_map = new Map();
                        for (var i = 0; i < result.length; i++) {
                            countylist.push(result[i].fullName);
                            fillin.county_map.put(result[i].fullName,result[i]);
                        }
                        countylist.push("暂不选择");
                        fillin.countyNameList = countylist;
                    }
                },
                error : function(XMLHttpRequest, textStatus,errorThrown) {
                    cm.mutual.tipsLoading();
                    cm.mutual.tipsDialog("服务器繁忙，请稍后再试！");
                    var countylist = new Array();
                    countylist.push("暂不选择");
                    fillin.countyNameList = countylist;
                }
            });
        },
        //灰度检查
        verifyIsPilotGrayOpenId:function(callback){//根据城市编码查询
            var verifyIsFlg = false;
            $.ajax({
              type : "POST",
              timeout : 2000,
              url : "/cx-wechat-query/query/validate/verifyIsPilotGrayOpenId",
              success : function(data) {
                  if(data.success && data.obj && (data.obj.pilotOpenId || data.obj.pilotOpenId=="true")){
                    verifyIsFlg=true;
                  }
                  callback(verifyIsFlg);
              },
              error : function(XMLHttpRequest, textStatus,errorThrown) {
                  callback(verifyIsFlg);
              }
            });
        },//OCR灰度检查
        verifyIsGrayUserByType:function(callback){//
            var verifyIsFlg = false;
            $.ajax({
              type : "POST",
              data : {type:"2"},
              timeout : 2000,
              url : "/cx-wechat-order/order/weixin/queryIsGrayUserByType",
              success : function(data) {
                  if(data.success && data.obj && data.obj.pilotOpenIdAndType=="true"){
                    verifyIsFlg = true;
                  }
                  callback(verifyIsFlg);
              },
              error : function(XMLHttpRequest, textStatus,errorThrown) {
                  callback(verifyIsFlg);
              }
            });
        },
        locationAddress : function() {//地址定位
            if (!$("#areaResslistid").hasClass("hide")) {
                fillin.hideList("areaResslistid");
            }
            if (!$("#addresslistid").hasClass("hide")) {
                fillin.hideList("addresslistid");
            }
            if (!$("#locationlistid").hasClass("hide")) {
                fillin.hideList("locationlistid");
            }
            bdMap.localSearch(function(resultData, sour) {
                new_address_ctly.select_local_point();//附近地址埋点
                if (resultData && resultData != "error") {
                    var province = "";
                    var city = "";
                    var district = "";
                    if(sour=="bd"){
                        province = resultData.result.addressComponent.province;
                        city = resultData.result.addressComponent.city;
                        district = resultData.result.addressComponent.district;
                    }
                    var result = resultData.result.pois;
                    if (result && result.length > 0) {
                        var addressCon = [];
                        addressCon.push("<dt>附近地址</dt>");
                        for (var i = 0; i < result.length; i++) {
                            var x=0,y=0;
                            if(sour=="sf"){
                                if(!result[i].x || !result[i].y){
                                    continue;
                                }
                                province = result[i].province;
                                city = result[i].city;
                                district = result[i].district;
                                x = result[i].x;
                                y = result[i].y;
                            }else{
                                if (!result[i].point) {
                                    continue;
                                }
                                x = result[i].point.x;
                                y = result[i].point.y;
                            }
                            var addr = api.formatAddress(province,city,district,result[i].addr);

                            addressCon.push('<dd class="bg" data-name="'+ result[i].name+ '" data-addr="'+ addr + '" data-province="'+ province+ '" data-city="' + city+ '"  data-county="'+ district + '" data-lng="'+ x+ '" data-lat="'+ y + '">');
                            addressCon.push('<span class="name">'+ result[i].name+ '</span>');
                            addressCon.push('<p class="address">'+ result[i].addr + '</p>');
                            addressCon.push('</dd>');
                        }
                        $("#locationlistid").append(addressCon.join(""));
                        fillin.showList("locationlistid");
                    }
                } else {
                    cm.mutual.tipsDialog("查询附近地址出错~");
                }
            });
        },
        formatAddress: function (province,city,district,address) {//格式化省市区数据。去掉重复的省市区
            if (province.indexOf("北京") != -1 || province.indexOf("天津") != -1 || province.indexOf("上海") != -1 || province.indexOf("重庆") != -1) {

            } else {
                if (address.indexOf(province) != -1) {
                    address = address.replace(province, "");
                }
            }
            if (address.indexOf(city) != -1) {
                address = address.replace(city, "");
            }
             if (address.indexOf(district) != -1) {
                 address = address.replace(district, "");
             }
            return address;
        },
        saveAddress:function(){//保存地址
            function saveFn(){
                if (saveFlg) {
                    cm.mutual.tipsDialog("请不要着急哦，正在保存中！");
                    return;
                }

                saveFlg = true;
                var saveInfo = api.dateInfo;
                cm.mutual.tipsLoading("正在保存");
                var s = JSON.stringify(saveInfo);
                var ddArr = {};
                ddArr.jsonStr = s;
                $.ajax({
                    type : "POST",
                    url : "/cx-wechat-order/order/weixin/adress/saveAddress",
                    data : ddArr,
                    dataType : "json",
                    success : function(data) {
                        cm.mutual.tipsLoading();
                        saveFlg = false;
                        if (data.success == false || data.success == "false") {
                            if(data.errorCode=="EMPTY_LOCATIONCODE"){
                                cm.mutual.tipsDialog("省市区信息异常，请重新选择省市区哦！");
                            }else{
                                var message = data.message;
                                if(!message){
                                    message=data.errorMessage;
                                }
                                cm.mutual.tipsDialog("保存地址失败，请稍后再试！");
                            }
                            return;
                        }
                        var _addressId = data.obj.addressId;
                        api.dateInfo.addressId = data.obj.addressId;
                        if (!_addressId) {
                            cm.mutual.tipsDialog("保存地址返回结果失败,请稍后再试！");
                            return;
                        }
                        if(fillin.from=="editBook"){//删除缓存数据
                            sessionStorage.removeItem("addressBookItem");
                        }else{
                            cm.page.setStorage(fillin.addtype + "Address", JSON.stringify(api.dateInfo));
                        }
                        //address_ctly.wayBuilding_ctly();
                        //	cmctly.end();// 关闭埋点
                        //	address_ctly.removeAddressSession();// 清空地址页面session
                        sessionStorage.removeItem("addrResolutionSession");//清楚智能地址页面信息
                        processc.gotoBack();
                    },
                    error : function(XMLHttpRequest, textStatus,errorThrown) {
                        saveFlg = false;
                        cm.mutual.tipsLoading();
                        cm.mutual.tipsDialog("服务器繁忙，请稍后再试！");
                    }
                });
            }

            if (cm.page.getUrlParm("type") == "sending") {
                api.queryQilot(api.dateInfo.locationCode,saveFn); // 如果是寄件地址，检查是否试点区域
                return;
            }
            saveFn();
        },
        addressbyname : function(_name, _sour) {// _sour：是否来源初始化

            // return; 屏蔽历史地址
            if(fillin.from=="editBook" || fillin.from=="addBook")return;
            _name = _name.replace(/[\s+'")\-><&\\\/\.?!~@#$%^&*]/g,"");
            fillin.hideList("addresslistid");
            if (!$("#areaResslistid").hasClass("hide")) {
                fillin.hideList("areaResslistid");
            }
            if (!$("#locationlistid").hasClass("hide")) {
                fillin.hideList("locationlistid");
            }
            var _jsonStr = {
                addressId : "",
                address : "",
                contact : _name,
                memType : "",
                rowcount : "20",
                telPhone : "",
                queryType:"1",//0按默认地址修改的时间的先后来排序,1按地址的修改时间来排,2按使用寄件地址的时间来排
            };
            var s = JSON.stringify(_jsonStr);
            var ddArr = {};
            ddArr.jsonStr = s;
            $.ajax({
                type : "POST",
                data : ddArr,
                dataType : "json",
                timeout : 3000,
                url : "/cx-wechat-order/order/weixin/adress/queryAddress",
                success : function(result) {
                    if (result) {
                        if (result.success == false || result.success == "false") {
                            // cm.mutual.tipsDialog("查询寄件历史地址，请稍后再试！");
                            return;
                        }
                        var list = result.obj;
                        if (list == 0) {
                            fillin.hideList("addresslistid");
                            return;
                        }
                        var conrbn = [];
                        // conrbn.push('<dt>历史地址</dt>'); 隐藏标题
                        for (var i = 0; i < list.length; i++) {
                            fillin.user_map.put(list[i].addressId, list[i]);
                            var tel = list[i].contactTel|| list[i].contactPhone;
                            conrbn.push('<dd class="bg" data-addressId="'+ list[i].addressId + '">');
                            conrbn.push('<span class="name">'+ list[i].contactName + '</span>');
                            conrbn.push('<span class="tel">'+ tel + '</span>');
                            var pro = list[i].province;
                            var city = list[i].city;
                            var county = list[i].county;
                            var address = list[i].address.replace(/\_\_/g,"");
                            var addressinfo = pro+" "+city+" "+county+" "+address;
                            conrbn.push('<p class="address">' + addressinfo + '</p>');
                            conrbn.push('</dd>');
                        }
                        conrbn.push('<a href="javascript:void(0)" class="coin-more">进入地址簿,查看更多&nbsp;&nbsp;&gt;&gt;</a>');
                        $("#addresslistid").html( conrbn.join(""));
                        fillin.showList("addresslistid");
                        if (_sour) {
                            $("input").blur();
                            //  address_ctly.loadHTML(new Date().getTime());
                        }
                    }
                    $(".coin-more").on("click", function () {
                        new_address_ctly.enter_addressbook();
                        window.location.href = "/cx/order/my-address-book.html" + location.search;
                    });
                },
                error : function(XMLHttpRequest, textStatus,errorThrown) {
                    cm.mutual.tipsDialog("服务器繁忙，请稍后再试！");
                }
            });
        },
        queryQilot:function(_locationCode,callback){
            cm.mutual.tipsLoading("正在检查");
            var ddArr = {};
            ddArr.locationCode = "{\"locationCode\":[\""+_locationCode+"\"]}";
            $.ajax({
                type : "POST",
                url : "/cx-wechat-order/order/validate/queryIsNonpilotCity",
                data : ddArr,
                timeout: 2000,
                dataType : "json",
                success : function(data) {
                    cm.mutual.tipsLoading();
                    if(data.objs.length>0){//非试点
                        cm.mutual.sorryshow("抱歉","您好，由于您选择的寄件地址未参与新版顺丰速运公众号试点，无法完成下单，建议您通过以下方式完成下单");
                        return;
                    }else{
                        callback();
                    }
                },
                error : function(XMLHttpRequest, textStatus,errorThrown) {
                    callback();
                    cm.mutual.tipsLoading();
                    //cm.mutual.tipsDialog("服务器繁忙，请稍后再试！");
                }
            });
        },
        /**
         * 查询热门城市
         */
        queryHotCity : function(queryFlag,callback,errorcallback){
            if(queryFlag!='init'){
                cm.mutual.tipsLoading("查询中");
            }

            $.ajax({
                type : "POST",
                url : "/cx-wechat-order/order/weixin/adress/getHotCity",
                data : '',
                dataType : "json",
                success : function(data) {
                    if(queryFlag!='init'){
                        cm.mutual.tipsLoading();
                    }
                    if(data.success=="true" && data.obj && data.obj.length>0){
                        var objs = data.obj;
                        callback.call(this,objs);
                    }else{
                        errorcallback.call(this);
                    }
                },
                error : function(XMLHttpRequest, textStatus,errorThrown) {
                    if(queryFlag!='init'){
                        cm.mutual.tipsLoading();
                    }
                    errorcallback.call(this);
                }
            });
        }
    };
