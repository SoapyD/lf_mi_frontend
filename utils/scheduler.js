const cron = require('node-cron');
// const { subscriptions } = require('../controllers');
const databaseQueriesUtil = require('../utils/database_queries2');
const ssrsUtil = require('../utils/ssrs3');

exports.addSchedule = (options) => {

    let time_string = options.second+''+options.minute+' '+options.hour+' '+options.day_of_month+' '+options.month+' '+options.day_of_week

    console.log(new Date().toLocaleString())

    cron.schedule(time_string, () => {
        console.log("running schedule ",time_string," for: ",options.report.name)
        ssrsUtil.run(0, options.report, options.subscription);
    })
}

exports.updateScheduler = async() => {

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
        if(report.subscriptions){

            report.subscriptions.forEach((subscription) => {

                let info = subscription

                let y = subscription.start_date.substring(0, 4)
                let m = parseInt(subscription.start_date.substring(5, 7))-1
                let d = subscription.start_date.substring(8, 10)
                let h = subscription.time.substring(0, 2)
                let M =subscription.time.substring(3, 5)
                let start_date = new Date(y, m, d, h, M)
                

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
                            day_of_month: '*', 
                            month: m,
                            day_of_week: '*',
                            report: report,
                            subscription: subscription 
                        }                            
                        exports.addSchedule(options)                         
                        break;                                                    
                }

                // console.log("test")

            })

        }
    })

    // console.log("test")

}

