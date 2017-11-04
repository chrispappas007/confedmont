var fs = require('fs');
var chalk = require('chalk');
var mapshaper = require('mapshaper');
var async = require('async');

// array of our files
var files = ['../project-data/confederate_symbols.geojson', '../project-data/congdist.json'];

// use async to load both at once
async.map(files, fs.readFile, function(err, files) {
    if(err) throw err;
    // parse the results and send to processData
    processData(JSON.parse(files[0]), JSON.parse(files[1]));

});

function processData(symbols, districts) {
    // we have access to the two GeoJSON FeatureCollections here


}