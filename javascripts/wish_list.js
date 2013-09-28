function MenuController($scope, $location) {
  $scope.activeClass = function(path) {
    if ($location.path().substr(0, path.length) == path) {
      return 'active';
    } else {
      return '';
    }
  }
};

function WishResumeController($scope, $filter, WishList) {
  $scope.$on('WishListUpdated', function(event, wishes) {
    sum = 0;
    wishes.forEach(function(wish) { sum += (wish.purchased ? +wish.amount : 0) });
    $scope.amount = sum;
  });
};

function WishesListController($scope, $routeParams, WishList, wishes) {
  $scope.wishes = wishes;
  $scope.search = { purchased: false };
  $scope.sortableOptions = {
    update: function(e, ui) { updatePriorities(e, ui) }
  };

  $scope.refund = function(wish) {
    wish.purchased = false;
    wish.$saveOrUpdate(success, success);
  };

  $scope.purchase = function(wish) {
    wish.purchased = true;
    wish.$saveOrUpdate(success, success);
  };

  $scope.toPurchasePercentage = function() {
    return 100 - $scope.purchasedPercentage();
  };

  $scope.purchasedPercentage = function() {
    return purchasedWishesCount() / wishes.length * 100;
  };

  $scope.wishesPartialName = function() {
    if (wishesCountInContext() > 0) {
      return 'partials/wishes/_wishes.html';
    } else if ($scope.search.purchased == 'false'){
      return 'partials/wishes/_empty.html';
    } else {
      $scope.search.purchased = 'false';
    }
  };

  notYetPurchasedWishesCount = function() {
    return wishes.length - purchasedWishesCount();
  };

  purchasedWishesCount = function() {
    sum = 0
    wishes.forEach(function(wish) { sum += (wish.purchased ? 1 : 0) });
    return sum;
  };

  success = function() {
    WishList.updateList(wishes);
  };

  updatePriorities = function(e, ui) {
    sorted_wishes_ids = $(e.target).sortable('toArray');
    wishes.forEach(function(wish) {
      new_priority = sorted_wishes_ids.indexOf('wish-' + wish.$id());
      if (new_priority != wish.priority) {
        wish.priority = new_priority;
        wish.$saveOrUpdate(success, success);
      }
    });
  };

  wishesCountInContext = function() {
    return ($scope.search.purchased == 'true' ? purchasedWishesCount() : notYetPurchasedWishesCount());
  };

  success();
};

function WishesFormController($scope, $routeParams, $location, wish) {
  $scope.wish = wish;

  $scope.save = function() {
    wish.amount   = parseInt(wish.amount);
    wish.priority = parseInt(wish.priority);
    wish.$saveOrUpdate(success, success);
  };

  $scope.remove = function() {
    wish.$remove(success, success);
  };

  success = function() {
    $location.path('/wishes');
  };
};

var app = angular.module('wish_list', ['mongolabResourceHttp', 'ui.sortable']).
  config(['$routeProvider', function($routeProvider, Wish) {
    $routeProvider.
      when('/wishes',       { templateUrl: 'partials/wishes/list.html', controller: WishesListController, resolve: { wishes: function(Wish) { return  Wish.all(); }}}).
      when('/wish/new',     { templateUrl: 'partials/wishes/form.html', controller: WishesFormController, resolve: { wish: function(Wish) { return new Wish({ purchased: false }) }}}).
      when('/wish/:wishId', { templateUrl: 'partials/wishes/form.html', controller: WishesFormController, resolve: { wish: function(Wish, $route) { return Wish.getById($route.current.params.wishId) }}}).
      otherwise({ redirectTo: '/wishes' });
}]);
app.constant('MONGOLAB_CONFIG', { API_KEY: MONGODB_SETTINGS.api_key, DB_NAME: MONGODB_SETTINGS.db_name });

app.factory('Wish', function ($mongolabResourceHttp) {
  return $mongolabResourceHttp('wishes');
});

app.factory('WishList', function($rootScope) {
  return {
    updateList: function(list) {
      $rootScope.$broadcast('WishListUpdated', list);
    }
  };
});
