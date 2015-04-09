// ---------   MAP  --------------

angular.module('MagicApp').controller('MainCtrl', function ($scope, $interval, $modal, MRHttp) {

    $scope.mapaVisible = true;
    $scope.cameraVisible = false;
    $scope.alternarMapaCamera = function() {
        $scope.mapaVisible = !$scope.mapaVisible;
        $scope.cameraVisible = !$scope.cameraVisible;
    }

    //var userLat = -23.199385; // Santos Dumont Lat
    //var userLng = -45.891001; // Santos Dumont Lng
    var userLat = -23.198069; // Vicentina Aranha 2 Lat
    var userLng = -45.896236; // Vicentina Aranha 2 Lng
    //var userLat = -23.198300; // Vicentina Aranha Lat
    //var userLng = -45.894200; // Vicentina Aranha Lng
    var userPosition = new google.maps.LatLng(userLat, userLng);
    var layerPosition = new google.maps.LatLng(-23.198169, -45.895000);

    var mapOptions = {
        center: userPosition,
        disableDefaultUI: true,
        zoom: 17
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker = new google.maps.Marker({
              position: userPosition,
              map: map
            });

    var layers;
    var options = {options:angular.toJson({include_layers:'ALL'})};
    MRHttp.get('http://magicsurfacebr.appspot.com/layer/list',options)
    .success(function(result){
        layers = result.layers;
        criarLayers();
    })
    .error(function(result){

    });

    $scope.imgs;
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
            map: map,
            center: layerPosition,
            radius: 30
            }; 
    var criarLayers = function(){
        for(var i=0; i<layers.length; ++i){
            layers[i]
            layerOptions.center = new google.maps.LatLng(layers[i].latitude,layers[i].longitude);
            layerOptions.radius = layers[i].radius;
            var circle = new google.maps.Circle(layerOptions);


            var infowindowLayer = new google.maps.InfoWindow({
            map: map,
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
        marker.setPosition(userPosition);
        map.setCenter(userPosition);

        for(var i=0; i<layers.length; ++i){
            layerPosition = new google.maps.LatLng(layers[i].latitude, layers[i].longitude);
            if(calcDistance(userPosition, layerPosition) < layers[i].radius){
                $interval.cancel(timer); // stop timer
                getImages(layers[i]);
                $scope.descricao = " Layer: "+layers[i].name;
                $scope.escondeMapa = false;
                /*
                $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl'
                });
                */
            }
        }
        userLng -= 0.000010;
    }



$scope.myChannel = {
    // the fields below are all optional
    videoHeight: 380,
    videoWidth: 290,
    video: null // Will reference the video element on success
  };


});