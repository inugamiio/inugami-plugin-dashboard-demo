// ANGULAR CORE MODULES --------------------------------------------------------
import {Component, OnInit}                            from '@angular/core';
import {ActivatedRoute,Router}                        from '@angular/router';

// INUGAMI COMPONENT -----------------------------------------------------------
import {SessionScope}                                 from 'js/app/scopes/session.scope.ts';
import {PluginsService}                               from 'js/app/services/plugins.service.ts';
import {CurveChart}                                   from 'js/app/components/charts/curve_chart/curve.chart.ts';
import {Bloc}                                         from 'js/app/components/display/bloc/bloc.ts';
import {SvgGenericMap}                                from 'js/app/components/charts/svg_generic_map/svg.generic.map.ts';
import {SvgGenericMapEventIncomming}                  from 'js/app/components/charts/svg_generic_map/svg.generic.map.event.incomming.ts';
import {SvgGenericMapMouseEvent}                      from 'js/app/components/charts/svg_generic_map/svg.generic.map.mouse.event';

// SERVICES --------------------------------------------------------------------
import {HealthCheckHandlerService}                    from 'js/app/plugins/inugami_plugin_dashboard_demo/services/health.check.handler.service.ts';
import {MainMenuService}                              from 'js/app/components/main_menu/main.menu.service';
import {MainMenuLink}                                 from 'js/app/components/main_menu/main.menu.link';

@Component({
    templateUrl: 'js/app/plugins/inugami_plugin_dashboard_demo/views/plugin.dashboard.view.html',
    directives : [
      CurveChart,Bloc,SvgGenericMap
    ],
    providers   : [HealthCheckHandlerService]  
})
export class PluginDashboardView implements OnInit{
  /**************************************************************************
  * ATTRIBUTES
  **************************************************************************/
  public  mapStyleClass : string  = "health-check";
  private hasError      : boolean = false;
  private svgMapHandler : any;

  public jsonQuery      : string;
  public svgMap         : string = 'images/health_map.svg';
  //public svgMap         : string = 'images/prep.svg';
  

  private bddInformationsBinding : any = {
    "apache":{
      "serverName":"apache",
      "type":"Httpd",
      "dmz" : "DMZ-1",
      "nbInstances" : 1,
      "instance" : [
        {"port": 80}
      ]
    },
    "hap1":{
      "serverName":"Hap 1",
      "type":"load balancer",
      "dmz" : "DMZ-1",
      "nbInstances" : 1,
      "instance" : [
        {"port": 45001}
      ]
    },
    "hap2":{
      "serverName":"Hap 2",
      "type":"load balancer",
      "dmz" : "DMZ-1",
      "nbInstances" : 1,
      "instance" : [
        {"port": 55001}
      ]
    },
    "indica":{
      "serverName":"indica",
      "type":"application server",
      "dmz" : "DMZ-1",
      "nbInstances" : 4,
      "instance" : [
        {"port": 21001},
        {"port": 21002},
        {"port": 31001},
        {"port": 31002}
      ]
    },
    "velvet":{
      "serverName":"indica",
      "type":"application server",
      "dmz" : "DMZ-1",
      "nbInstances" : 4,
      "instance" : [
        {"port": 61001},
        {"port": 61002},
        {"port": 66001},
        {"port": 66002}
      ]
    },
    "brett":{
      "serverName":"brett",
      "type":"application server",
      "dmz" : "DMZ-1",
      "nbInstances" : 4,
      "instance" : [
        {"port": 22001},
        {"port": 22002},
        {"port": 22301},
        {"port": 22302}
      ]
    },
    "galibier":{
      "serverName":"galibier",
      "type":"application server",
      "dmz" : "DMZ-1",
      "nbInstances" : 1,
      "instance" : [
        {"port": 99001}
      ]
    },
    "fogcutter":{
      "serverName":"fogcutter",
      "type":"application server",
      "dmz" : "DMZ-1",
      "nbInstances" : 1,
      "instance" : [
        {"port": 79001}
      ]
    },
    "neo4j":{
      "serverName":"neo4j",
      "type":"database",
      "dmz" : "DMZ-2",
      "nbInstances" : 1,
      "instance" : [
        {"port": 5401}
      ]
    },
    "els":{
      "serverName":"els",
      "type":"database",
      "dmz" : "DMZ-2",
      "nbInstances" : 1,
      "instance" : [
        {"port": 5601}
      ]
    },
    "mainframe":{
      "serverName":"mainframe",
      "type":"Mainframe",
      "dmz" : "DMZ-3",
      "nbInstances" : 1,
      "instance" : [
        {"port": 666}
      ]
    }
  }
  public selectedElement : any = null;

  /**************************************************************************
  * CONSTRUCTORS
  **************************************************************************/
  constructor(private route               : ActivatedRoute,
              private router              : Router,
              private pluginsService      : PluginsService,
              private sessionScope        : SessionScope,
              private healthCheckHandler  : HealthCheckHandlerService,
              private mainMenuService  : MainMenuService){

      let self = this;
      org.inugami.events.addEventListener(org.inugami.sse.events.OPEN_OR_ALREADY_OPEN, function(event) {
        self.pluginsService.callPluginEventsProcessingBaseName("inugami_plugin_dashboard_demo");
        org.inugami.events.updateResize();
      });
      

      let buffer = [];
      buffer.push('[');
      buffer.push('    {  "hostname":"brett", ');
      buffer.push('       "instances":[');
      buffer.push('           {"name":"instance-1", "state":"error"},');
      buffer.push('           {"name":"instance-3", "state":"error"}');
      buffer.push('       ]');
      buffer.push('     }');
      buffer.push(']');
      

      this.jsonQuery = buffer.join('\n');
      this.healthCheckHandler.initializeData();
      this.svgMapHandler = function(data){self.healthCheckHandler.handlingIncommingData(data)};
  }

  ngOnInit() {
    let self =this;
    this.route.params.subscribe(params => {
      
      org.inugami.sse.register("inugami_plugin_dashboard_demo",
                                  (eventFilter)=>{return  true },
                                  (eventAlerts)=>{self.onAlerts(eventAlerts)}); 
      
      this.sessionScope.openMainMenu();
      this.mainMenuService.cleanLinks();
      this.mainMenuService.setCurrentTitle("Demo plugin");
      this.mainMenuService.addSubLink(new MainMenuLink("Administration", "/admin","admin",true,'admin'));
      this.mainMenuService.addSubLink(new MainMenuLink("Plugin home", "/demo","plugin"));
      this.mainMenuService.updateMenu();
    });
              


  }


  public showMenu(){
    
  }

  public closeInformationPanel(){
    this.selectedElement=null;
  }

  public getInformationPanelClass(){
    let classes = ['information-panel'];
    if(isNotNull(this.selectedElement)){
      classes.push('panel-open');
    }else{
      classes.push('panel-close');
    }
    return classes.join(' ');
  }
  private onAlerts(alert : any){
    console.log(alert);
  }
  
  /**************************************************************************
  * ACTION HANDLERS 
  **************************************************************************/
  public simulateError(){
    let data = JSON.parse(this.jsonQuery)
    org.inugami.events.fireEventPlugin("inugami_plugin_dashboard_demo","health-check",data);
  }

  public simulateRollbackError(){
    org.inugami.events.fireEventPlugin("inugami_plugin_dashboard_demo","health-check");
  }


 public healthOnClick(event:SvgGenericMapMouseEvent){
    if(isNotNull(event.node)){
      let attribute = event.node.attributes['data-id'];
      if(isNotNull(attribute)){
        let content = this.bddInformationsBinding[attribute.value];
        if(isNotNull(content)){
          this.selectedElement = content;
        }
      }
    }
 }
}
