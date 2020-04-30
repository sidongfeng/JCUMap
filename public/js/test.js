/* TODO:  */

$(document).ready(function() {
    
    "use strict";
    function CreatXmlDoc(obj){
		this.tagName=obj.tagName;
		var children=obj.children.map(function(item){
		    if(typeof item =="object")
			{
			   item=new CreatXmlDoc(item)
			}
			return item
		})
		this.children=children;
	}
 
 
    CreatXmlDoc.prototype.render=function(){
		var el=document.createElement(this.tagName);
		var children=this.children || [];
		children.forEach(function(child){
			var childEl=(child instanceof CreatXmlDoc)
			? child.render()
			:document.createTextNode(child)
		el.appendChild(childEl);
		})
		return el
	}
 
 
    var obj={
    tagName:'Setup',
    children:[
        {
            tagName:'ProtocolList',
            children:[
                {
                    tagName:'Protocol',
                    children:[
                        {
                            tagName:'Name',
                            children:["onvif"]
                        }, 
                        {
                            tagName:'UserName',
                            children:["admin"]
                        }, 
                        {
                            tagName:'PassWord',
                            children:["admin"]
                        }, 
                        {
                            tagName:'Port',
                            children:["8000"]
                        }, 
                        {
                            tagName:'MediaPort',
                            children:["8000"]
                        }, 
                    ]
                },
                {
                    tagName:'Protocol',
                    children:[
                        {
                            tagName:'Name',
                            children:["onvif"]
                        }, 
                        {
                            tagName:'UserName',
                            children:["admin"]
                        }, 
                        {
                            tagName:'PassWord',
                            children:["admin"]
                        }, 
                        {
                            tagName:'Port',
                            children:["8000"]
                        }, 
                        {
                            tagName:'MediaPort',
                            children:["8000"]
                        }, 
                    ]
                },
                {
                    tagName:'Protocol',
                    children:[
                        {
                            tagName:'Name',
                            children:["onvif"]
                        }, 
                        {
                            tagName:'UserName',
                            children:["admin"]
                        }, 
                        {
                            tagName:'PassWord',
                            children:["admin"]
                        }, 
                        {
                            tagName:'Port',
                            children:["8000"]
                        }, 
                        {
                            tagName:'MediaPort',
                            children:["8000"]
                        }, 
                    ]
                },              
            ]
        },
        {
            tagName:'Function',
            children:[
                {
                    tagName:'PlayBack',
                    children:["onvif"]             
                },
                {
                    tagName:'Other',
                    children:["rtsp"] 
                }
            ]
         }
     ]
  }
 
 
   var doc=new CreatXmlDoc(obj);
   var SetupSerial=(new XMLSerializer()).serializeToString(doc.render());
   var reg = new RegExp(' xmlns="http://www.w3.org/1999/xhtml"',"g");
   SetupSerial=SetupSerial.replace(reg,"");
   console.log(SetupSerial);
});