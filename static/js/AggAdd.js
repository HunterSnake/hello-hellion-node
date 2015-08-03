angular.module('myApp', []).
  controller('myController', ['$scope', '$http', '$window', 
                              function ($scope, $http, window) {
        $scope.days = [];
        var today = new Date();
        $scope.aggDate =  (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
        $scope.aggInstance = 'EIT';
        $scope.aggCount = 500;
        $scope.status = "";
        $scope.AddAgg = function (sDate, sinstance, sCount) {
            $scope.status = 'in';
            $http.post('/aggregate/add', {sentDate: sDate, instance: sinstance, sentCount: sCount}).
                success(function (data, status, headers, config) {
                        $scope.status = status;
                    }).
                error(function (data, status, headers, config) {
                        $scope.status = data.msg;
                    });
        };
        $scope.getAgg = function () {
            $scope.status = "";
            $http.get('/aggregate/get').
              success(function (data, status, headers, config) {
                        $scope.days = data;
                    }).
              error(function (data, status, headers, config) {
                        window.alert(status);
                        $scope.status = data;
                    });
        };
        $scope.removeAgg = function (sdate) {
            $scope.status = 'removing';
            $http.post('/aggregate/remove', { sentDate: sdate}).
                success(function (data, status, headers, config) {
                $scope.days = data;
            }).
                error(function (data, status, headers, config) {
                $scope.status = data.msg;
            });
        };
    }]);