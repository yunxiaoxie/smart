# 优化或解决插件Bugs

## 简介

- ui-bootstrap : 选择日期后，Model中拿到的是date，直接传递Model有问题，需要用Filter转换，
  更新插件就是在3003行加入内部自动转换。
  ngModel.$parsers.push(function toModel(viewValue) {
    var dateFilter = $filter('date');
    return attrs.format ? dateFilter(viewValue, attrs.format) : viewValue;
  });

- 

- 

