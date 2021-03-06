/**
 * Created by hwen on 15/12/21.
 */

(function(angular) {
    'use strict';

    angular.module('waka').directive('navBar', customNavbar);

    function customNavbar() {
        var directive = {
            restrict: 'E',
            link: linkFn,
            templateUrl: 'app/components/navbar/navbar.html',
            scope: {
                creationDate: '='
            },
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function NavbarController($scope, $state, $timeout, User, Question) {
            var vm = this;
            var imgPath = "../assets/images/icons/";

            vm.isOpen = false;
            vm.tooltipVisible = false;
            vm.avatar ="../assets/images/user/" + "default.png";

            getAvatar();

            $scope.$watch('vm.isOpen', function(isOpen) {
                if (isOpen) {
                    $timeout(function() {
                        vm.tooltipVisible = vm.isOpen;
                    }, 600);
                } else {
                    vm.tooltipVisible = vm.isOpen;
                }
            });

            vm.items = [
                {name:"我的主页", icon: imgPath+"people.svg", direction: "left", action: "toHomePage"},
                {name:"修改信息", icon: imgPath+"setting.svg", direction: "left", action: "toUpdateInfo"},
                {name:"退出", icon: imgPath+"logout.svg", direction: "left", action: "logout"}
            ];

            vm.addQuestion = function() {
                $state.go("question-editor");
            };

            vm.action = function(action) {
                switch (action) {
                    case "toHomePage": toHomePage();break;
                    case "toUpdateInfo": toUpdateInfo();break;
                    case "logout" : logout();break;
                }
            };

            function toHomePage() {
                location.href = "/#/user-page/question";
            }

            function toUpdateInfo() {
                location.href = "/#/user-setting";
            }

            function logout() {
                cancelCookie();
                User.logout();
                $state.go("user-login");
            }

            function getAvatar() {
                User.get({id: getCookie("uid")}).$promise.then(function(res) {
                    vm.avatar = "../assets/images/user/" + res.data.avatar;
                });
            }

            function cancelCookie() {
                var cookies = document.cookie.split(";");
                cookies.forEach(function(item) {
                    document.cookie = item + ";max-age=0";
                });
            }

            function getCookie(key) {
                var str = document.cookie;
                if (str) {
                    str = str.substr(str.indexOf(key));
                    var end = str.indexOf(';') >-1 ? str.indexOf(';') : str.length;
                    var value = str.substring(str.indexOf("=")+1, end);
                    return value;
                } else {
                    return null;
                }
            }
        }

        function linkFn(scope, element, attrs) {
            //test version
            var input = document.getElementById('search'),
                oldValue = '';

            input.addEventListener('keydown', function(e){
                oldValue = this.value;
            }, false);

            input.addEventListener('keyup', function(e){
                var code = e.keyCode;
                if( code == 13 ){
                    if( oldValue === this.value ){
                        console.log(this.value);
                        location.href = '/#/search/' + this.value;
                    }
                }

            }, false);
        }
    }

})(angular);
