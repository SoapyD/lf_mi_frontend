
// const routes = {};


exports.login = require("./login");
exports.login.path = '/'


exports.admin = require("./admin");
exports.admin.path = '/admin'

exports.reports = require("./reports");
exports.reports.path = '/reports'

exports.subscriptions = require("./subscriptions");
exports.subscriptions.path = "/reports/:reportid/subscriptions"


exports.orgunit_slas = require("./orgunit_slas");
exports.orgunit_slas.path = '/orgunit_slas'

exports.orgunit_data = require("./orgunit_data");
exports.orgunit_data.path = '/orgunit_data'

exports.usernames = require("./usernames");
exports.usernames.path = '/usernames'

exports.tests = require("./tests");
exports.tests.path = '/tests'


// module.exports = routes



// app.use(IndexRoutes);
// app.use("/test",TestRoutes);
// app.use("/admin",AdminRoutes);
// app.use("/reports",ReportsRoutes);
// app.use("/reports/:reportid/subscriptions",SubscriptionsRoutes);