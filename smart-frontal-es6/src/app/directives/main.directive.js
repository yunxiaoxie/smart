import sortTpl from '../templates/tablesort.html';
import paginationTpl from '../templates/pagination-control.html';
import dateRangePicker from "../templates/date-range-picker.html"
import * as bootbox from '../../lib/bootbox';

/**
 * Created by yunxiaoxie.
 */
angular.module('directive')
/**
 * 列表排序.
 */
    /*.directive('tbSort', [function () {
        return {
            restrict: 'EA',
            template: sortTpl,
            scope: true,
            transclude: true,
            controller: ['$scope', function ($scope) {
                //current sort and column
                $scope.$parent.curSort = '', $scope.$parent.curCol = '';
                var curSort = '';
                $scope.theadSort = function () {
                    $scope.$parent.curSort = getCurSort();
                    $scope.$parent.curCol = $scope.getColName();
                    $scope.$emit("sortEvent", $scope.$parent.curCol, $scope.$parent.curSort);
                }

                var getCurSort = function () {
                    if (!curSort) {
                        curSort = 'asc';
                    }
                    else if (curSort === 'asc') {
                        curSort = 'desc';
                    }
                    else if (curSort === 'desc') {
                        curSort = '';
                    }
                    return curSort;
                }
            }],
            link: function ($scope, $element, $attrs, ctrl) {

                $scope.getColName = function () {
                    return $attrs.tbSort;
                }
            }
        }
    }])*/

    .directive('hasPermission', ['$rootScope', 'permissions', function ($rootScope, permissions) {
        return {
            link: function (scope, element, attrs) {
                if (!_.isString(attrs.hasPermission))
                    throw "hasPermission value must be a string";

                var value = attrs.hasPermission.trim();
                var notPermissionFlag = value === "";
                // if (notPermissionFlag) {
                //     value = value.slice(1).trim();
                // }
                function toggleVisibilityBasedOnPermission() {
                    if (!IsDebug) {
                        $rootScope.curentuser.then(function (cu) {
                            var hasPermission = permissions.hasPermission(cu, value || '');

                            if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                                // element[0].style.display = '';
                            } else {
                                element[0].remove();
                            }
                        })
                    }

                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }])
    /**
     * 页面分页控制.
     */
    /*.directive('pageControl', [function () {

        return {
            restrict: 'EA',
            template: paginationTpl,
            scope: {
                record: '=',
                evname: '@'
            },
            controller: ['$scope', function ($scope) {
                $scope.$on('modelInitialized', function (event, param) {
                    setPages($scope.record);
                })
                var setPages = function (data) {
                    if (data) {
                        $scope.pgs = {};
                        $scope.pgs.currentPg = data.pageNo;
                        $scope.pgs.lastPg = data.pageTotal;
                        $scope.pgs.pageSize = data.pageSize;
                    }
                }
                $scope.first = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === 1) return;
                    $scope.pgs.currentPg = 1;
                }
                $scope.prev = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === 1) return;
                    $scope.pgs.currentPg -= 1;
                }
                $scope.next = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg >= $scope.pgs.lastPg) return;
                    $scope.pgs.currentPg += 1;
                }
                $scope.last = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === $scope.pgs.lastPg) return;
                    $scope.pgs.currentPg = $scope.pgs.lastPg;
                }
                $scope.$watch('pgs.currentPg', function (newValue, oldValue) {
                    if (newValue) {
                        //$scope.$parent.getMaterialTask($scope.pgs.currentPg, $scope.pgs.pageSize, $scope.$parent.taskState);
                        if ($scope.$parent.taskState) {
                            $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize, $scope.$parent.taskState);
                        }
                        else {
                            $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize);
                        }
                    }
                });
            }],
            link: function ($scope, $element, $attrs, ctrl) {

            }
        }
    }])*/
    /**素材列表-截止时间*/
    .directive('stopTimeDirective', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                scope.html = "";
                let stopTime = new Date(attrs.stoptime);
                let nowTime = new Date();
                let diff = stopTime.getTime() - nowTime.getTime();//时间差的毫秒数
                let days = Math.floor(diff / (24 * 3600 * 1000));
                // //计算出小时数
                // let leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                // let hours = Math.floor(leave1 / (3600 * 1000));
                /*24小时后即将过期或过期的素材栏高亮显示*/
                if (days <= 0) {
                    scope.html = "<span style='color:orange'>" + attrs.stoptime + "</span>"
                }
                else {
                    scope.html = "<span>" + attrs.stoptime + "</span>"
                }
                let el = $compile(scope.html)(scope);
                element.append(el);
            }
        };
    }])

    .directive('dateRangePicker', [function () {
        return {
            restrict: 'AE',
            scope: {
                // models
                minDate: '=',
                maxDate: '=',
                onOk: "&",
            },
            template: dateRangePicker,
            link: function ($scope, element, attrs) {
                $scope.options1 = {
                    maxDate: new Date(),

                };
                $scope.options2 = {

                    maxDate: new Date(),
                };

                $scope.isOpen = false;
                $scope.closemodal = function () {
                    $scope.isOpen = false;
                    if (angular.isFunction($scope.onOk)) {
                        $scope.onOk();
                    }
                }
            }
        };
    }])

    /**
     * 活动列表按钮
     * */
    .directive("activityListButton", ["$state", "$compile", "ActivityService", function ($state, $compile, ActivityService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                listItem: "@"
            },
            template: "<div></div>",
            link: function (scope, element, attrs) {
                scope.html = "";
                let item = JSON.parse(scope.listItem);
                let preViewHtml = "";
                let spanHtml = "";
                if (item.activeStatusName == '已下线') {
                    preViewHtml = "<button has-permission='activity_preview' type='button' class='btn btn-secondary' disabled='disabled'><i class='fa fa-search' aria-hidden='true'></i>预览</button>";
                    spanHtml = "<span>发布</span>";
                }
                else {
                    preViewHtml = "<a has-permission='activity_preview' class='btn btn-secondary' href='" + item.initialUrl + "' target='_blank'><i class='fa fa-search' aria-hidden='true'></i>预览</a>";
                    spanHtml = "<span>取消发布</span>";
                }
                let editHtml = "<button has-permission='activity_edit' type='button' class='btn btn-secondary' ng-click=\"editActivity('"+item.id + "','" + item.activeName + "')\"><i class='fa fa-edit' aria-hidden='true'></i>编辑</button>";
                /**
                 * 编辑
                 * */
                scope.editActivity = function (id, name) {
                    $state.go("main.activityEdit", {activityId: id, activityName: name});
                };

                let moreHtml = "<div class='btn-group' has-permission='activity_more'>"
                    + "<button type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown'>"
                    + "<i class='icon-icon-more' aria-hidden='true'></i>更多</button>"
                    + "<ul class='dropdown-menu' role='menu'>"
                    + "<li><a has-permission='activity_online_offline' href ng-click=\"updateActivityStatus('"+ item.id + "','" + item.activeStatus + "','" + item.activeStatusName + "')\">" + spanHtml + "</a></li>"
                    + "<li><a has-permission='activity_delete' href ng-click=\"deleteActivity('"+ item.id + "')\">删除</a></li>"
                    + "</ul></div>";
                /**
                 * 发布 / 取消发布
                 * */
                scope.updateActivityStatus = function (id, activeStatus, activeStatusName) {
                    let postData = {
                        "id": id,
                        "activeStatus": activeStatus
                    };
                    if (activeStatusName == "已上线") {
                        bootbox.confirm({
                            title: "操作提示",
                            message: "取消发布后，该活动页将被下线无法访问。",
                            closeButton: false,
                            buttons: {
                                confirm: {
                                    label: '确认',
                                    className: 'btn-primary btn-plr-35'
                                },
                                cancel: {
                                    label: '取消',
                                    className: 'btn-default btn-plr-35'
                                }
                            },
                            callback: function (yes) {
                                if (yes) {
                                    updateActivityStatus(postData);
                                }
                            }
                        });
                    } else {
                        updateActivityStatus(postData);
                    }

                };
                let updateActivityStatus = function (postData) {
                    ActivityService.onOrOffLine(postData)
                        .then((data)=> {
                            scope.$parent.$parent.getActivityList(null, null, true);
                        });
                };

                /**
                 * 删除
                 * */
                scope.deleteActivity = function (id) {
                    bootbox.confirm({
                        title: "操作提示",
                        message: "删除操作不可恢复，确认要删除该活动项吗？",
                        closeButton: false,
                        buttons: {
                            confirm: {
                                label: '确认',
                                className: 'btn-primary btn-plr-35'
                            },
                            cancel: {
                                label: '取消',
                                className: 'btn-default btn-plr-35'
                            }
                        },
                        callback: function (yes) {
                            if (yes) {
                                ActivityService.deleteActivity(id)
                                    .then((data)=> {
                                        scope.$parent.$parent.getActivityList(null, null, true);
                                    });
                            }
                        }
                    });
                };

                scope.html = preViewHtml + editHtml + moreHtml;
                element.append($compile(scope.html)(scope));
            }
        }
    }])

    /*
    you also could build a plugin like this:
    (function(window, angular, undefined) {
        'use strict';
        var module = angular.module('ngHolder', []);
        module.directive('holder', [ 
            function() {
                return {
                  link: function(scope, element, attrs) {
                    if(attrs.holder)
                      attrs.$set('data-src', attrs.holder);
                    Holder.run({images:element[0]});
                  }
                };
            }]);
    })(window, window.angular);
    */
    .directive('ngHolder', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                attrs.$set('data-src', attrs.ngHolder);
                var holder = require('holderjs');
                holder.run({images:element[0], nocss:true});
            }
        };
    }])
    //移入显示弹层
    .directive('popoverHoverable', function ($timeout, $document) {
        return {
            restrict: 'A',
            scope: {
                popoverHoverable: '=',
                popoverIsOpen: '='
            },
            link: function(scope, element, attrs) {
                scope.insidePopover = false;

                scope.$watch('insidePopover', function (insidePopover) {
                    togglePopover(insidePopover);
                });
              
                scope.$watch('popoverIsOpen', function (popoverIsOpen) {
                  scope.insidePopover = popoverIsOpen;
                });

                function togglePopover (isInsidePopover) {
                    $timeout.cancel(togglePopover.$timer);
                    togglePopover.$timer = $timeout(function () {
                        if (isInsidePopover) {
                            showPopover();
                        } else {
                            hidePopover();
                        }
                    }, 100);
                }

                function showPopover () {
                    if (scope.popoverIsOpen) {
                        return;
                    }
                    if (!insidePopover(scope.target)) {
                        $(element[0]).click();
                    }
                }

                function hidePopover () {
                    scope.popoverIsOpen = false;
                    scope.insidePopover = false;
                }

                $(document).bind('mouseover', function (e) {
                    var target = e.target;
                    if (inside(target)) {
                        scope.insidePopover = true;
                        scope.target = e.target
                        scope.$digest();
                    }
                });

                $(document).bind('mouseout', function (e) {
                    var target = e.target;
                    if (inside(target)) {
                        scope.insidePopover = false;
                        scope.$digest();
                    }
                });

                scope.$on('$destroy', function () {
                    $(document).unbind('mouseenter');
                    $(document).unbind('mouseout');
                });

                function inside (target) {
                    return insideTrigger(target) || insidePopover(target);
                }

                function insideTrigger (target) {
                    return element[0].contains(target);
                }

                function insidePopover (target) {
                    var isIn = false;
                    var popovers = $('.popover-inner');
                    for (var i = 0, len = popovers.length; i < len; i++) {
                        if (popovers[i].contains(target)) {
                            isIn = true;
                            break;
                        }
                    }
                    return isIn;
                }
            }
        };
    });