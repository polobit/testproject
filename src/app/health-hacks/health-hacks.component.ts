import { Component, OnInit } from '@angular/core';
import {SingleArticleComponent} from '../single-article/single-article.component';
@Component({
  selector: 'app-health-hacks',
  templateUrl: './health-hacks.component.html',
  styleUrls: ['./health-hacks.component.scss']
})
export class HealthHacksComponent implements OnInit {

  constructor(public singleArticle: SingleArticleComponent ) {}

  ngOnInit() {
  // this.showAlert();
  }

  public showAlert(id) {
    // this.singleArticle.goToPage(id);
  }

}
