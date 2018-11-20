import {
  Component,
  OnInit,
  Input,
  Renderer,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { Graph1Options } from 'src/app/models/graph1';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { Subscription } from 'rxjs';
import * as d3 from '../../../custom-d3';

@Component({
  selector: 'app-bubble-graph',
  templateUrl: './bubble-graph.component.html',
  styleUrls: ['./bubble-graph.component.css']
})
export class BubbleGraphComponent implements OnInit, OnDestroy {
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

      const colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
      const scalePulse = d3
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
        .range([5, 30]);

      console.log(data);
      data.forEach(function(d) {
        d['radius'] = scaleRadius(d['feeling']);
        d['expand'] = false;
      });

      const simulation = d3
        .forceSimulation(data)
        .force('charge', d3.forceManyBody().strength(1))
        .force('center', d3.forceCenter(0, 0))
        .force(
          'collision',
          d3
            .forceCollide()
            .radius(function(d) {
              return d['radius'] + 5;
            })
            .strength(0.8)
        )
        .on('tick', ticked);

      function ticked() {
        if (node) {
          node
            .attr('cx', function(d) {
              return d.x;
            })
            .attr('cy', function(d) {
              return d.y;
            })
            .select('circle')
            .attr('r', function(d) {
              return d.radius;
            });
        }
      }

      const node = svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', function(d) {
          console.log(d['radius']);
          return d['radius'];
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
        })
        .call(
          d3
            .drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded)
        );

      /* node
        .transition()
        .duration(0)
        .delay(function(d, i) {
          return i * 50;
        })
        .each(pulse);

      function pulse() {
        this.transition()
          .duration(500)
          .attr('fill', 'red');
      } */

      function pulseAnimation() {
        repeat();
        function repeat() {
          console.log('repeating ...');
          node
            .transition()
            .duration(500)
            .delay(d => {
              return 200;
            })
            .tween('radius', function(d) {
              const that = d3.select(this);

              const interpolate = d3.interpolate(
                d['radius'],
                scaleRadius(d['feeling']) * scalePulse(d['feeling'])
              );
              return t => {
                d['radius'] = interpolate(t);
                that.attr('r', function() {
                  return d['radius'];
                });
                //simulation.alphaTarget(1).restart();
                simulation.nodes(data).alpha(1);
              };
            })
            .delay(1000)
            .on('end', repeat);
        }
      }
      pulseAnimation();
      function dragStarted(d) {
        console.log('start');
        simulation.alphaTarget(0.3).restart();
      }
      function dragged(d) {
        console.log('drag');
        /* bubbles.attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y); */
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragEnded(d) {
        console.log('end');
        delete d.fx;
        delete d.fy;
        simulation.alphaTarget(0);
      }
    };
    return chart;
  }

  ngOnDestroy() {
    this.countryDataSubscription.unsubscribe();


    this.chart
      .selectAll('svg')
      .transition()
      .remove();
  }
}
