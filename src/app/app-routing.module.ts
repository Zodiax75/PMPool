import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { NotFoundComponent } from './components/misc/not-found/not-found.component';

const routes: Routes = [
    {
        path: 'landing',
        loadChildren: () => import('app/components/landing/landing.module').then(m => m.LandingModule),
        data: { preload: true }
    },
    {
        path: 'auth',
        loadChildren: () => import('app/components/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'views',
        loadChildren: () => import('app/components/views/views.module').then(m => m.ViewsModule)
    },
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
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