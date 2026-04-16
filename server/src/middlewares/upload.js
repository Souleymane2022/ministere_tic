const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');

// S'assure que le dossier d'upload existe
const uploadRoot = path.resolve(env.UPLOAD_PATH);
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

function makeStorage(subdir = '') {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(uploadRoot, subdir);
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

const allowedMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain', 'text/csv',
];

function fileFilter(req, file, cb) {
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Type de fichier non autorisé'));
}

const uploadDocument = multer({
  storage: makeStorage('documents'),
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
});

const uploadAvatar = multer({
  storage: makeStorage('avatars'),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seules les images sont acceptées'));
  },
});

const uploadGeneric = multer({
  storage: makeStorage('generic'),
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
});

module.exports = { uploadDocument, uploadAvatar, uploadGeneric, uploadRoot };
