import {
  Box,
  TextField,
  Typography,
  Toolbar,
  IconButton,
  Collapse,
  Grid,
  MenuItem,
} from "@mui/material";
import { Fragment, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RangeSlider from "./RangeSlider";
import PropTypes from "prop-types";
import { Search } from "./Search";
import nextId from "react-id-generator";
import { productStatus as status } from "../../../layout/myLists";

const SortComponent = ({
  onSearchChange,
  onInputsChange,
  platform,
  categoriesData,
  priceRange,
  color,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [txt, setTxt] = useState("");
  const [filterInputs, setFilterInputs] = useState({
    categories: "all",
    productStatus: "all",
    priceRange: [],
  });

  const handleTxtChange = (e) => {
    setTxt(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isFilterOpen) {
      onInputsChange(null);
      setFilterInputs({
        categories: "all",
        productStatus: "all",
        priceRange: [],
      });
    }
  };

  const handleOptionChange = (e) => {
    setFilterInputs((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
    onInputsChange({ ...filterInputs, [e.target.name]: e.target.value });
  };

  const handleRangeChange = (range) => {
    setFilterInputs((currentState) => ({
      ...currentState,
      priceRange: range,
    }));
    onInputsChange({ ...filterInputs, priceRange: range });
  };

  const textFieldStyles = {
    sx: {
      "& .MuiOutlinedInput-root": {
        color: "#f9f9f9",
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#f9f9f9",
        },
      },
      "& .MuiInputLabel-outlined": {
        color: "#f9f9f9",
      },
      label: { color: "#f9f9f9" },
    },
  };

  return (
    <Fragment>
      <Box
        position="static"
        sx={{
          background: `linear-gradient(to right,${color}, #26d0ce)`,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <IconButton
            sx={{
              p: 1,
              mr: 3,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={handleFilterClick}
          >
            {isFilterOpen ? (
              <CloseIcon sx={{ color: "#f9f9f9" }} />
            ) : (
              <FilterListIcon sx={{ color: "#f9f9f9" }} />
            )}
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              color="#f9f9f9"
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              {platform}
            </Typography>
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                color: "#f9f9f9",
              }}
            >
              Find you games
            </Typography>
          </Box>

          <Search txt={txt} onTxtChange={handleTxtChange} />
        </Toolbar>
        <Collapse in={isFilterOpen}>
          <Toolbar>
            <Grid container spacing={1} sx={{ pt: 1, pb: 1 }}>
              <Grid item xs={12} sm={4} sx={{ mt: 1.5 }}>
                <TextField
                  {...textFieldStyles}
                  size="small"
                  name="categories"
                  select
                  label="Categories"
                  fullWidth
                  defaultValue="all"
                  value={filterInputs ? filterInputs.categories : "all"}
                  onChange={handleOptionChange}
                >
                  {categoriesData.map((option) => (
                    <MenuItem key={nextId()} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ mt: 1.5 }}>
                <TextField
                  {...textFieldStyles}
                  size="small"
                  name="productStatus"
                  select
                  label="Status"
                  fullWidth
                  defaultValue="all"
                  value={filterInputs ? filterInputs.productStatus : "all"}
                  onChange={handleOptionChange}
                >
                  {["all", ...status].map((option) => (
                    <MenuItem key={nextId()} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                {priceRange && isFilterOpen && (
                  <RangeSlider
                    range={priceRange}
                    onRangeChange={handleRangeChange}
                  />
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </Collapse>
      </Box>
    </Fragment>
  );
};

SortComponent.propTypes = {
  onInputsChange: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  categoriesData: PropTypes.array.isRequired,
  priceRange: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
};

export default SortComponent;
