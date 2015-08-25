// ---------   MAP  --------------

angular.module('MagicApp').controller('MainCtrl', function($scope, $interval, MagicSurface, LayerApi, FileApi) {

    var token = 'NsKvPTgcub0FFi4hHMUhAK0oPwB4U3';
    var username = 'gustavo';

    MagicSurface.configApp(
        token,
        username
    );


    $scope.mapaVisible = true;
    $scope.conteudoLayer = false;
    $scope.formVisible = false;
    $scope.ajaxload = false;

    $scope.btnCriar = true;
    $scope.btnCancelar = false;
    $scope.btnAbrir = false;
    $scope.btnSair = false;

    $scope.mostrarForm = function() {
        $scope.mapaVisible = false;
        $scope.formVisible = true;
        $scope.btnCriar = false;
        $scope.btnCancelar = true;
        $scope.latitude = userPosition.G;
        $scope.longitude = userPosition.K;
    }

    $scope.mostrarMapa = function() {
        $scope.mapaVisible = true;
        $scope.formVisible = false;
        $scope.conteudoLayer = false;
        $scope.btnCriar = true;
        $scope.btnCancelar = false;
        $scope.btnSair = false;
        criarLayers();
    }

    $scope.mostrarLayer = function() {
        getImages($scope.selected_layer);
        $scope.formVisible = false;
        $scope.mapaVisible = false;
        $scope.conteudoLayer = true;
        $scope.btnAbrir = false;
        $scope.btnCancelar = false;
        $scope.btnSair = true;
        
    }

    //var userLat = -23.199385; // Santos Dumont Lat
    //var userLng = -45.891001; // Santos Dumont Lng
    //var userLat = -23.198069; // Vicentina Aranha 2 Lat
    //var userLng = -45.896236; // Vicentina Aranha 2 Lng
    //var userLat = -23.198300; // Vicentina Aranha Lat
    //var userLng = -45.894200; // Vicentina Aranha Lng
    //var userLat = -23.160903; // FATEC
    //var userLng = -45.795815; // FATEC
    var userPosition = null;

    var mapOptions = {
        center: userPosition,
        disableDefaultUI: true,
        zoom: 18
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker = new google.maps.Marker({
              position: userPosition,
              map: map
            });



    var layers;

    function listarLayers() {
        var promise = LayerApi.list();
        promise.success(function(result){
            layers = result.layers;
            criarLayers();
        });
        promise.error(function(result){
            alert("Erro ao buscar layers.")
        });
    }
    
    listarLayers();

    $scope.imgs;
    var getImages = function(layer){
        var params = {
            layerId: layer.id,
            filters : {
                file: 'image'
            }
        };
        var promise = FileApi.list(params);
        promise.success(function(result){
            $scope.imgs = result.files;
        });
        promise.error(function(result){
            alert("Erro ao buscar imagens")
        });      
    }

    var layerOptions = {
            strokeColor: '#1000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#1000FF',
            fillOpacity: 0.35,
            map: map,
            center: null,
            radius: null
            }; 

    var criarLayers = function(){
        for(var i=0; i<layers.length; ++i){
            layerOptions.center = new google.maps.LatLng(layers[i].latitude,layers[i].longitude);
            layerOptions.radius = layers[i].radius;
            var circle = new google.maps.Circle(layerOptions);

            var infowindowLayer = new google.maps.InfoWindow({
                map: map,
                position: layerOptions.center,
                content: layers[i].name
            });
        }   
    }

    function calcDistance(p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
    }

    var timer = $interval(autoUpdate,1000);

    var inLayer = 0;

    function autoUpdate() {
        
        navigator.geolocation.getCurrentPosition(
                displayPosition, 
                displayError
            );

        function displayPosition(position) {
            userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            marker.setPosition(userPosition);
            map.setCenter(userPosition);
            //console.log(userPosition);

            for(var i=0; i<layers.length; ++i){
                layerPosition = new google.maps.LatLng(layers[i].latitude, layers[i].longitude);
                if(calcDistance(userPosition, layerPosition) < layers[i].radius) {
                    if(inLayer == 0) {
                        //$interval.cancel(timer); // stop timer
                        //getImages(layers[i]);
                        $scope.descricao = layers[i].name;
                        $scope.selected_layer = layers[i];
                        $scope.btnAbrir = true;
                        $scope.btnCriar = false; 
                        inLayer = 1;  
                    }       
                }
                else {
                    inLayer = 0;
                }
            }
        }
        function displayError(error) {
            var errors = { 
                1: 'Permission denied',
                2: 'Position unavailable',
                3: 'Request timeout'
            };
            alert("Error: " + errors[error.code]);
        }
    }

    $scope.submitLayer = function() {
        $scope.form["latitude"] = userPosition.G;
        $scope.form["longitude"] = userPosition.K;
        var promise = LayerApi.save($scope.form);
        promise.success(function(result){
            $scope.descricao = result.name;
            $scope.selected_layer = result;
            $scope.mostrarLayer();
        });
        promise.error(function(result){
            $scope.mensagem = "Erro ao enviar formulário. " ;
            console.log(result);
        }); 
    };

    $scope.image = false;
    $scope.submitFile = function(files){
        var _file = files[0];
        var promise = FileApi.save(_file, $scope.selected_layer.id);
        $scope.ajaxload = true;
        promise.success(function(result){
            $scope.ajaxload = false;
            $scope.image = result;
            $scope.imgs.push($scope.image);
            //console.log($scope.image);
        });
        promise.error(function(result){
            $scope.ajaxload = false;
            console.log(result);
        });
    };


});