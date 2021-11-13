module.exports = {
    HOST: "localhost",
    USER: "hydrobot",
    PASSWORD: "hydrobot",
    DB: "hydrobot",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
    };