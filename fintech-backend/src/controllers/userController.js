const User = require("../models/user");

// @desc    Update user profile & KYC details
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if they are provided in the request body
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.panNumber = req.body.panNumber || user.panNumber;
    user.bankName = req.body.bankName || user.bankName;
    user.bankAccountNumber =
      req.body.bankAccountNumber || user.bankAccountNumber;
    user.ifscCode = req.body.ifscCode || user.ifscCode;
    user.riskTolerance = req.body.riskTolerance || user.riskTolerance;

    // Auto-upgrade KYC status if they provided the critical banking info
    if (user.panNumber && user.bankAccountNumber && user.ifscCode) {
      user.kycStatus = "Verified";
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        kycStatus: updatedUser.kycStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const getUserProfile = async (req, res) => {
    try {
        // req.user._id is supplied automatically by your protect middleware
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User profile records not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                kycStatus: user.kycStatus,
                panNumber: user.panNumber || '',
                bankName: user.bankName || '',
                bankAccountNumber: user.bankAccountNumber || '',
                ifscCode: user.ifscCode || '',
                riskTolerance: user.riskTolerance || 'Moderate'
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

module.exports = { 
    updateUserProfile,
    getUserProfile
 };
