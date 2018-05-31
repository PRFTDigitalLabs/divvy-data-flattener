var stations={};
var filesRead = 0;

function loadFiles() {
  var files = document.querySelector('input[name=stations]').files;
  if (files) {
    for (var i = 0; i < files.length; i++) {
      (function(file) {
          var reader = new FileReader();
          reader.addEventListener("load", function() {
            var data = d3.csvParse(reader.result, function(d){
              return d;
            });
            stations = Object.assign(data, stations);
          }, false);
          reader.addEventListener("loadend", function() {
            filesRead++;
            if (filesRead>=files.length) {
              stations.sort(function(a,b) {
                return a.id - b.id;
              });
              console.table(stations);
            }
          }, false);
          reader.readAsText(file, "UTF-8");
      })(files[i]);
    }
  }
}
