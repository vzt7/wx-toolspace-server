const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("toolspace", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

const ActivationCode = sequelize.define("ActivationCode", {
  openId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expires: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: -1,
    validate: {
      isDate: true,
    },
  },
  level: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: true,
    },
  },
  isValid: {
    type: DataTypes.VIRTUAL,
    allowNull: false,
    get() {
      return Boolean(Date.now() - this.expires);
    },
  },
});

// 数据库初始化方法
async function init() {
  await ActivationCode.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  Counter,
  ActivationCode,
};
