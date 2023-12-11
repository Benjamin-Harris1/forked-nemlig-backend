import { createPriceMatchPriceInDB } from "./pricematchModel";

async function createPriceMatchPrice(req, res){
    try {
      const updatedProducts = await createPriceMatchPriceInDB();
      res.json({ msg: `Pricematch prices create!`, updatedProducts: updatedProducts});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to create pricematch prices!" });
    }
  }
  
  export default createPriceMatchPrice;