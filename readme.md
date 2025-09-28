# Swedish Pastries Bakery Management System

## Description

This project manages the menu for a bakery specializing in Swedish pastries.

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/MagNilsInSchool/pastries
    cd pastries
    ```
2. **Install dependencies:**
    ```sh
    npm install
    ```
3. **Run the development server:**
    ```sh
    npm run dev
    ```

## API:

### GET `http://localhost:1338/pastries`

Making a GET to url will list all available pastries.

---

### POST `http://localhost:1338/pastries`

Making a POST to url will attempt to add a new pastry.

Json required in request body ex:

```json
{
    "name": "beans",
    "description": "I can't believe it's not butter.",
    "price": 99
}
```

Allergens can be included as an optional array of values.

Only these values are accepted: nuts, gluten, dairy, soy, eggs.

ex:

```json
{
    "name": "beans",
    "description": "I can't believe it's not butter.",
    "price": 99,
    "allergens": ["gluten"]
}
```

---

### PUT `http://localhost:1338/pastries/:id`

Making a PUT to url will attempt to modify a new pastry.

:id refers to the id of the pastry you want to modify.

Json required in request body for the property you want to change ex:

```json
{
    "name": "Semla"
}
```

At least one property of name, description, price and allergens is required.

---

### DELETE `http://localhost:1338/pastries/:id`

Making a DELETE to url will attempt to delete a pastry.

:id refers to the id of the pastry you want to delete.

## Zod Schema Explanation

Validation is done to ensure that the system does not crash due to unexpected data and to prevent malicious code.

-   `pastryInputSchema`: Validates the user input of pastry objects. Since ID is not something coming from the user it is excluded. Only name, description, price and allergens are allowed.
-   `pastryUpdateSchema`: Partial makes every key of pastryInputSchema optional but refine makes sure at least one field is supplied in the request body. Only keys defined in pastryInputSchema is allowed and if a key is supplied it still needs to validate in accordance to pastryInputSchema.
-   `pastrySchema`: Includes id.
-   `pastriesSchema`: Is an array of pastries.

Types are inferred from the schemas.

```typescript
export const pastryInputSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: "Pastry name needs to be at least 2 characters long." })
            .max(20, { message: "Pastry name can't exceed 20 characters." }),
        description: z
            .string()
            .min(10, { message: "Pastry description needs to be at least 10 characters long." })
            .max(100, { message: "Pastry name can't exceed 100 characters." }),
        price: z.number().positive({ message: "Pastry price needs to be a positive number." }),
        allergens: z
            .array(
                z.union([
                    z.literal("nuts"),
                    z.literal("gluten"),
                    z.literal("dairy"),
                    z.literal("soy"),
                    z.literal("eggs"),
                ])
            )
            .optional(),
    })
    .strict();

export const pastryUpdateSchema = pastryInputSchema
    .partial()
    .refine((obj) => Object.keys(obj).length > 0, {
        message: "At least one field must be provided for update",
    })
    .strict();

export const pastrySchema = pastryInputSchema.extend({
    id: z.number().min(1).positive(),
});

export const pastriesSchema = z.array(pastrySchema);
```
