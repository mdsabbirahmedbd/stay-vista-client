const express = require("express");
const app = express();
require("dotenv").config();
const nodemailer = require("nodemailer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 8000;
const stripe = require("stripe")(process.env.SECRET_KEY);

// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// send Email using the nodeMailer

const sendEmail = (emailAddress, emailData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASS,
    },
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const mailBody = {
    from: `"Stay Vista" ${process.env.TRANSPORTER_EMAIL}`, // sender address
    to: emailAddress, // list of receivers
    subject: emailData.subject, // Subject line
    html: emailData.message, // html body
  };

  // send mail with defined transport object
  const info = transporter.sendMail(mailBody, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: ", info.response);
    }
  });
};

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

const { MongoClient, ServerApiVersion, ObjectId, Timestamp } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gapslvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // All collecttin part
    const roomsCollection = client.db("stayvista").collection("rooms");
    const usersCollection = client.db("stayvista").collection("users");
    const bookingsCollection = client.db("stayvista").collection("bookings");

    const verifyAdmin = async (req, res, next) => {
      const user = req.user;
      const query = { email: user.email };
      const result = await usersCollection.findOne(query);

      if (!result || result?.role !== "admin") {
        return res.status(401).send({ message: "unauthorized access" });
      }
      next();
    };

    const verifyHost = async (req, res, next) => {
      const user = req.user;
      const query = { email: user?.email };
      console.log(query);
      const result = await usersCollection.findOne(query);
      if (!result || result?.role !== "host") return res.status(401).send({ message: "unauthorized access" });
      next();
    };

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    app.get("/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
        console.log("Logout successful");
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // ALL GATTING PART IN SERVERSIDE
    // get all rooms from Db
    app.get("/rooms", async (req, res) => {
      const category = req.query.category;
      let query = {};
      if (category && category !== "null") {
        query = { category };
      }
      const result = await roomsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/mylistings/:email", verifyToken, verifyHost, async (req, res) => {
      const email = req.params.email;
      const query = { "host.email": email };
      const result = await roomsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/room/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.findOne(query);
      res.send(result);
    });

    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // get all booking for user
    app.get("/myBookins/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { "guest.email": email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/manage-booking/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { "host.email": email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    // admin statics page is setup
    app.get("/admin-state", verifyToken, verifyAdmin, async (req, res) => {
      const bookingDetails = await bookingsCollection
        .find(
          {},
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray();

      const allUsers = await usersCollection.countDocuments();
      const allRooms = await roomsCollection.countDocuments();
      const totalBookings = bookingDetails.length;
      const totalPrice = bookingDetails.reduce((prev, current) => prev + current.price, 0);

      const chartData = bookingDetails.map((booking) => {
        const day = new Date(booking.date).getDate();
        const month = new Date(booking.date).getMonth() + 1;
        const date = [`${day}/${month}`, booking?.price];
        return date;
      });
      chartData.unshift(["Day", "Sales"]);

      res.send({ bookingDetails, allRooms, allUsers, totalPrice, totalBookings, chartData });
    });

    // Host statics page is setup
    app.get("/host-state", verifyToken, verifyHost, async (req, res) => {
      const { email } = req.user;
      const query = { "host.email": email };
      const bookingDetails = await bookingsCollection.find(query, { projection: { date: 1, price: 1 } }).toArray();

      const allRooms = await roomsCollection.countDocuments(query);
      const totalBookings = bookingDetails.length;
      const totalPrice = bookingDetails.reduce((prev, current) => prev + current.price, 0);

      const { Timestamp } = await usersCollection.findOne({ email }, { projection: { Timestamp: 1 } });

      const chartData = bookingDetails.map((booking) => {
        const day = new Date(booking.date).getDate();
        const month = new Date(booking.date).getMonth() + 1;
        const date = [`${day}/${month}`, booking?.price];
        return date;
      });
      chartData.unshift(["Day", "Sales"]);

      res.send({ bookingDetails, allRooms, totalPrice, totalBookings, chartData, hostSince: Timestamp });
    });

    // Guest sataics page is setup

    app.get("/guest-state", verifyToken, async (req, res) => {
      const { email } = req.user;
      const query = { "guest.email": email };
      const bookingDetails = await bookingsCollection.find(query, { projection: { date: 1, price: 1 } }).toArray();

      const totalBookings = bookingDetails.length;
      const totalPrice = bookingDetails.reduce((prev, current) => prev + current.price, 0);

      const { Timestamp } = await usersCollection.findOne({ email }, { projection: { Timestamp: 1 } });

      const chartData = bookingDetails.map((booking) => {
        const day = new Date(booking.date).getDate();
        const month = new Date(booking.date).getMonth() + 1;
        const date = [`${day}/${month}`, booking?.price];
        return date;
      });
      chartData.unshift(["Day", "Sales"]);

      res.send({ totalPrice, totalBookings, chartData, guestSince: Timestamp });
    });

    // All Posting and deleting   or put patch  data server
    // create pyment intent
    app.post("/create-payment-intent", verifyToken, async (req, res) => {
      const price = req.body.price;
      const priceSend = parseInt(price) * 100;
      if (!price || priceSend < 1) return;

      const { client_secret } = await stripe.paymentIntents.create({
        amount: priceSend,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({ ClientSecret: client_secret });
    });

    // save bookings on database
    app.post("/bookings", verifyToken, async (req, res) => {
      const bookingData = req.body;
      const result = await bookingsCollection.insertOne(bookingData);

      // Send email to customer
      sendEmail(bookingData.guest.email,{
        subject: 'Booking Successful!',
        message: `You've successfully booked a room through StayVista. Transaction Id: ${bookingData.transactionId}`,
      })

      // Send email to Hoster 
       sendEmail(bookingData.host.email,{
        subject: 'Booking Confirmation! Your room got booked',
        message: `Get ready to welcome ${bookingData.guest.name}.`,
       })


      res.send(result);
    });

    app.patch("/room/status/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { booked: status },
      };
      const updateRoom = await roomsCollection.updateOne(query, updateDoc);
      res.send(updateRoom);
    });

    // as a hoster add room your collection
    app.post("/addRoom", verifyToken, verifyHost, async (req, res) => {
      const room = req.body;
      const result = await roomsCollection.insertOne(room);
      res.send(result);
    });

    app.put("/room/update/:id", async (req, res) => {
      const id = req.params.id;
      const roomData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: roomData,
      };
      const result = await roomsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.put("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const isExist = await usersCollection.findOne(query);

      if (isExist) {
        if (user.status === "Requested") {
          const result = await usersCollection.updateOne(query, { $set: { status: user?.status } });
          return res.send(result);
        }
        return;
      }

      const option = { upsert: true };

      const updateDoc = {
        $set: {
          ...user,
          Timestamp: Date.now(),
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, option);

      res.send(result);
    });

    app.delete("/roomDelete/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/userDelete/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/bookingDelete/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/userRole/:email", async (req, res) => {
      const email = req.params.email;
      const role = req.body;
      const query = { email: email };
      const updateDoc = { $set: { ...role, Timestamp: Date.now() } };
      const result = await usersCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from StayVista Server..");
});

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`);
});
