
queue()
    .defer(d3.json, "dataset/world-countries.json")
    .defer(d3.csv, "dataset/co2emissions.csv")
    .await(ready);
function ready(error, data, historicalCO2) {
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
        .call(makeAnnotations)

}
function annotationFilter(yearValue) {
    if (counter > 7) {
        counter = 0;
    }
    if (yearValue < 1800) {
        annotations = labels [counter - 1];
        console.log("annotations", counter, JSON.stringify(labels[0]))
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
    console.log("removing annotations");
    for (var i = 0; i < 9; i++) {
        console.log("removing annotations for --------------", i);
        console.log(".annotation-group" + i)
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
    console.log("emissionByCountry", JSON.stringify(emissionByCountry));
    data.features.forEach(function (d) {
        d.CO2emissions = emissionByCountry[d.id];
    });
    // console.log("d.CO2emissions2" , JSON.stringify(d));
    console.log("emissionByCountry", JSON.stringify(emissionByCountry));

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
                return "lightgrey";
            } else {
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
//replay animation
function animates () {
    yearValue = 1757;
    d3.select("#chosenYear").text(1757);
    playAnimation();
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