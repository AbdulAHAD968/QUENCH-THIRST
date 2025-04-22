const Employee = require("../models/employee");
const asyncHandler = require("express-async-handler");

// Get all employees
const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ role: "employees" }).select("-password");
  res.json(employees);
});

// Get employee by ID
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id, role: "employees" }).select("-password");

  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

// Create new employee
const createEmployee = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const employeeExists = await Employee.findOne({ email });

  if (employeeExists) {
    res.status(400);
    throw new Error("Employee already exists");
  }

  const employee = await Employee.create({
    username,
    email,
    password,
    role: "employees", // Hard-coded employee role
  });

  if (employee) {
    res.status(201).json({
      _id: employee._id,
      username: employee.username,
      email: employee.email,
      role: employee.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid employee data");
  }
});

// Update employee
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id, role: "employees" });

  if (employee) {
    employee.username = req.body.username || employee.username;
    employee.email = req.body.email || employee.email;

    if (req.body.password) {
      employee.password = req.body.password;
    }

    const updatedEmployee = await employee.save();

    res.json({
      _id: updatedEmployee._id,
      username: updatedEmployee.username,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
    });
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

// Delete employee
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id, role: "employees" });

  if (employee) {
    await employee.deleteOne();
    res.json({ message: "Employee removed" });
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
