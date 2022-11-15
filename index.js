const chooseFolderButton = document.querySelector("#chooseFolder");
const table = document.querySelector("#table");
const tbodyEl = document.querySelector("#table-body");
const infoBtnEl = document.querySelector(".info-button");
const selectedFolderEl = document.querySelector("#selectedFolder");


const formatBytes= (bytes,decimals=2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
const fileDetails = (file) => {
    const filenameArray = file.name.split('.');
    const name =  filenameArray.slice(0, -1).join('.');
    const extension =  filenameArray[filenameArray.length-1]
    return {
        name,
        extension,
        size: formatBytes(file.size),
        type: file.type,
        lastModifiedDate: file.lastModifiedDate
    }
   }
const itemEl = (i,item)=> {
    const {name,extension,size,type,lastModifiedDate} = item;
    let nameEl, extEl,sizeEl, typeEl, modifiedEl;
    nameEl = (name)?` <div class="tooltip-row"><div>File Name: </div> <div> ${name}</div></div>`:"<div></div>";
    extEl = (extension)?` <div class="tooltip-row"><div>Extension: </div> <div> ${extension}</div></div>`:"<div></div>";
    sizeEl = (size)?` <div class="tooltip-row"><div>Size: </div> <div> ${size}</div></div>`:"<div></div>";
    typeEl = (type)?` <div class="tooltip-row"><div>Type: </div> <div> ${type}</div></div>`:"<div></div>";
    modifiedEl = (lastModifiedDate)?` <div class="tooltip-row"><div>Modified: </div> <div> ${item.lastModifiedDate.toString().split('GMT')[0]}</div></div>`:"<div></div>";

    return `<div class='tbrow'>
    <div><span class="circle"><b>${i}.&nbsp;</b></span><span>${name}</span></div>
    <div>${size}</div>
    <div>
        <div class='info-button tooltip'>info
            <div class="tooltiptext"> 
                ${nameEl}
                ${extEl}
                ${sizeEl}
                ${typeEl}
                ${modifiedEl}
            </div>
        </div>
    
    </div>
</div>`

}
chooseFolderButton.onclick = async () => {
    // open folder picker
    let dirHandle
    try {
     dirHandle = await window.showDirectoryPicker();
    } catch (error) {
        console.log("No folder selected.");
        return;
    }
    
    console.log(dirHandle);
    // get value iterator
    const valueIterator = dirHandle.values();
    let fileHandle;
    let file;
    // get file handle for each file in the selected folder
    let tbodyRows='';
    let items=[];
   while(1){
    x = await valueIterator.next();
    console.log(x);
    if(x.done){
      break;
    }
    fileHandle = x.value;
    if(fileHandle.kind == 'file'){
        file = await fileHandle.getFile();
        console.log(file);
        details = fileDetails(file);
        items.push(details);
    }
    
   }
   // no files in selelected folder, return
   if(!items.length) return;
   // sort files with respect to their extension in alphabetical order
   items.sort(function(a,b){
        if(a.extension.toLowerCase() < b.extension.toLowerCase()) return -1;
        if(a.extension.toLowerCase() > b.extension.toLowerCase()) return 1;
        return 0;
   });
   // add necessary elements to DOM
   let i=0;
   for(let item of items){
    i++;
    tbodyRows+= itemEl(i,item);
   }
   selectedFolderEl.innerHTML = `Selected Folder: <b>${dirHandle.name}</b>`;
   chooseFolderButton.classList.remove("chooseFolderStart");
   chooseFolderButton.classList.add("chooseFolderButton");
   table.style.display = "block";
   tbodyEl.innerHTML = tbodyRows;

   
}
