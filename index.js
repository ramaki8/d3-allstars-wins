

$(document).ready(function(){
        var allstarsWins = [];
        var colorScale = ["#e69a61", "#9817ff", "#18c61a", "#33b4ff", "#c9167e", "#297853", "#d7011b", "#7456c7", "#7e6276", "#afb113", "#fd879c", "#fb78fa", "#24c373", "#45bbc5", "#766b21", "#abad93", "#c19ce3", "#fd8f11", "#2f56ff", "#307a11", "#b3483c", "#0d7396", "#94b665", "#9d4d91", "#b807c8", "#086cbf", "#a2abc5", "#a35702", "#d3084b", "#8c6148", "#fa82ce", "#71be42", "#2bc0a0", "#b64064", "#d09fa2", "#daa229", "#5a6f68", "#c1aa5f", "#8943dc", "#b72ba6", "#6e629e", "#e094bf", "#dd8df2", "#c03d0b", "#7db799", "#617046", "#ff8a78", "#1263e2"]
        /* call the php that has the php array which is json_encoded */
        $.getJSON('getdata.php?type=allstar', function(data) {
                /* data will hold the php array as a javascript object */
                var i = 0;
                $.each(data, function(key, val) {
                        var teamInfo = [];
                        teamInfo.push(val.teamID);
                        teamInfo.push(val.playerCount);
                        allstarsWins.push(teamInfo);
                        i++;
                        //$('ul').append('<li id="' + key + '">' + val.teamID + ' ' + val.playerCount + '</li>');
                });

        });
        $.getJSON('getdata.php?type=wins', function(data) {
                /* data will hold the php array as a javascript object */
                var i = 0;
                $.each(data, function(key, val) {
                        allstarsWins[i].push(val.name);
                        allstarsWins[i].push(val.W);
                        i++;
                        //$('ul').append('<li id="' + key + '">' + val.name + ' ' + val.teamID + ' ' + val.W + '</li>');
                });
                for (var i = 0; i <= allstarsWins.length; i++) {
                }
                
                
                
                var onMouseover = function() {                    
                    var circle = d3.select(this);
                    circle.transition().duration(100)
                        .attr("fill-opacity", 1);
			     }
                
                var onMouseout = function() {                    
                    var circle = d3.select(this);
                    circle.transition().duration(100)
                        .attr("fill-opacity", 0.5);                    
			     }
                
                var w = 850;
                var h = 600;
                var padding = 60;
                var color = color = d3.scale.ordinal()
                                        .domain(allstarsWins)
                                        .range(colorScale);

               //Define x scale 
                var xScale = d3.scale.linear()
                                .domain([0, d3.max(allstarsWins, function(d) { return d[1]; })])
                                .range([padding, w - padding * 4]);
                //Define y scale
                var yScale = d3.scale.linear()
                                .domain([55, 100])
                                .range([h - padding, padding]);
                //Define x axis
                var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom");
                              
                //Define Y axis
                var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left");
                
                var brush = d3.svg.brush()
                        .y(yScale)
                        .on("brush", brushmove)
                        .on("brushend", brushend);       
                
                //Create SVG element
                var svg = d3.select("#chart")
                            .append("svg")
                            .attr("width", w)
                            .attr("height", h);
                
                svg.append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .selectAll('rect')
                    .attr('width', w);
                            
                var circles = svg.selectAll("circle")
                    .data(allstarsWins)
                    .enter()
                    .append("svg:circle")
                    .attr("cx", function(d) {
                            return xScale(d[1]); // number of allstars
                    })
                    .attr("cy", function(d) {
                            return yScale(d[3]);
                    })
                    .attr("r", 7)
                    .attr("fill", color)
                    .attr("fill-opacity", 0.5)
                        .attr("clip-path", "url(#clip)")

                    .on("mouseover", onMouseover)
                    .on("mouseout", onMouseout)
                    .append('svg:title').text(function(d,i) {
                            return d[2] + ': ' + d[3] + ' wins';
                    });
                
                circles.on('mousedown', function(){
                    brush_elm = svg.select(".brush").node();
                    new_click_event = new Event('mousedown');
                    new_click_event.pageX = d3.event.pageX;
                    new_click_event.clientX = d3.event.clientX;
                    new_click_event.pageY = d3.event.pageY;
                    new_click_event.clientY = d3.event.clientY;
                    brush_elm.dispatchEvent(new_click_event);
                    });
                    
                function brushmove() {
                    var extent = brush.extent();
                    circles.classed("selected", function(d) {
                        is_brushed = extent[0] <= d[3] && d[3] <= extent[1];
                        return is_brushed;
                    });
                }
                
                function brushend() {
                    get_button = d3.select(".clear-button");
                    if(get_button.empty() === true) {
                        clear_button = svg.append('text')
                        .attr("y", 550)
                        .attr("x", 630)
                        .attr("class", "clear-button")
                        .text("Clear Brush");
                    }
                
                    yScale.domain(brush.extent());
                    
                    transition_data();
                    reset_axis();
                    
                    circles.classed("selected", false);
                    d3.select(".brush").call(brush.clear());
                    
                    clear_button.on('click', function(){
                        yScale.domain([55, 100]);
                        transition_data();
                        reset_axis();
                        clear_button.remove();
                    });
                }
                
                function transition_data() {
                    svg.selectAll("circle")
                        .data(allstarsWins)
                    .transition()
                        .duration(500)
                        .attr("cy", function(d) { return yScale(d[3]); });
                }
                
                function reset_axis() {
                    svg.transition().duration(500)
                    .select(".y.axis")
                    .call(yAxis);
                }
                                    
                //Create hover tooltip
                $('svg circle').tipsy({ 
                    gravity: 'w', 
                    html: true, 
                });
                
                //Create X axis
			    svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
				    .call(xAxis);
                    
                //Create Y axis
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + padding + ",0)")
                    .call(yAxis);
                
                svg.append("text")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ (padding/2) +","+(h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
                    .text("Number of Wins");
                svg.append("text")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ (w/2.5) +","+(h-(padding/3))+")")  // centre below axis
                    .text("Number of Allstars");

        });
});