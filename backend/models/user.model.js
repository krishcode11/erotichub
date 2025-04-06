import mongoose from "mongoose";

const myListItemSchema = mongoose.Schema({
	mediaId: {
		type: String,
		required: true
	},
	mediaType: {
		type: String,
		enum: ['movie', 'tv'],
		required: true
	},
	title: {
		type: String,
		required: true
	},
	posterPath: {
		type: String,
		default: ""
	},
	addedAt: {
		type: Date,
		default: Date.now
	}
});

const watchHistoryItemSchema = mongoose.Schema({
	mediaId: {
		type: String,
		required: true
	},
	mediaType: {
		type: String,
		enum: ['movie', 'tv'],
		required: true
	},
	title: {
		type: String,
		required: true
	},
	posterPath: {
		type: String,
		default: ""
	},
	watchedAt: {
		type: Date,
		default: Date.now
	},
	watchedDuration: {
		type: Number,
		default: 0
	}
});

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "",
	},
	searchHistory: {
		type: Array,
		default: [],
	},
	myList: {
		type: [myListItemSchema],
		default: []
	},
	watchHistory: {
		type: [watchHistoryItemSchema],
		default: []
	},
	categories: {
		type: [{
			name: {
				type: String,
				required: true
			},
			items: {
				type: [String],
				default: []
			}
		}],
		default: []
	}
});

export const User = mongoose.model("User", userSchema);
