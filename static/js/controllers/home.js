angular.module('MagicApp',['ui.bootstrap','mrhttp','webcam']);

angular.module('MagicApp').controller("CameraCtrl", function ($scope) {
	$scope.cameraVisible = false;
	$scope.mostrarCamera = function() {
		$scope.cameraVisible = true;
	}
});
