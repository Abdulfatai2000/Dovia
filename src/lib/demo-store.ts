export const DEMO_CHANGED = "dovia-demo-changed";
export const DEMO_RESET = "dovia-demo-reset";
export function notifyDemoChange() { if (typeof window !== "undefined") window.dispatchEvent(new Event(DEMO_CHANGED)); }
export function readDemo<T>(key:string, fallback:T, validate:(value:unknown)=>value is T):T {
  if(typeof window==="undefined")return fallback;
  try {const raw=localStorage.getItem(key);if(!raw)return fallback;const envelope:unknown=JSON.parse(raw);
    if(!envelope||typeof envelope!=="object"||!("version" in envelope)||envelope.version!==1||!("data" in envelope)||!validate(envelope.data))throw new Error();
    return envelope.data;
  }catch{throw new Error("Unable to restore Dovia demo preferences. Reset demo data in Settings if needed.");}
}
export function writeDemo<T>(key:string,data:T){
  try{localStorage.setItem(key,JSON.stringify({version:1,data}));}catch{throw new Error("Unable to save in this browser. Your changes have not been persisted.");}
  notifyDemoChange();
}
export function resetDemoData(){
  try{const keys=Object.keys(localStorage).filter(key=>key.startsWith("dovia_demo_"));keys.forEach(key=>localStorage.removeItem(key));}
  catch{throw new Error("Some demo data could not be cleared. Check browser storage access and try again.");}
  window.dispatchEvent(new Event(DEMO_RESET));notifyDemoChange();
}
export const isRecord=(value:unknown):value is Record<string,unknown>=>Boolean(value)&&typeof value==="object"&&!Array.isArray(value);
