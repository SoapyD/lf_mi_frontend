const cron = require('node-cron');
const moment = require('moment');
// const { subscriptions } = require('../controllers');
const databaseQueriesUtil = require('../utils/database_queries2');
const ssrsUtil = require('../utils/ssrs3');
const functionsUtil = require('../utils/functions');

const jobs = [];
const jobs_List = [];


exports.getJobs = () => {
    return jobs_List
}

exports.resetScheduler = () => {
    jobs.forEach((job) => {
        job.stop();
        delete job;
    })

    jobs.length = 0;
    jobs_List.length = 0;
}

exports.addSchedule = (options) => {

    let time_string = options.second+''+options.minute+' '+options.hour+' '+options.day_of_month+' '+options.month+' '+options.day_of_week

    let job = cron.schedule(time_string, () => {
        console.log("running schedule ",time_string," for: ",options.report.name)
        
        ssrsUtil.setup(0, options.report, options.subscription);
    })

    jobs.push(job)

    options.time_string = time_string
    jobs_List.push(options)
}

exports.updateScheduler = async() => {

    //RESET THE SCHEDULER
    exports.resetScheduler();

    //RETURN ALL REPORTS, LOOP THROUGH AND RESET SUBSCRIPTIONS
    find_list = []
    find_list.push(
    {
        model: "Report",
        search_type: "findAll",
        params: [{
            include: databaseQueriesUtil.searchType['Full Report'].include			
        }]        
    }) 
 
    let reports = await databaseQueriesUtil.findData(find_list)

    

    reports[0].forEach((report) => {

        report = functionsUtil.sortReport(report)

        if(report.subscriptions){

            report.subscriptions.forEach((subscription) => {

                if(subscription.active){

                    let y = subscription.start_date.substring(0, 4)
                    let m = parseInt(subscription.start_date.substring(5, 7))-1
                    let d = subscription.start_date.substring(8, 10)
                    let h = subscription.time.substring(0, 2)
                    let M =subscription.time.substring(3, 5)
                    let start_date = new Date(y, m, d, h, M)
                    let todays_date = moment().startOf('day').add(1,'days')._d;

                    if(start_date <= todays_date){
                        let date = start_date.getDate();
                        let day = start_date.getDay();
                        // let hour = start_date.getHours();
                        // let minute = start_date.getMinutes();
        
                        let options;
                        
                        switch(subscription.frequency.name){
                            case "Daily":
                                options = {
                                    second: "",
                                    minute: M,
                                    hour: h,
                                    day_of_month: '*', 
                                    month: '*',
                                    day_of_week: '*',
                                    report: report,
                                    subscription: subscription 
                                }
                                exports.addSchedule(options)
                                break;
                            case "Weekly":
                                options = {
                                    second: "",
                                    minute: M,
                                    hour: h,
                                    day_of_month: '*', 
                                    month: '*',
                                    day_of_week: day,
                                    report: report,
                                    subscription: subscription 
                                }                        
                                exports.addSchedule(options)                        
                                break;
                            case "Monthly":
                                options = {
                                    second: "",
                                    minute: M,
                                    hour: h,
                                    day_of_month: d, 
                                    month: '*',
                                    day_of_week: '*',
                                    report: report,
                                    subscription: subscription 
                                }                            
                                exports.addSchedule(options)                         
                                break;                                                    
                        }
        
                        // console.log("test")
                    }
    
                }
            })

        }
    })

}

