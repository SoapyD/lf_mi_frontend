
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

        this.retries = 0;
        this.total_reruns = 0;
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

    loadFile = (update_item) => {
        let file = this.file_list[this.index];

        //SET DYNAMIC VARIABLES, WHICH ARE EITHER THE MAIN FILE (WHATS BEING MERGED TO) AND THE MERGE FILE (WHICH IS BEING MERGED WITH THE MAIN FILE)
        this[update_item+"_filename"] = path.join(this.file_path,file);  
        this[update_item+"_data"] = Buffer.from(fs.readFileSync(this[update_item+"_filename"]).buffer); // File | First input file to perform the operation on.
        this.index++; 
    }

    setup = () => {
        this.loadFile("main") //THE FIRST FILE IS THE FILELIST BECOMES THE MAIN FILE AND IS ONLY SET DURING SETUP
        this.loadFile("merge") //THE MERGE FILE IS SET AFTER EACH SUCESSFUL CALL OF THE API IS RUN
    }

    runMerge = async() => {
        let opts = {};
        // console.log("MERGING:"+Date.now())
        // await utils.functions.delay(1000) //WAIT ONE SECOND BEFORE SENDING NEXT FILE TO MERGE
        this.apiInstance.mergeDocumentDocxMulti(this.main_data, this.merge_data, opts, this.callback);
    }

    callback = async(error, data, response)  => {

        //ERROR OUT IF THE MERGE DIDN'T OCCUR
        if (error) {
            // console.log("AN ERROR OCCURED!");
            // console.error(error);

            //fail over if we hit the retry limit
            if(this.retries >= 3){
                this.subscriptionactivity.merge_reruns = this.total_reruns;
                this.subscriptionactivity.merge_complete = -1;
                this.subscriptionactivity.save();
                // res.send(error)
    
                utils.check_output_files.merge_running = false;
                utils.check_output_files.checkList();
            }else{
                //try again if we still have retries
                this.retries++;
                this.total_reruns++;

                this.subscriptionactivity.merge_reruns = this.total_reruns;
                this.subscriptionactivity.save();

                await utils.functions.delay(1000) //WAIT ONE SECOND BEFORE SENDING NEXT FILE TO MERGE
                this.runMerge();
            }
        } else {

            this.main_data = data;

            //FINALISE THE MERGE IF THERE'S NO MORE FILES TO MERGE
            if(this.index >= this.file_list.length){

                let output_fullname = path.join(this.file_path,this.output_name)+'.docx'; 
                fs.writeFile(output_fullname, data, async() => {

                    this.subscriptionactivity.merge_reruns = this.total_reruns;                    
                    this.subscriptionactivity.merge_complete = 1;
                    this.subscriptionactivity.files_merged = this.index;

                    // console.log("MERGE COMPLETE!");

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

                this.subscriptionactivity.files_merged = this.index;
                this.subscriptionactivity.save();

                //ELSE CONTINUE MERGING DOCUMENTS
                this.retries = 0; //reset retries 
                this.loadFile("merge");
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