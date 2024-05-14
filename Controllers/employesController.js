const Employee = require('../models/Employee')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all employes
// @route GET /employes
// @access Private
const getAllEmployes = asyncHandler(async (req, res) => {
    // Get all employes from MongoDB
    const employes = await Employee.find().select('-password').lean()

    // If no employes 
    if (!employes?.length) {
        return res.status(400).json({ message: 'No employes found' })
    }

    res.json(employes)
})

// @desc Create new employee
// @route POST /employes
// @access Private
const createNewEmployee = asyncHandler(async (req, res) => {
    const { employeename, password, job } = req.body

    // Confirm data
    if (!employeename || !password || !job ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate employeename
    const duplicate = await Employee.findOne({ employeename }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate employeename' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const employeeObject = { employeename, "password": hashedPwd, job }

    // Create and store new employee 
    const employee = await Employee.create(employeeObject)

    if (employee) { //created 
        res.status(201).json({ message: `New employee ${employeename} created` })
    } else {
        res.status(400).json({ message: 'Invalid employee data received' })
    }
})

// @desc Update a employee
// @route PATCH /employes
// @access Private
const updateEmployee = asyncHandler(async (req, res) => {
    const { id, employeename, job, password } = req.body

    // Confirm data 
    if (!id || !employeename || !job ) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the employee exist to update?
    const employee = await Employee.findById(id).exec()

    if (!employee) {
        return res.status(400).json({ message: 'Employee not found' })
    }

    // Check for duplicate 
    const duplicate = await Employee.findOne({ employeename }).lean().exec()

    // Allow updates to the original employee 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate employeename' })
    }

    employee.employeename = employeename
    employee.job = job
    

    if (password) {
        // Hash password 
        employee.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedEmployee = await employee.save()

    res.json({ message: `${updatedEmployee.employeename} updated` })
})

// @desc Delete a employee
// @route DELETE /employes
// @access Private
const deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Employee ID Required' })
    }

    // Does the employee still have assigned notes?
    const note = await Note.findOne({ employee: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Employee has assigned notes' })
    }

    // Does the employee exist to delete?
    const employee = await Employee.findById(id).exec()

    if (!employee) {
        return res.status(400).json({ message: 'Employee not found' })
    }

    const result = await employee.deleteOne()

    const reply = `Employeename ${result.employeename} with ID ${result._id} deleted`

    res.json(reply)
})

const getDoctors = asyncHandler(async (req, res) => {

    const { job="doctor" } = req.params;

        const Employes = await Employee.find({ job : job }).select('-password').lean();
        res.json(Employes);

      if(!job?.length){
        return res.status(500).json({  message: 'No employes found' })}
        
  })

  //change "getCouchs" to "getCoaches"
  const getCouchs = asyncHandler(async (req, res) => {
        // and "couch" to "coach"
    const { job="couch" } = req.params;

        const Employes = await Employee.find({ job : job }).select('-password').lean();
        res.json(Employes);

      if(!job?.length){
        return res.status(500).json({  message: 'No employes found' })}
        
  })



module.exports = {
    getCouchs,
    getDoctors,
    getAllEmployes,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
}