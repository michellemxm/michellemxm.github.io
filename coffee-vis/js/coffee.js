var chart;
var height = 200;
var width = 300;
//Sum of sales by regions
var salesCentral = 0;
var salesEast = 0;
var salesWest = 0;
var salesSouth = 0;
//Sum of sales by categories
var salesCoffee = 0;
var salesEspresso = 0;
var salesTea = 0;
var salesHerbal = 0;
//Sum of profit by regions
var profitCentral = 0;
var profitEast = 0;
var profitWest = 0;
var profitSouth = 0;
//Sum of profit by categories
var profitCoffee = 0;
var profitEspresso = 0;
var profitTea = 0;
var profitHerbal = 0;
//Console all sums
var allSums = [
  [salesCentral, salesEast, salesWest, salesSouth],
  [profitCentral, profitEast, profitWest, profitSouth],
  [salesCoffee, salesEspresso, salesTea, salesHerbal],
  [profitCoffee, profitEspresso, profitTea, profitHerbal]
];

//DEFINE YOUR VARIABLES 


//Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg');
  vis = chart.append('g');
  //PUT YOUR INIT CODE BELOW
  
  //Count number of lines in the csv data sheet
  //4248 rows of data for this sheet

  //Import data
  d3.csv("./data/CoffeeData.csv", function(data) {
    
    //Strings to ints
    data.forEach(function(d) {
      d.sales = +d.sales;
      d.profit = +d.profit;
    })

    //Calculate by regions
    for (var i = 0; i < data.length; i++) {
      if (data[i].region == "Central") {
        salesCentral += data[i].sales;
        profitCentral += data[i].profit;
      }
      else if (data[i].region == "East") {
        salesEast += data[i].sales;
        profitEast += data[i].profit;
      }
      else if (data[i].region == "West") {
        salesWest += data[i].sales;
        profitWest += data[i].profit;
      }
      else if (data[i].region == "South") {
        salesSouth += data[i].sales;
        profitSouth += data[i].profit;
      }
    }
    //Check on the sum in console
    console.log(allSums);
  })

}


//Called when the update button is clicked
function updateClicked(){
  d3.csv('data/CoffeeData.csv',update);
}


//Callback for when data is loaded
function update(rawdata){
  //PUT YOUR UPDATE CODE BELOW


}


// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}


// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}
