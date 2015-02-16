var layerPosition = new google.maps.LatLng(-23.192131, -45.790300);
    //var layerPosition = new google.maps.LatLng(-23.191726, -45.790731);

    function initialize(){
      var map = new google.maps.Map(document.getElementById('map-canvas'), {
        disableDefaultUI: true,
        zoom: 19
      });

      var marker = null;

      function autoUpdate() {
        navigator.geolocation.getCurrentPosition(function(position) {  
          var newPoint = new google.maps.LatLng(position.coords.latitude, 
                                                position.coords.longitude);

          if (marker) {
            marker.setPosition(newPoint);
          }
          else {
            marker = new google.maps.Marker({
              position: newPoint,
              map: map
            });
          }

          map.setCenter(newPoint);

          if(calcDistance(newPoint,layerPosition)<20){
              $("#myModal").modal();
            }
        }); 

        setTimeout(autoUpdate, 50000); // Intervalo de tempo para cada requisição de localização.
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