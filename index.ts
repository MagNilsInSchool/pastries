import express from "express";
import { createPastry, deletePastry, getPastries, updatePastry } from "./controller/pastriesController.ts";

const app = express();
const PORT = 1338;

app.use(express.json());

app.get("/pastries", getPastries);
app.post("/pastries", createPastry);
app.put("/pastries/:id", updatePastry);
app.delete("/pastries/:id", deletePastry);

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});
