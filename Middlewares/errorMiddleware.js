const notFound = (req,res,next)=>{
    const error =  new Error(`NOT FOUND - ${req.originalUrl}`)
    res.status(404);

    next(error)
}

const errorHandler = (err,req,res,next)=>{
   console.log(req.body)
   let statusCode = res.statusCode === 200 ? 500 : res.statusCode
   let message = err.message 

   if(err.name ==='castError' && err.kind==='ObjectId'){
       statusCode=404;
       message = 'Resourse not found'
   }

   res.status(statusCode).json({
       message,
       stack:process.env.NODE_ENV === 'production' ? null : err.stack
   })
}

module.exports= {notFound,errorHandler}