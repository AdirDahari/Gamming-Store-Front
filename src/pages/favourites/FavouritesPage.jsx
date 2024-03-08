import { Fragment, useEffect, useState } from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import PostComponent from "../../components/PostComponent";
import axios from "axios";
import { Search } from "../shop/ui/Search";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES.JS";
import MyToast from "../../messages/MyToast";
import nextId from "react-id-generator";

let initData = [];
let userId = "";

const FavouritesPage = () => {
  const [dataFromServer, setDataFromServer] = useState([]);
  const [txt, setTxt] = useState("");
  const navigate = useNavigate();

  const handleTxtChange = (e) => {
    setTxt(e.target.value);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: userData } = await axios.get("/users/my-user");
        const { data: postData } = await axios.get("/posts");
        userId = userData._id;
        initData = postData.filter((post) => post.likes.includes(userId));
        console.log(initData);
        setDataFromServer(initData);
      } catch (err) {
        MyToast.error("Something wrong, Please try again later");
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!initData.length) return;
    if (txt.length > 1) {
      let tempData = initData;
      setDataFromServer(
        tempData.filter((post) =>
          post.game.name.toLowerCase().startsWith(txt.toLowerCase())
        )
      );
    } else {
      setDataFromServer(initData);
    }
  }, [txt]);

  const handleBuyNowClick = (_id) => {
    navigate(`${ROUTES.POST}/${_id}`);
  };
  const handleEditPostClick = (_id) => {
    navigate(`${ROUTES.EDITPOST}/${_id}`);
  };
  const handleDeletePostClick = async (_id) => {
    try {
      await axios.delete(`/posts/${_id}`);
      const { data: postData } = await axios.get("/posts");
      initData = postData.filter((post) => post.likes.includes(userId));
      setDataFromServer(initData);
      MyToast.info("Post Deleted!");
    } catch (err) {
      MyToast.error("Something wrong, Please try again later");
      console.log(err);
    }
  };
  const handleLikePost = async (_id) => {
    try {
      await axios.patch(`/posts/${_id}`);
      const { data: postData } = await axios.get("/posts");
      initData = postData.filter((post) => post.likes.includes(userId));
      setDataFromServer(initData);
    } catch (err) {
      MyToast.error("Something wrong, Please try again later");
      console.log(err);
    }
  };

  return (
    <Box maxWidth={1200} m="0 auto" sx={{ p: 1, pt: 4 }}>
      <Box
        sx={{
          minHeight: 650,
          bgcolor: "#f9f9f9",
          p: 4,
          pb: 2,
          mb: 4,
          borderRadius: "5px",
          boxShadow: `rgba(149, 157, 165, 0.2) 0px 8px 24px`,
        }}
      >
        <Box
          sx={{
            width: "80%",
            m: "0 auto",
            p: 1,
            bgcolor: "#E0115F",
            borderRadius: "5px",
          }}
        >
          <Typography sx={{ pl: 2 }} color="#f9f9f9" variant="h5">
            FAVOURITES
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", pr: 1 }}>
            <Typography color="#f9f9f9" sx={{ pl: 3 }}>
              find your saved posts
            </Typography>
            <Search txt={txt} onTxtChange={handleTxtChange} />
          </Box>
        </Box>
        <Divider variant="middle" sx={{ pt: 4, pb: 4 }} />
        {dataFromServer.length > 0 ? (
          <Grid
            container
            spacing={0}
            maxWidth={1200}
            sx={{ m: 2, p: 1, pt: 4, margin: "0 auto" }}
          >
            {dataFromServer.map((post) => (
              <Grid item key={nextId()} xs={12} sm={6} md={4} sx={{ p: 3 }}>
                <PostComponent
                  color="#E0115F"
                  _id={post._id}
                  name={post.game.name}
                  price={post.game.price}
                  image={post.game.images[0].url}
                  alt={post.game.images[0].alt}
                  onBuyNowClick={handleBuyNowClick}
                  onEditClick={handleEditPostClick}
                  onDeleteClick={handleDeletePostClick}
                  onLikeClick={handleLikePost}
                  isLoggedIn={true}
                  isUser={userId ? post.seller.userId == userId : false}
                  isLike={true}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Fragment>
            <Typography sx={{ p: 4 }} variant="h6">
              Your favourite collection is empty
            </Typography>
          </Fragment>
        )}
      </Box>
    </Box>
  );
};
export default FavouritesPage;
