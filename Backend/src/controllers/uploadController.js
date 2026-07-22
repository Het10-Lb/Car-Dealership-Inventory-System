export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    
    // multer-storage-cloudinary attaches the secure Cloudinary URL to req.file.path
    const imageUrl = req.file.path;
    
    return res.status(200).json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};
