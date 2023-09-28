export async function uploadFile( file: File, path: string, name: string ) {
  const formData = new FormData();

  formData.append(
      "file",
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


