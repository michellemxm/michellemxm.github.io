              var map;
              function initialize() {
              var mapOptions = {
                  center: new google.maps.LatLng(39.9957824, 116.479004),
                  zoom: 15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
              };
              var map = new google.maps.Map(document.getElementById("map_canvas"),
                  mapOptions);
              }

              google.maps.event.addDomListener(window, 'load', initialize);
              var styleArray = [
             {
                  featureType: "all",
                  stylers: [
                    { saturation: -80 }
                  ]
             },{
                  featureType: "road.arterial",
                  elementType: "geometry",
                  stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                  ]
             },{
                  featureType: "poi.business",
                  elementType: "labels",
                  stylers: [
                     { visibility: "off" }
                  ]
                }
             ];