const { read ,write, print } = require('./utils')

/*
  Will read in and parse the csv into an array of objects
  that look like this
  [{ 
      REGION:"Northeast",
      STATE:"New York",
      CITY:"New York, NY",
      POPULATION:"8622698",
  }, ... ]

  We then slice it down to just the first couple of rows
  so that it is easier to debug at first. Feel free to increase
  the limit or run all 1000 rows as you get more confident
*/
var csvData = read('cities.csv').slice(0,10)
//var csvData = read('cities.csv')

var regions = csvData.reduce((regionAcc, item) =>{
    //console.log(regionAcc), reduce in order to group the elements in the proper order
    var regionIndex = regionAcc.findIndex(region => region.name == item.REGION);
    // set a region index so you can keep track of where you are in the regions
    if (regionIndex == -1){
        regionAcc.push({name: item.REGION, states: []});
        regionIndex = regionAcc.length - 1;
    }
    //checked to see if it is the same or a different region, it it is new create that region and give it a states array

    var stateIndex = regionAcc[regionIndex].states.findIndex(state => state.name == item.STATE);
    //set a state index so you can keep track of what state you are on.
    if (stateIndex == -1){
        regionAcc[regionIndex].states.push({name : item.STATE, cities: []});
        stateIndex = regionAcc[regionIndex].states.length - 1;
    }
    // check to see if you are on the same or need a new state, if so create it and add a city array

    var cityIndex = regionAcc[regionIndex].states[stateIndex].cities.findIndex(city => city.name == item.CITY);
    //set a city index to see where you are in the cities
    if (cityIndex == -1){
        regionAcc[regionIndex].states[stateIndex].cities.push({name : item.CITY, population: item.POPULATION});
        cityIndex = regionAcc[regionIndex].states[stateIndex].cities.length - 1;
    }
    // check to see what city you are on, push it on.

    return regionAcc;
    // return the total grouped array

},[]);

var order = ["Pacific", "Mountain", "Midwest", "South", "Northeast"];
// create an array containing the order you want the regions to be in
regions.sort(function(a, b) {

    return order.indexOf(a.name) - order.indexOf(b.name);
    // compare the two regions and sort based on the order
  });


regions.forEach(region => {
    region.states.sort(function(a, b) {
        //sort the states based on their names
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
            //sort based on ascii value
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
        });

        region.states.forEach(state => {
            // for each city you are going to sort it based on the population
            state.cities.sort((a, b) => {
                return b.population - a.population
            });
        });
});


print(regions) // This will console.log with beautify what ever you pass it
write('data.json',regions) // Writing data to a file can be useful for debugging S