import type { Request, Response } from "express";
import { type Pastries, type Pastry, type PastryInput, pastryInputSchema } from "../models/pastriesSchema.ts";
import { CustomError, handleError } from "../utils/errorHandler.ts";

let pastries: Pastries = [
    { id: 1, name: "Kanelbulle", description: "King of pastries.", allergens: ["gluten", "dairy"] },
    { id: 2, name: "Mazarine", description: "It's good.", allergens: ["nuts", "gluten"] },
];

export const getPastries = (req: Request, res: Response) => {
    try {
        if (pastries.length === 0) throw new CustomError("All out of pastries. Maybe add something?", 404);
        res.status(200).send(pastries);
    } catch (error) {
        handleError(error, res);
    }
};

export const createPastry = (req: Request<{}, {}, PastryInput>, res: Response) => {
    try {
        const body = req.body;
        if (!body) throw new CustomError("New pastry needs to be included as JSON in the body.", 400);

        const validatedPastryInput = pastryInputSchema.safeParse(body);
        if (!validatedPastryInput.success) throw validatedPastryInput.error;

        const newPastry: Pastry = {
            id: pastries[pastries.length - 1].id + 1,
            ...validatedPastryInput.data,
        };

        pastries.push(newPastry);
        res.status(201).send({
            message: `Successfully added ${newPastry.name} to your pastries.`,
            data: newPastry,
        });
    } catch (error) {
        handleError(error, res);
    }
};

export const updatePastry = (req: Request<{ id: string }, {}, PastryInput>, res: Response) => {
    try {
        const id = Number(req.params.id);
        const pastry = pastries.find((pastry) => pastry.id === id);

        if (!pastry) throw new CustomError(`Pastry with id: ${id} not found.`, 404);

        const validatedUpdate = pastryInputSchema.safeParse(req.body);

        if (!validatedUpdate.success) throw validatedUpdate.error;

        Object.assign(pastry, validatedUpdate.data); //* Används för att mosa ihop ett eller fler object till ett annat. -> Object.assign(target, source1,source2...) <-

        res.status(200).send({ message: `Pastry with id: ${id} updated successfully!`, data: pastry });
    } catch (error) {
        handleError(error, res);
    }
};

export const deletePastry = (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = Number(req.params.id);
        const pastryToDelete = pastries.find((pastry) => pastry.id === id);

        if (!pastryToDelete) throw new CustomError(`Pastry with id: ${id} not found.`, 404);

        pastries = pastries.filter((pastry) => pastry.id !== id);

        res.status(200).send({ message: `Pastry with id: ${id} deleted successfully!`, data: pastryToDelete });
    } catch (error) {
        handleError(error, res);
    }
};
