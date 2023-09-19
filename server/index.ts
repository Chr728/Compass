import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
