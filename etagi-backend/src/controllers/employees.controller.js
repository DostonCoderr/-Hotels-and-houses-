const employeesService = require('../services/employees.service');
const { z } = require('zod');

const createSchema = z.object({
  name: z.string().min(2),
  position: z.string().min(2),
  photo: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  hidden: z.boolean().optional(),
  order: z.number().int().optional(),
});

const updateSchema = createSchema.partial();

const reorderSchema = z.object({
  order: z.array(
    z.object({
      id: z.number().int().positive(),
      order: z.number().int(),
    })
  ),
});

async function getVisible(req, res, next) {
  try {
    const employees = await employeesService.getVisibleEmployees();
    res.json(employees);
  } catch (err) { next(err); }
}

async function getAll(req, res, next) {
  try {
    const employees = await employeesService.getAllEmployees(req.query);
    res.json(employees);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const emp = await employeesService.getEmployeeById(req.params.id);
    res.json(emp);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const emp = await employeesService.createEmployee(data);
    res.status(201).json(emp);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const emp = await employeesService.updateEmployee(req.params.id, data);
    res.json(emp);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await employeesService.deleteEmployee(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}

async function toggle(req, res, next) {
  try {
    const emp = await employeesService.toggleHidden(req.params.id);
    res.json({
      message: emp.hidden ? 'Сотрудник скрыт' : 'Сотрудник показан',
      employee: emp,
    });
  } catch (err) { next(err); }
}

async function reorder(req, res, next) {
  try {
    const { order } = reorderSchema.parse(req.body);
    const result = await employeesService.reorderEmployees(order);
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

module.exports = { getVisible, getAll, getById, create, update, remove, toggle, reorder };