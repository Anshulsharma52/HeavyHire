import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Vehicle from './models/Vehicle.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/heavyhire')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const seedData = async () => {
  try {
    await User.deleteMany();
    await Vehicle.deleteMany();

    const owner = await User.create({
      name: 'John Owner',
      email: 'owner@test.com',
      password: 'password',
      phone: '9876543210',
      role: 'owner'
    });

    const user = await User.create({
      name: 'Jane Customer',
      email: 'user@test.com',
      password: 'password',
      phone: '1234567890',
      role: 'user'
    });

    const admin = await User.create({
      name: 'Anshul Sharma',
      email: 'anshulsharma1219@gmail.com',
      password: 'Anshul@HeavyHire',
      phone: '8058928399',
      role: 'admin'
    });

    await Vehicle.create([
      {
        ownerId: owner._id,
        vehicleName: 'Tata Prima Heavy Duty Truck',
        category: 'Truck',
        pricePerHour: 50,
        pricePerDay: 400,
        location: 'Mumbai, Maharashtra',
        description: 'Excellent condition 12-wheeler truck suitable for long-haul transport.',
        images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'],
        availability: true,
      },
      {
        ownerId: owner._id,
        vehicleName: 'JCB 3DX Super Eco',
        category: 'JCB',
        pricePerHour: 80,
        pricePerDay: 700,
        location: 'Pune, Maharashtra',
        description: 'Powerful backhoe loader for construction and excavation.',
        images: ['https://images.unsplash.com/photo-1579805561085-36423547eb55?auto=format&fit=crop&w=800&q=80'],
        availability: true,
      },
      {
        ownerId: owner._id,
        vehicleName: 'Mahindra Novo 605 DI',
        category: 'Tractor',
        pricePerHour: 30,
        pricePerDay: 250,
        location: 'Nashik, Maharashtra',
        description: 'Reliable tractor for agricultural needs.',
        images: ['https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80'],
        availability: true,
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
