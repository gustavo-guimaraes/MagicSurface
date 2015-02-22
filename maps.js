var layerPosition = new google.maps.LatLng(-23.198169, -45.895000);
var userLatitude = -23.198169;
var userLongitude = -45.893592;
var userPosition;
var userImage = 'userIcon.png';

    function initialize(){
      var map = new google.maps.Map(document.getElementById('map-canvas'), {
        disableDefaultUI: true,
        zoom: 19
      });

      var marker = null;

      function autoUpdate() {

        /*  GEOLOCALIZAÇÃO
        navigator.geolocation.getCurrentPosition(function(position) {  
          var newPoint = new google.maps.LatLng(position.coords.latitude, 
                                                position.coords.longitude);
        */
          userPosition = new google.maps.LatLng(userLatitude, userLongitude);


          if (marker) {
            marker.setPosition(userPosition);
          }
          else {
            marker = new google.maps.Marker({
              position: userPosition,
              map: map,
              icon: userImage
            });
          }

          map.setCenter(userPosition);

          if(calcDistance(userPosition, layerPosition) < 20){
              $("#myModal").modal();
              setTimeout(autoUpdate, 500000000000); // Intervalo de tempo para cada requisição de localização.
          }
          else{
            setTimeout(autoUpdate, 100); // Intervalo de tempo para cada requisição de localização.
          }

          userLongitude -= 0.000030;


        //}); fim geolocalização

      }

      autoUpdate();

      var layerOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: layerPosition,
            radius: 20
            };
            
      layerCircle = new google.maps.Circle(layerOptions);

      var infowindowLayer = new google.maps.InfoWindow({
              map: map,
              position: layerPosition,
              content: "Layer X (Raio de 20m)"
            });

    }

    function calcDistance(p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    $(document).ready(function(){
      $('input[type=file]').bootstrapFileInput();
    });