import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const UserAvatar = ({ userId, token }) => {
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    setUserAvatar("");
    fetchAvatar();
  }, [userId]);

  const fetchAvatar = async () => {
    const response = await fetch(
      new URL(`/profile/avatar/preview/${userId}`, "http://localhost:5000"),
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
    }
  };

  return userAvatar ? (
    <Avatar
      src={createAvatar(avataaars, userAvatar).toDataUriSync()}
      alt="User Avatar"
      sx={{
        width: 50,
        height: 50,
        marginRight: "10px",
        backgroundColor: "lightGrey",
      }}
    />
  ) : (
    <Avatar
      sx={{
        width: 50,
        height: 50,
        marginRight: "10px",
        backgroundColor: "lightGrey",
      }}
    />
  );
};

export default UserAvatar;
