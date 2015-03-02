angular.module('MagicApp',['ui.bootstrap','mrhttp']);

angular.module('MagicApp').controller('ModalCtrl', function ($scope, $modal) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl'
    });
  };
});

angular.module('MagicApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, MRHttp) {

  $scope.ok = function () {
    var options = {options:angular.toJson({include_layers:'ALL'})};
    MRHttp.get('http://magicsurfacebr.appspot.com/layer/list',options)
    .success(function(result){
        $scope.layers = result;
    })
    .error(function(result){});

    //$modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


