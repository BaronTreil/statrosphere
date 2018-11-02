import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as d3 from "d3-scale";

const countryList = [
  "BLR",
  "BLZ",
  "RUS",
  "RWA",
  "SRB",
  "TLS",
  "REU",
  "TKM",
  "TJK",
  "ROU",
  "TKL",
  "GNB",
  "GUM",
  "GTM",
  "SGS",
  "GRC",
  "GNQ",
  "GLP",
  "JPN",
  "GUY",
  "GGY",
  "GUF",
  "GEO",
  "GRD",
  "GBR",
  "GAB",
  "SLV",
  "GIN",
  "GMB",
  "GRL",
  "ERI",
  "MNE",
  "MDA",
  "MDG",
  "MAF",
  "MAR",
  "MCO",
  "UZB",
  "MMR",
  "MLI",
  "MAC",
  "MNG",
  "MHL",
  "MKD",
  "MUS",
  "MLT",
  "MWI",
  "MDV",
  "MTQ",
  "MNP",
  "MSR",
  "MRT",
  "IMN",
  "UGA",
  "TZA",
  "MYS",
  "MEX",
  "ISR",
  "FRA",
  "IOT",
  "SHN",
  "FIN",
  "FJI",
  "FLK",
  "FSM",
  "FRO",
  "NIC",
  "NLD",
  "NOR",
  "NAM",
  "VUT",
  "NCL",
  "NER",
  "NFK",
  "NGA",
  "NZL",
  "NPL",
  "NRU",
  "NIU",
  "COK",
  "XKX",
  "CIV",
  "CHE",
  "COL",
  "CHN",
  "CMR",
  "CHL",
  "CCK",
  "CAN",
  "COG",
  "CAF",
  "COD",
  "CZE",
  "CYP",
  "CXR",
  "CRI",
  "CUW",
  "CPV",
  "CUB",
  "SWZ",
  "SYR",
  "SXM"
];

@Injectable({
  providedIn: "root"
})
export class DataProviderService {
  dataSet;
  dataSetFull;
  dataSubject = new Subject<any>();
  countryData;
  constructor() {
    this.generateData();
    this.emitDataSubject();
  }

  generateData() {
    const countryData = [];
    countryList.forEach(element => {
      const f = this.generateValue(-10, 10);
      const p = this.generateValue(10000, 999999);
      const consu = this.generateValue(50000, 250000);
      const comp = this.generateValue(1000, 9000);
      const w = this.generateValue(0, 100);

      countryData.push([
        element,
        {
          feeling: f,
          population: p,
          consumers: consu,
          companies: comp,
          wealthness: w
        }
      ]);
    });
    this.countryData = countryData;
    this.convertToColouredDataSet();
  }

  getCountryDetail(countryCode: string) {
    const ctryDetails = this.dataSetFull[countryCode];
    if (ctryDetails) {
      return ctryDetails;
    } else {
      console.log("No country details found");
      return false;
    }
  }
  convertToColouredDataSet() {
    this.dataSet = {};
    this.dataSetFull = {};
    const feelinValues = this.countryData.map(function(obj) {
      return obj[1].feeling;
    });
    const minValue = Math.min.apply(null, feelinValues),
      maxValue = Math.max.apply(null, feelinValues);

    const paletteScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range(["#e40000", "#17c500"]); // green color

    this.countryData.forEach(element => {
      const iso = element[0],
        value = element[1].feeling;
      this.dataSet[iso] = {
        feeling: value,
        fillColor: paletteScale(value)
      };
    });

    this.countryData.forEach(element => {
      const iso = element[0];
      this.dataSetFull[iso] = {
        feeling: element[1].feeling,
        population: element[1].population,
        consumers: element[1].consumers,
        companies: element[1].companies,
        wealthness: element[1].wealthness,
        name: iso
      };
    });

    this.emitDataSubject();
  }

  generateValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  emitDataSubject() {
    this.dataSubject.next(this.dataSet);
  }
}
