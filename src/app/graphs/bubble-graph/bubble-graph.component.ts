import { Component, OnInit, Input, Renderer, ElementRef } from '@angular/core';
import { Graph1Options } from 'src/app/models/graph1';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { Subscription } from 'rxjs';
import * as d3 from "d3-scale";


@Component({
  selector: 'app-bubble-graph',
  templateUrl: './bubble-graph.component.html',
  styleUrls: ['./bubble-graph.component.css']
})
export class BubbleGraphComponent implements OnInit {
  @Input()
  width: string;

  @Input()
  height: string;

  graphOptions = new Graph1Options();
  datas;
  countryDataSubscription: Subscription;


  constructor(private el: ElementRef, private renderer: Renderer, private dataService: DataProviderService) {

  }
  ngOnInit() {
    this.countryDataSubscription = this.dataService.dataSubject.subscribe(d => {
      this.datas = d;
    });

    this.dataService.emitDataSubject();

    this.initChart();
  }

  initChart() {
    d3.select(this.el.nativeElement).select('svg').data(this.datas);
  }

  private scaleRadius() {
    d3.scaleLinear()
      .domain([d3.min(this.datas,  (d) => { return + d.feeling }),
      d3.max(this.datas, function (d) { return +d['feeling']; })])
      .range([5, 18]);
  }
}
