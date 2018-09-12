/* Defining width and heights of the canvas (svg) for the map*/
var width = 500,
    height = 500;

/* Defining width and heights of the canvas (svg2) for the graph*/
var margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width2 = 480 - margin.left - margin.right,
    height2 = 300 - margin.top - margin.bottom;

/* Creating svg for map */
var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)


/* Creating svg for graph */
var svg2 = d3.select("#graph")
    .append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    /* Accounting for the margin */
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")

/* Set the ranges and domains*/
var x = d3.scaleLinear().range([0, width2]);
var y = d3.scaleLinear().range([height2, 0]);

/* Define the axes using range and domain*/
var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);

/* Define the line*/
var valueline = d3.line()
    .x(function (d) { return x(d.ref_date); })
    .y(function (d) { return y(d.values); });

/* Creating projection which will be used to fit coordinates to represent map */
var projection = d3.geoMercator()
    .translate([width + 100, height + 100])
    .scale(200)

var path = d3.geoPath()
    .projection(projection)

/* Modal variable */
var modal = document.getElementById('myModal');

/* Time */
var formatTime = d3.timeFormat("%Y");

/* <span> close for modal 
var span = document.getElementsByClassName("close")[0];
*/

/* When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}
*/

/* When the user clicks anywhere outside of the modal, close it */
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var ref_date = [];

var values = [];

/* Defining graphing as a function */
function Graphing(filename, title) {
    
    svg2.selectAll("*").remove();
    
    /* Add Canadian data */ 
    d3.csv("CSV/Incest_Canada.csv", function(error, data) {
        xdhehe = data.forEach(function(d) {
            d.ref_date = +d.ref_date;
            d.values = +d.values;
            ref_date.push(d.ref_date);
            values.push(d.values);

            return ref_date, values
        });
        
        window.ref_date = ref_date
        window.values = values

        /* Scale the range and domain of the data */
        x.domain(d3.extent(data, function(d) { return d.ref_date; }));
        y.domain([0, d3.max(data, function(d) { return d.values; })]);

        /* xScale for Bar Graph */
        const xScale = d3.scaleBand()
            .range([0, 10])
            .padding(0.1);

        /* Adding Bar Graph */
        svg2.selectAll("bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.ref_date-0.1); })
            .attr("width", xScale.bandwidth())
            .attr("y", function (d) { return y(0); })
            .attr("height", 0)
            .style("fill","red")
            .transition()
            .attr("y", function (d) { return y(d.values-(0.005*d.values)); })
            .duration(2000)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("height", function (d) { return height2 - y(d.values); });

        /* Add the valueline path. */
        svg2.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        /* Add the X Axis */
        svg2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height2) + ")")
            .call(xAxis.tickFormat(d3.format(".0f")));

        /* Add the Y Axis */
        svg2.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate( 0, 0)")
            .call(yAxis);

    });

    d3.csv(filename, function (error, graph) {
        
        /* To see if there is an error or not */
        if (error) throw error;

        /* Calling data again */
        graph.forEach(function(d) {
            d.ref_date = d.ref_date
            d.values = +d.values;
          });

        /* Scale the range and domain of the data */
        x.domain(d3.extent(window.ref_date));
        y.domain([0, d3.max(window.values)]);

        /* xScale for bar graph */
        const xScale = d3.scaleBand()
            .range([0, 10])
            .padding(0.1);

        /* Adding Bar Graph */
        svg2.selectAll("bar")
            .data(graph)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.ref_date-0.1); })
            .attr("width", xScale.bandwidth())
            .attr("y", function (d) { return y(0); })
            .style("fill", "lightblue")
            .attr("height", 0)
            .transition()
            .attr("y", function (d) { return y(d.values-(0.01*d.values)); })
            .duration(2000)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("height", function (d) { return height2 - y(d.values); });

        /* Add the valueline path. */
        svg2.append("path")
            .attr("class", "line")
            .attr("d", valueline(graph));

        /* Add the X Axis */
        svg2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height2) + ")")
            .call(xAxis.tickFormat(d3.format(".0f")));

        /* Add the Y Axis */
        svg2.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate( 0, 0)")
            .call(yAxis);
    });
    document.getElementById('title').innerHTML = title;
    console.log(title)
}

/* reading the data */
d3.queue()
    .defer(d3.json, 'JSON/Canada.topojson')
    .await(CanadaMap);

function CanadaMap(error, data) {
    /* If there is an error, show error */
    if (error) throw error;

    /* Reading json features */
    var collections = topojson.feature(data, data.objects.collection).features

    /* Features represents provinces. Adding all feature into svg */
    svg.selectAll(".provinces")
        
    /* Calling the data*/
        .data(collections)
        /* Defining(Entering) shapes of the provinces from collection features using path */
        .enter().append("path")
        
        /* Defining attributes as provinces */
        .attr("class", "provinces")
        
        /* Using path variable to draw the map */
        .attr("d", path)
        
        /* light blue filling */
        .attr("fill", "#ADD8E6")
        
        /* when hovered change color */
        .on('mouseover', function (d) {
            d3.select(this).classed("selected", true);
            var name2 = d.properties.NAME;
            return document.getElementById('name').innerHTML = name2;
        })
        /* when it is off normal */
        .on('mouseout', function (d) {
            d3.select(this).classed("selected", false);
        })
        
        .on('click', function (d) {
            window.name = d.properties.NAME;
            modal.style.display = "block";
            /* Creating switch cases for each provinces. */
            switch (window.name) {
                case 'AB':
                    Graphing("CSV/Incest_Alberta.csv", "Total, Incest Charge per Year in "+ window.name)
                    break
                case 'BC':
                    Graphing("CSV/Incest_British_Columbia.csv", "Total, Incest Charge per Year in " + window.name);
                    break;
                case 'MB':
                    Graphing("CSV/Incest_Manitoba.csv", "Total, Incest Charge per Year in " + window.name);
                    break;
                case 'NB':
                    Graphing("CSV/Incest_New_Brunswick.csv", "Total, Incest Charge per Year in " + window.name);
                    break
                case 'NL':
                    Graphing("CSV/Incest_Newfoundland_Labrador.csv", "Total, Incest Charge per Year in " + window.name);
                    break;
                case "NS":
                    Graphing("CSV/Incest_Nova_Scotia.csv", "Total, Incest Charge per Year in " + window.name);
                    break;
                case "ON":
                    Graphing("CSV/Incest_Ontario.csv", "Total, Incest Charge per Year in " + window.name);
                    break
                case "PE":
                    Graphing("CSV/Incest_Prince_Edward_Island.csv", "Total, Incest Charge per Year in " + window.name);
                    break;
                case "QC":
                    Graphing("CSV/Incest_Quebec.csv", "Total, Incest Charge per Year in " + window.name);
                    break;
                case "SK":
                    Graphing("CSV/Incest_Saskatchewan.csv", "Total, Incest Charge per Year in " + window.name);
                    break;
                default:
                    Graphing("CSV/Incest_Canada.csv", "Total, Incest Charge per Year in Canada");
                    break;
            }
        })
    }
