import Review from "../models/Review.js";
// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { name, description, star } = req.body;

    if (!name || !description || !star) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newReview = new Review({
      name,
      description,
      star,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};


// GET ALL REVIEWS
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ _id: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// UPDATE REVIEW
export const updateReview = async (req, res) => {
  try {
    const { name, description, star } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { name, description, star },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};
