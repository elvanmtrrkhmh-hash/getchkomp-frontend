import Customer from '../models/Customer.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register Customer
export const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { fullName, email, password, phone } = req.body;

    // Check if customer already exists
    let customer = await Customer.findOne({ email });
    if (customer) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
    }

    // Create new customer
    customer = new Customer({
      fullName,
      email,
      password,
      phone,
    });

    // Save customer to database
    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    // Return response
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message,
    });
  }
};

// Login Customer
export const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Check if customer exists and get password field
    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan',
      });
    }

    // Compare passwords
    const isPasswordMatch = await customer.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // Generate token
    const token = generateToken(customer._id);

    // Return response
    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login',
      error: error.message,
    });
  }
};

// Get Current User Profile
export const getCurrentUser = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan',
      error: error.message,
    });
  }
};

// Update Customer Profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city, province, postalCode } = req.body;

    let customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer tidak ditemukan',
      });
    }

    // Update fields
    if (fullName) customer.fullName = fullName;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    if (city) customer.city = city;
    if (province) customer.province = province;
    if (postalCode) customer.postalCode = postalCode;

    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      customer,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update profil',
      error: error.message,
    });
  }
};
