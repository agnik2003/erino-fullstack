const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  deleteAllLeads,
} = require("../controllers/leadController");

// Register BULK DELETE first!
router.delete("/", protect, deleteAllLeads);

router.post("/", protect, createLead);
router.get("/", protect, getLeads);
router.get("/:id", protect, getLead);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

module.exports = router;
