angular.module('MagicApp',['ui.bootstrap','mrhttp','webcam']);

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

angular.module('MagicApp').controller("CameraCtrl", function ($scope) {
	$scope.cameraVisible = false;
	$scope.mostrarCamera = function() {
		$scope.cameraVisible = true;
	}
});
