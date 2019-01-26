// ANGULAR CORE MODULES --------------------------------------------------------
import {Component, OnInit}                     from '@angular/core';
import {Msg}                                   from 'js/app/components/msg/msg';
// SERVICES --------------------------------------------------------------------
@Component({
    templateUrl: 'js/app/plugins/inugami_plugin_dashboard_demo/views/plugin.home.view.html',
    directives : [
        Msg
    ]
})
export class PluginHomeView implements OnInit{
  /**************************************************************************
  * ATTRIBUTES
  **************************************************************************/
 
  
  /**************************************************************************
  * CONSTRUCTORS
  **************************************************************************/
  constructor(){

  }

  ngOnInit() {
   

  }
  
}
