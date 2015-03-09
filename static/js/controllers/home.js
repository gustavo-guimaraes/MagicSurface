angular.module('MagicApp',['ui.bootstrap','mrhttp']);

angular.module('MagicApp').controller('ModalCtrl', function ($scope, $modal) {

  $scope.open = function () {
    var modalInstance = $modal.open();
  };
});

angular.module('MagicApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


