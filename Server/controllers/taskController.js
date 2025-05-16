const Task = require("../models/Task");

// Créer une tâche
exports.createTask = async (req, res) => {
  const { title, description, status, priority, deadline } = req.body;

  try {
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      status,
      priority,
      deadline,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Récupérer toutes les tâches d'un utilisateur
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Récupérer une tâche par son ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Vérifier si la tâche existe
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Vérifier si l'utilisateur possède cette tâche
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(500).send("Server Error");
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  const { title, description, status, priority, deadline } = req.body;

  // Construire l'objet de tâche
  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (status) taskFields.status = status;
  if (priority) taskFields.priority = priority;
  if (deadline) taskFields.deadline = deadline;

  try {
    let task = await Task.findById(req.params.id);

    // Vérifier si la tâche existe
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Vérifier si l'utilisateur possède cette tâche
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Mettre à jour la tâche
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(500).send("Server Error");
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Vérifier si la tâche existe
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Vérifier si l'utilisateur possède cette tâche
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Supprimer la tâche
    await task.remove();

    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(500).send("Server Error");
  }
};

// Filtrer et trier les tâches
exports.filterTasks = async (req, res) => {
  try {
    const { status, search, sortBy, sortOrder } = req.query;

    // Construire le filtre
    const filter = { user: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Définir les options de tri
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // Par défaut, tri par date de création décroissante
    }

    const tasks = await Task.find(filter).sort(sort);

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
