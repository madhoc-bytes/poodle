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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyProfilePage = () => {
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState({
    firstName: "Handy",
    lastName: "Wang",
    email: "huangandy05@gmail.com",
    password: "Andy@123",
    avatar:
      "https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie&accessories[]&accessoriesColor=262e33&accessoriesProbability=100&clothesColor=262e33&clothing=shirtCrewNeck&clothingGraphic=bat&eyebrows=default&eyes=default&facialHair[]&facialHairColor=2c1b18&facialHairProbability=100&hairColor=2c1b18&hatColor=929598&mouth=default&skinColor=d08b5b&top=shortRound",
  });
  const [isTeacher, setIsTeacher] = useState();
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openEditAvatar, setOpenEditAvatar] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [newAvatar, setNewAvatar] = useState("");
  const [newClothing, setNewClothing] = useState("");

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
    hairColor: ["4a312c", "a55728", "c93305", "d6b370"],
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

  useEffect(() => {
    fetchIsTeacher();
    setNewAvatar(userDetails.avatar);
  }, []);
  // https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie&accessories[]&accessoriesColor=262e33&accessoriesProbability=100&clothesColor=262e33&clothing=shirtCrewNeck&clothingGraphic=bat&eyebrows=default&eyes=default&facialHair[]&facialHairColor=2c1b18&facialHairProbability=100&hairColor=2c1b18&hatColor=929598&mouth=default&skinColor=d08b5b&top=shortRound
  useEffect(() => {
    setNewAvatar(
      `https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie&clothing=${newClothing}&accessories[]&accessoriesColor=262e33&accessoriesProbability=100&clothesColor=262e33&clothingGraphic=bat&eyebrows=default&eyes=default&facialHair[]&facialHairColor=2c1b18&facialHairProbability=100&hairColor=2c1b18&hatColor=929598&mouth=default&skinColor=d08b5b&top=shortRound`
    );
  }, [newClothing]);

  const fetchIsTeacher = async () => {
    const response = await fetch(
      new URL(`/profile/is_teacher/me`, "http://localhost:5000"),
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
    } else setIsTeacher(data);
  };

  const handleOpenEditProfile = () => {
    setOpenEditProfile(true);
    setNewFirstName(userDetails.firstName);
    setNewLastName(userDetails.lastName);
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleCloseEditProfile = () => {
    setOpenEditProfile(false);
  };

  const handleSaveChanges = () => {
    // Validation checks
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (newFirstName.trim() === "" || !/^[a-zA-Z]+$/.test(newFirstName)) {
      newErrors.newFirstName = "First name must consist of letters only";
    }
    if (newLastName.trim() === "" || !/^[a-zA-Z]+$/.test(newLastName)) {
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

      handleCloseEditProfile();
    }
  };

  const handleOpenEditAvatar = () => {
    setOpenEditAvatar(true);
  };

  const handleCloseEditAvatar = () => {
    setNewAvatar(userDetails.avatar);
    setOpenEditAvatar(false);
  };

  const OptionButton = ({ meow, option, onClick }) => {
    const handleClick = () => {
      onClick(option);
    };

    console.log(option);

    return (
      <Button onClick={handleClick}>
        <Avatar
          src={`https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie&${meow}=${option}&accessories[]&accessoriesColor=262e33&accessoriesProbability=100&clothesColor=262e33&clothing=hoodie&clothingGraphic=bat&eyebrows=default&eyes=default&facialHair[]&facialHairColor=2c1b18&facialHairProbability=100&hairColor=${option}&hatColor=929598&mouth=default&skinColor=d08b5b&top=shortRound`}
          alt={option}
          sx={{ width: 100, height: 100 }}
        />
      </Button>
    );
  };

  return (
    <>
      <NavBar />
      <Toolbar />
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
            src={userDetails.avatar}
            alt="Avatar"
            height={350}
            style={{ borderRadius: "50%" }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenEditAvatar}
          >
            Customise avatar
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "700px",
          }}
          gap={2}
        >
          <Box
            sx={{ display: "flex", flexDirection: "row", overflow: "hidden" }}
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
              <Typography variant="h6">{userDetails.firstName}</Typography>
              <Typography variant="h6">{userDetails.lastName}</Typography>
              <Typography variant="h6"> {userDetails.email}</Typography>
              <Typography variant="h6">
                {isTeacher ? "Teacher" : "Student"}
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
      </Box>

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
      {/* EditAvatar Modal */}
      <Dialog
        PaperProps={{
          style: { borderRadius: 15, width: "400px" },
        }}
        open={openEditAvatar}
        onClose={handleCloseEditAvatar}
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Edit Avatar
        </DialogTitle>
        <DialogContent>
          <img src={newAvatar} height={350} style={{ borderRadius: "50%" }} />{" "}
          <Button onClick={() => setNewClothing("blazerAndShirt")}>
            blazer
          </Button>
          {total_attributes["hairColor"].map((option) => (
            <OptionButton
              key={option}
              meow={"hairColor"}
              option={option}
              onClick={() =>
                setNewAvatar(
                  `https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie&accessories[]&accessoriesColor=262e33&accessoriesProbability=100&clothesColor=262e33&clothing=hoodie&clothingGraphic=bat&eyebrows=default&eyes=default&facialHair[]&facialHairColor=2c1b18&facialHairProbability=100&hairColor=${option}&hatColor=929598&mouth=default&skinColor=d08b5b&top=shortRound`
                )
              }
            />
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyProfilePage;
