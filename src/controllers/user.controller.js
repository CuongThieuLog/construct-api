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

      const transformedData = await Promise.all(
        results.map(async (user) => {
          const userInfo = await Information.findOne({ user: user._id });

          return {
            _id: user._id,
            role: user.role,
            username: user.username,
            email: user.email,
            information: userInfo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        })
      );

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

  this.updateUserInfo = async (req, res) => {
    try {
      const { userId } = req.params;
      const { user: updatedUserData, information: updatedInformationData } =
        req.body;

      const user = await User.findByIdAndUpdate(userId, updatedUserData, {
        new: true,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let information = await Information.findOne({ user: userId });

      if (!information) {
        information = new Information({
          user: userId,
          ...updatedInformationData,
        });
      } else {
        Object.assign(information, updatedInformationData);
      }

      await information.save();

      return res
        .status(200)
        .json({ message: "User and information updated successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  this.deleteUserInfo = async (req, res) => {
    try {
      const { userId } = req.params;

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      await Information.findOneAndDelete({ user: userId });

      return res.status(200).json({
        message: "User and associated information deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  this.getUserInfoById = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const information = await Information.findOne({ user: userId });

      const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.status(200).json({ data: { user: userData, information } });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  return this;
}

module.exports = UserController();
