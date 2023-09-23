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



export async function uploadFile( file: File, path: string, name: string ) {
  const formData = new FormData();

  formData.append(
      "img",
      file,
      name,
  );

  console.log("Upload file " + path + name);
  console.log(file);

  return fetch(`upload?path=${path}`, {
    method: 'post',
    body: formData,
  });
}