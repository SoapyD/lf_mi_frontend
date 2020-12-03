const emailUtil = require('../util/email');

var fs = require('fs');
var path = require('path');
// const DocxMerger = require('docx-merger');
const DocxMerger = require('../util/docx-merger/index.js');
const tmp = require('tmp');
const Subscription = require('../models/subscription');
const Parameter = require('../models/parameter');

exports.ssrs = require('mssql-ssrs');
exports.files = [];


const username = process.env.SSRS_USER;
const password = process.env.SSRS_PASS;
var serverUrl = process.env.SSRS_URL; ///ReportServer2010
const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;
const container = process.env.STORAGE_CONTAINER;
const blob_path = '';

exports.run = async(subscriptions, report, fusions, sections, parameter_fusions, parameters) => {

    // console.log(fusions.length)
    try{

        subscriptions.forEach((subscription)=>{ //LOOP THROUGH EACH PERSCRIPTION
            
            const tmpobj = tmp.dirSync();
            
            let folder_path = tmpobj.name //'reports';//
            
            let file_data = {
                folder_path: folder_path,
                files_needed: fusions.length
            }
            
            exports.files.push(file_data);
            
            let filepath = '';
            let filename = '';
            let outputname = '';
            
            let contents_page = '';
            //make a contents page
            fusions.forEach(function (fusion){
                //get section data associated with fusion
                var section = sections.find(o => o.id === fusion.join_from_id);
                
                if (section.name !== "front"){
                    contents_page += section.name + "\n"
                }
            })
            
            //CONVERT PARAMETER STRING INTO AN OBJECT
            let parameter_object = JSON.parse(subscription.parameters);
            
            fusions.forEach((fusion) => { //LOOP THROUGH SECTION/REPORT FUSIONS
                let section = sections.find(o => o.id === fusion.join_from_id); //GET SECTION DATA FROM FUSION
                //GET PARAMETERS ASSOCIATED WITH SECTION
                let p_fusions_t = parameter_fusions.filter(o => o.join_to_id === fusion.join_from_id);
                let p_fusions;
                //IF P_FUSIONS_T ISN'T AN ARRAY, OR UNDEFINED, MAKE IT AN ARRAY
                if (Array.isArray(p_fusions_t) === false){
                    if(p_fusions_t){
                        p_fusions = [];
                        p_fusions.push(p_fusions_t)
                    }
                }else{
                    p_fusions = p_fusions_t
                }
                
                let param_string = "{"
                //LOOP P_FUSIONS IF IT'S DEFINED
                if (p_fusions){
                    p_fusions.forEach((p_fusion, index) => {
                        let parameter = parameters.find(o => o.id === p_fusion.join_from_id);
                        let value = parameter_object[parameter.name];
                        
                        if(index > 0){
                            param_string+= " , "
                        }
                        param_string += '"' + parameter.name + '" : "'+value+'"'
                    })
                }
                
                param_string += "}"
                let section_param_object = JSON.parse(param_string)
                
                if(section.name === "front"){
                    section_param_object['contents_page'] = contents_page;
                }
                
                filepath = section.path;
                filename = section.name;  
                let size = 3
                
                outputname = "000000000" + fusion.order;
                outputname = outputname.substr(outputname.length-size);

                // let output_path = folder_path+'/'+outputname;
                let output_path = path.join(folder_path,outputname);                
                
                exports.runReport(filepath, filename, section_param_object, output_path)
                
                /*
                */
            })
        })
    }
    catch(err){
        console.log(err)
    }

}

exports.runReport = async(filepath, filename, parameters, outputname) => {
    try {
        console.log("running: "+filename)
        
        const reportPath = filepath + filename;
        // Define parameters
        const fileType = 'WORD';
        const file_extension = 'docx';
        
        let report;
        
        exports.ssrs.setServerUrl(serverUrl);
        
        var auth = {
            userName: username,
            password: password,
            workstation: null, // optional
            domain: null // optional
          };
        report = await exports.ssrs.reportExecution.getReportByUrl(reportPath, fileType, parameters, auth)        

        
        // Writing to local file / or send the reponse to API 
        // await fs.writeFileSync(outputname+'.'+file_extension, report, "base64");
        /**/
    } catch (err) {
        console.log("ERROR RUNNING REPORT")
        console.error(err);
    }
}


exports.checkFiles = async() => {

    exports.files.forEach( async(item, index) => {
        var file_list = fs.readdirSync(item.folder_path);
        console.log("number of files: "+file_list.length.toString())   
        if(file_list.length >= item.files_needed){
            //create the merge document
            try{
                await exports.mergeDocument(item.folder_path, file_list, Date.now() )
                //remove from files array
                exports.files.splice(index, 1);
            }
            catch(err){
                console.log(err)
            }
        }
    })   
    setTimeout(exports.checkFiles, 10000);
}

exports.mergeDocument = async(filepath, file_list, filename) => {

    let imported_files = [];
    file_list.forEach( async(item, index) => {
        await imported_files.push(fs.readFileSync(path.join(filepath,item), 'binary'))
    })
    


    var docx = new DocxMerger({},imported_files);
    //SAVING THE DOCX FILE
    console.log("merging document")
    
    docx.save('nodebuffer',function (data) {
        fs.writeFile(path+"output.docx", data, function(err){/*...*/});

        emailUtil.email("output.docx",path+"output.docx")

        exports.saveBlob(data, filename);
    });   
    
    setTimeout(exports.checkFiles, 10000);
}


exports.saveBlob = async(content, filename) => {
     
    const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
    
    // Enter your storage account name and shared key

     
    // Use StorageSharedKeyCredential with storage account and account key
    // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);    
     
    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
    );

    const containerName = container;
     
    // async function main() {
    const containerClient = blobServiceClient.getContainerClient(containerName);
     
    // const content = "Hello world!";
    const blobName = blob_path+filename+".docx"
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    if(content !== undefined)
    {
        const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    }

}

