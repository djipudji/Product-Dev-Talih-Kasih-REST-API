const axios = require('axios');
const https = require('http');
const {
  check,
  validationResult,
  matchedData,
  sanitize
} = require('express-validator'); //form validation & sanitize form params
const multer = require('multer'); //multipar form-data
const path = require('path'); // to detect path of directory
const crypto = require('crypto'); // to encrypt something
const campaign = require('../../models').campaign;

// Axios intance for request
const axiosRequest = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // Pass SSL certificate
  })
});

function returnHexaNumber(s) {
  var regExp = /^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/;
  return (typeof s === 'string' && regExp.test(s));
}

const uploadDirImage = '/img/'; // make images upload to /img/
const storageImages = multer.diskStorage({
  destination: "./public" + uploadDirImage, // make images upload to /public/img/
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname)) // encrypt filename and save it into the /public/img/ directory
    })
  }
})
const uploadImage = multer({
  storage: storageImages,
  dest: uploadDirImage,
  fileFilter: (req, file, cb) => {
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
            return cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error(`File must be an image! (.jpg or .jpeg or .png)`))
        }
    },
    limits: {
        fileSize: 1 * 2048 * 1024
    }
});

module.exports = {
  create: [
    uploadImage.single('images'),
    check('title', 'Title tidak boleh kosong, harus memiliki 5 sampai 35 karakter!').isString().notEmpty().isLength({
      min: 5,
      max: 35
    }).custom(value => {
      return campaign.findOne({
        title: value
      }).then(n => {
        if (n) {
          throw new Error('Judul campaign sudah ada')
        }
      })
    }),
    check('goal', 'goal harus nomor').isNumeric().notEmpty(),
    check('due_date', 'due_date harus format tanggal (yyyy-mm-dd)').isDate().notEmpty(),
    check('category', 'category tidak ada').isString().notEmpty(),
    check('story', 'story tidak ada').isString().notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],
  updateCampaign: [
    check('campaignId').custom(async (value, {req}) => {
      try {
        if((value.length != 24) || !returnHexaNumber(value)) {
          throw new Error(`ID harus 24 karakter!`)
        };

        let findCampaign = await campaign.findOne({
          _id: value
        });

        if(!findCampaign) {
          throw new Error(`ID campaign tidak ada!`)
        }
      } catch(e) {
        throw new Error(e)
      }
    }),
    check('title', 'Title tidak boleh kosong, harus memiliki 5 sampai 35 karakter!').isString().notEmpty().isLength({
      min: 5,
      max: 35
    }).custom(value => {
      return campaign.findOne({
        title: value
      }).then(n => {
        if (n) {
          throw new Error('Title campaign sudah ada, tidak boleh update dengan title yang sama dengan sebelumnya!')
        }
      })
    }),
    check('goal', 'goal harus nomor').isNumeric().notEmpty(),
    check('due_date', 'due_date harus format tanggal (yyyy-mm-dd)').isDate().notEmpty(),
    check('category', 'category tidak ada').isString().notEmpty(),
    check('story', 'story tidak ada').isString().notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],
  updateWallet: [
    check('campaignId').custom(async (value, {req}) => {
      try {
        if((value.length != 24) || !returnHexaNumber(value)) {
          throw new Error(`ID harus 24 karakter!`)
        };

        let findCampaign = await campaign.findOne({
          _id: value
        });

        if(!findCampaign) {
          throw new Error(`ID campaign tidak ada!`)
        }
      } catch(e) {
        throw new Error(e)
      }
    }),
    check('wallet', 'wallet harus nomor').isNumeric().notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],
  updateStatus: [
    check('campaignId').custom(async (value, {req}) => {
      try {
        if((value.length != 24) || !returnHexaNumber(value)) {
          throw new Error(`ID harus 24 karakter!`)
        };

        let findCampaign = await campaign.findOne({
          _id: value
        });

        if(!findCampaign) {
          throw new Error(`ID campaign tidak ada!`)
        }
      } catch(e) {
        throw new Error(e)
      }
    }),
    check('status', 'status harus string').isString().notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],
  delete: [
    check('campaignId').custom(async (value, {req}) => {
      try {
        if((value.length != 24) || !returnHexaNumber(value)) {
          throw new Error(`ID harus 24 karakter!`)
        };

        let findCampaign = await campaign.findOne({
          _id: value
        });

        if(!findCampaign) {
          throw new Error(`ID campaign tidak ada!`)
        }
      } catch(e) {
        throw new Error(e)
      }
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],
  updateImages: [
    uploadImage.single('images'),
    check('campaignId').custom(async (value, {req}) => {
      try {
        if((value.length != 24) || !returnHexaNumber(value)) {
          throw new Error(`ID harus 24 karakter!`)
        };

        let findCampaign = await campaign.findOne({
          _id: value
        });

        if(!findCampaign) {
          throw new Error(`ID campaign tidak ada!`)
        }
      } catch(e) {
        throw new Error(e)
      }
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],

  updateTotalShare: [
    check('campaignId').custom(async (value, {req}) => {
      try {
        if((value.length != 24) || !returnHexaNumber(value)) {
          throw new Error(`ID harus 24 karakter!`)
        };

        let findCampaign = await campaign.findOne({
          _id: value
        });

        if(!findCampaign) {
          throw new Error(`ID campaign tidak ada!`)
        }
      } catch(e) {
        throw new Error(e)
      }
    }),
    check('total_share', 'Total share harus nomor!').isNumeric().notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],

  getOne: [
    check('campaignId').custom(async (value, {req}) => {
      try {
        if((value.length != 24) || !returnHexaNumber(value)) {
          throw new Error(`ID should have 24 characters and hexa decimal number!`)
        };

        let getCampaign = await campaign.findOne({
          _id: value
        });

        if(!getCampaign) {
          throw new Error(`Campaign isn't exist!`)
        };
      } catch (e) {
        throw new Error(e);
      };
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ]
}