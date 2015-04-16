###AngularJS学习笔记
1）使用git将phonecat下载下来。git clone https://github.com/angular/angular-phonecat.git
2) 使用bower将phonecat依赖的其它库下载下来。 bower install
3) 使用npm test运行karma测试用例。
    测试示例如下：
   'use strict';

   /* jasmine specs for controllers go here */
   describe('PhoneCat controllers', function() {

     describe('PhoneListCtrl', function(){

       beforeEach(module('phonecatApp'));

       it('should create "phones" model with 3 phones', inject(function($controller) {
         var scope = {},
             ctrl = $controller('PhoneListCtrl', {$scope:scope});

         expect(scope.phones.length).toBe(3);
         expect(scope.name).toBe('World');
       }));

     });
   });
4)在使用protractor时，由于网络问题，会出现无法下载protractor中的selemiun，从而会报错
   Could not find chromedriver at F:\study\AngularJS\phonecat\angular-phonecat\node_modules\protractor\selenium\chromedriver.exe
   stackoverflow上面的一个解决方法是设置网络代理。
   http://stackoverflow.com/questions/22193692/protractor-selenium-could-not-find-chromedriver-at-on-windows。
   这个似乎只是在windows上会遇到的坑。
5)filters可以用来进行输入校验。
    <input ng-model="userInput"> {{ userInput | checkmark }}
6)对于REST and Custom Services的理解
    将通信层和控制层分离。REST应该和ajax有一定的关联，用来进行数据传递通信的技术。
7)对于angularJS这种前后端分离，通过ajax获取json数据在呈现给界面的方式。SEO在google方面已经有解决方案，那就是会生成快照。