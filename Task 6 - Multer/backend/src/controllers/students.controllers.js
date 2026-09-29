import Student from "../models/Students.js";

export const GetAllStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const GetStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const AddStudent = async (req, res) => {
    try {
        const student = await Student.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            profilePic: req.file ? req.file.filename : ""
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const UpdateStudent = async (req, res) => {
    try {
        const updateData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname
        };

        if (req.file) {
            updateData.profilePic = req.file.filename;
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const DeleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const DeleteAllStudents = async (req, res) => {
    try {
        await Student.deleteMany({});

        res.json({
            message: "All students deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};