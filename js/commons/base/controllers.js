// Generated by CoffeeScript 1.8.0
(function() {
  var module;

  module = angular.module("commons.base.controllers", ['commons.base.services', 'commons.accounts.controllers', 'commons.graffiti.services', 'commons.catalog.services']);

  module.controller("AbstractListCtrl", function($scope, $stateParams, $timeout, BareRestangular, DataSharing, FilterService) {
    "Abstract controller that initialize some list filtering parameters and\nwatch for changes in filterParams from FilterService\nControllers using it need to implement a refreshList() method calling adequate [Object]Service";
    console.log(" Init list ctrler, defaultResultLimit = ", config.defaultResultLimit);
    $scope.params = {
      limit: config.defaultResultLimit
    };
    $scope.seeMore = false;
    $scope.resultTotalCount = null;
    $scope.$watch(function() {
      return FilterService.filterParams.tags;
    }, function(newVal, oldVal) {
      if (newVal !== oldVal) {
        return $scope.refreshListGeneric();
      }
    });
    $scope.$watch(function() {
      return FilterService.filterParams.query;
    }, function(newVal, oldVal) {
      if (newVal !== oldVal) {
        return $scope.refreshListGeneric();
      }
    });
    $scope.refreshList = function() {
      return console.log(" Abstract List Refresher (do nothing)");
    };
    $scope.refreshListGeneric = function() {
      var tag, _i, _len, _ref;
      $scope.params['q'] = FilterService.filterParams.query;
      $scope.params['facet'] = FilterService.filterParams.tags;
      if (config.defaultSiteTags) {
        _ref = config.defaultSiteTags;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          $scope.params['facet'].push(tag);
        }
      }
      return $scope.refreshList();
    };
    $scope.loadAll = function() {
      " Load all results (should be restrained regarding number of results) ";
      console.log(" loading all !");
      $scope.params['limit'] = $scope.resultTotalCount;
      return $scope.refreshList();
    };
    $scope.loadMore = function() {
      " Using here custom Restangular service to use directly URL given by tastypie (nextURL) ";
      return BareRestangular.all($scope.nextURL).getList().then(function(result) {
        var item, _i, _len;
        console.log("loading more !", result);
        for (_i = 0, _len = result.length; _i < _len; _i++) {
          item = result[_i];
          $scope.projectsheets.push(item);
        }
        if (result.metadata.next) {
          $scope.seeMore = true;
          $scope.nextURL = result.metadata.next.slice(1);
        } else {
          $scope.seeMore = false;
        }
        return $timeout(function() {
          return $scope.$broadcast('projectListRefreshed');
        }, 10);
      });
    };
    return $scope.init = function(limit, featured) {
      " Init query param from stateParams (see routing in app.coffee) and template constants (limit, featured) ";
      console.log(" Init List controller ! ", limit);
      if (limit) {
        $scope.params.limit = limit;
      }
      FilterService.filterParams.query = '';
      FilterService.filterParams.tags = [];
      if ($stateParams.query) {
        DataSharing.sharedObject['stateParamQuery'] = $stateParams.query;
        FilterService.filterParams.query = $stateParams.query;
      } else {
        DataSharing.sharedObject['stateParamQuery'] = '';
      }
      if ($stateParams.tag) {
        console.log(" [List] got a tag ! ", $stateParams.tag);
        DataSharing.sharedObject['stateParamTag'] = $stateParams.tag;
        FilterService.filterParams.tags.push($stateParams.tag);
      } else {
        DataSharing.sharedObject['stateParamTag'] = [];
      }
      return $scope.refreshListGeneric();
    };
  });

  module.controller("ObjectGetter", function($scope, Project, Profile) {
    return $scope.getObject = function(objectTypeName, objectId) {
      if (objectTypeName === 'project') {
        Project.one(objectId).get().then(function(ProjectResult) {
          return $scope.project = ProjectResult;
        });
      }
      if (objectTypeName === 'profile') {
        return Profile.one(objectId).get().then(function(ProfileResult) {
          return $scope.profile = ProfileResult;
        });
      }
    };
  });

}).call(this);
