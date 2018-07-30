'use strict';

/* Controllers */
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource', 'ui.bootstrap']);

/* Config */
weatherApp.config(['$routeProvider', '$locationProvider', function ($routeProvide, $locationProvider) {
    $locationProvider.html5Mode({
        enabled:true,
        requiredBase:false
    });
    $routeProvide
            .when('/', {
                templateUrl: 'template/home.html',
                controller: 'CitiesListCtrl'
            })
            .when('/about', {
                templateUrl: 'template/about.html',
                controller: 'AboutCtrl'
            })
            .when('/contact', {
                templateUrl: 'template/contact.html',
                controller: 'ContactCtrl'
            })
            .when('/cities/:cityId/:region', {
                templateUrl: 'template/city-detail.html',
                controller: 'CityDetailCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

    }
]);

/* Factory */
weatherApp.factory('city', ['$resource', function ($resource) {
        return $resource('cities/:cityId.:format', {
            cityId: 'cities',
            format: 'json',
            apiKey: 'someKeyThis'
            /* http://localhost:8888/phones/phones.json?apiKey=someKeyThis */
        }, {
            // action: {method: <?>, params: <?>, isArray: <?>, ...}
            update: {method: 'PUT', params: {cityId: '@city'}, isArray: true}
        });
        //Phone.update(params, successcb, errorcb);
    }
]);

/* Filter */
weatherApp.filter('checkmark', function () {
    return function (input) {
        return input > 10 ? '\u2713' : '\u2718';
    }
});

weatherApp.controller('CitiesListCtrl', [
    '$scope', '$http', '$location', 'city',
    function ($scope, $http, $location, city) {

        city.query({cityId: 'cities'}, function (data) {
            $scope.cities = data;
        });

        $scope.capitals = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
        $scope.add = function(){
            $scope.obj = new Object;
            $scope.obj.region = "us";
            $scope.obj.id = $scope.selected;
            $scope.cities.push($scope.obj);
        }

        // $scope.obj = new Object;
        // $scope.obj.region = $scope.selected;
        // $scope.obj.id = $scope.addItem;
        // $scope.cities.push($scope.obj);
        // $http.get($scope.url).success(function (data) {
        //     $scope.capitals = data;
        //     // $scope.alpha2Code = data.alpha2Code;
        //     // $scope.capital = data.capital;
        // });




        //Phone.query(params, successcb, errorcb)

        //Phone.get(params, successcb, errorcb)

        //Phone.save(params, payloadData, successcb, errorcb)

        //Phone.delete(params, successcb, errorcb)

    }
]);

/* About Controller */
weatherApp.controller('AboutCtrl', [
    '$scope', '$http', '$location',
    function ($scope, $http, $location) {

    }
]);

/* Contact Controller */
weatherApp.controller('ContactCtrl', [
    '$scope', '$http', '$location',
    function ($scope, $http, $location) {

    }
]);

/* Phone Detail Controller */
weatherApp.controller('CityDetailCtrl', ['$scope', '$http', '$location', '$routeParams',
    function ($scope, $http, $location, $routeParams) {
        $scope.cityId = $routeParams.cityId;
        $scope.region = $routeParams.region;
        $scope.ready = true;
        $scope.url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22{city}%2C%20{region}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'.replace('{city}', $scope.cityId).replace('{region}', $scope.region);
        $http.get($scope.url, $scope.cityId).success(function (data, status, config) {
            $scope.city = data.query.results.channel;
            $scope.city.img = ($scope.city.item.condition.text).replace(/\s/g, '');
            $scope.ready = false;
        });
    }
]);


