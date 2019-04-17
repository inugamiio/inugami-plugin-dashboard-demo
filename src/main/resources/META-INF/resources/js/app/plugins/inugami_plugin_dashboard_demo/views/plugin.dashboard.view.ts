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
@Component({
    templateUrl: 'js/app/plugins/inugami_plugin_dashboard_demo/views/plugin.dashboard.view.html',
    directives : [
      CurveChart,Bloc,SvgGenericMap
    ]
})
export class PluginDashboardView implements OnInit{
  /**************************************************************************
  * ATTRIBUTES
  **************************************************************************/
  public  mapStyleClass : string  = "health-check";
  private hasError      : boolean = false;
  private svgMapHandler : any;

  public jsonQuery      : string;

  public connectors     : any = {
    "brett_instance-1" : ['path.hap-TO-brett-instance-1'],
    "brett_instance-2" : ['path.hap-TO-brett-instance-2'],
    "brett_instance-3" : ['path.hap-TO-brett-instance-3'],
    "brett_instance-4" : ['path.hap-TO-brett-instance-4']

  };

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
              private sessionScope        : SessionScope){

      let self = this;
      org.inugami.events.addEventListener(org.inugami.sse.events.OPEN_OR_ALREADY_OPEN, function(event) {
        self.pluginsService.callPluginEventsProcessingBaseName("inugami_plugin_dashboard_demo");
        org.inugami.events.updateResize();
      });
      this.sessionScope.closeMainMenu();

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

      this.svgMapHandler = function(data){self.svgMapOnDataIncomming(data)};
  }

  ngOnInit() {
    let self =this;
    this.route.params.subscribe(params => {
      
      org.inugami.sse.register("inugami_plugin_dashboard_demo",
                                  (eventFilter)=>{return  true },
                                  (eventAlerts)=>{self.onAlerts(eventAlerts)});  
    });

  }






  public showMenu(){
    this.sessionScope.toggleMainMenu();
  }

  private onAlerts(alert : any){
    console.log(alert);
  }
  
  /**************************************************************************
  * SVG GENERIC MAP CONTROL
  **************************************************************************/
  public simulateError(){
    org.inugami.events.fireEventPlugin("inugami_plugin_dashboard_demo","health-check",
      JSON.parse(this.jsonQuery);
    );
  }

  public simulateRollbackError(){
    org.inugami.events.fireEventPlugin("inugami_plugin_dashboard_demo","health-check");
  }

  private svgMapOnDataIncomming(data:SvgGenericMapEventIncomming){
    if(isNotNull(data.previousEvent) && isNotNull(data.previousEvent.data) && isNotNull(data.previousEvent.data.values)){
      this.reInitializePreviousNodes(data.rootNode,data.previousEvent.data.values);
    }

    if(isNotNull(data.event) && isNotNull(data.event.data) && isNotNull(data.event.data.values)){
      this.changeNodesStates(data.rootNode,data.event.data.values);
    }
  }


  private reInitializePreviousNodes(rootNode:any, data:any){
    for(let asset of data){
      for(let instanceState of asset.instances){
         this.reInitializeInstanceState(rootNode,asset.hostname,instanceState);
         
      }
    }

    let selectedConnectors =rootNode.selectAll('path.connectors-states');
    if(isNotNull(selectedConnectors)){
      for(let i=0;i<selectedConnectors._groups[0].length; i++){
        let currentNode = selectedConnectors._groups[0][i];
        let pathSelected = rootNode.selectAll('#'+currentNode.id);
        if(isNotNull(pathSelected)){
          this.reInitializeNode(pathSelected);
        }
      }
    }
  }

  private changeNodesStates(rootNode:any, data:any){
    for(let asset of data){
      let state = [];
      for(let instanceState of asset.instances){
         this.changeInstanceState(rootNode,asset.hostname,instanceState);
         if(!state.includes(instanceState.state)){
          state.push(instanceState.state);
         }
      }
    }
  }


  private changeInstanceState(rootNode,hostname,instanceState){
    let nodes = rootNode.selectAll(['g.',hostname,' g.',instanceState.name].join(''));

    if(isNotNull(nodes)){
      this.setNewCssClass(nodes, instanceState.state);
    }

    let connectors = this.connectors[[hostname,instanceState.name].join('_')];
    if(isNotNull(connectors)){
      for(let connector of connectors){
        let connectorsNodes = rootNode.selectAll(connector);
        this.setNewCssClass(connectorsNodes, 'connectors-states '+instanceState.state);
      }
    }

  }

  private setNewCssClass(node, state){
    if(isNotNull(node) && node._groups.length>0 && node._groups[0].length>0){
      node.attr('data-previous-class', node.attr('class'));
      node.attr('class', [node.attr('class'),state].join(' '));
    }
  }


  private reInitializeInstanceState(rootNode,hostname,instanceState){
    let nodes = rootNode.selectAll(['g.',hostname,' g.',instanceState.name].join(''));
    this.reInitializeNode(nodes);
  }

  private reInitializeNode(nodes){
    if(isNotNull(nodes)){
      let previousClass = nodes.attr('data-previous-class');
      if(isNotNull(previousClass)){
        nodes.attr('class',previousClass);
      }
    }
  }


  /**************************************************************************
  * SVG GENERIC MAP CONTROL EVENT
  **************************************************************************/
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
