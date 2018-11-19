import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'pixel' })
export class PixelPipe implements PipeTransform {
    transform(value: any) {
        return value + "px";
    }
}