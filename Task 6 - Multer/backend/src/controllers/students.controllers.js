import Student from "../models/Students.js";

export const GetAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        next(error);
    }
};

export const GetStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            const error = new Error("Student not found");
            error.statusCode = 404;
            return next(error);
        }

        res.json(student);
    } catch (error) {
        next(error);
    }
};

export const AddStudent = async (req, res, next) => {
    try {
        if (!req.body.firstname || !req.body.lastname) {
            const error = new Error("First name and last name are required");
            error.statusCode = 400;
            return next(error);
        }

        const student = await Student.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            profilePic: req.file ? req.file.filename : ""
        });

        res.status(201).json(student);
    } catch (error) {
        next(error);
    }
};

export const UpdateStudent = async (req, res, next) => {
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
            const error = new Error("Student not found");
            error.statusCode = 404;
            return next(error);
        }

        res.json(student);
    } catch (error) {
        next(error);
    }
};

export const DeleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            const error = new Error("Student not found");
            error.statusCode = 404;
            return next(error);
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const DeleteAllStudents = async (req, res, next) => {
    try {
        await Student.deleteMany({});

        res.json({
            message: "All students deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};