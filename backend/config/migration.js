const mongoose = require("mongoose");
const User = require("../models/User");

const migrateUsers = async () => {
    try {
        console.log("Starting user migration...");
        
        // Find all users without name field
        const usersWithoutName = await User.find({ name: { $exists: false } });
        
        if (usersWithoutName.length > 0) {
            console.log(`Found ${usersWithoutName.length} users without name field`);
            
            // Update all users without name to have default name
            const result = await User.updateMany(
                { name: { $exists: false } },
                { $set: { name: "User" } }
            );
            
            console.log(`Updated ${result.modifiedCount} users with default name`);
        } else {
            console.log("No users need migration");
        }
        
        console.log("User migration completed successfully");
    } catch (error) {
        console.error("Migration error:", error);
    }
};

module.exports = migrateUsers; 