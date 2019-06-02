import {Injectable}                              from '@angular/core';
import {HttpServices}                            from 'js/app/services/http/http.services.ts';


@Injectable()
export class HealthCheckHandlerService {

   /**************************************************************************
   * ATTRIBUTES
   **************************************************************************/
   public connectors     : any = {}
      


   /**************************************************************************
   * CONSTRUCTORS
   **************************************************************************/
   constructor( private httpSerivce    : HttpServices) {
   }

   public initializeData(){
      this.httpSerivce.get(CONTEXT_PATH+"rest/plugins/inugami-plugin-dashboard-demo/healthCheckData")
                      .then(data =>{
                        this.connectors = data;
                      });
   }
   /**************************************************************************
   * INCOMMING DATA
   **************************************************************************/
   public handlingIncommingData(data:SvgGenericMapEventIncomming){
      if(isNotNull(data.previousEvent) && isNotNull(data.previousEvent.data) && isNotNull(data.previousEvent.data.values)){
         this.reInitializePreviousNodes(data.rootNode,data.previousEvent.data.values);
      }

      if(isNotNull(data.event) && isNotNull(data.event.data) && isNotNull(data.event.data.values)){
         this.changeNodesStates(data.rootNode,data.event.data.values);
      }
   }


   /**************************************************************************
   * RE INITIALIZE NODES
   **************************************************************************/
   private reInitializePreviousNodes(rootNode:any, data:any){
      for(let asset of data){
         if(isNull(asset.instances)){
            this.reInitializeInstanceState(rootNode,asset.hostname,null);
         }else{
            for(let instance of asset.instances){
               this.reInitializeInstanceState(rootNode,asset.hostname,instance);
            }
         }
      }

      let selectedConnectors =rootNode.selectAll('.connectors-states');
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

   private reInitializeInstanceState(rootNode,hostname,instance){
      let query = ['g.',hostname];
      if(isNotNull(instance)){
         query.push(' ');
         query.push('g.');
         query.push(instance.name);
      }

      let nodes = rootNode.selectAll(query.join(''));
      this.reInitializeNode(nodes);
   }


   private reInitializeNode(nodes){
      if(isNotNull(nodes)){
         let previousClass = null;
         try{
            previousClass = nodes.attr('data-previous-class');
         } catch(error) {}
         if(isNotNull(previousClass)){
            nodes.attr('class',previousClass);
         }
      }
   }

   /**************************************************************************
   * CHANGE NODES STATES
   **************************************************************************/
   private changeNodesStates(rootNode:any, data:any){
      for(let asset of data){
         if(isNull(asset.instances) || asset.instances.length==0){
            this.changeInstanceState(rootNode,asset.hostname,null,isNull(asset.state)?"error":asset.state);
         }else{
            for(let instance of asset.instances){
               this.changeInstanceState(rootNode,asset.hostname,instance);
            }
         }
      }

      let connectors = this.resolveConnectorsToChangeState(data);
      if(connectors.length>0){
         for(let connectorInfo of connectors){
            this.processChangeStateConnectors(rootNode,connectorInfo.selectors, connectorInfo.state)
         }
      }
   }

   private changeInstanceState(rootNode,hostname,instance, rootState?){
      let defaultState = isNull(rootState)?"error":rootState;
      let state = (isNull(instance)||isNull(instance.state))?defaultState:instance.state;

      let query = ['g.',hostname];
      let connectorQuery = [hostname];

      if(isNotNull(instance)){
         query.push(' g.');
         query.push(instance.name);
         connectorQuery.push(instance.name);
      }

      let nodes = rootNode.selectAll(query.join(''));

      if(isNotNull(nodes)){
         this.setNewCssClass(nodes, state);
      }

      let connectors = this.connectors[connectorQuery.join('_')];
      this.processChangeStateConnectors(rootNode,connectors,state);
   }

   private processChangeStateConnectors(rootNode, connectors:string[], state){
      if(isNotNull(connectors)){
         for(let connector of connectors){
            let connectorsNodes = rootNode.selectAll(connector);
            this.setNewCssClass(connectorsNodes, 'connectors-states '+state);
         }
      }
   };
  

   private setNewCssClass(node, state){
      if(isNotNull(node) && node._groups.length>0 && node._groups[0].length>0){
         node.attr('data-previous-class', node.attr('class'));
         node.attr('class', [node.attr('class'),state].join(' '));
      }
   }
  

   /**************************************************************************
   * RESOLVERS
   **************************************************************************/
   private resolveConnectorsToChangeState(data){
      let result = [];
      if(isNotNull(data) && data.length>0){
         let size = data.length;
         result = result.concat(this.resolveIfAllVmdKo(data,size));
         result = result.concat(this.resolveIfAllVmaKo(data,size));
         result = result.concat(this.resolveIfAllVmcKo(data,size));
         result = result.concat(this.resolveIfAllMiwKo(data,size));
      }
      return result;
   }


   private resolveIfAllVmdKo(data, dataSize){
     return this.genericResolveIfAllKo(data, dataSize,"vmd",2, 'vmd.all',['instance-1','instance-2','instance-3','instance-4']);
   }
   private resolveIfAllVmaKo(data, dataSize){
      return this.genericResolveIfAllKo(data, dataSize,"vma",1, 'vma.all',['instance-1','instance-2']);
   }
   private resolveIfAllVmcKo(data, dataSize){
      return this.genericResolveIfAllKo(data, dataSize,"vmc",1, 'vmc.all',['instance-1','instance-2']);
   }
 
 
   private resolveIfAllMiwKo(data, dataSize){
      let result = [];
      let miwTagliata  = null;
      let miwVecchia   = null;

      for(let i=dataSize-1; i>=0; i--){
         let asset = data[i];
         if(asset.hostname == "miw.vecchia"){
            miwVecchia = asset;
         }
         else if(asset.hostname == "miw.tagliata"){
            miwTagliata = asset;
         }
      }

      if(miwTagliata != null && miwVecchia!=null){
         if(miwTagliata.instances.length==4 && miwVecchia.instances.length==4){
            result.push({
               "state":"error",
               "selectors" : this.connectors['miw.all']
            });
         }
      }
      return result;
   }




   private genericResolveIfAllKo(data, dataSize, assetName, warnLevel, connectorSelector ,instancetoFind){
      let result = [];
      let toFind = [];
          toFind = toFind.concat(instancetoFind);
      let currentAsset = null;

      for(let i=dataSize-1; i>=0; i--){
         let asset = data[i];
         if(asset.hostname == assetName){
            currentAsset = asset;
            break;
         }
      }

      if(isNotNull(currentAsset) && isNotNull(currentAsset.instances)){
         for(let instance of currentAsset.instances){
            let index = toFind.indexOf(instance.name);
               if(index !=-1){
                  toFind.splice(index,1);
            }
         }
      }

      if(toFind.length<=warnLevel){
         let state = toFind.length==0?"error" : "warn";
         result.push({
            "state":state,
            "selectors" : this.connectors[connectorSelector]
         });
      }
      return result;
   }

}