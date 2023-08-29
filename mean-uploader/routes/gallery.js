var express = require('express');
const router = express.Router();
var multer  = require('multer');
const Gallery = require('../models/Gallery.js');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') { 
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

 
const upload = multer({ storage: storage });

router.post('/', upload.array('files', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(500).send({ message: 'Upload fail' });
    } else {     
      console.log(req.body,'formGroup')


      const imageUrls = [];

      for (const file of req.files) {
        imageUrls.push('http://localhost:3000/images/' + file.filename);
 
      }
       console.log(imageUrls,'imageUrls')
      req.body.imageUrls = imageUrls;
      const gallery =    await Gallery.create({
        imageUrl:imageUrls,
        imageTitle:req.body.imageTitle,
        imageDesc:req.body.imageDesc,
   
    }) 
 
     res.json(gallery);
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(galleryItem);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
