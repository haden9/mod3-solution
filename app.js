(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com');

    NarrowItDownController.$inject = ['MenuSearchService', '$scope'];
    function NarrowItDownController(MenuSearchService, $scope) {
        var controller = this;

        var promise = MenuSearchService.getMatchedMenuItems();
        var list = [];
        controller.searchTerm = '';
        controller.found = [];

        controller.loadItems = function () {
            promise.then(function (result) {
                list = result.data['menu_items'];
            });
        };

        controller.loadItems();

        controller.narrowIt = function () {
            controller.found = list.filter(function(item) {
                return item.description.indexOf(controller.searchTerm) > -1;
            });
        };


        $scope.$watch('controller.searchTerm', function() {
            if (controller.searchTerm.length === 0) {
                controller.found = [];
            }
        });

        controller.removeFound = function (index) {
            controller.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function () {
            return $http({
                method: 'GET',
                url: ApiBasePath + '/menu_items.json'
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'controller',
            bindToController: true
        };

        return ddo;
    }

    function MenuItem(id, description, large_portion_name, name, price_large, price_small, short_name, small_portion_name) {
        this.id = id;
        this.description = description;
        this.largePortionName = largePortionName;
        this.name = name;
        this.priceLarge = price_large;
        this.priceSmall = price_small;
        this.shortName = short_name;
        this.smallPortionName = small_portion_name;
    }

})();
