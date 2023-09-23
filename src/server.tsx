import { renderC } from "./component";
import { loadImg } from "./components/support";

renderC('out-container', <>
  <div>
    <h2>Files upload test</h2>
    <div className="box">
      <input type="file" onChange={async ( e )=>{
        const file =  e.target.files[0];

        // Create an object of formData
        const formData = new FormData();
 
        // Update the formData object
        formData.append(
            "img",
            file,
            file.name,
        );

        console.log("Selected file:");
        console.log(file);

        await fetch("upload", {
          method: 'post',
          body: formData,
        });
        console.log("Sent");
        
        
        console.log("Get");
        console.log(await fetch("imgget"));
        console.log("---");

      }}/>
    </div>
  </div>
</>);