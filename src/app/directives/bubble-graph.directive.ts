import { Directive, OnInit, ElementRef, Renderer, Input } from "@angular/core";

@Directive({
  selector: "[appBubbleGraph]"
})
export class BubbleGraphDirective implements OnInit {
  @Input()
  width: number;

  @Input()
  height: number;

  graphOptions;

  constructor(private el: ElementRef, private renderer: Renderer) {
    el.nativeElement.innerHTML =
      '<div class="chart-example" id="chart"><svg></svg></div>';
  }

  ngOnInit() {
    this.graphOptions.width = this.width;
    this.graphOptions.height = this.height;
  }
}
