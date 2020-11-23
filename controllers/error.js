exports.get404 = (req, res, next) => {
    res.send("404 error")
    // res.status(404).render('404', { pageTitle: 'Page Not Found', path:'/404' });
}