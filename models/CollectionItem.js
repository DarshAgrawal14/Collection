// models/CollectionItem.js - Database model for currency/coin items
const mongoose = require('mongoose');

const CollectionItemSchema = new mongoose.Schema({
  // Basic type information
  type: {
    type: String,
    enum: ['Note', 'Coin'],
    required: true
  },
  region: {
    type: String,
    required: true
  },
  
  // India-specific fields
  after1947: {
    type: Boolean,
    default: true
  },
  rulerType: {
    type: String,
    enum: ['British', 'Portuguese', 'Kingdom/Samrajya', ''],
  },
  isCommemorative: {
    type: Boolean,
    default: false
  },
  
  // Currency/coin details
  currency: String,
  country: String,
  denomination: String,
  year: String,
  mint: String,
  commemorativeNameFor: String,
  commemorativeRange: String,
  issuer: String,
  material: String,
  metal: String,
  script: String,
  ruler: String,
  ruleDuration: String,
  coinValue: String,
  weight: String,
  series: String,
  
  // Collection info
  condition: String,
  notes: String,
  purchaseValue: String,
  currentValue: String,
  acquisitionType: {
    type: String,
    enum: ['bought', 'seen'],
    default: 'bought'
  },
  boughtFrom: String,
  exchangeRate: String,
  
  // Photo handling
  photos: [{
    filename: String,
    path: String,
    originalname: String
  }],
  thumbnailIndex: {
    type: Number,
    default: 0
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
CollectionItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CollectionItem', CollectionItemSchema);