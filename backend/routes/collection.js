// routes/collection.js - API routes for currency/coin collection
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const config = require('../config');
const CollectionItem = require('../models/CollectionItem');
const fileSystem = require('../utils/filesystem.js');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', config.UPLOAD_DIR));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: config.UPLOAD_LIMIT },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET recent collection items (NEW ENDPOINT)
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const items = await CollectionItem.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(limit);
    
    console.log(`Fetching ${limit} recent items, found: ${items.length}`);
    res.json(items);
  } catch (err) {
    console.error('Error fetching recent items:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET all collection items
router.get('/', async (req, res) => {
  try {
    const items = await CollectionItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single collection item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await CollectionItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new collection item
router.post('/', upload.array('photos', config.MAX_FILES), async (req, res) => {
  try {
    const metadata = JSON.parse(req.body.metadata);
    
    // Prepare photos array for database
    const photos = req.files.map(file => ({
      filename: file.filename,
      path: `/${config.UPLOAD_DIR}/${file.filename}`,
      originalname: file.originalname
    }));
    
    // Create new collection item
    const newItem = new CollectionItem({
      ...metadata,
      photos
    });
    
    const savedItem = await newItem.save();
    console.log('New item saved:', savedItem._id);
    res.status(201).json(savedItem);
  } catch (err) {
    // Clean up any uploaded files if there was an error
    if (req.files) {
      req.files.forEach(async (file) => {
        await fileSystem.deleteFile(file.filename);
      });
    }
    console.error('Error creating item:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT update an existing collection item
router.put('/:id', upload.array('photos', config.MAX_FILES), async (req, res) => {
  try {
    const metadata = JSON.parse(req.body.metadata);
    const item = await CollectionItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Process new photos
    let photos = [...item.photos];
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => ({
        filename: file.filename,
        path: `/${config.UPLOAD_DIR}/${file.filename}`,
        originalname: file.originalname
      }));
      photos = [...photos, ...newPhotos];
    }
    
    // Handle deleted photos if specified
    if (metadata.deletedPhotos && metadata.deletedPhotos.length > 0) {
      // Delete files from disk
      for (const photoId of metadata.deletedPhotos) {
        const photo = item.photos.find(p => p._id.toString() === photoId);
        if (photo) {
          await fileSystem.deleteFile(photo.filename);
        }
      }
      
      // Remove from photos array
      photos = photos.filter(photo => !metadata.deletedPhotos.includes(photo._id.toString()));
      delete metadata.deletedPhotos;
    }
    
    // Update item
    const updatedItem = await CollectionItem.findByIdAndUpdate(
      req.params.id,
      { ...metadata, photos, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json(updatedItem);
  } catch (err) {
    // Clean up any uploaded files if there was an error
    if (req.files) {
      req.files.forEach(async (file) => {
        await fileSystem.deleteFile(file.filename);
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// DELETE a collection item
router.delete('/:id', async (req, res) => {
  try {
    const item = await CollectionItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Delete associated photos
    for (const photo of item.photos) {
      await fileSystem.deleteFile(photo.filename);
    }
    
    // Delete the item from the database
    await CollectionItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET items by filter criteria
router.post("/api/collection/search", async (req, res) => {
  const filters = req.body;
  const query = {};

  for (const key in filters) {
    if (filters[key] !== "" && filters[key] !== undefined) {
      query[key] = filters[key];
    }
  }

  try {
    const results = await Collection.find(query).limit(100);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});


module.exports = router;