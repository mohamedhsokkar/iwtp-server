import express from "express";
import { check, validationResult } from "express-validator";
import Issue from "../db/models/Issue.js";
import { validateAccessToken } from "./utils/index.js";
import { requirePermission } from "./utils/roles.js";

const router = express.Router();

router.post(
  "/",
  validateAccessToken,
  requirePermission("issues.create"),
  check("description", "Description is required").trim().notEmpty(),
  check("dateOfOccurance", "Occurrence date is required and must be a valid date").isISO8601(),
  check("location", "Location is invalid").isIn(["Mashroat", "CTE", "Bamag1", "Bamag2"]),
  check("status", "Status is invalid").optional().isIn(["open", "in_progress", "closed"]),
  check("dateOfFix", "Fix date must be a valid date").optional({ values: "falsy" }).isISO8601(),
  check("status").custom((value, { req }) => {
    if (value === "closed" && !req.body.dateOfFix) {
      throw new Error("Fix date is required when status is closed");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const issue = new Issue({
        description: req.body.description,
        dateOfOccurance: req.body.dateOfOccurance,
        user: req.user.id,
        location: req.body.location,
        status: req.body.status ?? "open",
        dateOfFix: req.body.dateOfFix
      });

      await issue.save();
      return res.status(201).json(issue);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: err.message });
    }
  }
);

router.get("/", validateAccessToken, requirePermission("issues.view"), async (req, res) => {
  try {
    const issues = await Issue.find().sort({ dateOfCreation: -1 });
    return res.json(issues);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", validateAccessToken, requirePermission("issues.view"), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ msg: "Issue not found" });
    }

    return res.json(issue);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: err.message });
  }
});

router.put(
  "/:id",
  validateAccessToken,
  requirePermission("issues.update"),
  check("description", "Description is required").optional().trim().notEmpty(),
  check("dateOfOccurance", "Occurrence date must be a valid date").optional().isISO8601(),
  check("location", "Location is invalid").optional().isIn(["Mashroat", "CTE", "Bamag1", "Bamag2"]),
  check("status", "Status is invalid").optional().isIn(["open", "in_progress", "closed"]),
  check("dateOfFix", "Fix date must be a valid date").optional({ values: "falsy" }).isISO8601(),
  check("status").custom((value, { req }) => {
    if (value === "closed" && !req.body.dateOfFix) {
      throw new Error("Fix date is required when status is closed");
    }
    return true;
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.dateOfOccurance !== undefined) updates.dateOfOccurance = req.body.dateOfOccurance;
    if (req.body.location !== undefined) updates.location = req.body.location;
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.dateOfFix !== undefined) updates.dateOfFix = req.body.dateOfFix;

    try {
      const issue = await Issue.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });

      if (!issue) {
        return res.status(404).json({ msg: "Issue not found" });
      }

      return res.json(issue);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: err.message });
    }
  }
);

router.delete("/:id", validateAccessToken, requirePermission("issues.delete"), async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({ msg: "Issue not found" });
    }

    return res.json({ msg: "Issue deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: err.message });
  }
});

export default router;
