import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as d3 from "d3";
import { renderDetachView } from "@angular/core/src/view/view_attach";
declare var $: any; // JQuery

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit, AfterViewInit {
  chart;
  pageLoaded = false;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.createSampleChart1();
    }, 1000);
  }

  createSampleChart1() {
    // 2. Use the margin convention practice
    const margin = { top: 20, right: 50, bottom: 50, left: 50 },
      width = d3
        .select("#svgcontainer")
        .style("width")
        .slice(0, -2), // Use the window's width
      height = d3
        .select("#svgcontainer")
        .style("height")
        .slice(0, -2); // Use the window's height

    // The number of datapoints
    const n = 21;

    // 5. X scale will use the index of our data
    const xScale = (d3 as any)
      .scaleLinear()
      .domain([0, n - 1]) // input
      .range([0, width]); // output

    // 6. Y scale will use the randomly generate number
    const yScale = (d3 as any)
      .scaleLinear()
      .domain([0, 1]) // input
      .range([height, 0]); // output

    // 7. d3's line generator
    const line = (d3 as any)
      .line()
      .x(function(d, i) {
        return xScale(i);
      }) // set the x values for the line generator
      .y(function(d) {
        return yScale(d.y);
      }) // set the y values for the line generator
      .curve((d3 as any).curveMonotoneX); // apply smoothing to the line

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    const dataset = d3.range(n).map(function(d) {
      return { y: (d3 as any).randomUniform(1)() };
    });

    // 1. Add the SVG to the page and employ #2
    const svg = d3
      .select("#svgcontainer")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin slice")
      .attr("viewBox", "0 0 " + 650 + " " + 650)
      //class to make it responsive
      .classed("svg-content-responsive", true)
      .append("g")
      .attr(
        "transform",
        "translate(" + (margin.left - 10) + "," + (margin.top - 10) + ")"
      );

    // 3. Call the x axis in a group tag
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call((d3 as any).axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg
      .append("g")
      .attr("class", "y axis")
      .call((d3 as any).axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator
    svg
      .append("path")
      .datum(dataset) // 10. Binds data to the line
      .attr("class", "line") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator

    // 12. Appends a circle for each datapoint
    svg
      .selectAll(".dot")
      .data(dataset)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d, i) {
        return xScale(i);
      })
      .attr("cy", function(d) {
        return yScale(d.y);
      })
      .attr("r", 5)
      .on("mouseover", function(a, b, c) {
        console.log(a);
        this.attr("class", "focus");
      })
      .on("mouseout", function() {});


      this.pageLoaded= true;
  }

  redraw() {
    const margin = { top: 20, right: 50, bottom: 50, left: 50 },
      width = d3
        .select("#svgcontainer")
        .style("width")
        .slice(0, -2), // Use the window's width
      height = d3
        .select("#svgcontainer")
        .style("height")
        .slice(0, -2); // Use the window's height

    d3.select("#svgcontainer")
      .append("svg")
      .attr("width", +width - margin.right)
      .attr("height", +height - margin.top);
  }
}
