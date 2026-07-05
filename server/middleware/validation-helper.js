import { body } from "express-validator";

const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is empty!")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Username cannot be more than 20 characters."),
  body("password")
    .notEmpty()
    .withMessage("Password is empty!")
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage(
      "Passwords cannot be more than 30 characters or less than 8 characters.",
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Password is empty!")
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage(
      "Passwords cannot be more than 30 characters or less than 8 characters.",
    ),
];

const newStoryValidation = [
  body("story_title").notEmpty().withMessage("Title is empty!").trim(),
];

export { registerValidation, newStoryValidation };
