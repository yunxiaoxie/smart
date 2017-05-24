angular.module('directive')
// 鼠标导航线
.directive('myCanvas', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          //获得cvs元素相对于浏览器圆点的坐标
          this.winPos2CvsPos = function(cvs,_x,_y){
            var _box = cvs.getBoundingClientRect();
            return {
              x:_x-_box.left*(cvs.width/_box.width),
              y:_y-_box.top*(cvs.height/_box.height)
            }
          },
          //画导航线
          this.drawGuideLines = function(ctx, x, y, w, h){
            ctx.strokeStyle='lightblue';
            ctx.lineWidth=1;
            ctx.clearRect(0, 0, w, h);
            this.drawVerticalLine(ctx, x, h);
            this.drawHorizontalLine(ctx, y, w);
          },
          //画水平线
          this.drawHorizontalLine = function(ctx, y, w){
            ctx.beginPath();
            ctx.moveTo(0,y+.5);
            ctx.lineTo(w,y+.5);
            ctx.stroke();
          },
          //画垂直线
          this.drawVerticalLine = function (ctx, x, h) {
            ctx.beginPath();
            ctx.moveTo(x +.5, 0)
            ctx.lineTo(x +.5, h);
            ctx.stroke();
          },

          //更新显示结果
          this.updateReadout = function (x,y, el) {
            el.innerText = '('+ x.toFixed(0)+','+ y.toFixed(0)+')';
          },
          this.lines=[];
          this.drawLine = function(ctx) {
            ctx.beginPath();
            ctx.strokeStyle='black';
            ctx.lineWidth=3;
            var self = this;
            _.each(this.lines, function(line) {
              _.each(line.points, function(p, i) {
                if (i == 0) {
                  ctx.moveTo(p.x, p.y);
                }
                ctx.lineTo(p.x, p.y);
              })

            })
            ctx.stroke();
          },
          this.createLine = function(ctx,point) {
            if (this.hasNotActiveTrue()) {
              var line = {active: true, points: []}
              line.points.push(point);
              this.lines.push(line);
            } else {
              _.each(this.lines, function(line) {
                if (line.active) {
                  if (Math.abs(point.x - line.points[0].x) <= 5 && Math.abs(point.y - line.points[0].y) <= 5) {
                    line.points.push(point);
                    ctx.closePath();
                    ctx.stroke();
                    line.active = false;
                  } else {
                    line.points.push(point);
                  }
                }
              })
            }
          },
          this.hasNotActiveTrue = function(){
            var result = true;
            _.each(this.lines, function(line){
              if (line.active) {
                result = false;
              }
            });
            return result;
          }
        }],
        link: function (scope, elem, attrs, ctrl) {
            var cvs = elem[0],
                ctx = cvs.getContext("2d"),
                width = attrs.width, // or cvs.width
                height = attrs.height,
                imgsheet = new Image(),
                readoutel = elem.context.parentNode.children[0];
            cvs.onmousemove = function(e){
              var _loc = ctrl.winPos2CvsPos.call(ctrl, cvs, e.clientX, e.clientY);
              ctrl.drawGuideLines.call(ctrl, ctx, _loc.x, _loc.y, width, height);
              ctrl.updateReadout.call(ctrl,_loc.x,_loc.y, readoutel);
              ctrl.drawLine(ctx);
            }
            cvs.onclick = function(e){
              var _loc = ctrl.winPos2CvsPos.call(ctrl, cvs, e.clientX, e.clientY);
              ctrl.createLine(ctx, {x:_loc.x.toFixed(0), y:_loc.y.toFixed(0)});
              ctrl.drawLine(ctx);

            }
        }
    };
}])
//画多边形
.directive('paintCanvas', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          
        }],
        link: function (scope, elem, attrs, ctrl) {
            var Point = function (x, y) {
                this.x = x;
                this.y = y;
            };
            var Polygon = function (centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled) {
                this.x = centerX;//外接圆心x坐标
                this.y = centerY;
                this.radius = radius;//外接圆半径
                this.sides = sides;//边数
                this.startAngle = startAngle;//开始角度
                this.strokeStyle = strokeStyle;
                this.fillStyle = fillStyle;
                this.filled = filled;
            };
            Polygon.prototype = {
                getPoints: function () {//获取多边形所有顶点
                    var points = [],
                            angle = this.startAngle || 0;
                    for (var i=0; i < this.sides; ++i) {
                        points.push(new Point(this.x + this.radius * Math.sin(angle),
                                this.y - this.radius * Math.cos(angle)));
                        angle += 2*Math.PI/this.sides;
                    }
                    return points;
                },
                createPath: function (context) {//创建多边形路径
                    var points = this.getPoints();
                    context.beginPath();
                    context.moveTo(points[0].x, points[0].y);
                    for (var i=1; i < this.sides; ++i) {
                        context.lineTo(points[i].x, points[i].y);
                    }
                    context.closePath();
                },
                stroke: function (context) {//对多边形描边
                    context.save();
                    this.createPath(context);
                    context.strokeStyle = this.strokeStyle;
                    context.stroke();
                    context.restore();
                },
                fill: function (context) {//填充
                    context.save();
                    this.createPath(context);
                    context.fillStyle = this.fillStyle;
                    context.fill();
                    context.restore();
                },
                move: function (x, y) {
                    this.x = x;
                    this.y = y;
                },
            };
            var canvas = document.getElementById('paintCvs'),
                  context = canvas.getContext('2d'),
          //清除按钮
                  eraseAllButton = document.getElementById('eraseAllButton'),
          //描边颜色
                  strokeStyleSelect = document.getElementById('strokeStyleSelect'),
          //画多边形的开始角度
                  startAngleSelect = document.getElementById('startAngleSelect'),
          //填充颜色
                  fillStyleSelect = document.getElementById('fillStyleSelect'),
          //不否填充
                  fillCheckbox = document.getElementById('fillCheckbox'),
          //进入编辑
                  editCheckbox = document.getElementById('editCheckbox'),
          //边数
                  sidesSelect = document.getElementById('sidesSelect'),
          //canvas位图数据
                  drawingSurfaceImageData,

          //记录鼠标按下的位置
                  mousedown = {},
          //橡皮筋矩形框
                  rubberbandRect = {},
                  dragging = false,//是否在拖动状态
                  draggingOffsetX,
                  draggingOffsetY,
                  sides = 8,
                  startAngle = 0,
                  guidewires = true,
                  editing = false,
          //保存已绘制的多边形
                  polygons = [];
          // Functions..........................................................
          //画网络线
          function drawGrid(color, stepx, stepy) {
              context.save();
              context.shadowColor = undefined;
              context.shadowBlur = 0;
              context.shadowOffsetX = 0;
              context.shadowOffsetY = 0;

              context.strokeStyle = color;
              context.fillStyle = '#ffffff';
              //context2.lineCap = "round";//连接处为圆形
              context.lineWidth = 1;
              context.fillRect(0, 0, context.canvas.width, context.canvas.height);
              context.beginPath();
              for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
                  context.moveTo(i, 0);
                  context.lineTo(i, context.canvas.height);
              }
              context.stroke();
              context.beginPath();
              for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
                  context.moveTo(0, i);
                  context.lineTo(context.canvas.width, i);
              }
              context.stroke();
              context.restore();
          }
          //窗口坐标转canvas坐标
          function windowToCanvas(x, y) {
              var bbox = canvas.getBoundingClientRect();
              return {
                  x: x - bbox.left * (canvas.width  / bbox.width),
                  y: y - bbox.top  * (canvas.height / bbox.height)
              };
          }
          // 保存或恢复已绘制的画面...................................
          function saveDrawingSurface() {
              drawingSurfaceImageData = context.getImageData(0, 0,canvas.width,canvas.height);
          }
          function restoreDrawingSurface() {
              context.putImageData(drawingSurfaceImageData, 0, 0);
          }
          // 画多边形.....................................................
          function drawPolygon(polygon) {
              context.beginPath();
              polygon.createPath(context);
              polygon.stroke(context);
              if (fillCheckbox.checked) {
                  polygon.fill(context);
              }
          }
          // 更新橡皮筋矩形框...................................................
          function updateRubberbandRectangle(loc) {
              rubberbandRect.width = Math.abs(loc.x - mousedown.x);
              rubberbandRect.height = Math.abs(loc.y - mousedown.y);
              if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
              else   rubberbandRect.left = loc.x;
              if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
              else   rubberbandRect.top = loc.y;
          }
          //以鼠标按下点为圆心，橡皮筋框宽为半径创建多边形
          function drawRubberbandShape(loc, sides, startAngle) {
              var polygon = new Polygon(mousedown.x, mousedown.y,
                      rubberbandRect.width,
                      parseInt(sidesSelect.value),
                      (Math.PI / 180) * parseInt(startAngleSelect.value),
                      context.strokeStyle,
                      context.fillStyle,
                      fillCheckbox.checked);
              drawPolygon(polygon);//画多边形

              if (!dragging) {//保存这个多边形
                  polygons.push(polygon);
              }
          }
          //更新橡皮筋
          function updateRubberband(loc, sides, startAngle) {
              updateRubberbandRectangle(loc);
              drawRubberbandShape(loc, sides, startAngle);
          }
          // 网络线.................................................
          function drawHorizontalLine (y) {
              context.beginPath();
              context.moveTo(0,y+0.5);
              context.lineTo(context.canvas.width,y+0.5);
              context.stroke();
          }
          function drawVerticalLine (x) {
              context.beginPath();
              context.moveTo(x+0.5,0);
              context.lineTo(x+0.5,context.canvas.height);
              context.stroke();
          }
          function drawGuidewires(x, y) {
              context.save();
              context.strokeStyle = 'rgba(0,0,230,0.4)';
              context.lineWidth = 0.5;
              drawVerticalLine(x);
              drawHorizontalLine(y);
              context.restore();
          }
          //绘制保存的所有多边形
          function drawPolygons() {
              polygons.forEach( function (polygon) {
                  drawPolygon(polygon);
              });
          }
          // 开始拖动...........................................................
          function startDragging(loc) {
              saveDrawingSurface();
              mousedown.x = loc.x;
              mousedown.y = loc.y;
          }
          //进入编辑状态
          function startEditing() {
              canvas.style.cursor = 'pointer';
              editing = true;
          }
          //退出编辑状态
          function stopEditing() {
              canvas.style.cursor = 'crosshair';
              editing = false;
          }
          //事件处理，鼠标按下...................................................
          canvas.onmousedown = function (e){
              //窗口坐标转canvas坐标
              var loc = windowToCanvas(e.clientX, e.clientY);
              e.preventDefault(); // prevent cursor change
              if(editing){//在编辑状态时，检查鼠标按下的点在哪个多边形路径中
                  polygons.forEach( function (polygon) {
                      polygon.createPath(context);
                      if (context.isPointInPath(loc.x, loc.y)) {
                          startDragging(loc);
                          dragging = polygon;//要拖动的多边形
                          draggingOffsetX = loc.x - polygon.x;
                          draggingOffsetY = loc.y - polygon.y;
                          return;
                      }
                  });
              }
              else {
                  startDragging(loc);
                  dragging = true;
              }
          };
          //鼠标移动
          canvas.onmousemove = function (e) {
              var loc = windowToCanvas(e.clientX, e.clientY);
              e.preventDefault(); // prevent selections
              if (editing && dragging) {//有一个要拖动的多边形
                  dragging.x = loc.x - draggingOffsetX;
                  dragging.y = loc.y - draggingOffsetY;
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  drawGrid('lightgray', 10, 10);
                  drawPolygons();//重画所有多边形
              }
              else {
                  if (dragging) {
                      restoreDrawingSurface();
                      updateRubberband(loc, sides, startAngle);
                      if (guidewires) {
                          drawGuidewires(mousedown.x, mousedown.y);
                      }
                  }
              }
          };
          canvas.onmouseup = function (e) {
              var loc = windowToCanvas(e.clientX, e.clientY);
              dragging = false;
              if (editing) {
              }
              else {
                  restoreDrawingSurface();
                  updateRubberband(loc);
              }
          };
          eraseAllButton.onclick = function (e) {
              context.clearRect(0, 0, canvas.width, canvas.height);
              drawGrid('lightgray', 10, 10);
              saveDrawingSurface();
          };
          strokeStyleSelect.onchange = function (e) {
              context.strokeStyle = strokeStyleSelect.value;
          };
          fillStyleSelect.onchange = function (e) {
              context.fillStyle = fillStyleSelect.value;
          };
          editCheckbox.onchange = function (e) {
              if (editCheckbox.checked) {
                  startEditing();
              }
              else {
                  stopEditing();
              }
          };
          // Initialization.....................................................
          context.strokeStyle = strokeStyleSelect.value;
          context.fillStyle = fillStyleSelect.value;
          drawGrid('lightgray', 10, 10);
          if (navigator.userAgent.indexOf('Opera') === -1)
              context.shadowColor = 'rgba(0, 0, 0, 0.4)';
          context.shadowOffsetX = 2;
          context.shadowOffsetY = 2;
          context.shadowBlur = 4;
        }
    };
}])
/*拖动层*/
.directive('dragLayer', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          
          this.drawDragArea = function(ctx,data){
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.strokeStyle = 'lightgray';
            ctx.beginPath();
            ctx.lineWidth="10";
            ctx.moveTo(data.x, data.y);
            ctx.lineTo(data.x, data.y+data.cvsHeight);
            ctx.lineTo(data.x+data.cvsWidth, data.y+data.cvsHeight);
            ctx.lineTo(data.x+data.cvsWidth, data.y);
            ctx.closePath();
            ctx.stroke();
          }
        }],
        link: function ($scope, elem, attrs, ctrl) {
          var cvs = elem[0],
              dragging = false,
              self = this,
              plusBtn = document.querySelector('#plusBtn'),
              minusBtn = document.querySelector('#minusBtn'),
              
              offsetX = 0,
              offsetY = 0,
              ctx = cvs.getContext("2d");

          $scope.$on('bgImgOk', function(e){
            ctrl.drawDragArea(ctx, $scope.bgImg);
          });
          function windowToCanvas(x, y) {
              var bbox = cvs.getBoundingClientRect();
              return {
                x: x - bbox.left * (cvs.width  / bbox.width),
                y: y - bbox.top  * (cvs.height / bbox.height)
              };
          }
          cvs.onmousedown = function(e){
              var loc = windowToCanvas(e.clientX, e.clientY);
              if (ctx.isPointInPath(loc.x, loc.y)){
                  offsetX = loc.x - $scope.bgImg.x;
                  offsetY = loc.y - $scope.bgImg.y;
                  dragging=true;
              }
          }
          cvs.onmousemove = function(e){
              cvs.style.cursor='pointer';
              var loc = windowToCanvas(e.clientX, e.clientY);
              if (dragging){
                  $scope.bgImg.x = loc.x-offsetX;
                  $scope.bgImg.y = loc.y-offsetY;
                  $scope.drawBgImg();
                  //ctrl.drawDragArea(ctx, $scope.bgImg);
                  
              }
          }
          cvs.onmouseup = function(e){
              dragging = false;
          }
          cvs.onmouseout = function(){
            cvs.style.cursor='normal';
          }
          plusBtn.onclick = function(e){
            $scope.bgImg.imgScale += 0.2;
            if ($scope.bgImg.imgScale>=2) {
              $scope.bgImg.imgScale = 2;
            }
            $scope.drawBgImg();
          }
          minusBtn.onclick = function(e){
            $scope.bgImg.imgScale -= 0.2;
            if ($scope.bgImg.imgScale<=0) {
              $scope.bgImg.imgScale = 0.1;
            }
            $scope.drawBgImg();
          }
        }
    };
}])
/*
支持：拖动，缩放（中心缩放）; 
若图片大于等于画布，拖动区域为画布; 若图片小于画布，拖动区域为图片大小.
注意：有一个窗口缩放比例，一个图片缩放比例。
*/
.directive('bgCanvas', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          //draw bg
          $scope.drawBgImg = function () {
            $scope.bgctx.clearRect(0, 0, $scope.bgctx.canvas.width, $scope.bgctx.canvas.height);
            $scope.bgctx.globalAlpha=0.5;
            $scope.bgctx.drawImage($scope._img, 
              $scope.bgImg.x, $scope.bgImg.y, 
              $scope.bgImg.imgWidth*$scope.bgImg.imgScale, 
              $scope.bgImg.imgHeight*$scope.bgImg.imgScale);
          }
        }],
        link: function ($scope, elem, attrs, ctrl) {
            $scope.bgImg = {
              x: 0,
              y: 0,
              imgScale: 1, //图片缩放比例
              winScale: 1, //窗口缩放比例
              cvsWidth: attrs.width ? parseInt(attrs.width) : 800,
              cvsHeight: attrs.height ? parseInt(attrs.height) : 600
            }
            var cvs = elem[0];
            $scope.bgctx = cvs.getContext("2d");
            $scope._img = new Image();

            function calcImgScale() {
              if ($scope._img.width <= $scope.bgImg.cvsWidth && $scope._img.height <= $scope.bgImg.cvsHeight) {
                $scope.bgImg.imgScale = 1;
              }
            }

            $scope._img.src = require("../image/canvasbg.jpg");
            $scope._img.onload = function(){
              $scope.bgImg.imgWidth = $scope._img.width;
              $scope.bgImg.imgHeight = $scope._img.height;
              $scope.$emit('bgImgOk', null);
              $scope.drawBgImg.call($scope);
            }
        }
    };
}])
/*
支持：动画 
*/
.directive('animationCanvas', ['$interval', function($interval) {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          $scope.startPoints =[{mac:11,x:10,y:10,phone:13898889882,state:0},{mac:22,x:400,y:10,phone:13898889232,state:0},{mac:33,x:190,y:130,phone:13898889232,state:0},{mac:55,x:455,y:130,phone:13898889232,state:0}];
          $scope.endPoints =[{mac:11,x:300,y:250,phone:13898889882,state:0},{mac:22,x:300,y:300,phone:13898889232,state:0},{mac:33,x:30,y:230,phone:13898889232,state:0},{mac:44,x:5,y:130,phone:13898889232,state:0}];
          $scope.init = function(){
          	_.each($scope.startPoints, function(item){
			    $scope.draw(item);
			})
          }
          $scope.draw = function(point){
          	addPointPosition(point);
          	$scope.ctx.drawImage($scope.monster,point.x,point.y,20,20);
          }
          $scope.currnetPosition=[];// 当前人的位置
		  // 只存一个人的当前位置
		  function addPointPosition(p) {
		    var person = _.find($scope.currnetPosition, {mac: p.mac});
		    if (person) {
		        if (!_.isMatch(p, person)) {
		            person.mac = p.mac;
		            person.x = p.x;
		            person.y = p.y;
		            person.phone = p.phone;
		            person.state = p.state;
		        }
		    } else {
		        $scope.currnetPosition.push(_.clone(p));
		    }
		  }

		  var speed = 5;
		  $scope.update = function() {
			  if (isAllEnd()) {
			    $interval.cancel($scope.time);
			    return;
			  }
			  $scope.ctx.clearRect(0,0,$scope.cvs.width,$scope.cvs.height);
			  _.each($scope.endPoints, function(point) {
			    var originPoint = getOriginPoint(point.mac, $scope.startPoints);
			        //console.log("p2:"+point.x+","+point.y)
			        if(originPoint) {
			          if(originPoint.x != point.x || originPoint.y != point.y) {
			            if (originPoint.x < point.x) originPoint.x += speed;
			            if (originPoint.x > point.x) originPoint.x -= speed;
			            if (originPoint.y < point.y) originPoint.y += speed;
			            if (originPoint.y > point.y) originPoint.y -= speed;
			            //console.log("mac:"+point.mac+",x="+originPoint.x+",y="+originPoint.y)
			            $scope.draw(originPoint)  
			          }else {
			            $scope.draw(point);
			          }
			        }else {
			          $scope.draw(point);
			        }
			          
			  });
			  $scope.hasNotActionTrue = true;
			}

			//比较两个数组中点的值
			function isAllEnd() {
			    var result = true;
			    for (var i=0; i<$scope.startPoints.length; i++) {
			        // 当前点位置
			        var currentPoint = getOriginPoint($scope.startPoints[i].mac, $scope.startPoints);
			        // 目标点位置
			        var targetPoint = getOriginPoint($scope.startPoints[i].mac, $scope.endPoints);
			        if (currentPoint && targetPoint && (currentPoint.x != targetPoint.x || currentPoint.y != targetPoint.y)) {
			            result = false; break;
			        }
			    }
			    return result;
			}

			function windowToCanvas(x, y) {
		        var bbox = bgCanvas.getBoundingClientRect();
		        return { x: x - bbox.left * (bgCanvas.width  / bbox.width),
		            y: y - bbox.top  * (bgCanvas.height / bbox.height)
		        };
		    }

		    // 得到源点
			function getOriginPoint(name, oriArr){
			    for (var i=0;i<oriArr.length;i++) {
			        if (oriArr[i].mac == name) {
			            return oriArr[i];
			        }else {
			            $scope.draw(oriArr[i]);
			        }
			    }
			    return null;
			}

			// 查找附近的人
			$scope.getNearbyPerson = function (x,y) {
			    var range = 20;
			    var result = null;
			    _.each($scope.currnetPosition, function(element, index, list) {
			        if (Math.abs(element.x-x)<=range && Math.abs(element.y-y)<=range) {
			            result = element;
			        }
			    });
			    return result;
			}
			    
        }],
        link: function ($scope, elem, attrs, ctrl) {
            $scope.cvs = elem[0];
            $scope.ctx = $scope.cvs.getContext("2d");
            $scope.monster = new Image();
            $scope.monster.src = require("../image/monster.png");
            $scope.monster.onload = function(){
              $scope.init();
              $scope.time = $interval($scope.update,300);
            }

            var $cvs = $($scope.cvs);
            $cvs.mousemove(function(e) { // mouse move handler
		        var canvasOffset = $cvs.offset();
		        var canvasX = Math.floor(e.pageX - canvasOffset.left);
		        var canvasY = Math.floor(e.pageY - canvasOffset.top);
		        // 设定热区范围
		        var person = $scope.getNearbyPerson(canvasX, canvasY);
		        if (person) {
		            $('#readout').html('I get it:'+person.mac+','+person.x+','+person.y);
		        } else {
		            $('#readout').html('');
		        }
		        
		    });

            var pauseBtn = document.querySelector('#pauseBtn');
            pauseBtn.onclick = function(){
            	if($scope.hasNotActionTrue){
				    $interval.cancel($scope.time);
				    $scope.hasNotActionTrue = false;
				}else {
				    $scope.time = $interval($scope.update,300);
				}
            }
        }
    };
}])
/*刮刮卡*/
.directive('scratchCard', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
	        $scope.bindHandler = (function() {
	            if (window.addEventListener) {
	                return function(elem, type, handler) {
	                    //false:在冒泡阶段调用事件处理程序
	                    elem.addEventListener(type, handler, false);
	                }
	            } else if (window.attachEvent) {
	                return function(elem, type, handler) {
	                    elem.attachEvent("on" + type, handler);
	                }
	            }
	        })();
	        $scope.removeHandler = (function() {
	            if (window.removeEventListener) {
	                return function(elem, type, handler) {
	                    elem.removeEventListener(type, handler, false);
	                }
	            } else if (window.detachEvent) {
	                return function(elem, type, handler) {
	                    elem.detachEvent("on" + type, handler);
	                }
	            }
	        })();
        }],
        link: function ($scope, elem, attrs, ctrl) {
            
            let cvs = elem[0],
                ctx = cvs.getContext("2d");

            (function init(){
            	ctx.fillStyle='#A9AB9D';
			    ctx.fillRect(10,10,280,180);
			    ctx.fillStyle='#000';
			    ctx.font='50px Arial';
			    ctx.fillText('刮奖区',75,115);
            })();
            //刮奖
            var brush=function(e){
		        ctx.clearRect(e.offsetX,e.offsetY,20,20);
		    };

            cvs.onmousedown = function(e){
		        $scope.bindHandler(cvs,'mousemove',brush,false);
		    }

            cvs.onmouseup = function(){
		        $scope.removeHandler(cvs,"mousemove",brush,false);
		    }
        }
    };
}])
/*画笔*/
.directive('painter', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
	        $scope.windowToCanvas = function(cvs, x, y) {
		        var bbox = cvs.getBoundingClientRect();
		        return { x: x - bbox.left * (cvs.width  / bbox.width),
		            y: y - bbox.top  * (cvs.height / bbox.height)
		        };
		    }
        }],
        link: function ($scope, elem, attrs, ctrl) {
            
            let cvs = elem[0],
                ctx = cvs.getContext("2d");

            (function init(){
            	ctx.font='20px Arial';
    			ctx.strokeText('NICK画笔',100,30);
            })();
            var isTouch = "ontouchstart" in window ? true : false;
		    var StartDraw = isTouch ? "touchstart" : "mousedown",
		            MoveDraw = isTouch ? "touchmove" : "mousemove",
		            EndDraw = isTouch ? "touchend" : "mouseup";

		    ctx.strokeStyle='blue';//线色
		    ctx.lineCap = "round";//连接处为圆形
		    ctx.lineWidth =10;//线框

		    cvs.addEventListener(StartDraw, function(ev){
		        ev.preventDefault();
		        var isX = isTouch ? ev.targetTouches[0].clientX : ev.clientX;
		        var isY = isTouch ? ev.targetTouches[0].clientY : ev.clientY;
		        var xy = $scope.windowToCanvas(cvs, isX, isY);
		        ctx.beginPath();
		        ctx.moveTo(xy.x, xy.y);
		        function StartMove(ev){
		            var isX1 = isTouch ? ev.targetTouches[0].clientX : ev.clientX;
		            var isY1 = isTouch ? ev.targetTouches[0].clientY : ev.clientY;
		            var xy1 = $scope.windowToCanvas(cvs, isX1, isY1);
		            
		            ctx.lineTo(xy1.x, xy1.y);

		            ctx.stroke();
		            ctx.beginPath();
		            ctx.moveTo(xy1.x, xy1.y);
		        };
		        function EndMove(ev){
		            var isX1 = isTouch ? ev.changedTouches[0].clientX : ev.clientX;
		            var isY1 = isTouch ? ev.changedTouches[0].clientY : ev.clientY;
		            var xy1 = $scope.windowToCanvas(cvs, isX1, isY1);
		            ctx.lineTo(xy1.x, xy1.y);
		            ctx.stroke();
		            cvs.removeEventListener(MoveDraw, StartMove, false);
		            cvs.removeEventListener(EndDraw, EndMove, false);
		        };
		        cvs.addEventListener(MoveDraw, StartMove, false);
		        cvs.addEventListener(EndDraw, EndMove, false);
		    }, false);
        }
    };
}])
/*调色板 自定义笔刷*/
.directive('colorPalette', [function() {
    return {
        restrict: 'EA',
        template: require("../templates/palette.html"),
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
	        $scope.windowToCanvas = function(cvs, x, y) {
		        var bbox = cvs.getBoundingClientRect();
		        return { x: x - bbox.left * (cvs.width  / bbox.width),
		            y: y - bbox.top  * (cvs.height / bbox.height)
		        };
		    }

		    //初始化调色板
		    $scope.drawGradients = function(colorCvs, colorCtx) {
                var grad = colorCtx.createLinearGradient(20, 0, colorCvs.width - 20, 0);
                grad.addColorStop(0, 'red');
                grad.addColorStop(1 / 6, 'orange');
                grad.addColorStop(2 / 6, 'yellow');
                grad.addColorStop(3 / 6, 'green');
                grad.addColorStop(4 / 6, 'aqua');
                grad.addColorStop(5 / 6, 'blue');
                grad.addColorStop(1, 'purple');
                colorCtx.fillStyle=grad;
                colorCtx.fillRect(0, 0, colorCvs.width, colorCvs.height);
            }
        }],
        link: function ($scope, elem, attrs, ctrl) {
            let colorCvs = document.querySelector('#color'),
                colorCtx = colorCvs.getContext("2d"),
                panelCvs = document.querySelector('#panel'),
                panelCtx = panelCvs.getContext("2d"),
                preview = document.querySelector('#preview'),
                pick = document.querySelector('#pick');
            $scope.drawGradients(colorCvs, colorCtx);
            
            let selColorR = 0, selColorG = 195, selColorB = 135, bMouseDown = false;
            //冒泡画笔 刷子
            let BubbleBrush = {
                // inner variables
                iPrevX : 0,
                iPrevY : 0,
             
                // initialization function
                init: function () {
                    panelCtx.globalCompositeOperation = 'source-over'; //'lighter' is nice too
                    panelCtx.lineWidth = 1;
                    panelCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    panelCtx.lineWidth = 2;
                },
                //开始曲线
                startCurve: function (x, y) {
                    this.iPrevX = x;
                    this.iPrevY = y;
                    panelCtx.fillStyle = 'rgba(' + selColorR + ', ' + selColorG + ', ' + selColorB + ', 0.9)';
                },
             
                draw: function (x, y) {
                    var iXAbs = Math.abs(x - this.iPrevX);
                    var iYAbs = Math.abs(y - this.iPrevY);
             
                    if (iXAbs > 20 || iYAbs > 20) {
                        panelCtx.beginPath();
                        //ctx.arc(this.iPrevX, this.iPrevY, (iXAbs + iYAbs) * 0.5, 0, Math.PI*2, false);
                        panelCtx.arc(this.iPrevX, this.iPrevY, 5, 0, Math.PI*2, false);
                        panelCtx.fill();
                        panelCtx.stroke();
                        this.iPrevX = x+10;
                        this.iPrevY = y+10;
                    }
                }
            };

            BubbleBrush.init();
            
            $('#color').mousemove(function(e) { // mouse move handler
                var canvasOffset = $(colorCvs).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
         
                var imageData = colorCtx.getImageData(canvasX, canvasY, 1, 1);
                var pixel = imageData.data;
         
                var pixelColor = 'rgba('+pixel[0]+', '+pixel[1]+', '+pixel[2]+', '+pixel[3]+')';
                $('#preview').css('backgroundColor', pixelColor);
            });

            $('#color').click(function(e) { // mouse click handler
                var canvasOffset = $(colorCvs).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
         
                var imageData = colorCtx.getImageData(canvasX, canvasY, 1, 1);
                var pixel = imageData.data;
         
                var pixelColor = 'rgba('+pixel[0]+', '+pixel[1]+', '+pixel[2]+', '+pixel[3]+')';
                $('#pick').css('backgroundColor', pixelColor);
         
                selColorR = pixel[0];
                selColorG = pixel[1];
                selColorB = pixel[2];
            });

            $('#panel').mousedown(function(e) { // mouse down handler
                bMouseDown = true;
                var canvasOffset = $(panelCvs).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
         
                BubbleBrush.startCurve(canvasX, canvasY);
            });
            $('#panel').mouseup(function(e) { // mouse up handler
                bMouseDown = false;
            });
            $('#panel').mousemove(function(e) { // mouse move handler
                if (bMouseDown) {
                    var canvasOffset = $(panelCvs).offset();
                    var canvasX = Math.floor(e.pageX - canvasOffset.left);
                    var canvasY = Math.floor(e.pageY - canvasOffset.top);
         
                    BubbleBrush.draw(canvasX, canvasY);
                }
            });
        }
    };
}])