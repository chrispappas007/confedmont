# History Revised: Civil War Monuments Across the US
Recent events have brought about a national conversation on Civil War Monuments, and specifically monuments to the Confederacy. The majority of Civil War Monuments were dedicated during two periods: from 1900 to the 1920s, when Jim Crow legislation was being enacted, and through the 1950s and 1960s, the height of the Civil Rights movement. 
[The Southern Poverty Law Center](https://www.splcenter.org/) (SPLC) has worked to catalog these monuments in an effort to assit local communities in re-examining their role and place in the local landscape. SPLC excluded historical markers, battlefields, museums, cemeteries, and places or symbols that are largely historic in nature from their database. They identified 1,503 monuments that include statues, roadways, parks, and schools. They detail their project goals, methods, and results at [Whose Heritage? Public Symbols of the Confederacy](https://www.splcenter.org/20160421/whose-heritage-public-symbols-confederacy). 

### Data Sources
Our datasets were drawn from two sources:
* [SPLC Confederate Symbols Database](https://splcenter.carto.com/tables/confederate_symbols/public) hosted by [CARTO](https://carto.com/)
* [Congressional Districts](https://www.census.gov/geo/maps-data/data/cbf/cbf_cds.html) for 115th Congress from the [Census Bureau](https://www.census.gov/en.html)

Please note that the data displayed in our map has NOT been normalized and is instead the raw counts of monuments as documented in each congressional district.

### Processes and Scripts
SPLC offers their data for download in both geoJSON and CSV format. We choose the CSV format so we can easily examine the data, simplify the categories, and include additional information. This file was then converted to a geojson. The congressional districts were downloaded as a shapefile and mapshaper was used to make the geoJSON conversion, trim percision, and filter unwanted fields. The SPLC data was then joined to the congressional districts using mapshaper. Packages used for this project include:
* [csv2geojson](https://github.com/mapbox/csv2geojson)
* [mapshaper](https://github.com/mbloch/mapshaper)
Our scripts for processing were:
* use csv2geojson to convert csv to geojson

  `csv2geojson confederate_symbols.csv --lat "latitude" --lon "longitude" > symbols.json`

* use mapshaper to convert shapefile to geojson and trim precision

  `mapshaper cb_2016_us_cd115_20m.shp -simplify 30% -filter remove-empty -filter-fields ALAND,STATEFP -o precision=.0001 format=geojson districts.json`

*  use mapshaper to filter out unwanted fields and trim precision

  `mapshaper symbols.json -filter-fields uid,feature_name,address,city,state,side,year_dedicated -o format=geojson precision=.000001 symbols-filtered.json`

*  use mapshaper to join symbols-filtered.json to districts.json; added a count of monuments in district (join_count)

  `mapshaper districts.json -join symbols-filtered.json -filter-fields feature_name,side,year_dedicated calc='join_count=count()' -o monudist.json`

### A Word on the Process
Communication was primarily through Slack messages. We opened issues on GitHub for specific problems or points for consideration. Especially helpful was the creation of a data-notes.txt file where scripts for each process were stored. The files were re-processed several times as we added and removed attributes and this made it easy to replicate each step.