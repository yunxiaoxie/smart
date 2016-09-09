# 优化或解决插件Bugs

## 简介

- ui-bootstrap : 选择日期后，Model中拿到的是date，直接传递Model有问题，需要用Filter转换，
  更新插件就是在3003行加入内部自动转换。
  ngModel.$parsers.push(function toModel(viewValue) {
    var dateFilter = $filter('date');
    return attrs.format ? dateFilter(viewValue, attrs.format) : viewValue;
  });

- ztree : 目录树，为了适应ui-router，需要修改源码。

  找到view对象的方法：makeDOMNodeNameBefore，在for循环体下加入下面的代码，同时注释原有的。
  
  //begin ui-sref
	        if(setting.data.key.uiSref && node[setting.data.key.uiSref]) {
	            html.push("<a id='", node.tId, consts.id.A,"' ui-sref='",node[setting.data.key.uiSref], "' class='", consts.className.LEVEL, node.level,"' treeNode", consts.id.A, "' style='", fontStyle.join(''),"'");
	        } else {
	            html.push("<a id='", node.tId, consts.id.A,"' class='", consts.className.LEVEL, node.level,"' treeNode", consts.id.A," onclick=\"", (node.click || ''), 
	                "\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''), 
	                "'");
	        }
	        //end ui-sref
- ztree for bootstrap

  复制metro.css及相应图片到ztree目录即可。

- 

