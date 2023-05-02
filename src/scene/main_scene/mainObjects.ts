import { ObjectGame } from "../../globals";

function callAll(item: ObjectGame | ObjectGame[], funcname:string){
    if(Array.isArray(item)){
        item.forEach((i)=>{callAll(i, funcname)})
    }else{
        if(typeof item[funcname] === 'function'){
            item[funcname]();
        }
    }
}

export let mainObjects:{
    preloadAll: ()=>void,
    createAll: ()=>void,
    updateAll: ()=>void,
    [index:string]:(ObjectGame|ObjectGame[])
} = {
    preloadAll: ()=>{
        for(let prop in mainObjects){
            callAll(mainObjects[prop], 'preload');
        }
    },
    createAll: ()=>{
        for(let prop in mainObjects){
            callAll(mainObjects[prop], 'create');
        }
    },
    updateAll: ()=>{
        for(let prop in mainObjects){
            callAll(mainObjects[prop], 'update');
        }
    }
};

