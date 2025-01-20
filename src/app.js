import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.get("/", (req, res, next) => {
    return res.json({
      code: 200,
      message: "Server is Up"
    })
  })

//routes import 
import appRouter from './routes/front/index.js'
import adminRouter from './routes/admin/index.js'


//routes declaration
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/', appRouter)


export {app}