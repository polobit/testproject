import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import * as _ from 'lodash';
@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss']
})
export class SingleArticleComponent implements OnInit {

public routeId: any;
public id: any;
public link: any;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.link = window.location.pathname ;
    console.log('this.link::' + this.link);
  }

  ngOnInit() {
    this.routeId = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 1 if no query param provided.
        this.id = params['id'];
      });
      // console.log('this.routeId::' + JSON.stringify( this.routeId));
      // console.log('this.routeId::' + this.id);
   // this.goToPage(this.id);
  }

  // goToPage(id) {
  //   alert('the id' + id);
  //   this.id = id;
  //  this.router.navigate(['/article'], { queryParams: { id: this.id} });
  //   if (window.location.href.includes('/1')) {
  //     alert('/article one'); } else {
  //     alert('/article other');
  //   }
  // }

}
