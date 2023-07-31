import React, { useEffect, useState, useMemo } from "react";
import NavBar from "../components/NavBar";
import {
  Toolbar,
  Box,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  Button,
  Slide,
  DialogTitle,
  Avatar,
  AppBar,
  Tabs,
  Tab,
  Popover,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import StarsIcon from "@mui/icons-material/Stars";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyProfilePage = () => {
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState({});
  const [userAvatar, setUserAvatar] = useState({});
  const [userAttributes, setUserAttributes] = useState({});
  const [userStars, setUserStars] = useState();
  const [badges, setBadges] = useState({
    academic: 30,
    efficient: 0,
    helpful: 25,
  });

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openEditAvatar, setOpenEditAvatar] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const [newAvatar, setNewAvatar] = useState("");

  const [selectedTab, setSelectedTab] = useState(0);

  // State and functions to handle the popover
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverInfo, setPopoverInfo] = useState("hi");
  const handlePopoverOpen = (event, badge) => {
    if (badge === "academic")
      setPopoverInfo("Gained by getting high scores in assignments");
    else if (badge === "efficient")
      setPopoverInfo("Gained by handing in work early");
    else if (badge === "helpful")
      setPopoverInfo("Gained by replying to forum posts");
    else if (badge === "stars")
      setPopoverInfo("Stars are gained by completing badges");
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const total_attributes = {
    accessories: ["nothing", "eyepatch", "prescription02", "wayfarers"],
    clothing: [
      "blazerAndShirt",
      "graphicShirt",
      "hoodie",
      "overall",
      "shirtCrewNeck",
      "shirtVNeck",
    ],
    clothesColor: ["262e33", "5199e4", "929598", "a7ffc4", "ff488e", "ffffb1"],
    facialHair: ["nothing", "beardMajestic", "moustacheFancy"],
    facialHairColor: ["724133", "a55728", "b58143", "c93305", "e8e1e1"],
    hairColor: ["4a312c", "a55728", "c93305", "d6b370", "b58143"],
    skinColor: ["614335", "d08b5b", "edb98a", "f8d25c", "ffdbb4"],
    top: [
      "bigHair",
      "bob",
      "curly",
      "dreads01",
      "frida",
      "fro",
      "hat",
      "shortCurly",
      "shortRound",
      "sides",
      "straight02",
      "winterHat02",
      "winterHat04",
    ],
  };

  const defaultAvatarOptions = {
    seed: "Cookie",
    accessories: [],
    accessoriesProbability: 100,
    clothesColor: ["262e33"],
    clothing: ["shirtCrewNeck"],
    eyebrows: ["default"],
    eyes: ["default"],
    facialHair: [],
    facialHairColor: ["724133"],
    facialHairProbability: 100,
    hairColor: ["4a312c"],
    hatColor: ["transparent"],
    mouth: ["default"],
    skinColor: ["d08b5b"],
    top: ["shortRound"],
  };

  useEffect(() => {
    fetchUserDetails();
    fetchAvatar();
    fetchAttributes();
    fetchStars();
  }, []);

  const fetchUserDetails = async () => {
    // fetch user details from backend
    const response = await fetch(
      new URL(`/profile/info`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else setUserDetails(data);
  };

  const fetchAvatar = async () => {
    const response = await fetch(
      new URL(`/profile/avatar/preview`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setUserAvatar(data);
      setIsLoading(false);
    }
  };

  const fetchAttributes = async () => {
    const response = await fetch(
      new URL(`/profile/avatar/attributes`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setUserAttributes(data);
      console.log(data);
    }
  };

  const fetchStars = async () => {
    const response = await fetch(
      new URL(`/profile/stars`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setUserStars(data.stars);
      console.log(data);
    }
  };

  const handleOpenEditProfile = () => {
    setOpenEditProfile(true);
    setNewFirstName(userDetails.first_name);
    setNewLastName(userDetails.last_name);
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleCloseEditProfile = () => {
    setOpenEditProfile(false);
  };

  const handleSaveChanges = async () => {
    // Validation checks
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!/^[a-zA-Z]+$/.test(newFirstName) && newFirstName !== "") {
      newErrors.newFirstName = "First name must consist of letters only";
    }
    if (!/^[a-zA-Z]+$/.test(newLastName) && newLastName !== "") {
      newErrors.newLastName = "Last name must consist of letters only";
    }
    if (!passwordRegex.test(newPassword) && newPassword !== "") {
      newErrors.newPassword =
        "Password must be at least 8 characters and contain at least one character from each of the groups: letters, numbers and special characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // fetch post
      const response = await fetch(
        new URL(`/profile/edit`, "http://localhost:5000"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: newFirstName,
            lastName: newLastName,
            password: newPassword,
          }),
        }
      );
      const data = await response.json();
      if (data.error) console.log("ERROR");
      else {
        fetchUserDetails();
        handleCloseEditProfile();
      }
    }
  };

  const handleOpenEditAvatar = () => {
    setNewAvatar(userAvatar);
    setOpenEditAvatar(true);
  };

  const handleCloseEditAvatar = () => {
    setOpenEditAvatar(false);
    setNewAvatar(userAvatar);
  };

  const OptionButton = ({ attribute, option, onClick }) => {
    const [openUnlockDialog, setOpenUnlockDialog] = useState(false);

    const isOptionUnlocked = userAttributes[attribute].includes(option);

    const handleClick = () => {
      if (isOptionUnlocked) {
        const newAvatarOptions = {
          ...newAvatar,
          [attribute]: [option],
        };
        onClick(newAvatarOptions);
      } else setOpenUnlockDialog(true);
    };

    const updatedAvatarOptions = {
      ...defaultAvatarOptions,
      [attribute]: [option],
    };
    if (attribute === "facialHairColor") {
      updatedAvatarOptions.facialHair = ["beardMajestic"];
    }
    const avatar = createAvatar(
      avataaars,
      updatedAvatarOptions
    ).toDataUriSync();

    const handleCloseUnlockDialog = () => {
      setOpenUnlockDialog(false);
    };

    const handleUnlock = async () => {
      if (userStars < 1) {
        alert("Not enough stars");
        return;
      }

      const response = await fetch(
        new URL(`/profile/avatar/unlock`, "http://localhost:5000"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attribute,
            style: option,
          }),
        }
      );
      const data = await response.json();
      if (data.error) console.log("ERROR");
      else {
        console.log(data.message);
      }
      fetchStars();
      fetchAttributes();
      setOpenUnlockDialog(false);
      alert("Unlocked " + option);
    };

    return (
      <>
        <Button onClick={handleClick} sx={{ borderRadius: "50%" }}>
          <Avatar
            src={avatar}
            alt={option}
            sx={{
              width: 200,
              height: 200,
              "&:hover": {
                backgroundColor: "lightGrey",
              },
            }}
          />
          {!isOptionUnlocked && (
            <LockIcon
              sx={{
                position: "absolute",
                top: "0%",
                left: "5%",
                color: "grey",
                fontSize: "3rem",
              }}
            />
          )}
        </Button>
        <Dialog
          open={openUnlockDialog}
          onClose={handleCloseUnlockDialog}
          PaperProps={{
            style: { borderRadius: 15, width: "520px" },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {`Do you want to purchase ${option} for 1 `} <StarsIcon /> ?
          </DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "center", p: 1 }} gap={5}>
            <Button
              onClick={handleUnlock}
              color="secondary"
              variant="contained"
            >
              Yes
            </Button>
            <Button
              onClick={handleCloseUnlockDialog}
              color="primary"
              variant="contained"
            >
              No
            </Button>
          </Box>
        </Dialog>
      </>
    );
  };

  const saveAvatar = async () => {
    // fetch save
    const response = await fetch(
      new URL(`/profile/avatar/update`, "http://localhost:5000"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attributes: newAvatar,
        }),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
      alert("Error saving avatar");
    } else {
      fetchAvatar();
      handleCloseEditAvatar();
      console.log(data);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <Toolbar />
      {!isLoading && (
        <Box
          gap={15}
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Left section: Avatar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", marginBottom: 2 }}
            >
              User Profile
            </Typography>
            <img
              src={createAvatar(avataaars, userAvatar).toDataUriSync()}
              alt="Avatar"
              height={350}
              style={{ borderRadius: "50%", marginBottom: "20px" }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenEditAvatar}
            >
              Customise avatar
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                maxWidth: "700px",
              }}
              gap={2}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  overflow: "hidden",
                }}
                gap={5}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "170px",
                  }}
                  gap={2}
                >
                  {/* Right section: User Details */}
                  <Typography variant="h6" fontWeight={"bold"}>
                    First Name:
                  </Typography>
                  <Typography variant="h6" fontWeight={"bold"}>
                    Last Name:
                  </Typography>
                  <Typography variant="h6" fontWeight={"bold"}>
                    Email:
                  </Typography>
                  <Typography variant="h6" fontWeight={"bold"}>
                    Role:
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }} gap={2}>
                  <Typography variant="h6">{userDetails.first_name}</Typography>
                  <Typography variant="h6">{userDetails.last_name}</Typography>
                  <Typography variant="h6"> {userDetails.email}</Typography>
                  <Typography variant="h6">
                    {userDetails.is_teacher ? "Teacher" : "Student"}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                sx={{ marginLeft: "20px", marginBottom: "130px" }}
                onClick={handleOpenEditProfile}
              >
                <EditIcon />
              </IconButton>
            </Box>
            {!userDetails.is_teacher && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingTop: "60px",
                }}
                gap={5}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  gap={2}
                >
                  <SchoolIcon
                    sx={{
                      fontSize: "100px",
                      borderRadius: "25%",
                      boxShadow:
                        badges.academic > 29
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver, 0 0 0 12px gold`
                          : Math.floor(badges.academic / 10) === 2
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver`
                          : Math.floor(badges.academic / 10) === 1
                          ? `0 0 0 4px #cd7f32`
                          : "",
                      marginBottom: "10px",
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      badges.academic >= 30 ? 100 : (badges.academic % 10) * 10
                    }
                    sx={{
                      width: "200px",
                      height: "10px",
                      borderRadius: "10px",
                      backgroundColor: "lightGrey",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                  <Typography variant="h5">
                    Academic Apex
                    <IconButton
                      onClick={(e) => handlePopoverOpen(e, "academic")}
                      sx={{ marginLeft: 0 }}
                    >
                      <InfoIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  gap={2}
                >
                  <MoreTimeIcon
                    sx={{
                      fontSize: "100px",
                      boxShadow:
                        badges.efficient > 29
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver, 0 0 0 12px gold`
                          : Math.floor(badges.efficient / 10) === 2
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver`
                          : Math.floor(badges.efficient / 10) === 1
                          ? `0 0 0 4px #cd7f32`
                          : "",
                      marginBottom: "10px",
                      borderRadius: "25%",
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      badges.efficient >= 30
                        ? 100
                        : (badges.efficient % 10) * 10
                    }
                    sx={{
                      width: "200px",
                      height: "10px",
                      borderRadius: "10px",
                      backgroundColor: "lightGrey",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                  <Typography variant="h5">
                    Efficient Executor{" "}
                    <IconButton
                      onClick={(e) => handlePopoverOpen(e, "efficient")}
                      sx={{ marginLeft: 0 }}
                    >
                      <InfoIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  gap={2}
                >
                  <LocalLibraryIcon
                    sx={{
                      fontSize: "100px",
                      boxShadow:
                        badges.helpful > 29
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver, 0 0 0 12px gold`
                          : Math.floor(badges.helpful / 10) === 2
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver`
                          : Math.floor(badges.helpful / 10) === 1
                          ? `0 0 0 4px #cd7f32`
                          : "",
                      marginBottom: "10px",
                      borderRadius: "25%",
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      badges.helpful >= 30 ? 100 : (badges.helpful % 10) * 10
                    }
                    sx={{
                      width: "200px",
                      height: "10px",
                      borderRadius: "10px",
                      backgroundColor: "lightGrey",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                  <Typography variant="h5">
                    Helpful Learner{" "}
                    <IconButton
                      onClick={(e) => handlePopoverOpen(e, "helpful")}
                      sx={{ marginLeft: 0 }}
                    >
                      <InfoIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Typography>
                </Box>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    sx: {
                      backgroundColor: "black",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                >
                  <Typography variant="p" sx={{ p: 1 }}>
                    {popoverInfo}
                  </Typography>
                </Popover>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Edit Profile Dialog */}
      <Dialog
        PaperProps={{
          style: { borderRadius: 15, width: "400px" },
        }}
        open={openEditProfile}
        onClose={handleCloseEditProfile}
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Edit user details
        </DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            fullWidth
            margin="dense"
            variant="standard"
            error={!!errors.newFirstName}
            helperText={errors.newFirstName}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            variant="standard"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            error={!!errors.newLastName}
            helperText={errors.newLastName}
          />
          <TextField
            label="New Password"
            fullWidth
            margin="dense"
            variant="standard"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <TextField
            label="Confirm Password"
            fullWidth
            margin="dense"
            variant="standard"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveChanges}
          >
            Edit
          </Button>
        </Box>
      </Dialog>
      {/* Edit Avatar Dialog */}
      <Dialog
        fullScreen
        open={openEditAvatar}
        onClose={handleCloseEditAvatar}
        TransitionComponent={Transition}
      >
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20px",
            position: "absolute",
            left: "80px",
            top: "90px",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={"bold"}
            sx={{ display: "inline-flex", alignItems: "center" }}
            gap={0.5}
          >
            {userStars}
            <StarsIcon />
            <IconButton
              onClick={(e) => handlePopoverOpen(e, "stars")}
              sx={{ marginLeft: 0 }}
            >
              <InfoIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "8px",
            top: "70px",
            zIndex: 1,
          }}
        >
          <IconButton
            color="inherit"
            onClick={handleCloseEditAvatar}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <Typography variant="h3" fontWeight={"bold"}>
              Edit Avatar
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "90%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row", width: "90%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={createAvatar(avataaars, newAvatar).toDataUriSync()}
                  height={500}
                  style={{ borderRadius: "50%", marginBottom: "30px" }}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={saveAvatar}
                >
                  Update avatar
                </Button>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <AppBar
                  position="static"
                  sx={{
                    background: "black",
                    width: "1200px",
                    margin: "50px 0 0 0",
                    marginRight: "auto",
                    borderRadius: "10px",
                    alignItems: "center",
                  }}
                >
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="secondary"
                    indicatorColor="secondary"
                  >
                    {Object.keys(total_attributes).map(
                      (attributeType, index) => (
                        <Tab
                          key={index}
                          label={attributeType}
                          sx={{
                            color: "white",
                            maxWidth: "200px",
                            fontSize: "15px",
                            // fontWeight: "bold",
                          }}
                        />
                      )
                    )}
                  </Tabs>
                </AppBar>
                {Object.keys(total_attributes).map((attributeType, index) => (
                  <TabPanel key={index} value={selectedTab} index={index}>
                    {total_attributes[attributeType].map(
                      (option, optionIndex) => (
                        <OptionButton
                          key={option}
                          attribute={attributeType}
                          option={option}
                          onClick={setNewAvatar}
                        />
                      )
                    )}
                  </TabPanel>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default MyProfilePage;
