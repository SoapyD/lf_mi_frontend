
// const routes = {};


exports.login = require("./login");
exports.login.path = '/'


exports.admin = require("./admin");
exports.admin.path = '/admin'

exports.reports = require("./reports");
exports.reports.path = '/reports'

exports.subscriptions = require("./subscriptions");
exports.subscriptions.path = "/reports/:reportid/subscriptions"

exports.client_data = require("./client_data");
exports.client_data.path = '/client_data'

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