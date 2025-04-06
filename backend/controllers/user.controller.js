import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const updateProfile = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update username if provided
    if (username && username !== user.username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
      user.username = username;
    }

    // Update password if both current and new password are provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await bcryptjs.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }

      // Check if new password is valid
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      }

      // Hash new password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(newPassword, salt);
    }

    // Save updated user
    await user.save();

    // Return user without password
    const userWithoutPassword = { ...user._doc, password: undefined };
    res.status(200).json({ success: true, message: "Profile updated successfully", user: userWithoutPassword });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user and populate watch history
    const user = await User.findById(userId).select("watchHistory");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, watchHistory: user.watchHistory || [] });
  } catch (error) {
    console.error("Error in getWatchHistory controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addToMyList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mediaId, mediaType, title, posterPath } = req.body;

    if (!mediaId || !mediaType || !title) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if already in list
    if (!user.myList) {
      user.myList = [];
    }

    const existingItem = user.myList.find(
      item => item.mediaId.toString() === mediaId.toString() && item.mediaType === mediaType
    );

    if (existingItem) {
      return res.status(400).json({ success: false, message: "Item already in your list" });
    }

    // Add to my list
    user.myList.push({
      mediaId,
      mediaType,
      title,
      posterPath,
      addedAt: new Date()
    });

    await user.save();
    res.status(200).json({ success: true, message: "Added to your list", myList: user.myList });
  } catch (error) {
    console.error("Error in addToMyList controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeFromMyList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mediaId } = req.params;

    if (!mediaId) {
      return res.status(400).json({ success: false, message: "Media ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove from my list
    if (user.myList) {
      user.myList = user.myList.filter(item => item.mediaId.toString() !== mediaId.toString());
    }

    await user.save();
    res.status(200).json({ success: true, message: "Removed from your list", myList: user.myList });
  } catch (error) {
    console.error("Error in removeFromMyList controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyList = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user and populate my list
    const user = await User.findById(userId).select("myList");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, myList: user.myList || [] });
  } catch (error) {
    console.error("Error in getMyList controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}; 