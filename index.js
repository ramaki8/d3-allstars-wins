
$(document).ready(function(){
        //Array to hold data retrieved from php
        var allstarsWins = [];
        
        //Array of unique colors to use for my circles
        var colorScale = ["#e69a61", "#9817ff", "#18c61a", "#33b4ff", "#c9167e", "#297853", "#d7011b", "#7456c7", "#7e6276", "#afb113", "#fd879c", "#fb78fa", "#24c373", "#45bbc5", "#766b21", "#abad93", "#c19ce3", "#fd8f11", "#2f56ff", "#307a11", "#b3483c", "#0d7396", "#94b665", "#9d4d91", "#b807c8", "#086cbf", "#a2abc5", "#a35702", "#d3084b", "#8c6148", "#fa82ce", "#71be42", "#2bc0a0", "#b64064", "#d09fa2", "#daa229", "#5a6f68", "#c1aa5f", "#8943dc", "#b72ba6", "#6e629e", "#e094bf", "#dd8df2", "#c03d0b", "#7db799", "#617046", "#ff8a78", "#1263e2"];
        
        // call the php that has the php array which is json_encoded
        // for retrieving the allstar data
        $.getJSON('d3-allstars-wins/getdata.php?type=allstar', function(data) {
                // Iterate through the php array and add the 
                // team ID and playerCount of allstars to the javascript array
                $.each(data, function(key, val) {
                        var teamInfo = [];
                        teamInfo.push(val.teamID);
                        teamInfo.push(val.playerCount);
                        allstarsWins.push(teamInfo);
                });

        });
        
        // call the php that has the php array which is json_encoded
        // for retrieving the wins data
        $.getJSON('d3-allstars-wins/getdata.php?type=wins', function(data) {
                // Iterate through the php array and add the
                // team's name and their wins to the javascript array
                var i = 0;
                $.each(data, function(key, val) {
                        allstarsWins[i].push(val.name);
                        allstarsWins[i].push(val.W);
                        allstarsWins[i].push(val.yearID);
                        i++;
                });
                for (var j = 0; j < allstarsWins.length; j++) {
                    if (allstarsWins[j].length != 5) {
                        allstarsWins.splice(j, 1);
                    }
                }
 
 
                
                // Function to decrease the opacity of the circles 
                // when they are moused over
                var onMouseover = function() {                    
                    var circle = d3.select(this);
                    circle.transition().duration(100)
                        .attr("fill-opacity", 1);
			     }
                
                // Function to reset the opacity of the circles
                // when the mouse is removed from them
                var onMouseout = function() {                    
                    var circle = d3.select(this);
                    circle.transition().duration(100)
                        .attr("fill-opacity", 0.5);                    
			     }
                
                // Set values for margin and dimensions used in chart                
                var margin = {top: 20, right: 20, bottom: 60, left: 60},
                    width = 960 - margin.left - margin.right,
                    height = 600 - margin.top - margin.bottom;
                
                // Create color scale to use for circles    
                var color = color = d3.scale.ordinal()
                                        .domain(allstarsWins)
                                        .range(colorScale);

               //Define x scale
                var xScale = d3.scale.linear()
                                .domain([0, parseInt(d3.max(allstarsWins, function(d) { return d[1]; })) + 1 ])
                                .range([margin.left, width]);
                                
                //Define y scale
                var yScale = d3.scale.linear()
                                .domain([50, 110])
                                .range([height, 0]);
                                
                //Define x axis
                var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom");
                              
                //Define y axis
                var yAxis = d3.svg.axis()
                              .scale(yScale)
                              .orient("right");
                              
                
                // Define brush object for brushing functionality
                var brush = d3.svg.brush()
                        .y(yScale)
                        .on("brush", brushmove)
                        .on("brushend", brushend);           
                
                
                //Create SVG element
                var svg = d3.select("#chart")
                            .append("svg")
                              .attr("width", width + margin.left + margin.right)
                              .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                            
                //Create X axis
			    svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")				    
                    .call(xAxis);
                    
                //Create Y axis
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("clip-path", "url(#clip)")
                    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
                    .call(yAxis);
                
                // Create brush object
                svg.append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .selectAll('rect')
                    .attr('width', width)
                    .attr("transform", "translate(" + margin.left + "," + 0 + ")");
                 
                // Create clip path   
                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                  .append("rect")
                    .attr("width", width)
                    .attr("height", height);
                
                // Create circles to represent teams            
                var circles = svg.selectAll("circle")
                    .data(allstarsWins)
                    .enter()
                    .append("svg:circle")
                    .attr("cx", function(d) {
                            return xScale(d[1]); // number of allstars
                    })
                    .attr("cy", function(d) {
                            return yScale(d[3]); // number of wins
                    })
                    .attr("r", 7)
                    .attr("fill", color)
                    .attr("fill-opacity", 0.5) // set to transparent until moused over
                    .attr("clip-path", "url(#clip)")
                    .on("mouseover", onMouseover)
                    .on("mouseout", onMouseout)
                    .append('svg:title').text(function(d,i) {
                            return d[4] + " " + d[2] + ': ' + d[3] + ' wins'; // append tooltip to circles
                    });
                    
                
                // Define behavior for when the brush moves. Sets circles within area to be
                // selected and returns the brushed area  
                function brushmove() {
                    var extent = brush.extent();
                    circles.classed("selected", function(d) {
                        is_brushed = extent[0] <= d[3] && d[3] <= extent[1];
                        return is_brushed;
                    });
                }
                
                // Define behavior for when the brush ends. Makes clear button visible,
                // updates the y axis domain to the extent of the brush, transitions the data,
                // and resets the axis.
                function brushend() {
                    get_button = d3.select(".clear-button");
                    if(get_button.empty() === true) {
                        clear_button = svg.append('text')
                        .attr("y", 575)
                        .attr("x", 800)
                        .attr("class", "clear-button")
                        .text("Clear Brush");
                    }
                
                    yScale.domain(brush.extent());
                    
                    transition_data();
                    reset_axis();
                    
                    circles.classed("selected", false);
                    d3.select(".brush").call(brush.clear());
                    
                    clear_button.on('click', function(){
                        yScale.domain([50, 110]);
                        transition_data();
                        reset_axis();
                        clear_button.remove();
                    });
                }
                
                // Updates the data after it is brushed or the clear button is pressed
                function transition_data() {
                    svg.selectAll("circle")
                        .data(allstarsWins)
                    .transition()
                        .duration(500)
                        .attr("cy", function(d) { return yScale(d[3]); });
                }
                
                // Resets axis when it is brushed or when the clear button is pressed
                function reset_axis() {
                    svg.transition().duration(500)
                    .select(".y.axis")
                    .call(yAxis);
                }
                                    
                //Create hover tooltip for the circles
                $('svg circle').tipsy({ 
                    gravity: 'w', 
                    html: true, 
                });
                
                // Creates the axis labels for the x and y axis
                svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate("+ (margin.left/2) +","+(height/2)+")rotate(-90)")
                    .text("Number of Wins");
                svg.append("text")
                    .attr("text-anchor", "middle") 
                    .attr("transform", "translate("+ ((width /2) + margin.left) +","+ (margin.bottom + height) +")")
                    .text("Number of Allstars");

        });
});