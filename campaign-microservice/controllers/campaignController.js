const axios = require('axios'); // Import axios
const https = require('https'); // Import https
const { campaign, history } = require('../models'); // Import campaign and history
const { ObjectId } = require('mongodb')

const axiosRequest = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});


class campaignController {

  async create(req, res) {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      let getUserAPI = {
        method: 'get',
        url: `http://localhost:3000/user/profile`,
        headers: {
          'Authorization': req.header('Authorization')
        },
        httpsAgent: agent
      };
      let responseGetUserAPI = await axios(getUserAPI);

      let getUser = responseGetUserAPI.data;

      let createdCampaign = await campaign.create({
        images: req.file === undefined ? "" : req.file.filename,
        title: req.body.title,
        goal: req.body.goal,
        due_date: req.body.due_date,
        category: req.body.category,
        story: req.body.story,
        user: getUser.data,
      })
      let newCampaign = await campaign.findOne({
        _id: createdCampaign._id
      }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at');

      return res.status(200).json({
        status: 'success created data',
        data: newCampaign
      })
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        errors: e
      });
    }
  }

  async updateCampaign(req, res) {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      let getUserAPI = {
        method: 'get',
        url: `http://localhost:3000/user/profile`,
        headers: {
          'Authorization': req.header('Authorization')
        },
        httpsAgent: agent
      };

      let responseGetUserAPI = await axios(getUserAPI);

      let getUser = responseGetUserAPI.data;

      let updateCampaign = await campaign.findOneAndUpdate({
        _id: req.params.campaignId
      }, {
        title: req.body.title,
        goal: req.body.goal,
        due_date: req.body.due_date,
        category: req.body.category,
        story: req.body.story,
        get: getUser.data
      }, {
        new: true
      });

      let campaignObjectId = new ObjectId(updateCampaign._id)

      let updateCampaignInHistory = await history.updateMany({
        "campaign._id": {
          $eq: campaignObjectId
        }
      }, {
        $set: {
          "campaign": updateCampaign
        }
      })

      let updateCampaignInDonation = {
        method: 'put',
        url: `http://localhost:3002/donation/update/campaign/${updateCampaign._id}`,
        headers: {
          'Authorization': req.header('Authorization')
        },
        httpsAgent: agent
      };

      let responseUpdateCampaignInDonation = await axios(updateCampaignInDonation);

      let getUpdateCampaignInDonation = responseUpdateCampaignInDonation.data;

      let newCampaign = await campaign.findOne({
        _id: updateCampaign._id
      }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at');

      return res.status(200).json({
        status: 'success update data',
        data: newCampaign
      })
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        errors: e
      });
    }
  }
  async updateWallet(req, res){
    campaign.findOneAndUpdate({
        _id: req.params.campaignId
    },{
      wallet : req.body.wallet
      },{
        new:true
        })
    .then(() => {
        return campaign.findOne({
          _id: req.params.campaignId
        },'_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        }).then(result => {
        res.json({
        status: "Succes update wallet",
        data : result
            })
                  })
}

async updateStatus(req, res){
  campaign.findOneAndUpdate({
      _id: req.params.campaignId
  },{
    status : req.body.status
    },{
      new:true
      })
  .then(() => {
      return campaign.findOne({
        _id: req.params.campaignId
      },'_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
      }).then(result => {
      res.json({
      status: "Succes update status",
      data: result
          })
                })
}
  async updateImages(req, res) {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      let getUserAPI = {
        method: 'get',
        url: `http://localhost:3000/user/profile`,
        headers: {
          'Authorization': req.header('Authorization')
        },
        httpsAgent: agent
      };

      let responseGetUserAPI = await axios(getUserAPI);

      let getUser = responseGetUserAPI.data;

      let updateImages = await campaign.findOneAndUpdate({
        _id: req.params.campaignId
      }, {
        images: req.file === undefined ? "" : req.file.filename,
        get: getUser.data
      }, {
        new: true
      })

      let campaignObjectId = new ObjectId(updateImages._id)

      let updateCampaignInHistory = await history.updateMany({
        "campaign._id": {
          $eq: campaignObjectId
        }
      }, {
        $set: {
          "campaign": updateImages
        }
      })

      let updateCampaignInDonation = {
        method: 'put',
        url: `http://localhost:3002/donation/update/campaign/${updateImages._id}`,
        headers: {
          'Authorization': req.header('Authorization')
        },
        httpsAgent: agent
      };

      let responseUpdateCampaignInDonation = await axios(updateCampaignInDonation);

      let getUpdateCampaignInDonation = responseUpdateCampaignInDonation.data;

      let newCampaign = await campaign.findOne({
        _id: updateImages._id
      },'_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at');

      return res.status(200).json({
        status: 'success update image',
        data: newCampaign
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        errors: e
      });
    }
  }

  async updateTotalShare(req, res) {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      let updateCampaign = await campaign.findOneAndUpdate({
        _id: req.params.campaign_id
      }, {
        total_share: req.body.total_share
      }, {
        new: true
      });

      let campaignObjectId = new ObjectId(updateCampaign._id)

      let updateCampaignInHistory = await history.updateMany({
        "campaign._id": {
          $eq: campaignObjectId
        }
      }, {
        $set: {
          "campaign": updateCampaign
        }
      })

      let updateCampaignInDonation = {
        method: 'put',
        url: `http://localhost:3002/donation/update/campaign/${updateCampaign._id}`,
        headers: {},
        httpsAgent: agent
      };

      let responseUpdateCampaignInDonation = await axios(updateCampaignInDonation);

      let getUpdateCampaignInDonation = responseUpdateCampaignInDonation.data;

      let newCampaign = await campaign.findOne({
        _id: updateCampaign._id
      },'_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at');

      return res.status(200).json({
        status: 'success update data',
        data: newCampaign
      })
    } catch (e) {

    }
  }

  async updateDonationInCampaign(req, res) {
    try {
      let getDonationAPI = {
        method: `get`,
        url: `http://localhost:3002/donation/total/${req.params.campaign_id}`,
        headers: {
          'Authorization': req.header('Authorization')
        }
      }

      let responseGetDonationAPI = await axiosRequest(getDonationAPI);

      let getDonation = responseGetDonationAPI.data.data;

      let getDonationLengthAPI = {
        method: `get`,
        url: `http://localhost:3002/donation/total/length/${req.params.campaign_id}`,
        headers: {
          'Authorization': req.header('Authorization')
        }
      }

      let responseGetDonationLengthAPI = await axiosRequest(getDonationLengthAPI);

      let getDonationLength = responseGetDonationLengthAPI.data.data;

      let updatedDonationInCampaign = await campaign.findOneAndUpdate({
        _id: req.params.campaign_id
      }, {
        $set: {
          total_donation: getDonationLength,
          total_donation_rupiah: getDonation
        }
      })

      return res.status(200).json({
        status: `Success update donation in campaign!`
      });
    } catch (e) {
      return res.status(500).json({
        status: `Fail to update donation in campaign!`,
        errors: e
      })
    }
  }

  async delete(req, res) {
    campaign.delete({
      _id: req.params.campaignId
    }).then(() => {
      res.json({
        status: "Succes delete data",
        data: null
      })
    })
  };

  async getOne(req, res) {
    let getCampaign = await campaign.findOne({
      _id: req.params.campaignId
    }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at');

    let sumView;

    if (getCampaign.view == null) {
      sumView = 1;
    } else {
      sumView = getCampaign.view + 1;
    }

    let updateCampaign = await campaign.findOneAndUpdate({
      _id: req.params.campaignId
    }, {
      $set: {
        view: sumView
      }
    }, {
      new: true
    });

    if (req.header('Authorization')) {
      try {
        let getUserAPI = {
          method: 'get',
          url: 'http://localhost:3000/user/profile',
          headers: {
            'Authorization': req.header('Authorization')
          }
        };

        let responseGetUserAPI = await axiosRequest(getUserAPI);

        let getUser = responseGetUserAPI.data.data;

        let createHistory = await history.create({
          user: getUser,
          campaign: updateCampaign
        });

        return res.status(200).json({
          status: `Success to get one campaign!`,
          data: updateCampaign
        });
      } catch (e) {
        return res.status(500).json({
          status: `Failed to get one campaign!`,
          errors: e
        })
      }
    }

    return res.status(200).json({
      message: "Success to get one campaign!",
      data: updateCampaign
    });
  };

  async getOneAxios(req, res) {
    try {
      let updateCampaign = await campaign.findOne({
        _id: req.params.campaignId
      });

      return res.status(200).json({
        status: `Success to get one campaign!`,
        data: updateCampaign
      });
    } catch (e) {
      return res.status(500).json()
    }
  }

  async getUser(req, res) {
    try{
      const { page = 1, limit = 6} = req.query;

      const countPages = await campaign.find({
        "user.id": req.query.user_id
      }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at');

      const posts = await campaign.find({
        "user.id": req.query.user_id
      }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
      const count = await countPages.length;

      return res.status(200).json({
        status: `Success get all campaign sort by user!`,
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch(e) {
      return res.status(500).json({
        status: `Error!`,
        errros: e
      })
    }
  }

  async getTitle(req, res) {
    const {
      page = 1, limit = 6
    } = req.query;
    try {
      const countPages = await campaign.find({
          title: {
            $regex: req.query.title,
            $options: '$i'
          },
          status : {
            $regex : "open",
            $options: '$i'
          }
        }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
      const posts = await campaign.find({
          title: {
            $regex: req.query.title,
            $options: '$i'
          },
          status : {
            $regex : "open",
            $options: '$i'
          }
        }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await countPages.length;
      res.json({
        status: "Succes get all the data",
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  async getCategory(req, res) {
    const {
      page = 1, limit = 6
    } = req.query;
    try {
      const countPages = await campaign.find({
          category: {
            $regex: req.query.category,
            $options: '$i'
          }, status : {
            $regex : "open",
            $options: '$i'
          }
        }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
      const posts = await campaign.find({
          category: {
            $regex: req.query.category,
            $options: '$i'
          }, status : {
            $regex : "open",
            $options: '$i'
          }
        }, '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await countPages.length;
      res.json({
        status: "Succes get all the data",
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  async getAll(req, res) {
    const {
      page = 1, limit = 6
    } = req.query;
    try {
      const posts = await campaign.find({
        status : {
          $regex: 'open',
          $options: '$i'
        }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await posts.length;
      res.json({
        status: "Succes get all the data",
        data : posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } catch (err) {
      console.error(err.message);
    }

  };

  async getbyadmin(req, res) {
    const {
      page = 1, limit = 6
    } = req.query;
    try {
      const posts = await campaign.find({},
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await campaign.countDocuments();
      res.json({
        status: "Succes get all the data",
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } catch (err) {
      console.error(err.message);
    }

  };

  async getNew(req, res) {
    const {
      page = 1, limit = 6
    } = req.query;
    try {
      const countPages = await campaign.find({
          status : {
            $regex : "open",
            $options: '$i'
          }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          created_at: -1
        })
      const posts = await campaign.find({
          status : {
            $regex : "open",
            $options: '$i'
          }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          created_at: -1
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await countPages.length;
      res.json({
        status: "Succes get all the data",
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } catch (err) {
      console.error(err.message);
    }

  };

  async getUrgen(req, res) {
    const {
      page = 1, limit = 6
    } = req.query;
    try {
      const countPages = await campaign.find({
          status : {
            $regex : "open",
            $options: '$i'
          }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          due_date: 1
        })
      const posts = await campaign.find({
          status : {
            $regex : "open",
            $options: '$i'
          }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          due_date: 1
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await countPages.length;
      res.json({
        status: "Succes get all the data",
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } catch (err) {
      console.error(err.message);
    }
  };

  async getPopuler(req, res) {
    const {
      page = 1, limit = 6
    } = req.query;
    try {
      const countPages = await campaign.find({
          status : {
            $regex : "open",
            $options: '$i'
          }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          view: -1
        })
      const posts = await campaign.find({
        status : {
          $regex : "open",
          $options: '$i'
        }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          view: -1
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await countPages.length;
      res.json({
        status: "Succes get all the data",
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } catch (err) {
      console.error(err.message);
    }
  };

  async getLessDonation(req, res) {
    try {
      const {
        page = 1, limit = 6
      } = req.query;
      const countPages = await campaign.find({
        status : {
          $regex : "open",
          $options: '$i'
        }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          total_donation_rupiah: 1
        })
      const posts = await campaign.find({
        status : {
          $regex : "open",
          $options: '$i'
        }
      },
        '_id title goal images due_date category story user view total_donation total_donation_rupiah total_share wallet status created_at')
        .sort({
          total_donation_rupiah: 1
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await countPages.length;
      return res.status(200).json({
        status: `Success get all the data`,
        data : posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (e) {
      return res.status(500).json({
        status: `Failed to get all data`,
        errors: e
      })
    }
  }

  async updateUserInCampaign(req, res) {
    try {
      let getUserAPI = {
        method: 'get',
        url: 'http://localhost:3000/user/profile',
        headers: {
          'Authorization': req.header('Authorization')
        }
      };

      let responseGetUserAPI = await axiosRequest(getUserAPI);

      let getUser = responseGetUserAPI.data.data;

      let updatedUserInCampaign = await campaign.updateMany({
        "user.id": {
          $eq: getUser.id
        }
      }, {
        $set: {
          "user": getUser
        }
      });

      return res.status(200).json({
        status: `Success update user also in campaign!`,
        data: getUser
      });
    } catch (e) {
      return res.status(500).json({
        status: `Failed update user in campaign! (Campaign API)`,
        errors: e
      })
    }
  }

};

module.exports = new campaignController