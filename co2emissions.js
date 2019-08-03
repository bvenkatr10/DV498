$( document ).ready(function() {
    $('#container2').hide();
    $('#container3').hide();
    $('#two').click(function () {
        $('#container2').show();
        if (!slide2Loaded) {
            slide2();
        }
        $('#container1').hide();
        $('#container3').hide();
        $('#slide1').hide();
        $(".legend").hide();
        $(".legend2").show();
    })
    $('#one').click(function () {
        $('#container2').hide();
        $('#container1').show();
        $('#container3').hide();
        $('#slide1').show();
        $(".legend").show();
    })
    $('#three').click(function () {
        if (!slide3Loaded) {
            slide3();
        }
        $('#container2').hide();
        $('#container3').show();
        $('#container1').hide();
        $('#slide1').hide();
        $(".legend").hide();
    })
    $('#playAnimation').click(function () {
        animates();
    })
    //replay animation
    function animates () {
        yearValue = 1757;
        d3.select("#chosenYear").text(1757);
        playAnimation();
    }
    d3.select("#chosenYear").text(1757);
    var format = d3.format(",");
    var lowColor = 'lightgreen';
    var midColor = "orange";
    var highColor = 'red';
    var minVal = 0;
    var midVal = 14;
    var maxVal = 28;
    var yearValue = 1757;
    var interval = 1200;
    annotatedYears = ['1957'];
    var counter = 1;
    var annotations;
    // Set tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            // console.log("d is" , JSON.stringify(d));
            return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" +
                "<strong>Total CO2emissions: </strong><span class='details'>" + format(d.CO2emissions) + "</span>";
        });
    //set margins
    var margin = {top: -150, right: 110, bottom: 0, left: 20},
        width = 1560 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var ramp = d3.scaleQuantize().domain([minVal, midVal, maxVal]).range([lowColor, midColor, highColor]);
    var path = d3.geoPath();
    var svg = d3.select("#co2em")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('class', 'map');
    var projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);
    var path = d3.geoPath().projection(projection);
    svg.call(tip);
    // Listen to the slider?
    d3.select("#mySlider").on("change", function (d) {
        d3.select("#chosenYear").text(this.value);
        console.log("selected valued", this.value);
        selectedValue = this.value;
        console.log("selected valued", selectedValue);
        updateChart(allCO2Data, allWorldJson, selectedValue);
    })
    var slide2Loaded = false;
    /**
     * slide 2
     */

    function slide2 () {
        slide2Loaded = true;
        var allPaths = [];
        var countries = [];

        var selectOptionCountries = [];
        var margin2 = {top: 120, right: 150, bottom: 30, left: 50},
            width2 = 1730 - margin2.left - margin2.right,
            height2 = 600 - margin2.top - margin2.bottom;

        var parse = d3.timeParse("%Y");

        var x2 = d3.scaleTime()
                .range([0, width2])
            /*.domain([1751, 2017])*/;

        var y2 = d3.scaleLinear()
            .range([height2, 0])
            .domain([0, 55]);

        var color2 = d3.scaleOrdinal(d3.schemeCategory10);

        var svg2 = d3.select("#countryco2em").append("svg")
            .attr("width", width2 + margin2.left + margin2.right)
            .attr("height", height2 + margin2.top + margin2.bottom)
            .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        function chartDraw(data) {
            console.log("chartDraw", data);
            color2.domain(d3.keys(data[0]).filter(function (key) {
                return key !== "date";
            }));

            var companies = color2.domain().map(function (name) {
                console.log("sel22");
                return {
                    name: name,
                    values: data.map(function (d) {
                        // console.log("+d[name]", +d[name]);
                        return {date: d.date, price: +d[name]};
                    })
                };
            });
            countries = companies;

            console.log("companies", companies);

            console.log("d3.extent(data, function(d) { return d.date; })", d3.extent(data, function (d) {
                return d.date;
            }));

            var yValues, tmpValues = [];

            companies.forEach(function (d) {
                d.values.map(function (x) {
                    tmpValues.push(x.price);
                })
            });
            console.log("tmpValues", tmpValues);
            //array of all y-values
            tmpValues = d3.set(tmpValues).values();
            //use a d3.set to eliminate duplicate values
            tmpMinValue = Math.min.apply(null, tmpValues);
            tmpMaxValue = Math.max.apply(null, tmpValues);
            yMin = Math[tmpMinValue < 0 ? 'ceil' : 'floor'](tmpMinValue / 5) * 5;
            yMax = Math[tmpMaxValue < 0 ? 'ceil' : 'floor'](tmpMaxValue / 5) * 5;
            console.log("yMax", yMax, yMin);
            x2.domain(d3.extent(data, function (d) {
                console.log("alabel", d.date)
                return d.date;
            }));

            console.log("a", d3.max(companies, function (c) {
                return d3.max(c.values, function (v) {
                    return v.price;
                });
            }));
            console.log("b", d3.min(companies, function (c) {
                return d3.min(c.values, function (v) {
                    return v.price;
                });
            }));

            y2.domain([
                d3.min(companies, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.price;
                    });
                }),
                d3.max(companies, function (c) {
                    return d3.max(c.values, function (v) {
                        return v.price;
                    });
                })
            ]);
            /*x2.domain([1751, 2017]);*/
            var formatxAxis = d3.format('.0f');
            var xAxis2 = d3.axisBottom(x2).tickFormat(formatxAxis)
                .ticks(15);

            console.log("x2", JSON.stringify(x2), x2)
            var yAxis2 = d3.axisLeft(y2)
            // .scale(y)
                .tickFormat(function (d) {
                    console.log("ticksy", d)
                    return d + "%";
                });

            var line = d3.line()
                .curve(d3.curveMonotoneX)
                .x(function (d) {
                    return x2(d.date);
                })
                .y(function (d) {
                    return y2(d.price);
                });

            svg2.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            svg2.append("g")
                .attr("class", "y axis")
                .call(yAxis2);

            svg2.append("line")
                .attr(
                    {
                        "class": "horizontalGrid",
                        "x1": 0,
                        "x2": width2,
                        "y1": y2(0),
                        "y2": y2(0),
                        "fill": "none",
                        "shape-rendering": "crispEdges",
                        "stroke": "black",
                        "stroke-width": "1px",
                        "stroke-dasharray": ("3, 3")
                    });


            var company = svg2.selectAll(".company")
                .data(countries)
                .enter().append("g")
                .attr("class", "company");

            var path = company.append("path")
                .attr("class", "line")
                .attr("d", function (d) {
                    console.log("pat", JSON.stringify(d));
                    return line(d.values);
                })
                .style("stroke", function (d) {
                    return color2(d.name);
                });
            allPaths = path._groups;
            console.log("allPaths", allPaths)
            d3.select('.legend').remove();

            var legend = svg2.selectAll(".company")
                .append('g')
                .attr('class', 'legend2');

            loadAnimation(path._groups);

            legend.append('rect')
                .attr('x', width2 - 20)
                .attr('cursor', 'pointer')
                .attr('y', function (d, i) {
                    return i * 20;
                })
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', function (d) {
                    return color2(d.name);
                });

            legend.append('text')
                .attr("class", "legendTexts")
                .attr('x', width2 - 8)
                .attr('cursor', 'pointer')
                .attr('y', function (d, i) {
                    return (i * 20) + 9;
                })
                .on("click", function (d) {
                    clickedPathName = "#" + d.name.replace(" ", "");
                    console.log("onclick", clickedPathName)
                    currentLineState = d3.select(clickedPathName).attr("visibility");
                    if (currentLineState == null || currentLineState == "visible") {
                        d3.select(clickedPathName).attr("visibility", "hidden");

                    } else if (currentLineState == 'hidden') {
                        d3.select(clickedPathName).attr("visibility", "visible");
                    }
                    lineThruLegendText(legend);
                })
                .text(function (d) {
                    return d.name;
                });
            loadAnnotations2();
        }

        function loadAnimation(path) {
            console.log("pathlen", JSON.stringify(path))
            console.log("pathlen", path[0].length, path[0][1])
            for (var i = 0; i < path[0].length; i++) {
                var totalLength = path[0][i].getTotalLength();
                console.log("path", JSON.stringify(path[0][i].__data__.name))
                d3.select(path[0][i])
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(5000)
                    .attr("id", path[0][i].__data__.name.replace(" ", ""))
                    // .ease("linear")
                    .attr("stroke-dashoffset", 0);
            }
        }

        function lineThruLegendText(legend) {
            console.log("onclick22", clickedPathName)
            legend.selectAll(".legendTexts")
                .attr("text-decoration", function (d) {
                    console.log("onclick2", d)
                    console.log(JSON.stringify(d.name));
                    clickedPathName = "#" + d.name.replace(" ", "");
                    console.log("onclick222", clickedPathName)
                    currentLineState = d3.select(clickedPathName).attr("visibility");
                    if (currentLineState == null || currentLineState == "visible") {
                        return "none";

                    } else if (currentLineState == 'hidden') {
                        return "line-through";
                    }
                })
        }

        var dataset = [];
        var mouseG = svg2.append("g")
            .attr("class", "mouse-over-effects");

        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        var lines = document.getElementsByClassName('line');

        d3.tsv("top_country.tsv", function (error, data) {
            dataset = data;
            chartDraw(data);
            loadToolTips(data);
        });
        $('#saveCountrySelect').click(function () {
            selectOptionCountries = [];
            console.log("hhe");
            $('select[name="inptProduct"] option:selected').each(function () {
                console.log("inptProduct");
                var $this = $(this);
                if ($this.length) {
                    var selText = $this.text();
                    selectOptionCountries.push(selText);
                    console.log(selectOptionCountries);
                }
            });

            var companies = color2.domain().filter(function (filter) {
                console.log("domain", JSON.stringify(filter));
                if (selectOptionCountries.includes(filter)) {
                    return true; // true
                }
                return false; //skip
            }).map(function (name) {
                console.log("sel");
                return {
                    name: name,
                    values: dataset.map(function (d) {
                        // console.log("+d[name]", +d[name]);
                        return {date: d.date, price: +d[name]};
                    })
                };
            });
            console.log("companies", companies)
            countries = companies;
            console.log("countries", countries)
            chartDraw(countries);
            setCountries();
        });
        $('#addCountry').click(function () {
            loadAnimation(allPaths);
        })
        function loadAnnotations2() {
            console.log("loadAnnotations2")
            const annotations2 = [{note: {
                    label: "Top trend chart clearly depicts while any country is undergoing a huge development, they tend to produce more CO2",
                    bgPadding: 20,
                    title: "Global Emission Increase with Developing Nations"
                },
                // type: d3.annotationCalloutCircle,
                subject: {
                    radius: 75,         // circle radius
                    radiusPadding: 20   // white space around circle befor connector
                },
                color: ["navy"],
                //can use x, y directly instead of dataset
                data: {Entity: "United Kingdom", CO2emissions: 91.0641},
                x: 600,
                y: 160,
                className: "show-bg",
                dy: 37,
                dx: 662},
                {note: {
                        label: "Developing nations across Asia have started to produce more Co2 by utilizing more energy",
                        bgPadding: 20,
                        title: "More energy use ==> More Co2"
                    },
                    // type: d3.annotationCalloutCircle,
                    subject: {
                        radius: 25,         // circle radius
                        radiusPadding: 20   // white space around circle befor connector
                    },
                    color: ["navy"],
                    //can use x, y directly instead of dataset
                    data: {Entity: "United Kingdom", CO2emissions: 91.0641},
                    x: 1400,
                    y: 430,
                    className: "show-bg",
                    dy: -37,
                    dx: -892}]
            const type2 = d3.annotationCallout;
            console.log("type2", type2)
            const makeAnnotations2 = d3.annotation()
                .notePadding(15)
                .type(type2)
                .annotations(annotations2)
            console.log("mmakeAnnotations2", makeAnnotations2)
            d3.select("#countryco2em").select("svg")
                .append("g")
                .attr("class", "annotation-group")
                .attr("font-size", "1em")
                .call(makeAnnotations2)
        }
        function loadToolTips(data) {
            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(countries)
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");


            mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", function (d) {
                    return color2(d.name);
                })
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0");

            mousePerLine.append("text")
                .attr("transform", "translate(10,3)");


            mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                .attr('width', width) // can't catch mouse events on a g element
                .attr('height', height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseout', function () { // on mouse out hide line, circles and text
                    d3.select(".mouse-line")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "0");
                })
                .on('mouseover', function () { // on mouse in show line, circles and text
                    d3.select(".mouse-line")
                        .style("opacity", "1");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "1");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "1");
                })
                .on('mousemove', function () { // mouse moving over canvas
                    var mouse = d3.mouse(this);
                    d3.select(".mouse-line")
                        .attr("d", function () {
                            var d = "M" + mouse[0] + "," + height;
                            d += " " + mouse[0] + "," + 0;
                            return d;
                        });
                    d3.selectAll(".mouse-per-line")
                        .attr("transform", function (d, i) {
                            /*console.log(width / mouse[0])*/
                            var xDate = x2.invert(mouse[0]),
                                bisect = d3.bisector(function (d) {
                                    return d.date;
                                }).right;
                            // console.log("dataset", dataset)
                            // console.log("xDate", typeof xDate, xDate.toString().split(" ")[3]);
                            xDate = xDate.toString().split(" ")[3];
                            emission = dataset.map(function (name) {
                                return {
                                    name: name,
                                    values: data.map(function (d) {
                                        thisDate = d.date.toString().split(" ")[3];
                                        // console.log("xDate HEREEE", xDate, thisDate)
                                        if (thisDate == xDate) {
                                            //console.log("xDate HEREEE match", xDate, d.date)
                                            return {date: d.date, price: +d[name]};
                                        }
                                    })
                                };
                            });
                            //console.log("emission here", emission);

                            // idx = bisect(d.price, xDate);
                            // console.log("idx", idx);
                            var beginning = 0,
                                end = lines[i].getTotalLength(),
                                target = null;

                            while (true) {
                                target = Math.floor((beginning + end) / 2);
                                pos = lines[i].getPointAtLength(target);
                                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0]) end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                                else break; //position found
                            }

                            d3.select(this).select('text')
                                .text(y2.invert(pos.y).toFixed(2));

                            return "translate(" + mouse[0] + "," + pos.y + ")";
                        });

                });
        }
    }
    var slide3Loaded = false;
    /**
     * slide 3
     */
    function slide3 () {
        slide3Loaded = true;
        // set the dimensions and margins of the graph
        var margin3 = {top: 120, right: 150, bottom: 130, left: 150},
            width3 = 1230 - margin3.left - margin3.right,
            height3 = 700 - margin3.top - margin3.bottom;

        // append the svg object to the body of the page
        var svg3 = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width3 + margin3.left + margin3.right)
            .attr("height", height3 + margin3.top + margin3.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin3.left + "," + margin3.top + ")");

        //Read the data
        d3.tsv("bubbledataset.tsv", function (data) {
            console.log("data", JSON.stringify(data))
            // Add X axis
            var x3 = d3.scaleLinear()
                .domain([-5, 70])
                .range([0, width3]);

            svg3.append("g")
                .attr("transform", "translate(0," + height3 + ")")
                .call(d3.axisBottom(x3).tickFormat(function (d) {
                    return d + "%";
                }));
            // text label for the x axis
            svg3.append("text")
                .attr("transform",
                    "translate(" + (width3 / 2) + " ," +
                    (height3 + margin3.top) + ")")
                .style("text-anchor", "middle")
                .text("Share of people in extreme poverty (%)");
            // Add Y axis
            var y3 = d3.scaleLinear()
                .domain([35, 210000])
                .range([height3, 0]);
            svg3.append("g")
                .call(d3.axisLeft(y3).tickFormat(function (d) {
                    return d + "kWh";
                }).ticks(5));
            // text label for the y axis
            svg3.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin3.left)
                .attr("x", 0 - (height3 / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Per capita energy use (kg oil equivalent per year)");
            // Add a scale for bubble size
            var z3 = d3.scaleLinear()
                .domain([200000, 1310000000])
                .range([4, 40]);
            console.log("d3",  d3.schemeSet10)
            // Add a scale for bubble color
            var myColor = d3.scaleOrdinal()
            // .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
                .range(d3.schemeCategory10);


            // -1- Create a tooltip div that is hidden by default:
            var tooltip = d3.select("#my_dataviz")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("width", "5em")
                .style("padding", "10px")
                .style("color", "white")
                .style("font-family", "Monotype Corsiva")
                .style("margin-left", "27em")
                .style("margin-top", "-21em")

            // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
            var showTooltip = function (d) {
                tooltip
                    .transition()
                    .duration(400)
                tooltip
                    .style("opacity", 1)
                    .html("Country: " + d.country + "</br>" + "Energy Use :" + d.energyuse)
                /*.style("left", "2em")
                .style("top", "3em")*/
            }
            var moveTooltip = function (d) {
                tooltip
                    .style("left", (d3.mouse(this)[0] + 30) + "px")
                    .style("top", (d3.mouse(this)[1] + 30) + "px")
            }
            var hideTooltip = function (d) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
            }

            var node = svg3.selectAll(".node")
                .data(data)
                .enter().append("g")
                .attr("class", "node")
            //.attr("transform", function(d) { console.log("dddx3y3", d);return "translate(" + x3(d.povertyshare) + "," + y3(d.energyuse) + ")"; });
            node.append("circle")
                .attr("cx", function (d) {
                    return x3(d.povertyshare);
                })
                .attr("cy", function (d) {
                    return y3(d.energyuse);
                })
                .attr("r", function (d) {
                    return z3(d.pop);
                })
                .style("fill", function (d) {
                    console.log("dfill", d.continet, myColor(d.continet));
                    return myColor(d.continet);
                })
                // -3- Trigger the functions
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip);

            var legend_data = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
            var legend = svg3.append("g")
                .attr("class", "legend")
                .selectAll("g")
                .data(legend_data)
                .enter()
                .append("g")


            legend.append('rect')
                .attr('x', width3 - 20)
                .attr('y', function (d, i) {
                    return i * 20;
                })
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', function (d) {
                    console.log("dfill2", d, myColor(d));
                    return myColor(d);
                });

            legend.append('text')
                .attr('x', width3 - 8)
                .attr('y', function (d, i) {
                    return (i * 20) + 9;
                })
                .text(function (d) {
                    return d;
                });

            loadAnnotations3();

            function loadAnnotations3() {
                console.log("loadAnnotations3")
                const annotations3 = [{
                    note: {
                        label: "In general, we see a very similar correlation in both CO2 and energy: higher Co2 and energy access => lower levels of extreme poverty. ",
                        bgPadding: 20,
                        title: "Co2 && Energy growth"
                    },
                    // type: d3.annotationCalloutCircle,
                    subject: {
                        width: 375,         // circle radius
                        height: 520   // white space around circle befor connector
                    },
                    color: ["red"],
                    //can use x, y directly instead of dataset
                    data: {Entity: "United Kingdom", CO2emissions: 91.0641},
                    x: 400,
                    y: 160,
                    className: "show-bg",
                    dy: 67,
                    dx: 462
                }, {
                    note: {
                        label: "Energy access is therefore an essential component in improved living standards and poverty alleviation",
                        bgPadding: 20,
                        title: "Poverty alleviation"
                    },
                    // type: d3.annotationCalloutCircle,
                    subject: {
                        width: 375,         // circle radius
                        height: 520   // white space around circle befor connector
                    },
                    color: ["red"],
                    //can use x, y directly instead of dataset
                    data: {Entity: "United Kingdom", CO2emissions: 91.0641},
                    x: 400,
                    y: 160,
                    className: "show-bg",
                    dy: 297,
                    dx: 692
                }]
                const type3 = d3.annotationCalloutRect;
                console.log("type3", type3)
                const makeAnnotations3 = d3.annotation()
                    .notePadding(15)
                    .type(type3)
                    .annotations(annotations3)
                console.log("mmakeAnnotations3", makeAnnotations3)
                d3.select("#my_dataviz").select("svg")
                    .append("g")
                    .attr("class", "annotation-group")
                    .attr("font-size", "1em")
                    .call(makeAnnotations3)
            }
        })
    }
    queue()
        .defer(d3.json, "dataset/world-countries.json")
        .defer(d3.csv, "dataset/co2emissions.csv")
        .await(ready);
    function ready(error, data, historicalCO2) {
        selectedValue = 1757;
        /** Global dataset storage **/
        allCO2Data = historicalCO2;
        allWorldJson = data;
        updateChart(allCO2Data, allWorldJson, selectedValue);
        playAnimation();
    }
    function displayAnnotations(annotations, yearValue) {
        const type = d3.annotationLabel;
        const makeAnnotations = d3.annotation()
            .notePadding(15)
            .type(type)
            .annotations(annotations)
        d3.select("svg")
            .append("g")
            .attr("class", "annotation-group" + yearValue)
            .style('font-size', '1.1em')
            .call(makeAnnotations)

    }
    function annotationFilter(yearValue) {
        if (counter > 7) {
            counter = 0;
        }
        if (yearValue >1700 && yearValue < 1780 ) {
            annotations = labels [counter - 1];
            //console.log("annotations", counter, JSON.stringify(labels[0]))
            displayAnnotations(annotations, counter);
        } else if (yearValue > 1780 && yearValue < 1800) {
            d3.selectAll(".annotation-group1").style("visibility", "hidden");
            annotations = labels [3];
            displayAnnotations(annotations, counter);
        } else if (yearValue > 1800 && yearValue < 1850) {
            d3.selectAll(".annotation-group1").style("visibility", "hidden");
            counter = counter + 1;
            annotations = labels [2];
            displayAnnotations(annotations, 2);
        } else if (yearValue > 1850 && yearValue < 1907) {
            annotations = labels [2];
            displayAnnotations(annotations, 2);
            annotations = labels [7];
            displayAnnotations(annotations, 2);
        } else if (yearValue > 1907 && yearValue < 1947) {
            d3.selectAll(".annotation-group2").style("visibility", "hidden");
            counter = counter + 1;
            annotations = labels [3];
            displayAnnotations(annotations, 3);
        } else if (yearValue > 1947 && yearValue < 1967) {
            d3.selectAll(".annotation-group3").style("visibility", "hidden");
            counter = counter + 1;
            annotations = labels [1];
            displayAnnotations(annotations, 4);
        } else if (yearValue > 1960 && yearValue < 1967) {
            annotations = labels [4];
            displayAnnotations(annotations, 4);
        } else if (yearValue > 1967 && yearValue < 1987) {
            d3.selectAll(".annotation-group4").style("visibility", "hidden");
            annotations = labels [5];
            displayAnnotations(annotations, 5);
        } else if (yearValue > 1987 && yearValue < 2000) {
            d3.selectAll(".annotation-group5").style("visibility", "hidden");
            annotations = labels [6];
            displayAnnotations(annotations, 6);
        } else if (yearValue > 2000 && yearValue < 2010) {
            d3.selectAll(".annotation-group6").style("visibility", "hidden");
            annotations = labels [9];
            displayAnnotations(annotations, 7);
        } else if (yearValue > 2010) {
            d3.selectAll(".annotation-group7").style("visibility", "hidden");
            annotations = labels [8];
            displayAnnotations(annotations, 8);
            annotations = labels [10];
            displayAnnotations(annotations, 8);
        }

    }
    function removeAnnotations() {
        //console.log("removing annotations");
        for (var i = 0; i < 9; i++) {
            //console.log("removing annotations for --------------", i);
            //console.log(".annotation-group" + i)
            d3.selectAll(".annotation-group" + i).style("visibility", "hidden");
        }
    }
    function playAnimation() {
        var inter = setInterval(function () {
            d3.select("#chosenYear").text(yearValue);
            updateChart(allCO2Data, allWorldJson, yearValue);
            yearValue = yearValue + 10;
            if (annotatedYears.includes(yearValue)) {
                interval = 3000;
            } else {
                interval = 1200;
            }
            annotationFilter(yearValue);
            if (yearValue > 2017) {
                clearInterval(inter);
                counter = 1;
            }
        }, 1000);

    }
    function updateChart(allCO2Data, data, sliderValue) {
        removeAnnotations();
        var emissionByCountry = {};
        allCO2Data.forEach(function (d) {
            if (!sliderValue == ' ') {
                if (d.Year == sliderValue) {
                    emissionByCountry[d.Code] = +d.CO2emissions;
                }
            }
        });
        //console.log("emissionByCountry", JSON.stringify(emissionByCountry));
        data.features.forEach(function (d) {
            d.CO2emissions = emissionByCountry[d.id];
        });
        // //console.log("d.CO2emissions2" , JSON.stringify(d));
        //console.log("emissionByCountry", JSON.stringify(emissionByCountry));

        maxPop = 28;
        minPop = 0;

        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function (d) {
                console.log("isNaN((d.CO2emissions))", (isNaN(d.CO2emissions)));
                if (isNaN((d.CO2emissions))) {
                    return "lightblue";
                } else {
                    console.log("color returned",ramp(d.CO2emissions))
                    return ramp(d.CO2emissions);
                }
            })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity", 0.8)
            // tooltips
            .style("stroke", "white")
            .style('stroke-width', 0.3)
            .on('mouseover', function (d) {
                tip.show(d);

                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 3);
            })
            .on('mouseout', function (d) {
                tip.hide(d);

                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke", "white")
                    .style("stroke-width", 0.3);
            });

        svg.append("path")
            .datum(topojson.mesh(data.features, function (a, b) {
                return a.id !== b.id;
            }))
            // .datum(topojson.mesh(dataset.features, function(a, b) { return a !== b; }))
            .attr("class", "names")
            .attr("d", path);

        // add a legend
        var w = 130, h = 500;

        var key = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "legend");

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", highColor)
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", lowColor)
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w - 100)
            .attr("height", h)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([h, 0])
            .domain([minVal, maxVal]);

        var yAxis = d3.axisRight(y);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(41,10)")
            .call(yAxis)
        annotationFilter(sliderValue);
    }
    /* annotations labels*/
    const labels = [[{
        note: {
            label: "UK contributed to 98% of world emissions in 17th century",
            bgPadding: 20,
            title: "United Kingdom"
        },
        type: d3.annotationCalloutCircle,
        subject: {
            radius: 25,         // circle radius
            radiusPadding: 20   // white space around circle befor connector
        },
        color: ["navy"],
        //can use x, y directly instead of dataset
        data: {Entity: "United Kingdom", CO2emissions: 91.0641},
        x: 700,
        y: 290,
        className: "show-bg",
        dy: 157,
        dx: 462
    }],
        [{
            note: {
                label: "In the 1960s, United States had been producing almost 1/3 of the entire world's CO2",
                bgPadding: 20,
                title: "United States"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 55,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "USA", CO2emissions: 14.5755},
            x: 490,
            y: 327,
            className: "show-bg",
            dy: 167,
            dx: 162
        }],
        [{
            note: {
                label: "CO2 emissions continued a steep increase over 18th Century  ",
                bgPadding: 20,
                title: "Europe"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 45,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "EasternEurope", CO2emissions: 2.2111},
            x: 720,
            y: 300,
            className: "show-bg",
            dy: 157,
            dx: 162
        }],
        [{
            note: {
                label: "There was no reliable dataset on Soviet Union and Africa until 1940s",
                bgPadding: 20,
                title: "No Data"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 65,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "Russia", CO2emissions: 9.5091},
            x: 1000,
            y: 240,
            className: "show-bg",
            dy: 157,
            dx: 162
        }],
        [{
            note: {
                label: "Russia was the second highest producer of CO2 as of 1960s",
                bgPadding: 20,
                title: "Russia"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 65,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "Russia", CO2emissions: 9.5091},
            x: 1050,
            y: 140,
            className: "show-bg",
            dy: 157,
            dx: 162
        }],
        [{
            note: {
                label: "In the 1980s, the US was producing 18x more CO2 than the 10th largest CO2 producing country",
                bgPadding: 20,
                title: "United States"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 55,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "USA", CO2emissions: 14.5755},
            x: 490,
            y: 340,
            className: "show-bg",
            dy: 57,
            dx: -62
        }],
        [{
            note: {
                label: "By 1985, the US was still producing more CO2 than the entire Europe combined",
                bgPadding: 20,
                title: "United States"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 55,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["red"],
            //can use x, y directly instead of dataset
            data: {Entity: "USA", CO2emissions: 14.5755},
            x: 490,
            y: 340,
            className: "show-bg",
            dy: 167,
            dx: -60
        }],
        [{
            note: {
                label: "Soon after 1850s, US started to produce more Co2 emissions",
                bgPadding: 20,
                title: "United States"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 55,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "UnitedStates", CO2emissions: 5.1412},
            x: 490,
            y: 327,
            className: "show-bg",
            dy: 167,
            dx: -60
        }],
        [{
            note: {
                label: "By 2015, China surpassed the US in total annual CO2 emissions in just 4 years after joining WTO",
                bgPadding: 20,
                title: "China"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 45,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "China", CO2emissions: 5.1412},
            x: 950,
            y: 360,
            className: "show-bg",
            dy: 57,
            dx: 182
        }],
        [{
            note: {
                label: "By 2009, India became the third largest CO2 producing country",
                bgPadding: 20,
                title: "India"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 35,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["navy"],
            //can use x, y directly instead of dataset
            data: {Entity: "India", CO2emissions: 5.1412},
            x: 890,
            y: 390,
            className: "show-bg",
            dy: 157,
            dx: 62
        }], [{
            note: {
                label: "By 2015, 6 of the 10 Top 10 Co2 producing countries are from ASIA",
                bgPadding: 20,
                title: "ASIA"
            },
            type: d3.annotationCalloutCircle,
            subject: {
                radius: 65,         // circle radius
                radiusPadding: 20   // white space around circle befor connector
            },
            color: ["red"],
            //can use x, y directly instead of dataset
            data: {Entity: "India", CO2emissions: 5.1412},
            x: 890,
            y: 380,
            className: "show-bg",
            dy: 137,
            dx: 22
        }]]
});