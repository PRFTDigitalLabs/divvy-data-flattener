var stations={};
var stationFilesRead = 0;

var trips={};
var tripFilesRead = 0;

function loadFiles() {
  loadStations();
  loadTrips();
}

function loadStations() {
    var stationFiles = document.querySelector('input[name=stations]').files;
    if (stationFiles) {
      for (var i = 0; i < stationFiles.length; i++) {
        (function(file) {
            var reader = new FileReader();
            reader.addEventListener("load", function() {
              var data = d3.csvParse(reader.result, function(d){
                return d;
              });
              stations = Object.assign(data, stations);
            }, false);
            reader.addEventListener("loadend", function() {
              stationFilesRead++;
              if (stationFilesRead>=stationFiles.length) {
                stations.sort(function(a,b) {
                  return a.id - b.id;
                });
                downloadObjectAsCSV(stations, "divvy_stations");
              }
            }, false);
            reader.readAsText(file, "UTF-8");
        })(stationFiles[i]);
      }
    }
}

function loadTrips() {
    var tripFiles = document.querySelector('input[name=trips]').files;
    if (tripFiles) {
      for (var i = 0; i < tripFiles.length; i++) {
        (function(file) {
            var reader = new FileReader();
            reader.addEventListener("load", function() {
              var data = d3.csvParse(reader.result, function(d){
                return d;
              });
              trips = Object.assign(data, trips);
            }, false);
            reader.addEventListener("loadend", function() {
              tripFilesRead++;
              if (tripFilesRead>=tripFiles.length) {
                flattenData();
              }
            }, false);
            reader.readAsText(file, "UTF-8");
        })(tripFiles[i]);
      }
    }
}

function flattenData() {

}

function downloadObjectAsCSV(exportObj, exportName){
    var dataStr = "data:text/csv;charset=utf-8,";

    const array = typeof exportObj !== 'object' ? JSON.parse(exportObj) : exportObj;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    dataStr += array.reduce((str, next) => {
       str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
       return str;
      }, str);

    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".csv");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
