import memcached from "../config/memcached.js";
import User from "../models/Users.js";


export const GetAllUsers = async (req, res) => {
  const key = "users";
  const cached = await memcached.get(key);
  if (cached.value) {
    console.log("CACHE HIT");
    return res.json(JSON.parse(cached.value.toString()));
  }
  console.log("CACHE MISS");
  try {   
    const users = await User.find({});
    
    if (users.length === 0) {
        return res.json([]);
    }

    await memcached.set(
        key,
        JSON.stringify(users)
    );
    console.log("CACHE SET");
    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const AddUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    await memcached.delete("users");
    console.log("OLD CACHE DELETED");
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const Update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await memcached.delete("users");
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const Delete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    setTimeout(async () => {
        await memcached.delete("users");
    }, 30 * 1000);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const DeleteAll = async (req, res) => {
  try {
    await User.deleteMany({});
    setTimeout(async () => {
        console.log("30 SECONDS PASSED");
        await memcached.delete("users");
        console.log("USERS CACHE DELETED");
    }, 30 * 1000);
    res.json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
