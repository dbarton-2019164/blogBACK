const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require("xss-clean");
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const http = require('http');
const { Server } = require("socket.io");
const errorHandler = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');
const postRoute = require('./routes/postRoute');

// Database connection
const dbConnection = async () => {
  try {
    mongoose.connection.on("open", () => {
      console.log("MongoDB | connected to database");
    });
    await mongoose.connect(process.env.URI_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    });
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

dbConnection();


const server = http.createServer(app);
const io = new Server(server);


app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
  limit: "5mb",
  extended: true
}));
app.use(cookieParser());
app.use(cors());
app.use(mongoSanitize());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"]
    }
  })
)
app.use(xss());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter);
app.use(hpp());

app.use('/blog/v1/users', authRoutes);
app.use('/blog/v1/post', postRoute);

__dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}


app.use(errorHandler);


const port = process.env.PORT;

io.on('connection', (socket) => {
  socket.on('comment', (msg) => {
    io.emit("new-comment", msg);
  })
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
