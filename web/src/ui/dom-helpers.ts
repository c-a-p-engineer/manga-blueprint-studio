export function byId<T extends HTMLElement>(id:string):T|null{
  return document.getElementById(id) as T|null;
}

export function currentLanguage():'ja'|'en'{
  const value=byId<HTMLSelectElement>('languageSelect')?.value||document.documentElement.lang||'ja';
  return value.toLowerCase().startsWith('en')?'en':'ja';
}

export function copy(ja:string,en:string):string{
  return currentLanguage()==='en'?en:ja;
}

export function setTextIfChanged(node:Element|null,value:string):void{
  if(node&&node.textContent!==value)node.textContent=value;
}

export function moveNodeInto(host:HTMLElement,node:Element|null):void{
  if(node&&node.parentElement!==host)host.appendChild(node);
}
