// ANGULAR CORE MODULES --------------------------------------------------------
import {NgModule}                       from '@angular/core';
import {RouterModule}                   from '@angular/router';
import {CommonModule}                   from '@angular/common';
import {BrowserModule}                  from '@angular/platform-browser';
import { HttpClientModule }             from '@angular/common/http';
import {ReactiveFormsModule}            from '@angular/forms';
import {FormsModule}                    from '@angular/forms';

// INUGAMI CORE ----------------------------------------------------------------
import {AppRootModule}                  from 'js/app/app.root.module';



// SERVICES --------------------------------------------------------------------

// VIEWS -----------------------------------------------------------------------
import {PluginHomeView}                 from 'js/app/plugins/inugami_plugin_dashboard_demo/views/plugin.home.view';
import {PluginDashboardView}            from 'js/app/plugins/inugami_plugin_dashboard_demo/views/plugin.dashboard.view';

// COMPO --------------------------------------------------------------------

// SERVICES -----------------------------------------------------------------

// MODULE ----------------------------------------------------------------------
@NgModule({
    imports         : [CommonModule, BrowserModule, ReactiveFormsModule, FormsModule, HttpClientModule, RouterModule, AppRootModule],
    declarations    : [PluginHomeView,PluginDashboardView],
    entryComponents : [],
    exports         : [],
    providers       : [],
    bootstrap       : []
})
export class InugamiPluginDashboardDemoModule {

}
export const InugamiPluginDashboardDemoRoutes = RouterModule.forRoot([
    {path: 'demo'           , component: PluginHomeView},
    {path: 'demo/home'      , component: PluginHomeView},
    {path: 'demo/dashboard' , component: PluginDashboardView}
]);
