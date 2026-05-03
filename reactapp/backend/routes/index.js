module.exports = app => {
    require('./auth.routes')(app);
    require('./project.routes')(app);
    require('./ticket.routes')(app);
}