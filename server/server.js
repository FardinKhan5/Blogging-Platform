const {app,port} = require('./app.js')

app.listen(port,()=>{
    console.log(`Server is running at: http://localhost:${port}/`)
})