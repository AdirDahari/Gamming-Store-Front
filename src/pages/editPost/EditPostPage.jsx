import GameForm from "./ui/GameForm.jsx";
import Review from "./ui/Review.jsx";
import Box from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ROUTE from "../../routes/ROUTES.JS";
import { editPostNormalization } from "./editPostNoramalization.js";
import MyToast from "../../messages/MyToast";
import nextId from "react-id-generator";
import server from "../../server/server";

const steps = ["Game details", "Update your post"];

const getStepContent = (
  step,
  funcNext,
  funcBack,
  funcSubmit,
  userDetails,
  gameDetails
) => {
  switch (step) {
    case 0:
      return <GameForm handleNext={funcNext} postData={gameDetails} />;
    case 1:
      return (
        <Review
          handleBack={funcBack}
          userDetails={userDetails}
          gameDetails={gameDetails}
          handleSubmit={funcSubmit}
        />
      );
    default:
      throw new Error("Unknown step");
  }
};

let initData = {};

const EditPostPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const navigate = useNavigate();
  const { id: _id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await server.posts.getPostById(_id);
        initData = data;
        setUserDetails(data.seller);
        setGameDetails(data);
      } catch (err) {
        MyToast.error("Something wrong, Please try again later");
      }
    })();
  }, []);

  const handleNext = (gameDetailsValues) => {
    setGameDetails(gameDetailsValues);
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setGameDetails(initData);
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const request = editPostNormalization(gameDetails);
      await server.posts.putPost(_id, request);
      MyToast.info("Post Updated!");
      navigate(ROUTE.HOME);
    } catch (err) {
      MyToast.error("Something wrong, Please try again later");
    }
  };

  return (
    <Fragment>
      <Box maxWidth="sm" sx={{ pb: 8, pt: 8 }}>
        <Paper
          variant="outlined"
          sx={{ py: { xs: 3, pd: 6 }, p: { xs: 2, pd: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Edit Post
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={nextId()}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {gameDetails && (
            <Fragment>
              {getStepContent(
                activeStep,
                handleNext,
                handleBack,
                handleSubmit,
                userDetails,
                gameDetails
              )}
            </Fragment>
          )}
        </Paper>
      </Box>
    </Fragment>
  );
};
export default EditPostPage;
