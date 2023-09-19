import { Request, Response } from "express";
import Flag from "./Flag.schema";

const createFlag = async (req: Request, res: Response) => {
  try {
    // Extract flag data from the request body
    const { userId, flagType, description } = req.body;

    // Create a new flag document using mongoose model
    const flag = new Flag({
      userId,
      flagType,
      description,
    });

    // Save the flag to the database
    await flag.save();

    // Return the newly created flag as the response
    res.status(201).json(flag);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const FlagController = {
  createFlag,
};

export default FlagController;
