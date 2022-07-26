import { createRequire } from "module";
const require = createRequire(import.meta.url);
import multer from "multer";
const path = require("path")



export const newUpload =  multer({
  storage: multer.diskStorage({}),
  
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});


/////////////////////////////////////////////////////////

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//       cb(null, 'uploads/');
//   },

//   filename: function(req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });


///////////////////////////////////////////////////////////////////////

