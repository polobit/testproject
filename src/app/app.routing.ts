import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import { HealthHacksComponent} from './health-hacks/health-hacks.component';
import {AdDisplayComponent} from './ad-display/ad-display.component';
import {SingleArticleComponent} from './single-article/single-article.component';
const routeLinks: Routes = [
    {
        path: '',
        redirectTo: 'health',
        pathMatch: 'full'
    },
    // {
    //     path: '**',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    // },
    {
        path: 'home',
        component: AppComponent
    },
    {
        path: 'health',
        component: HealthHacksComponent
    },
    {
        path: 'ads',
        component: AdDisplayComponent
    },
    {
        path: 'article/:id',
        component: SingleArticleComponent,
        // data: { pathId: 900 }
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routeLinks)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})

export class AppRoutingModule {
}
