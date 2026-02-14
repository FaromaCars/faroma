import Car from "../models/Car.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* helper → upload buffer to cloudinary */
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "faroma_cars",
        quality: "auto",        // compress for web
        fetch_format: "auto"    // convert to WebP if browser supports
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

//////////////////////////////////////////////////////////////
// ADD CAR (ADMIN)
//////////////////////////////////////////////////////////////
export const addCar = async (req, res) => {
  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        imageUrls.push(result.secure_url); // save url
      }
    }

    const newCar = new Car({
      ...req.body,
      images: imageUrls,
    });

    await newCar.save();

    res.status(201).json({
      message: "Car added successfully",
      car: newCar,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//////////////////////////////////////////////////////////////
// GET ALL CARS + FILTERS
//////////////////////////////////////////////////////////////
export const getCars = async (req, res) => {
  try {
    const {
      brand,
      color,
      fuelType,
      featured,
      transmission,
      minPrice,
      maxPrice,
      year,
      condition,
      sort,
    } = req.query;

    let filter = {};

    if (featured) filter.featured = featured;
    if (brand) filter.brand = brand;
    if (color) filter.color = color;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (year) filter.year = Number(year);
    if (condition) filter.condition = new RegExp(`^${condition}$`, "i");

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Car.find(filter);

    if (sort === "low") query.sort({ price: 1 });
    if (sort === "high") query.sort({ price: -1 });
    if (sort === "new") query.sort({ year: -1 });

    const cars = await query;
    res.json(cars);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//////////////////////////////////////////////////////////////
// SINGLE CAR
//////////////////////////////////////////////////////////////
export const getSingleCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json(car);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//////////////////////////////////////////////////////////////
// DELETE CAR + CLOUDINARY IMAGES
//////////////////////////////////////////////////////////////
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json("Car not found");

    if (car.images.length > 0) {
      for (const img of car.images) {
        const parts = img.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = "faroma_cars/" + fileName.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json("Car deleted successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//////////////////////////////////////////////////////////////
// UPDATE CAR
//////////////////////////////////////////////////////////////
export const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const existingCar = await Car.findById(carId);

    if (!existingCar) return res.status(404).json("Car not found");

    ////////////////////////////////////////////////////////
    // 1️⃣ GET EXISTING IMAGES FROM FRONTEND
    ////////////////////////////////////////////////////////
    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === "string") existingImages = [existingImages];

    ////////////////////////////////////////////////////////
    // 2️⃣ UPLOAD NEW IMAGES IF PROVIDED
    ////////////////////////////////////////////////////////
    let newImageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        newImageUrls.push(result.secure_url);
      }
    }

    ////////////////////////////////////////////////////////
    // 3️⃣ MERGE OLD + NEW IMAGES
    ////////////////////////////////////////////////////////
    const allImages = [...existingImages, ...newImageUrls];

    ////////////////////////////////////////////////////////
    // 4️⃣ SET MAIN IMAGE
    ////////////////////////////////////////////////////////
    let mainImage = req.body.mainImage;

    if (!mainImage || !allImages.includes(mainImage)) {
      mainImage = allImages[0]; // fallback first image
    }

    ////////////////////////////////////////////////////////
    // 5️⃣ DELETE REMOVED IMAGES FROM CLOUDINARY ONLY
    ////////////////////////////////////////////////////////
    const removedImages = existingCar.images.filter(
      img => !allImages.includes(img)
    );

    for (const img of removedImages) {
      try {
        const parts = img.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = "faroma_cars/" + fileName.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Failed to delete image:", img, err.message);
      }
    }

    ////////////////////////////////////////////////////////
    // 6️⃣ UPDATE CAR (everything else remains same)
    ////////////////////////////////////////////////////////
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      {
        ...req.body,
        images: allImages,
        mainImage: mainImage,
      },
      { new: true }
    );

    res.status(200).json(updatedCar);

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to update car");
  }
};

