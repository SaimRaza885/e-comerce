import { DB_Connection } from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";


dotenv.config({
  path: "./.env",
});


DB_Connection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("The App is running on port ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Error has occured",error);
  });
