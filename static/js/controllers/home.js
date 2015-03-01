angular.module('magic',['ui.bootstrap']);

angular.module('magic').controller('ModalCtrl', function ($scope, $modal) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl'
    });
  };
});

angular.module('magic').controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});






// ---------   MAP  --------------

angular.module('magic').controller('MapCtrl', function ($scope, $interval, $modal) {

    var userLat = -23.198300;
    var userLng = -45.894200;
    var userPosition = new google.maps.LatLng(userLat, userLng);
    var layerPosition = new google.maps.LatLng(-23.198169, -45.895000);

    var mapOptions = {
        center: userPosition,
        disableDefaultUI: true,
        zoom: 18
    }
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.marker = new google.maps.Marker({
              position: userPosition,
              map: $scope.map,
            });

    var layerOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: $scope.map,
            center: layerPosition,
            radius: 30
            };       
    $scope.layerCircle = new google.maps.Circle(layerOptions);

    $scope.infowindowLayer = new google.maps.InfoWindow({
        map: $scope.map,
        position: layerPosition,
        content: calcDistance(userPosition,layerPosition)+' m'
    });

    function calcDistance(p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
    }

    function autoUpdate() {
        userPosition = new google.maps.LatLng(userLat, userLng);
        $scope.infowindowLayer.setContent(calcDistance(userPosition,layerPosition)+' m');
        $scope.marker.setPosition(userPosition);
        $scope.map.setCenter(userPosition);

        if(calcDistance(userPosition, layerPosition) < 30){
            $interval.cancel(timer);
            $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl'
            });
        }
        userLng -= 0.000010;
    }

    var timer = $interval(autoUpdate,100);

    

});


