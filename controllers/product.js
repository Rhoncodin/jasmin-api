const query = require('../config/database');
const path = require('path');
const fs = require('fs');

const getProducts = async (req, res) => {
  const statement = await query(
    `SELECT id, name, price, unit, image FROM product`,
    []
  );

  try {
    const result = statement;
    const message =
      result.length >= 0
        ? 'Products found successfully!'
        : 'Products not found';
    const status = result.length < 1 ? 400 : 200;
    return res.status(status).json({
      message: message,
      status: status,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal error', status: 500 });
  }
};

const createProducts = async (req, res) => {
  const { name, price, unit } = req.body;

  if (req.fileValidationError) {
    return res
      .status(400)
      .json({ message: req.fileValidationError.message, status: 400 });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Image is required', status: 400 });
  }

  if (name == '' || price == '' || unit == '') {
    const message =
      name == ''
        ? 'Product name is required'
        : price == ''
        ? 'Product price is required'
        : unit == ''
        ? 'Unit is required'
        : '';
    req.file && fs.unlinkSync(req.file.path);

    return res.status(400).json({ message: message, status: 400 });
  }

  const filePath = req.file && req.file.path;
  const image =
    req.file && path.relative('public', filePath).replace(/\\/g, '/');

  const statement = await query(
    `INSERT INTO product (name, price, unit, image) VALUES (?, ?, ?, ?)`,
    [name, price, unit, image]
  );

  try {
    const result = statement;
    const message =
      result.affectedRows < 1
        ? 'Failed to add products'
        : 'Products added successfully!';
    const status = result.affectedRows < 1 ? 400 : 201;
    return res.status(status).json({
      message: message,
      status: status,
      data: result.affectedRows < 1 ? null : req.body,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal error', status: 500 });
  }
};

const updateProducts = async (req, res) => {
  const { id, name, price, unit } = req.body;

  if (req.fileValidationError) {
    return res
      .status(400)
      .json({ message: req.fileValidationError.message, status: 400 });
  }

  if (name == '' || price == '' || unit == '') {
    const message =
      name == ''
        ? 'Product name is required'
        : price == ''
        ? 'Product price is required'
        : unit == ''
        ? 'Unit is required'
        : '';
    req.file && fs.unlinkSync(req.file.path);

    return res.status(400).json({ message: message, status: 400 });
  }

  const [getImage] = await query('SELECT image FROM product WHERE id = ?', [
    id,
  ]);

  if (getImage.image !== null && req.file) {
    try {
      const img = path.relative('images', getImage.image);
      const filePath = path.resolve(__dirname, '..', 'public', 'images', img);
      req.file && fs.unlinkSync(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Error', status: 500 });
    }
  }

  const filePath = req.file && req.file.path;
  const image =
    req.file && path.relative('public', filePath).replace(/\\/g, '/');

  const statement = await query(
    `UPDATE product SET name = ?, price = ?, unit = ?, image = ? WHERE id = ?`,
    [name, price, unit, req.file == undefined ? getImage?.image : image, id]
  );

  try {
    const result = statement;
    const message =
      result.affectedRows < 1
        ? 'Failed to update products'
        : 'Products updated successfully!';
    const status = result.affectedRows < 1 ? 400 : 200;
    return res.status(status).json({
      message: message,
      status: status,
      data: result.affectedRows < 1 ? null : req.body,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal error', status: 500 });
  }
};

const deleteProducts = async (req, res) => {
  const { id } = req.params;

  const statement = await query(`DELETE FROM product WHERE id = ?`, [id]);

  try {
    const result = statement;
    const message =
      result.affectedRows < 1
        ? 'Failed to delete products'
        : 'Products deleted successfully!';
    const status = result.affectedRows < 1 ? 400 : 200;
    return res.status(status).json({
      message: message,
      status: status,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal error', status: 500 });
  }
};

module.exports = {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
};
