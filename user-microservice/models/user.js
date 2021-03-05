'use strict';
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10))
      }
    },
    bank_name: DataTypes.STRING,
    bank_account_number: DataTypes.INTEGER,
    profile_image: {
      type: DataTypes.STRING,
      get() {
        const profileImage = this.getDataValue('profile_image');
        return 'https://api.talikasih.tech:3000/img/' + profileImage;
      }
    }
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    modelName: 'user',
  });
  return user;
};