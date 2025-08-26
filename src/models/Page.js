import mongoose from 'mongoose';


const PageSchema = new mongoose.Schema({
url: { type: String, index: true, unique: true },
title: String,
content: String,
chunks: [{
id: String,
text: String,
embedding: { type: [Number], index: '2dsphere' }
}],
updatedAt: { type: Date, default: Date.now }
});


export default mongoose.model('Page', PageSchema);