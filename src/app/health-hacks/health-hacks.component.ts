import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-health-hacks',
  templateUrl: './health-hacks.component.html',
  styleUrls: ['./health-hacks.component.scss']
})
export class HealthHacksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
   this.showAlert();
  }

  public showAlert() {
     console.log('Health !!');
  }

}
