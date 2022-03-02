import React, { useEffect, useState } from "react";
import "./Main.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import { CardActions } from "@mui/material";
import { BsLinkedin, BsTwitter, BsSearch } from "react-icons/bs";
import { AiFillGithub } from "react-icons/ai";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { EmployeesType } from "../reducers/Type";
import axios from "axios";


export default function Main() {
  const [users, setUsers] = useState<EmployeesType[] | []>([]);
  const [data, setData] = useState<EmployeesType[] | []>([]);
  const [searchedUser, setSearchedUser] = useState<EmployeesType[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(6);
  const [err, setError] = useState<boolean>(false)
  console.log(users);
  const [sortBy, setSortBy] = React.useState<string>("");
  const [searchByName, setSearchByName] = useState<string>("");
  const [searchByOffice, setSearchByOffice] = useState<string>("");
  //const [AllData , setAllData ]= useState<EmployeesType[] | []>([]);
  
  const fetchUsers = async () => {
    await axios
      .get("https://api.1337co.de/v3/employees", {
        headers: {
          Authorization:
            "api-key 14:2022-02-22:anna.vanduijvenbode@tretton37.com 2e5c4ed80f3e3476b3d35774cb11e23f627a5a2e14e87d5fcb1db4d2d1c87e57",
        },
      })
      .then((res) => {
        console.log(res.data);
        const AllData = res.data;
        const usersWithImages: EmployeesType[] = AllData.filter(
          (user: EmployeesType) => user.imagePortraitUrl
        );
        console.log(usersWithImages);
        setUsers([...usersWithImages]);
        setData([...usersWithImages]);
      })
      .catch((err: any) => console.log(err));
  };
    /*  UseEffect hook to fetch the data from api once the page loads */
    useEffect(() => {
      fetchUsers()
      setSearchedUser([]);
      setSearchByName("")
      setSearchByOffice("")
    }, [1]);
  
    /*  Use Effect Hook to sort the fetched Data according to the options mentioned in Select Dropdown.
    If user selects any Dropdown option, UseEffect hook will run and sort and display the data accordingly */
    useEffect(() => {
    
      if (data && sortBy === "office") {
        setStartIndex(0);
        setSearchedUser([])
        setSearchByName("")
        setSearchByOffice("")
        setEndIndex(6);
        const sortByOffice:EmployeesType[] = data.sort((a: EmployeesType, b: EmployeesType) => {
          let userA: string = a.office;
          let userB: string = b.office;
  
          if (userA < userB) {
            return -1;
          }
          if (userA > userB) {
            return 1;
          }
          return 0;
        });
        setUsers([...sortByOffice]);
      } else if (data && sortBy === "name") {
        setStartIndex(0);
        setEndIndex(6);
        setSearchedUser([])
        setSearchByName("")
        setSearchByOffice("")
        const sortByName:EmployeesType[] = data.sort((a: EmployeesType, b: EmployeesType) => {
          let userA: string = a.name;
          let userB: string = b.name;
  
          if (userA < userB) {
            return -1;
          }
          if (userA > userB) {
            return 1;
          }
          return 0;
        });
        setStartIndex(0);
        setEndIndex(6);
        setUsers([...sortByName]);
      } else {
        setUsers([...data]);
        setSearchedUser([]);
      }
      setSearchedUser([]);
      setSearchByName("")
      setSearchByOffice("");
    }, [sortBy]);

  
  /*  Back and forward arrows for pagination of data, Back arrow will show previous 
  6 profiles and Forward Arrow will show next 6 profiles */
  const backArrow = () => {
    if (startIndex === 0) {
      setStartIndex(0);
      setEndIndex(6);
    } else {
      setStartIndex((prevState) => prevState - 6);
      setEndIndex((prevState) => prevState - 6);
    }
  };

  const forwardArrow = () => {
    if (endIndex < users.length - 6) {
      setStartIndex((prevState) => prevState + 6);
      setEndIndex((prevState) => prevState + 6);
    }
  };

  /* Search functionality of users By name and office, by filling out the field and clicking Enter button,
 will display particular profiles*/
 const handleSubmitByName = () => {
  console.log(searchByName);
  if (users && searchByName.length > 0) {
    const name = searchByName.toLowerCase();
    const UserByName = data.filter((user: EmployeesType) => user.name?.toLowerCase().includes(name));
        
    if (UserByName.length > 0) {
      setSearchedUser([...UserByName]);
      setStartIndex(0)
      setEndIndex(6)
      setError(false)
    } else {
      setSearchedUser([]);
      setError(true)
    }
  } else if (searchByName === "") {
    setUsers([...data]);
    setSearchedUser([]);
    setStartIndex(0)
    setEndIndex(6)
    setSearchByName("")
    setSearchByOffice("")
    setError(false);
  }
};

const handleSearchByOffice = () => {
  console.log(searchByOffice);
  if (users && searchByOffice.length > 0) {
    const name:string = searchByOffice.toLowerCase();
    const UserByOffice:EmployeesType[] | [] = data.filter((user: EmployeesType) => user.office?.toLowerCase().includes(name));
        
    if (UserByOffice.length > 0) {
      setSearchedUser([...UserByOffice]);
      setStartIndex(0)
      setEndIndex(6)
      setError(false);
    } else {
      setSearchedUser([]);
      setError(true);
    }
  } else if (searchByOffice === "") {
    setUsers([...data]);
    setSearchedUser([]);
    setStartIndex(0)
    setEndIndex(6)
    setSearchByName("")
    setSearchByOffice("")
    setError(false);
  }
};

 

  return (
    <div id="cards">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={6} className="fields">
            <TextField
              sx={{ borderBottom: "none" }}
              placeholder={`Search By Name`}
              value={searchByName}
              className="input"
              onChange={(e) => setSearchByName(e.target.value)}
              onKeyPress={() => handleSubmitByName()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BsSearch />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />  <TextField
            sx={{ borderBottom: "none" }}
            placeholder={`Search By Office`}
            value={searchByOffice}
            className="input"
            onChange={(e) => setSearchByOffice(e.target.value)}
            onKeyPress={() => handleSearchByOffice()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BsSearch />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          </Grid>
          <Grid item xs={12} sm={4} className="fields">
            <select
              value={sortBy}
              name="sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option selected value={"name"}>
                Name
              </option>
              <option value={"office"}>Office</option>
            </select>
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item sm={1} lg={1.5}></Grid>
          <Grid item xs={12} sm={12} md={10} lg={9}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  { err === true && (
                    <Stack sx={{ width: "100%", placeItems:"center" }} spacing={2}>
                      <Alert severity="error"sx={{textAlign:"center"}}>
                        User Not Found !!!
                      </Alert>
                    </Stack>
                  )}
                </Grid>
                {users && searchByName==="" && searchByOffice===""  && searchedUser.length === 0 && users.length > 1
                  ? users.slice(startIndex, endIndex).map((user: any) => {
                      console.log(user);
                      return (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          sx={{ textAlign: "-webkit-center" }}
                        >
                          <Card
                            sx={{ maxWidth: 300, boxShadow: "none" }}
                            className="card"
                          >
                            <CardMedia
                              component="img"
                              image={`${user.imagePortraitUrl}`}
                              alt="Profile Picture"
                            />
                            <CardContent className="content">
                              <p>
                                <span className="name">{user.name}</span>
                                <br />
                                <span>{user.office}</span>
                              </p>
                            </CardContent>
                            <CardActions className="links">
                              <a href={`${user.gitHub}`}>
                                <AiFillGithub className="icon" />
                              </a>
                              <a href={`${user.linkedIn}`}>
                                <BsLinkedin className="icon" />
                              </a>
                              <a href={`${user.twitter}`}>
                                <BsTwitter className="icon" />
                              </a>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })
                  : searchedUser.slice(startIndex, endIndex).map((user: any) => {
                      console.log(user);
                      return (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          sx={{ textAlign: "-webkit-center" }}
                        >
                          <Card
                            sx={{ maxWidth: 300, boxShadow: "none" }}
                            className="card"
                          >
                            <CardMedia
                              component="img"
                              image={`${user.imagePortraitUrl}`}
                              alt="Profile Picture"
                            />
                            <CardContent className="content">
                              <p>
                                <span className="name">{user.name}</span>
                                <br />
                                <span>{user.office}</span>
                              </p>
                            </CardContent>
                            <CardActions className="links">
                              <a href={`${user.gitHub}`}>
                                <AiFillGithub className="icon" />
                              </a>
                              <a href={`${user.linkedIn}`}>
                                <BsLinkedin className="icon" />
                              </a>
                              <a href={`${user.twitter}`}>
                                <BsTwitter className="icon" />
                              </a>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })}
              </Grid>
            </Box>
          </Grid>
          <Grid item sm={1} lg={1.5}></Grid>
        </Grid>
      </Box>
      <div id="icons">
        {users.length > 4 && searchByName.length === 0 && searchByOffice.length === 0 && searchedUser.length === 0 && (
          <>
            <BsFillArrowLeftSquareFill
              className="icon"
              onClick={() => backArrow()}
            />
            <BsFillArrowRightSquareFill
              className="icon"
              onClick={() => forwardArrow()}
            />
          </>
        )}
     {searchedUser.length > 5 && (
          <>
            <BsFillArrowLeftSquareFill
              className="icon"
              onClick={() => backArrow()}
            />
            <BsFillArrowRightSquareFill
              className="icon"
              onClick={() => forwardArrow()}
            />
          </>
        )}
      </div>
    </div>
  );
}