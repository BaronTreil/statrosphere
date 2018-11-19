import { Component, OnInit, Input, Renderer, ElementRef } from '@angular/core';
import { Graph1Options } from 'src/app/models/graph1';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { Subscription } from 'rxjs';
import * as d3 from '../../../custom-d3';

@Component({
  selector: 'app-bubble-graph',
  templateUrl: './bubble-graph.component.html',
  styleUrls: ['./bubble-graph.component.css']
})
export class BubbleGraphComponent implements OnInit {
  @Input()
  width = 960;

  @Input()
  height = 960;

  maxRadius = 6;

  graphOptions = new Graph1Options();
  datas;
  countryDataSubscription: Subscription;

  chart;

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private dataService: DataProviderService
  ) {}

  ngOnInit() {
    this.countryDataSubscription = this.dataService.dataSubject.subscribe(d => {
      this.datas = d.slice(1, 10);
    });

    this.dataService.emitCountryDataSubject();

    setTimeout(() => {
      this.chart = this.initChart();
      d3.select('#chart')
        .datum(this.datas)
        .call(this.chart);
    }, 400);
  }

  initChart() {
    const chart: any = selection => {
      const data = selection.datum();
      const div = selection,
        svg = div.selectAll('svg');
      svg.attr('width', this.width).attr('height', this.height);

      const rect = svg.node().getBoundingClientRect(),
        svgWidth = rect.width,
        svgHeight = rect.height;

      console.log(' SVG HEIGHT ' + svgHeight);

      const tooltip = selection
        .append('div')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('color', 'white')
        .style('padding', '8px')
        .style('background-color', '#626D71')
        .style('border-radius', '6px')
        .style('text-align', 'center')
        .style('font-family', 'monospace')
        .style('width', '100px')
        .text('');

      const simulation = d3
        .forceSimulation(data)
        .force('charge', d3.forceManyBody().strength(-50))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        .on('tick', ticked);

      function ticked() {
        node
          .attr('cx', function(d) {
            return d.x;
          })
          .attr('cy', function(d) {
            return d.y;
          });
      }

      const colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
      const pulseStrength = d3
        .scaleLinear()
        .domain([
          d3.min(data, function(d) {
            return +d['feeling'];
          }),
          d3.max(data, function(d) {
            return +d['feeling'];
          })
        ])
        .range([1, 2]);

      const scaleRadius = d3
        .scaleLinear()
        .domain([
          d3.min(data, function(d) {
            return +d['feeling'];
          }),
          d3.max(data, function(d) {
            return +d['feeling'];
          })
        ])
        .range([5, 18]);

      const node = svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', function(d) {
          return scaleRadius(d['feeling']);
        })
        .style('fill', function(d) {
          return colorCircles(d['feeling']);
        })
        .attr('transform', 'translate(' + [svgWidth / 2, svgHeight / 2] + ')')
        .on('mouseover', d => {
          tooltip.html(
            '<b>' +
              d['name'] +
              '</b>' +
              '<br>' +
              d['feeling'] +
              '<br>' +
              d['feeling'] +
              ' hearts'
          );
          return tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function() {
          return tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
        })
        .on('mouseout', function() {
          return tooltip.style('visibility', 'hidden');
        });

      svg
        .selectAll('circle')
        .transition()
        .duration(2000)
        .attr('r', function(d) {
          return scaleRadius(d['feeling']) * pulseStrength(d['feeling']);
        })
        .duration(500)
        .attr('r', function(d) {
          return scaleRadius(d['feeling']);
        });
    };
    return chart;
  }
}
