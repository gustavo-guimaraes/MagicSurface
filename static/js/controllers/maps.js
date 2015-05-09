// ---------   MAP  --------------

angular.module('MagicApp').controller('MainCtrl', function ($scope, $interval, MRHttp) {

    $scope.mapaVisible = true;
    $scope.conteudoLayer = false;
    $scope.formVisible = false;
    $scope.cameraVisible = false;

    $scope.btnCriar = true;
    $scope.btnCancelar = false;
    $scope.btnAbrir = false;
    $scope.btnSair = false;
    $scope.btnFoto = false;

    $scope.mostrarForm = function() {
        $scope.mapaVisible = false;
        $scope.formVisible = true;
        $scope.btnCriar = false;
        $scope.btnCancelar = true;
        $scope.latitude = userPosition.A;
        $scope.longitude = userPosition.F;
    }

    $scope.mostrarMapa = function() {
        $scope.mapaVisible = true;
        $scope.formVisible = false;
        $scope.btnCriar = true;
        $scope.btnCancelar = false;
    }

    $scope.mostrarLayer = function() {
        $scope.mapaVisible = false;
        $scope.conteudoLayer = true;
        $scope.btnAbrir = false;
        $scope.btnSair = true;
    }

    $scope.sairLayer = function() {
        $scope.btnSair = false;
        $scope.btnAbrir = true;
        $scope.conteudoLayer = false;
        $scope.mapaVisible = true;
    }

    $scope.abrirCamera = function() {
        $scope.conteudoLayer = false;
        $scope.cameraVisible = true;
        $scope.btnSair = false;
        $scope.btnFoto = true;
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
    var options = {options:angular.toJson({include_layers:'ALL'})};
    MRHttp.get('http://magicsurfacebr.appspot.com/layer/list',options)
    .success(function(result){
        layers = result.layers;
        criarLayers();
    })
    .error(function(result){
        console.log('Erro ao buscar Layers');
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
            console.log('Erro ao buscar imagens');
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

    criarLayers = function(){
        for(var i=0; i<layers.length; ++i){
            layerOptions.center = new google.maps.LatLng(layers[i].latitude,layers[i].longitude);
            layerOptions.radius = layers[i].radius;
            var circle = new google.maps.Circle(layerOptions);

            var infowindowLayer = new google.maps.InfoWindow({
                map: map,
                position: layerOptions.center,
                content: layers[i].name
            });
            console.log('Criando layers');
        }     
    }

    function calcDistance(p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
    }

     var timer = $interval(autoUpdate,1000);

    function autoUpdate() {
        
        navigator.geolocation.getCurrentPosition(
                displayPosition, 
                displayError
            );

        function displayPosition(position) {
            userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            marker.setPosition(userPosition);
            map.setCenter(userPosition);

            for(var i=0; i<layers.length; ++i){
                layerPosition = new google.maps.LatLng(layers[i].latitude, layers[i].longitude);
                if(calcDistance(userPosition, layerPosition) < layers[i].radius){
                    $interval.cancel(timer); // stop timer
                    getImages(layers[i]);
                    $scope.descricao = layers[i].name;
                    $scope.btnAbrir = true;
                    $scope.btnCriar = false;            }
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

    $scope.myChannel = {
        // the fields below are all optional
        videoWidth: 600,
        video: null // Will reference the video element on success
      };

    $scope.submitLayer = function() {
        $scope.form["latitude"] = userPosition.A;
        $scope.form["longitude"] = userPosition.F;
        MRHttp.post('http://magicsurfacebr.appspot.com/layer/save', $scope.form)
        .success(function(result){
            $scope.mostrarMapa();
            criarLayers();
        })
        .error(function(result){
            $scope.mensagem = "Erro ao enviar formulário.";
        });  
    }


});