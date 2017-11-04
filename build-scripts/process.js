var fs = require('fs');
var chalk = require('chalk');
var mapshaper = require('mapshaper');
var async = require('async');
var turf = require('@turf/turf');

// array of our files
var files = ['../project-data/symbols.json', '../project-data/districts.json'];

// use async to load both at once
async.map(files, fs.readFile, function(err, files) {
    if(err) throw err;
    // parse the results and send to processData
    processData(JSON.parse(files[0]), JSON.parse(files[1]));

});

function processData(symbols, districts) {
    // we have access to the two GeoJSON FeatureCollections here

    // use turf to loop through each district
    turf.featureEach(districts, (district, i) => {

        // reset count to zero for district
        var count = 0;
        
        // then loop through each symbol
        turf.featureEach(symbols, (symbol) => {
            
            // // if the symbol is in the district
            if(turf.inside(symbol, district)) {
                // increment the count by one
                count++
            }
        });

        // add the total count to the district
        district.properties.count = count;
    });

    fs.writeFile('../data/districts.json', JSON.stringify(districts), (err)=> {
        if(err) throw err;
    });

}