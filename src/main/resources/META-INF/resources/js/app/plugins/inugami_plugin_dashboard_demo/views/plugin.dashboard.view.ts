// ANGULAR CORE MODULES --------------------------------------------------------
import {Component, OnInit}                            from '@angular/core';
import {ActivatedRoute,Router}                        from '@angular/router';

// INUGAMI COMPONENT -----------------------------------------------------------
import {SessionScope}                                 from 'js/app/scopes/session.scope.ts';
import {PluginsService}                               from 'js/app/services/plugins.service.ts';
import {CurveChart}                                   from 'js/app/components/charts/curve_chart/curve.chart.ts';
import {Bloc}                                         from 'js/app/components/display/bloc/bloc.ts';

// SERVICES --------------------------------------------------------------------
@Component({
    templateUrl: 'js/app/plugins/inugami_plugin_dashboard_demo/views/plugin.dashboard.view.html',
    directives : [
      CurveChart,Bloc
    ]
})
export class PluginDashboardView implements OnInit{
  /**************************************************************************
  * ATTRIBUTES
  **************************************************************************/
 
  
  /**************************************************************************
  * CONSTRUCTORS
  **************************************************************************/
  constructor(private route               : ActivatedRoute,
              private router              : Router,
              private pluginsService      : PluginsService,
              private sessionScope        : SessionScope){

      let self = this;
      org.inugami.events.addEventListener(org.inugami.sse.events.OPEN_OR_ALREADY_OPEN, function(event) {
        self.pluginsService.callPluginEventsProcessingBaseName("inugami_plugin_dashboard_demo");
        org.inugami.events.updateResize();
      });

      this.sessionScope.closeMainMenu();
  }

  ngOnInit() {
    let self =this;
    this.route.params.subscribe(params => {
      
      org.inugami.sse.register("inugami_plugin_dashboard_demo",
                                  (eventFilter)=>{return  true },
                                  (eventAlerts)=>{self.onAlerts(eventAlerts)});  
    });

  }


  private onAlerts(alert : any){
    console.log(alert);
  }
  
}
