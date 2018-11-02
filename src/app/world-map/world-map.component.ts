import { DataProviderService } from "./../services/data-provider.service";
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input
} from "@angular/core";
import * as d3 from "d3";
import { Subscription } from "rxjs";
import * as Datamap from "datamaps";

@Component({
  selector: "app-world-map",
  templateUrl: "./world-map.component.html",
  styleUrls: ["./world-map.component.css"]
})
export class WorldMapComponent implements OnInit, AfterViewInit {
  @ViewChild("mapDiv")
  mapDiv;

  expanded = false;
  expandedRight = false;

  @Input()
  detailsTitleColor = "#343a40";

  @Input()
  selectedCountry = {};

  mapRef: DataMap;
  mapSvg;
  datas;
  countryDataSubscription: Subscription;

  constructor(private dataService: DataProviderService) {}
  ngOnInit() {
    this.countryDataSubscription = this.dataService.dataSubject.subscribe(d => {
      this.datas = d;
    });

    this.dataService.emitDataSubject();
    console.log(this.datas);
  }

  ngAfterViewInit() {
    this.initiateMap();
  }

  toggleLeftBar() {
    this.expanded = !this.expanded;
  }

  toggleRightBar() {
    this.expandedRight = !this.expandedRight;
    console.log(this.expandedRight);
  }

  closeRightBar() {
    this.expandedRight = false;
    console.log(this.expandedRight);
  }

  openRightBar() {
    this.expandedRight = true;
    console.log(this.expandedRight);
  }

  showCountryDetails(countryName, countryCode, countryColor) {
    this.selectedCountry = {};
    if (countryColor) {
      this.detailsTitleColor = countryColor;
    }
    this.selectedCountry["name"] = countryName;
    this.selectedCountry["countryCode"] = countryCode;
    this.selectedCountry["details"] = this.dataService.getCountryDetail(
      countryCode
    );
    console.log(JSON.stringify(this.selectedCountry));
    this.openRightBar();
  }

  refreshButtonClick() {
    this.refreshMap();
    this.refreshCountryDetails();
  }
  refreshCountryDetails() {
    if (this.selectedCountry["countryCode"]) {
      this.selectedCountry["details"] = this.dataService.getCountryDetail(
        this.selectedCountry["countryCode"]
      );
    }
  }
  refreshMap() {
    this.dataService.generateData();
    this.dataService.emitDataSubject();
    console.log(this.datas[0]);
    console.log(this.mapRef);

    this.mapRef.updateChoropleth(this.datas);
  }
  zoomTest() {
    console.log("Zoom test");
    this.zoomTo(150, 86);
  }

  zoomTo(abs, ord) {
    console.log("Incoming coordinates: " + abs + " ; " + ord);
    (this.mapRef as any).svg
      .select("g")
      .transition(500)
      .attr("transform", "translate(" + abs + "," + ord + ") scale(1)");
  }
  initiateMap() {
    if (this.datas != null) {
      this.mapRef = new Datamap({
        element: this.mapDiv.nativeElement,
        geographyConfig: {
          responsive: true,
          popupOnHover: true,
          highlightOnHover: true,
          highlightBorderWidth: 2,
          highlightFillColor: "#ff3c00",
          highlightBorderColor: "#db0025",
          borderColor: "#343a40",
          borderWidth: 1,
          dataUrl: "../../assets/mapExample.topo.json",
          data: this.datas,
          popupTemplate: function(geo, data) {
            // tooltip content
            if (data != null) {
              return [
                '<div class="hoverinfo">',
                "<span style='text-align: center; display:block; font-size: 1.2em;'><strong>",
                geo.properties.name,
                "</strong></span>",
                "<strong>Feeling Lvl : </strong> " + "<i>" + data.feeling + "</i>",
                "</div>"
              ].join("");
            } else {
              return [
                '<div class="hoverinfo">',
                "<strong>",
                geo.properties.name,
                "</strong>",
                "</div>"
              ].join("");
            }
          }
        },
        fills: {
          defaultFill: "#dddddd"
        },
        done: datamap => {
          d3.select(".datamap").call(
            (d3 as any)
              .zoom()
              .scaleExtent([0.7, 6])
              .on("zoom", function() {
                datamap.svg
                  .selectAll("g")
                  .attr("transform", (d3.event as any).transform);
              })
          );
          d3.select(".datamap").on("click", () => {
            this.closeRightBar();
          });

          d3.selectAll(".datamaps-subunit").on("click", (d, i, nodes) => {
            (d3.event as Event).stopPropagation();
            //datamap.svg
            //  .select("g")
            //.attr("transform","scale(2)");
            const bbox = nodes[i].getBBox();
            console.log("BBOX : " + bbox.x + " ; " + +bbox.y);
            console.log("CLICK LOCATION  : " + d3.mouse(nodes[i]));
            // this.zoomTo(bbox.x, bbox.y);
            this.showCountryDetails(
              d.properties.name,
              d.id,
              (this.datas[d.id] != null ? this.datas[d.id].fillColor : "#343a40"),
            );
          });
          // datamap.svg.selectAll(".datamaps-subunit").on("click", geography => {
          //   d3.select("datamap").call(d3.zoom);
          //   let event = d3.event as d3.BaseEvent;

          //   console.log("EVENT DATAMAP" + JSON.stringify(event));
          //   this.showCountryDetails(geography.id);
          // });
        },
        data: this.datas
      });
    }
  }
}
