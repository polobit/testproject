import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import { HealthHacksComponent} from './health-hacks/health-hacks.component';
import {AdDisplayComponent} from './ad-display/ad-display.component';
const routeLinks: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePageComponent
    },
    {
        path: 'health',
        component: HealthHacksComponent
    },
    {
        path: 'ads',
        component: AdDisplayComponent
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
export const routingComponents = [HomePageComponent, HealthHacksComponent ] ;
