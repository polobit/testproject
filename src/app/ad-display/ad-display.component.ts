import { Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-ad-display',
  templateUrl: './ad-display.component.html',
  styleUrls: ['./ad-display.component.scss']
})
// declare interface Window {
//   adsbygoogle: any[];
// }
// declare var adsbygoogle: any[];
export class AdDisplayComponent implements AfterViewInit {
  constructor() { }

  // ngOnInit() {
  // }

  ngAfterViewInit() {
    try {
      (window['adsbygoogle']  = window['adsbygoogle'] || []).push({});
    } catch (e) {}
  }

}
