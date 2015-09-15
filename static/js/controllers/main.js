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
        inLayer = 0;
    }

    $scope.mostrarLayer = function() {
        getFiles($scope.selected_layer);
        $scope.formVisible = false;
        $scope.mapaVisible = false;
        $scope.conteudoLayer = true;
        $scope.btnAbrir = false;
        $scope.btnCancelar = false;
        $scope.btnSair = true; 
    }


    var userPosition;
    var map;
    var marker;

    navigator.geolocation.getCurrentPosition(function(position){
        userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            center: userPosition,
            disableDefaultUI: true,
            zoom: 17
        }
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        marker = new google.maps.Marker({
            position: userPosition,
            map: map
        });

        getLayers();

        var timer = $interval(autoUpdate,1000);
    });

    function calcDistance(p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
    }

    var inLayer = 0;

    function autoUpdate() {
        
        navigator.geolocation.getCurrentPosition(displayPosition, displayError);

        function displayPosition(position) {
            userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            marker.setPosition(userPosition);
            map.setCenter(userPosition);

            for(var i=0; i<layers.length; ++i){
                layerPosition = new google.maps.LatLng(layers[i].latitude, layers[i].longitude);
                if(calcDistance(userPosition, layerPosition) < layers[i].radius) {
                    if(inLayer == 0) {
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

    var layers = new Array();

    function getLayers() {
        var promise = LayerApi.list();
        $scope.ajaxload = true;
        promise.success(function(result){
            layers = result.layers;
            criarLayers();
            $scope.ajaxload = false;
        });
        promise.error(function(result){
            alert("Erro ao buscar layers.");
            $scope.ajaxload = false;
        });
    }

    var criarLayers = function(){

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

    $scope.submitLayer = function() {
        $scope.form["latitude"] = userPosition.G;
        $scope.form["longitude"] = userPosition.K;
        var promise = LayerApi.save($scope.form);
        $scope.ajaxload = true;
        promise.success(function(result){
            $scope.descricao = result.name;
            $scope.selected_layer = result;
            $scope.mostrarLayer();
            $scope.ajaxload = false;
        });
        promise.error(function(result){
            $scope.mensagem = "Erro ao enviar formulário. " ;
            $scope.ajaxload = false;
            console.log(result);
        }); 
    };

    $scope.imgs = [];
    $scope.videos = [];

    var getFiles = function(layer){
        $scope.imgs = [];
        $scope.videos = [];
        var params = {
            layerId: layer.id,
            filters: {
                files: 'all',
                deleted: false
            }
        };
        var promise = FileApi.list(params);
        $scope.ajaxload = true;
        promise.success(function(result){
            var files = result.files;
            for(var i=0; i<files.length; i++){
                if(files[i].kind == "image"){
                    $scope.imgs.push(files[i]);
                }
                else if(files[i].kind == "video"){
                    var video = {
                        "src":files[i].link,
                    }
                    $scope.videos.push(files[i]);
                }
            }
            console.log($scope.imgs);
            console.log($scope.videos); 
            $scope.ajaxload = false; 
        });
        promise.error(function(result){
            alert("Erro ao buscar imagens");
            $scope.ajaxload = false;
        });  

    }

    $scope.submitFile = function(files){
        var _file = files[0];
        var promise = FileApi.save(_file, $scope.selected_layer.id);
        $scope.ajaxload = true;
        promise.success(function(result){
            if(result.kind == "image"){
                $scope.imgs.push(result);
                console.log($scope.imgs);
            }
            else if(result.kind == "video"){
                $scope.videos.push(result);
                console.log($scope.videos);
            }
            $scope.ajaxload = false;
        });
        promise.error(function(result){
            $scope.ajaxload = false;
            console.log(result);
        });
    };

});


//var userLat = -23.199385; // Santos Dumont Lat
    //var userLng = -45.891001; // Santos Dumont Lng
    //var userLat = -23.198069; // Vicentina Aranha 2 Lat
    //var userLng = -45.896236; // Vicentina Aranha 2 Lng
    //var userLat = -23.198300; // Vicentina Aranha Lat
    //var userLng = -45.894200; // Vicentina Aranha Lng
    //var userLat = -23.160903; // FATEC
    //var userLng = -45.795815; // FATEC