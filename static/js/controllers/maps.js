// ---------   MAP  --------------

angular.module('MagicApp').controller('MapCtrl', function ($scope, $interval, $modal, MRHttp) {

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

    var marker = new google.maps.Marker({
              position: userPosition,
              map: $scope.map,
            });

    var layers;
    $scope.imgs;
    var options = {options:angular.toJson({include_layers:'ALL'})};
    MRHttp.get('http://magicsurfacebr.appspot.com/layer/list',options)
    .success(function(result){
        layers = result.layers;
        criarLayers();
        getImages(layers[0]);
    })
    .error(function(result){

    });

    var getImages = function(layer){
        var params = {
            id: layer.id,
            options: angular.toJson({include_images:'ALL'})
        };

        MRHttp.get('http://magicsurfacebr.appspot.com/layer/get', params)
        .success(function(result){
            $scope.imgs = result.images;
        })
        .error(function(result){
        });        
    }
    


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
    var criarLayers = function(){
        for(var i=0;i<layers.length;++i){
            layers[i]
            layerOptions.center = new google.maps.LatLng(layers[i].latitude,layers[i].longitude);
            layerOptions.radius = layers[i].radius;
            var circle = new google.maps.Circle(layerOptions);


            var infowindowLayer = new google.maps.InfoWindow({
            map: $scope.map,
            position: new google.maps.LatLng(layers[i].latitude,layers[i].longitude),
            content: layers[i].name
            });


        }     
    }

    function calcDistance(p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
    }

    //var timer = $interval(autoUpdate,100); //Timer para simular usuário andando no mapa

    function autoUpdate() {
        userPosition = new google.maps.LatLng(userLat, userLng);
        $scope.infowindowLayer.setContent(calcDistance(userPosition,layerPosition)+' m');
        $scope.marker.setPosition(userPosition);
        $scope.map.setCenter(userPosition);

        if(calcDistance(userPosition, layerPosition) < 30){
            $interval.cancel(timer); // stop timer
            $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl'
            });




        }
        userLng -= 0.000010;
    }

});