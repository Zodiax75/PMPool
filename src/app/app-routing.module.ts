import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './components/misc/not-found/not-found.component';

const routes: Routes = [
    {
        path: 'views',
        loadChildren: () => import('./components/views/views.module').then(m => m.ViewsModule)
    },
    { path: '', redirectTo: '/views/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [
        NotFoundComponent
    ]
})
  
export class AppRoutingModule { }