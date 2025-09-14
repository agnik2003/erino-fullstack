const Lead = require("../models/Lead");

// @desc Create a new lead
// @route POST /api/leads
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all leads with pagination & filters
// @route GET /api/leads
const getLeads = async (req, res) => {
  try {
    let { page = 1, limit = 20, ...filters } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    limit = Math.min(limit, 100);

    const query = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      switch (key) {
        // String filters
        case "email":
        case "company":
        case "city":
          if (value.includes("*")) {
            query[key] = { $regex: value.replace(/\*/g, ".*"), $options: "i" };
          } else {
            query[key] = value;
          }
          break;

        // Enum filters
        case "status":
        case "source":
          if (value.includes(",")) {
            query[key] = { $in: value.split(",") };
          } else {
            query[key] = value;
          }
          break;

        // Number filters
        case "score":
        case "lead_value":
          if (value.includes("-")) {
            const [min, max] = value.split("-");
            query[key] = { $gte: Number(min), $lte: Number(max) };
          } else if (value.startsWith(">")) {
            query[key] = { $gt: Number(value.slice(1)) };
          } else if (value.startsWith("<")) {
            query[key] = { $lt: Number(value.slice(1)) };
          } else {
            query[key] = Number(value);
          }
          break;

        // Date filters
        case "created_at":
        case "last_activity_at":
          if (value.includes(",")) {
            const [from, to] = value.split(",");
            query[key] = { $gte: new Date(from), $lte: new Date(to) };
          } else if (value.startsWith(">")) {
            query[key] = { $gt: new Date(value.slice(1)) };
          } else if (value.startsWith("<")) {
            query[key] = { $lt: new Date(value.slice(1)) };
          } else {
            query[key] = new Date(value);
          }
          break;

        // Boolean filters
        case "is_qualified":
          query[key] = value === "true";
          break;
      }
    });

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single lead
// @route GET /api/leads/:id
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update lead
// @route PUT /api/leads/:id
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete lead
// @route DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete all leads
// @route DELETE /api/leads
const deleteAllLeads = async (req, res) => {
  try {
    await Lead.deleteMany({});
    res.json({ message: "All leads deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  deleteAllLeads,
};
