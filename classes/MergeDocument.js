
var fs = require('fs');
var path = require('path');
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
const utils = require('../utils');

const MergeDocument = class {
    constructor(options) {

        this.Apikey = defaultClient.authentications['Apikey'];
        this.Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;
        this.apiInstance = new CloudmersiveConvertApiClient.MergeDocumentApi();

        this.index = 0;
        this.file_path = options.file_path;
        this.file_list = fs.readdirSync(this.file_path); 

        this.main_filename = "";
        this.merge_filename = "";

        this.main_data;
        this.merge_data;

        this.output_name = options.output_name;
        this.subscription = options.subscription;
        this.subscriptionactivity = options.subscriptionactivity;

        this.setup();
    }

    loadFile = (update_item, index) => {
        let file = this.file_list[index];
        this[update_item+"_filename"] = path.join(this.file_path,file);  
        this[update_item+"_data"] = Buffer.from(fs.readFileSync(this[update_item+"_filename"]).buffer); // File | First input file to perform the operation on.
        this.index++; 
    }

    setup = () => {
        this.loadFile("main",this.index)
        this.loadFile("merge",this.index)         
    }

    runMerge = () => {
        let opts = {};
        this.apiInstance.mergeDocumentDocxMulti(this.main_data, this.merge_data, opts, this.callback);
    }

    callback = (error, data, response)  => {
        if (error) {
            console.log("AN ERROR OCCURED!");
            console.error(error);
            this.subscriptionactivity.merge_complete = -1;
            this.subscriptionactivity.save();
            // res.send(error)

            utils.check_output_files.merge_running = false;
            utils.check_output_files.checkList();
        } else {

            this.main_data = data;
            if(this.index >= this.file_list.length){

                let output_fullname = path.join(this.file_path,this.output_name)+'.docx'; 
                fs.writeFile(output_fullname, data, async() => {

                    this.subscriptionactivity.merge_complete = 1;

                    console.log("MERGE COMPLETE!");

                    //SAVE THE FILE TO STORAGE
                    let filename = this.output_name+"_"+Date.now()+".docx"
                    utils.storage.saveBlob(data, filename); 
                    this.subscriptionactivity.document_saved = 1;
                    
                    //EMAIL THE REPORT OUT
                    await utils.email.email(this.subscription, this.output_name+".docx",output_fullname)
                    this.subscriptionactivity.email_sent = 1;
                    this.subscriptionactivity.save();
                    
                    //DELETE FILES AND TEMPORARY FOLDER
                    this.deleteTemp(this.file_path)  
                    
                    utils.check_output_files.merge_running = false;
                    utils.check_output_files.checkList();                    
                });                
            }
            else{
                this.loadFile("merge",this.index);
                this.runMerge();
            }
        }
    }

    deleteTemp = (output_path) => {

        if(output_path.includes('tmp')){
            console.log("Deleting temp folder: "+output_path)
            fs.rmdirSync(output_path, { recursive: true });
        }
    }    
}


module.exports = MergeDocument