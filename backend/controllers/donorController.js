import DonorProfile from "../models/DonorProfile.js";


// GET DONOR PROFILE
export const getDonorProfile = async(req,res)=>{

 try{

 const profile = await DonorProfile.findOne({
    userId:req.user._id
 }).populate("userId","name email phone");


 res.status(200).json({
    success:true,
    profile
 });


 }catch(error){

 res.status(500).json({
    success:false,
    message:error.message
 });

 }

};

// UPDATE DONOR PROFILE
export const updateDonorProfile = async (req, res) => {
  try {

    const profile = await DonorProfile.findOneAndUpdate(
      {
        userId: req.user.id
      },
      {
        organizationName: req.body.organizationName,
        address: req.body.address,
        city: req.body.city
      },
      {
        returnDocument: "after",
        runValidators: true,
        upsert: true
      }
    );


    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};