// ANGULAR CORE MODULES --------------------------------------------------------
import {Component, OnInit}                     from '@angular/core';
import {SessionScope}                          from 'js/app/scopes/session.scope';
import {Msg}                                   from 'js/app/components/msg/msg';
import {MainMenuService}                       from 'js/app/components/main_menu/main.menu.service';
import {MainMenuLink}                          from 'js/app/components/main_menu/main.menu.link';
// SERVICES --------------------------------------------------------------------
@Component({
    templateUrl: 'plugin.home.view.html',
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
  constructor(private mainMenuService  : MainMenuService,
              private sessionScope     : SessionScope){

  }

  ngOnInit() {
    this.sessionScope.openMainMenu();
    this.mainMenuService.cleanLinks();
    this.mainMenuService.setCurrentTitle("Demo plugin");
    this.mainMenuService.addSubLink(new MainMenuLink("Administration", "/admin","admin",true,'admin'));
    this.mainMenuService.addSubLink(new MainMenuLink("Dashboard", "/demo/dashboard","demo-dashboard"));
  
    this.mainMenuService.updateMenu();
  }
  
}
