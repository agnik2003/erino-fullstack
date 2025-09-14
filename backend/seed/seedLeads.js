// backend/seed/seedLeads.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { faker } = require("@faker-js/faker");
const Lead = require("../models/Lead");

dotenv.config(); // load .env

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected for seeding"))
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  });

const seedLeads = async () => {
  try {
    // Clear old leads
    await Lead.deleteMany();

    // Generate 100 fake leads
    const leads = Array.from({ length: 100 }).map(() => ({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      company: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.state(),
      source: faker.helpers.arrayElement([
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ]),
      status: faker.helpers.arrayElement([
        "new",
        "contacted",
        "qualified",
        "lost",
        "won",
      ]),
      score: faker.number.int({ min: 0, max: 100 }),
      lead_value: faker.number.float({ min: 100, max: 10000, precision: 0.01 }),
      last_activity_at: faker.date.recent({ days: 30 }),
      is_qualified: faker.datatype.boolean(),
    }));

    await Lead.insertMany(leads);

    console.log("✅ 100 Leads Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding leads:", error);
    process.exit(1);
  }
};

seedLeads();
