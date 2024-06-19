const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Table = require("../models/TableModel");
const QRCode = require("qrcode");

exports.getAllTables = catchAsync(async (req, res, next) => {
  const tables = await Table.find();
  res.status(200).json({
    status: "success",
    results: tables.length,
    data: {
      tables,
    },
  });
});

exports.updateTableAvailability = catchAsync(async (req, res, next) => {
  const table = await Table.findById(req.params.id);
  if (!table) {
    return next(new AppError("Table not found", 404));
  }
  table.is_available = !table.is_available;
  await table.save();
  res.status(200).json({
    status: "success",
    message: "Table availability updated successfully",
    data: {
      table,
    },
  });
});

exports.createTable = catchAsync(async (req, res, next) => {
  const table = await Table.create({ ...req.body, qr_code: undefined });
  table.qr_code = await QRCode.toDataURL(
    `${process.env.BASE_URL}/api/v1/tables/${table._id}`
  );
  await table.save();
  res.status(201).json({
    status: "success",
    message: "Table created successfully",
    data: {
      table,
    },
  });
});

exports.getTable = catchAsync(async (req, res, next) => {
  const table = await Table.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      table,
    },
  });
});

exports.updateTable = catchAsync(async (req, res, next) => {
  if (req.body.qr_code) {
    delete req.body.qr_code;
  }
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!table) {
    return next(new AppError("Table not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Table updated successfully",
    data: {
      table,
    },
  });
});

exports.deleteTable = catchAsync(async (req, res, next) => {
  const table = await Table.findByIdAndDelete(req.params.id);
  if (!table) {
    return next(new AppError("Table not found", 404));
  }
  res.status(204).json({
    status: "success",
    message: "Table deleted successfully",
    data: null,
  });
});
