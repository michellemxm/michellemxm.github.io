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

//DEFINE YOUR VARIABLES UP HERE


//Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg');
  vis = chart.append('g');
  //PUT YOUR INIT CODE BELOW
  
  //Count number of lines in the csv data sheet
  //4248 rows of data for this sheet

  //Import data
  d3.csv("./data/CoffeeData.csv", function(data) {
    data.forEach(function(d) {
      d.sales = +d.sales;
      d.profit = +d.profit;
    })

    data.forEach(function(d) {
      if (d.regions == "Central") {
        salesCentral += d.sales;
      }
      else if (d.regions == "East") {
        salesEast += d.sales;
      }
      else if (d.regions == "West") {
        salesWest += d.sales;
      }
      else if (d.regions == "South") {
        salesSouth += d.sales;
      }
    })

    console.log("salesCentral" + salesCentral);
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
