var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Initial Params
var chosenXAxis = "poverty";

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(povertyData, err) {
  if (err) throw err;

  // Append an SVG group
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // parse data
  povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d.poverty) * 0.8,
        d3.max(povertyData, d => d.poverty) * 1.2])
    .range([0, width]);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d.obesity) * 0.8,
        d3.max(povertyData, d => d.obesity) * 1.2])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  // need to transform and translate?
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circles = chartGroup
    .selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 10)
    .classed("stateCircle", true)

    // text added to bubbles

  var text = chartGroup.append("g")
  .selectAll('text')
  .data(povertyData)
  .enter()
  .append("text")
  .attr("dx", d => xLinearScale(d.poverty))
  .attr("dy", d => yLinearScale(d.obesity) +4)
  .text(d => d.abbr)
  .classed('stateText', true)

//
  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .classed("aText", true)
    .text("Poverty");


  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Obesity");

});
