
const sequelize_db_handler = class {
	constructor(options) {
        
        this.sequelize = {};
        this.searchType = {};
        this.sequelize = this.connect();
    }

    connect = () => {
        const { connect } = require("mssql");
        const Sequelize = require("sequelize");
        
        return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
            host: process.env.DB_SERVER,
            dialect: process.env.DB_TYPE,
            pool: {
              max: 100,
              min: 0,
              idle: 10000,
              idleTimeoutMillis: 60000
            },
            dialectOptions: {
              // encrypt: true
              options: { 
                encrypt: true,
                useUTC: true,
                connectTimeout: 60000,
                // "requestTimeout": 300000 
                decimalNumbers: true,
              }
            },
            // The retry config if Deadlock Happened
            retry: {
              match: [/Deadlock/i],
              max: 3, // Maximum rety 3 times
              backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
              backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
            },
        
            logging: false,
            
        })
        // .sync()
        // .then(result => {
        //   if(process.env._PROCESS_TYPE === 'Dev'){
        //   }
        // })
        // .catch(err => {
        //   console.log(err)
        // });        
    }

    sync = () => {
        this.sequelize
        .sync()
        .then(result => {
          if(process.env._PROCESS_TYPE === 'Dev'){
          }
        })
        .catch(err => {
          console.log(err)
        });         
    }

    loadModels = () => {
        this.models = require("../models");     
        this.setSearchTypes();   
    }

    runQuery = async(query) => {
        const sql = require('mssql')

        // sql.connect() will return the existing global pool if it exists or create a new one if it doesn't
        return sql.connect({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            server: process.env.DB_SERVER, // You can use 'localhost\\instance' to connect to named instance
            database: process.env.QUERY_DB_NAME,            
        }).then((pool) => {
            return pool.query(query)
        })
    }

    setSearchTypes = () => {

        this.searchType = {
    
            "Full Report": {
                include: [
                    {
                        model: this.models.Section, 
                        as: "sections",
                        include: [
                            {
                                model: this.models.SubSection, 
                                as: "subsections",
                                through: {
                                    model: this.models.SectionSubSection,
                                    as: "sectionsubsections"
                                },
                                include: [
                                    {
                                        model: this.models.Parameter, 
                                        as: "parameters",
                                        through: {
                                            model: this.models.SubSectionParameter,
                                            as: "subsectionparameters"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: this.models.Subscription, 
                        as: "subscriptions",             
                        include: [
                            {
                                model: this.models.Frequency, 
                                as: "frequency"
                            },
                            {
                                model: this.models.SubscriptionActivity, 
                                as: "subscriptionactivities",
                                limit: 1,
                                order: [["createdAt", "DESC"]]
                            }                    
                        ]
                    }, 
                ]        
            },
            "SubSection": {
                include: [
                    {
                        model: this.models.Parameter, 
                        as: "parameters",
                        through: {
                            model: this.models.SubSectionParameter,
                            as: "subsectionparameters"
                        }
                    }
                ]        
            },
            "OrgUnit": {
                include: [
                    {
                        model: this.models.Dimension_Ownerteam, 
                        as: "ownerteams",
                    },
                    {
                        model: this.models.Dimension_Orgunit_Contract, 
                        as: "contracts",
                    },
                    {
                        model: this.models.DIMENSION_Measurement_Org_Measurements, 
                        as: "measurements",
        
                        include: [
                            {
                                model: this.models.DIMENSION_Measurement_Definitions, 
                                as: "definition",
                            },           
                        ]                  
                    }             
                ]  
            },
            "PeopleHR_Employee": {
                include: [
                    {
                        model: this.models.Dimension_Agentlink, 
                        as: "agentlinks",
                    },           
                ]  
            }
        }
    }
    
    
    //USE THE BELOW IF YOU WANT TO FILTER ANY INCLUDES, NEED TO SAY "REQUIRED = FALSE" TO MAKE IT A LEFT OUTER JOIN
    // where: {
    //     dim_measurement_org_measurements_active: 1
    // },
    // required: false,
    
    
    
    //  #####  ######  #######    #    ####### #######       ######  #######  #####  ####### ######  ######  
    // #     # #     # #         # #      #    #             #     # #       #     # #     # #     # #     # 
    // #       #     # #        #   #     #    #             #     # #       #       #     # #     # #     # 
    // #       ######  #####   #     #    #    #####   ##### ######  #####   #       #     # ######  #     # 
    // #       #   #   #       #######    #    #             #   #   #       #       #     # #   #   #     # 
    // #     # #    #  #       #     #    #    #             #    #  #       #     # #     # #    #  #     # 
    //  #####  #     # ####### #     #    #    #######       #     # #######  #####  ####### #     # ######  
    
    createData = async(creation_list, search_type="findOrCreate") => {
    
        let promises = [];
    
        creation_list.forEach((list) => {
            list.params.forEach((item) => {
                promises.push(this.models[list.model][search_type](item))
            })
        })
    
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })  
    }
    
    createData2 = async(creation_list) => {
        
        //check records are there
        let checks = await checkRecordsNull(creation_list)
        let created = await createRecord(creation_list, checks)
        return created
    }
    
    createRecord = async(creation_list, checks) => {
        let promises = [];
    
        let i = 0;
        creation_list.forEach( async(list) => {
            list.params.forEach( async(item) => {
        
                //IF ITEM DOESN'T EXIST, CREATE IT            
                promises.push(this.models[list.model].create(item))
                i++;
            })
        })
    
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })  
    }
    
    //  #####  #     # #######  #####  #    #       ######  #######  #####  ####### ######  ######   #####        #     # #     # #       #       
    // #     # #     # #       #     # #   #        #     # #       #     # #     # #     # #     # #     #       ##    # #     # #       #       
    // #       #     # #       #       #  #         #     # #       #       #     # #     # #     # #             # #   # #     # #       #       
    // #       ####### #####   #       ###    ##### ######  #####   #       #     # ######  #     #  #####  ##### #  #  # #     # #       #       
    // #       #     # #       #       #  #         #   #   #       #       #     # #   #   #     #       #       #   # # #     # #       #       
    // #     # #     # #       #     # #   #        #    #  #       #     # #     # #    #  #     # #     #       #    ## #     # #       #       
    //  #####  #     # #######  #####  #    #       #     # #######  #####  ####### #     # ######   #####        #     #  #####  ####### ####### 
                                                                                                                                               
    
    checkRecordsNull = async(creation_list) => {
    
        let promises = [];
    
        creation_list.forEach( async(list) => {
            list.params.forEach( async(item) => {
    
                let findlist = []
    
                let search_criteria = {
                    model: list.model,
                    search_type: "findOne",
                    params: [
                        {
                            where: item
                        }
                    ]
                }     
                findlist.push(search_criteria)       
    
                promises.push(findData(findlist))
            })
        })
    
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })       
    }
    
    
    // ####### ### #     # ######        ######     #    #######    #    
    // #        #  ##    # #     #       #     #   # #      #      # #   
    // #        #  # #   # #     #       #     #  #   #     #     #   #  
    // #####    #  #  #  # #     # ##### #     # #     #    #    #     # 
    // #        #  #   # # #     #       #     # #######    #    ####### 
    // #        #  #    ## #     #       #     # #     #    #    #     # 
    // #       ### #     # ######        ######  #     #    #    #     # 
    
    findData = async(find_list) => {
    
        let promises = [];
    
        find_list.forEach((list) => {
    
            if (list.params)
            {
                list.params.forEach((item) => {
                    promises.push(this.models[list.model][list.search_type](item))
                })
            }
            else{
                promises.push(this.models[list.model][list.search_type]())
            }
        })
    
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })    
    }
    
    
    // ######  #     # #     #       ######  ######         #####  #     # ####### ######  ### #######  #####  
    // #     # #     # ##    #       #     # #     #       #     # #     # #       #     #  #  #       #     # 
    // #     # #     # # #   #       #     # #     #       #     # #     # #       #     #  #  #       #       
    // ######  #     # #  #  # ##### #     # ######  ##### #     # #     # #####   ######   #  #####    #####  
    // #   #   #     # #   # #       #     # #     #       #   # # #     # #       #   #    #  #             # 
    // #    #  #     # #    ##       #     # #     #       #    #  #     # #       #    #   #  #       #     # 
    // #     #  #####  #     #       ######  ######         #### #  #####  ####### #     # ### #######  #####  
    
    runDBQueries = async(query_array) => {
    
        let promises = [];
    
        query_array.forEach((item) => {
            if(item.query && item.query !== ""){
                promises.push(this.runQuery(item.query))    
            }
            else{
                promises.push([])
            }
        })
    
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    
    }
    
    
    // #     # ######  ######     #    ####### #######       ######     #    #######    #    
    // #     # #     # #     #   # #      #    #             #     #   # #      #      # #   
    // #     # #     # #     #  #   #     #    #             #     #  #   #     #     #   #  
    // #     # ######  #     # #     #    #    #####   ##### #     # #     #    #    #     # 
    // #     # #       #     # #######    #    #             #     # #######    #    ####### 
    // #     # #       #     # #     #    #    #             #     # #     #    #    #     # 
    //  #####  #       ######  #     #    #    #######       ######  #     #    #    #     # 
    
    updateData = async(item, update_list) => {
    
        let promises = [];
    
        update_list.forEach((list) => {
    
            list.params.forEach((param_item) => {
                for(const key in param_item){
                    item[key] = param_item[key]
                }
            })
            promises.push(item.save())
        })  
        
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }
    
    
    updateWhere = async(list) => {
    
        let promises = [];
    
        list.forEach((item) => {
    
            item.params.forEach((param) => {
                promises.push(this.models[item.model].update(param.update_info,param.where_info))
    
            })
            
        })  
        
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }
    
    
    
    // ######  #######  #####  ####### ######  ####### #     #       ######     #    #######    #    
    // #     # #       #     #    #    #     # #     #  #   #        #     #   # #      #      # #   
    // #     # #       #          #    #     # #     #   # #         #     #  #   #     #     #   #  
    // #     # #####    #####     #    ######  #     #    #    ##### #     # #     #    #    #     # 
    // #     # #             #    #    #   #   #     #    #          #     # #######    #    ####### 
    // #     # #       #     #    #    #    #  #     #    #          #     # #     #    #    #     # 
    // ######  #######  #####     #    #     # #######    #          ######  #     #    #    #     # 
    
    destroyData = async(destroy_list) => {
    
        let promises = [];
    
        destroy_list.forEach((list) => {
    
            list.params.forEach((item) => {
                promises.push(this.models[list.model].destroy(item))
            })
        })  
    
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }


}


module.exports = sequelize_db_handler