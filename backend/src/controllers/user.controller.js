import asyncHandler from "express-async-handler"
import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"

// Helper function to generate unique username
const generateUniqueUsername = async (email) => {
    const baseUsername = email.split("@")[0];
    let username = baseUsername;
    let counter = 1;
    
    while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
    }
    
    return username;
};

export const getUserProfile = asyncHandler(async(req,res) =>{
    const {username} = req.params;

    const user = await User.findOne({username})
        .populate('followers', 'username firstName lastName profilePicture')
        .populate('following', 'username firstName lastName profilePicture');
    
    if (!user) {
        return res.status(404).json({error:"User not found"});
    }
    
    // Fetch user's posts
    const posts = await Post.find({ user: user._id })
        .populate('user', 'username firstName lastName profilePicture')
        .populate('comments.user', 'username firstName lastName profilePicture')
        .sort({ createdAt: -1 });
    
    res.status(200).json({user, posts});
}) 

export const updateProfile = asyncHandler(async(req,res)=>{
    const { userId } = getAuth(req);
    const user = await User.findOneAndUpdate({clerkId: userId}, req.body, {new:true});
    
    if (!user) {
        return res.status(404).json({error:"User not found"});
    }
    res.status(200).json({user});
})

//syncs our database with the clerk user database
export const syncUser = asyncHandler(async(req,res)=>{
    const { userId } = getAuth(req);

    // Check if user already exists in database
    const existingUser = await User.findOne({clerkId: userId});
    if (existingUser) {
        return res.status(200).json({user: existingUser, message: "User already exists"});
    }
    
    // Create new user from Clerk data
    try {
        const clerkUser = await clerkClient.users.getUser(userId);
        
        // Validate required fields
        if (!clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
            return res.status(400).json({error: "User email not found"});
        }
        
        const userData = {
            clerkId: userId,
            email: clerkUser.emailAddresses[0].emailAddress,
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            username: await generateUniqueUsername(clerkUser.emailAddresses[0].emailAddress),
            profilePicture: clerkUser.imageUrl || "",
        };

        const user = await User.create(userData);
        return res.status(201).json({ user, message: "User created successfully" });
    } catch (error) {
        console.error("Sync user error:", error);
        return res.status(500).json({error: "Failed to sync user with Clerk"});
    }
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId })
        .populate('followers', 'username firstName lastName profilePicture')
        .populate('following', 'username firstName lastName profilePicture');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params;

    if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" });

    const currentUser = await User.findOne({ clerkId: userId });
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        // unfollow
        await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: targetUserId },
        });
        await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUser._id },
        });
    } else {
        // follow
        await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: targetUserId },
        });
        await User.findByIdAndUpdate(targetUserId, {
        $push: { followers: currentUser._id },
        });

        // create notification
        await Notification.create({
        from: currentUser._id,
        to: targetUserId,
        type: "follow",
        });
    }

    res.status(200).json({
        message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
    });
});