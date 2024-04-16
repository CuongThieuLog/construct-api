const User = require("../models/user.model");
const Information = require("../models/information.model");
const BaseController = require("./base.controller");

function UserController() {
  const baseController = BaseController;

  this.find = async (req, res) => {
    return res.send(req.user);
  };

  this.register = async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      await newUser.save();

      return res.json({ user: newUser.toAuthJSON() });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  this.getAll = async (req, res) => {
    try {
      const { page, limit, role, username } = req.query;

      let query = {};

      query = baseController.appendFilters(query, { role, username });

      const { results, pagination } = await baseController.pagination(
        User,
        query,
        page,
        limit
      );

      const transformedData = results.map((user) => ({
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      res.status(200).json({
        data: transformedData,
        pagination: pagination,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  this.createUserInfo = async (req, res) => {
    try {
      const { user, information } = req.body;

      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const newUser = new User(user);
      await newUser.save();

      const newInformation = new Information({
        user: newUser._id,
        ...information,
      });

      await newInformation.save();

      return res
        .status(201)
        .json({ message: "User and information created successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  return this;
}

module.exports = UserController();
