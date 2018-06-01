var stations = {};
var stationFilesRead = 0;

var trips = {};
var tripFilesRead = 0;

var combined = {};

function loadFiles() {
  loadStations();
  loadTrips();
}

function loadStations() {
  var stationFiles = document.querySelector("input[name=stations]").files;
  if (stationFiles) {
    for (var i = 0; i < stationFiles.length; i++) {
      (function(file) {
        var reader = new FileReader();
        reader.addEventListener(
          "load",
          function() {
            var data = d3.csvParse(reader.result, function(d) {
              return d;
            });
            stations = Object.assign(data, stations);
          },
          false
        );
        reader.addEventListener(
          "loadend",
          function() {
            stationFilesRead++;
            if (stationFilesRead >= stationFiles.length) {
              stations.sort(function(a, b) {
                return a.id - b.id;
              });
              downloadStringAsCSV(makeCSV(stations), "divvy_stations");
            }
          },
          false
        );
        reader.readAsText(file, "UTF-8");
      })(stationFiles[i]);
    }
  }
}

function loadTrips() {
  var tripFiles = document.querySelector("input[name=trips]").files;
  if (tripFiles) {
    for (var i = 0; i < tripFiles.length; i++) {
      (function(file) {
        var reader = new FileReader();
        reader.addEventListener(
          "load",
          function() {
            var data = d3.csvParse(reader.result, function(d) {
              return d;
            });
            trips = Object.assign(data, trips);
          },
          false
        );
        reader.addEventListener(
          "loadend",
          function() {
            tripFilesRead++;
            if (tripFilesRead >= tripFiles.length) {
              flattenData();
            }
          },
          false
        );
        reader.readAsText(file, "UTF-8");
      })(tripFiles[i]);
    }
  }
}

function flattenData() {
  const deleteFields = [];//["trip_id", "start_time", "end_time", "bikeid", "from_station_name", "to_station_name", "usertype", "birthyear", "gender"];

  trips = trips.map(obj => {
    let fromStation = stations.find(o => o.id === obj.from_station_id);
    let toStation = stations.find(o => o.id === obj.to_station_id);

    obj["from_station_latitude"] = fromStation.latitude;
    obj["from_station_longitude"] = fromStation.longitude;
    obj["to_station_latitude"] = toStation.latitude;
    obj["to_station_longitude"] = toStation.longitude;

    for (var i = 0; i < deleteFields.length; i++) {
      delete obj[deleteFields[i]];
    }

    return obj;
  });
  downloadStringAsCSV(makeCSV(trips), "divvy_trips");
}

function makeCSV(objToConvert) {
  var dataStr = "";

  const array =
    typeof objToConvert !== "object" ? JSON.parse(objToConvert) : objToConvert;
  let str =
    `${Object.keys(array[0])
      .map(value => `"${value}"`)
      .join(",")}` + "\r\n";

  dataStr += array.reduce((str, next) => {
    str +=
      `${Object.values(next)
        .map(value => `"${value}"`)
        .join(",")}` + "\r\n";
    return str;
  }, str);

  return dataStr;
}

function downloadStringAsCSV(CSVstring, exportName) {
  var blob = new Blob([CSVstring], { type: "text/csv;charset=utf-8" });
  saveAs(blob, exportName + ".csv");
}
