const mongoose = require('mongoose');

mongoose.connect(process.env.url,{
    // useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
}).then(()=>{
    console.log("connection Successfully");
}).catch((e)=>{
    console.log("connection error");
    // console.log(e);
})
