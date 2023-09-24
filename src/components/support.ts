export async function getJson( url: string ) {
  return fetch(url).then(res=>{ return res.json(); });
} /* End of 'getJson' function */ 

export function queryToStr( obj: any ): string {
  var queryStr = "";

  Object.keys(obj).map(( name, i )=>{
    if (obj[name] != undefined)
      queryStr += (i != 0 ? '&' : '') + name + '=' + obj[name];
  });

  return queryStr;
} /* End of 'queryToStr' function */


export function loadImg( fileName: string ): Promise<HTMLImageElement> {
  var img = new Image();
  img.src = "./bin/imgs/" + fileName;
  return new Promise( async (resolve) => {
    img.onload = ()=>{ resolve(img); };
  });
} /* loadImg */

export function getQuery(): any {
  const urlParams = new URLSearchParams(window.location.search);
  var out = {};
  urlParams.forEach((value, name)=>{
    out = {
      ...out,
      [name]: value,
    }
  });

  return out;
}