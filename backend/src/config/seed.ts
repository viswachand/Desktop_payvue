import { AdminConfig } from "../models/adminModel";
import { User } from "../models/userModel";

const adminSeed = {
  username: "admin",
  firstName: "Viswachand",
  lastName: "Reddy",
  password: "admin",
  employeeStartDate: new Date("2024-01-15"),
  contactNumber: "+1-555-123-4567",
  isAdmin: true,
};

const adminConfigSeed = {
  companyName: "A - 1 JEWELERS",
  companyAddress: "5142 Wilson Mills Rd",
  companyPhone: "1234567890",
  companyEmail: "info@payvue.com",
  taxRate: 8,
};

export async function seedInitialData() {
  try {
    const existingUser = await User.findOne({ username: adminSeed.username });
    if (!existingUser) {
      await User.create(adminSeed);
      console.log("✅ Seed: Default admin user created.");
    } else {
      console.log("ℹ️ Seed: Admin user already exists. Skipping creation.");
    }

    const existingConfig = await AdminConfig.findOne({});
    if (!existingConfig) {
      await AdminConfig.create(adminConfigSeed);
      console.log("✅ Seed: Default admin configuration created.");
    } else {
      console.log("ℹ️ Seed: Admin configuration already exists. Skipping creation.");
    }
  } catch (error) {
    console.error("❌ Seed: Failed to seed initial data.", error);
    throw error;
  }
}
